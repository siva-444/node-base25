import pool from "@config/db.js";
import * as UserService from "@services/user.service.js";
import * as DepartmentService from "@services/department.service.js";
import type { RowDataPacket } from "mysql2";
import * as ErrorClasses from "@helpers/error/classes.js";
import * as QuizService from "@services/quiz.service.js";

export const createStudent = async (
  name: string,
  email: string,
  password: string,
  roll_number: string,
  department_id: number,
  batch_year: number,
) => {
  if (
    !name ||
    !email ||
    !password ||
    !roll_number ||
    !department_id ||
    !batch_year
  )
    throw new ErrorClasses.ValidationError({
      fields: "Missing required fields",
    });
  const department = await DepartmentService.getDepartmentById(department_id);

  // Use user.service.ts to create user
  const user = await UserService.createUser(name, email, password, "student");
  // Create student_info
  await pool.execute(
    "INSERT INTO student_info (user_id, roll_number, department_id, batch_year) VALUES (?, ?, ?, ?)",
    [user.id, roll_number, department_id, batch_year],
  );
  return {
    id: user.id,
    name,
    email,
    role: user.role,
    roll_number,
    department_id,
    department: department.name,
    batch_year,
  };
};

export const getStudentById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.role, s.roll_number, s.department_id, d.name as department, s.batch_year FROM users u JOIN student_info s ON u.id = s.user_id JOIN departments d ON s.department_id = d.id WHERE u.id = ? AND u.role = 'student'`,
    [id],
  );
  if (!rows || rows.length === 0)
    throw new ErrorClasses.NotFoundError("Student not found", String(id));
  return rows[0];
};

export const getAllStudents = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, u.role, s.roll_number, s.department_id, d.name as department, s.batch_year FROM users u JOIN student_info s ON u.id = s.user_id JOIN departments d ON s.department_id = d.id WHERE u.role = 'student'`,
  );
  return rows;
};

export const updateStudent = async (
  id: number,
  name?: string,
  email?: string,
  password?: string,
  roll_number?: string,
  department_id?: number,
  batch_year?: number,
) => {
  const [studentRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM student_info WHERE user_id = ?",
    [id],
  );
  if (!studentRows || studentRows.length === 0)
    throw new ErrorClasses.NotFoundError("Student info not found", String(id));

  const student = await getStudentById(id);
  const department = await DepartmentService.getDepartmentById(
    student.department_id,
  );
  const user = await UserService.updateUser(id, name, email, password);

  await pool.execute(
    "UPDATE student_info SET roll_number = ?, department_id = ?, batch_year = ? WHERE user_id = ?",
    [
      roll_number || student.roll_number,
      department_id || student.department_id,
      batch_year || student.batch_year,
      id,
    ],
  );
  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
    roll_number: roll_number ?? student.roll_number,
    department_id: department_id ?? student.department_id,
    department: department.name,
    batch_year: batch_year ?? student.batch_year,
  };
};

export const deleteStudent = async (id: number) => {
  const [studentRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM student_info WHERE user_id = ?",
    [id],
  );
  if (!studentRows || studentRows.length === 0)
    throw new ErrorClasses.NotFoundError("Student info not found", String(id));

  // Delete student_info first
  await pool.execute("DELETE FROM student_info WHERE user_id = ?", [id]);
  // Delete user
  await UserService.deleteUser(id);

  return id;
};

export const getStudentsQuizzes = async ({
  studentId,
  departmentId,
  batchYear,
}: {
  studentId: number;
  departmentId: number;
  batchYear: number;
}) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
        SELECT 
        qa.id AS assignment_id,
        q.id AS quiz_id,
        q.title,
        q.description,
        q.duration_minutes,
        qa.assigned_at,
        COUNT(DISTINCT qstn.id) AS total_questions,
        MAX(sa.id IS NOT NULL) AS is_answered,
        COALESCE(CAST(SUM(CASE WHEN sa.is_correct = TRUE THEN 1 ELSE 0 END) AS SIGNED), 0) AS score
    FROM quiz_assignments qa
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN questions qstn ON qstn.quiz_id = q.id
    LEFT JOIN student_answers sa ON sa.quiz_id = q.id AND sa.question_id = qstn.id AND sa.student_id = :studentId
    WHERE 
        qa.student_id = :studentId
        OR (
            qa.student_id IS NULL
            AND (
                  (qa.department_id IS NOT NULL AND qa.batch_year IS NULL AND qa.department_id = :departmentId)
              OR (qa.batch_year IS NOT NULL AND qa.department_id IS NULL AND qa.batch_year = :batchYear)
              OR (qa.department_id IS NOT NULL AND qa.batch_year IS NOT NULL 
                  AND qa.department_id = :departmentId 
                  AND qa.batch_year = :batchYear)
            )
        )
    GROUP BY qa.id, q.id, q.title, q.description, q.duration_minutes, qa.assigned_at;
    `,
    { studentId, departmentId, batchYear },
  );
  return rows.map((row) => ({ ...row, is_answered: row.is_answered === 1 }));
};
export const getQuizDetailById = async (quizId: number) => {
  return QuizService.getQuizById(quizId);
};

export const getCorrectOptionForQuiz = async (quizId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT q.id as question_id, o.id as correct_option_id
    FROM questions q
    JOIN options o ON q.id = o.question_id
    WHERE q.quiz_id = ? AND o.is_correct = TRUE`,
    [quizId],
  );
  const correctOptions: { [questionId: number]: number } = {};
  rows.forEach((row) => {
    correctOptions[row.question_id] = row.correct_option_id;
  });
  return correctOptions;
};

export const submitStudentQuiz = async (
  studentId: number,
  quizId: number,
  answers: { question_id: number; option_id: number }[],
) => {
  const student = await getStudentById(studentId);
  // Check if quiz exists
  const quiz = await QuizService.getQuizById(quizId);
  const correctOptions = await getCorrectOptionForQuiz(quizId);

  const queryColumns =
    "student_id, quiz_id, question_id, option_id, is_correct";
  const queryPlaceholders = answers.map(() => "(?, ?, ?, ?, ?)").join(", ");
  const query = `INSERT INTO student_answers (${queryColumns}) VALUES ${queryPlaceholders}`;
  const params: (number | string | boolean)[] = [];
  answers.forEach(({ question_id, option_id }) => {
    const is_correct = correctOptions[question_id] === Number(option_id);
    params.push(studentId, quizId, question_id, option_id, is_correct);
  });
  const [result] = await pool.execute(query, params);
  return { answer_id: (result as any).insertId };
};

export const getStudentQuizResult = async (
  studentId: number,
  quizId: number,
) => {
  // Check if quiz exists
  const quiz = await getQuizDetailById(quizId);
  const correctOptions = await getCorrectOptionForQuiz(quizId);

  // fetch any submitted answers (if any) and student info
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT sa.question_id, sa.option_id, sa.is_correct, u.name as student_name, si.department_id as student_department_id, d.name as student_department
     FROM student_answers sa
     JOIN users u ON u.id = sa.student_id
     LEFT JOIN student_info si ON si.user_id = u.id
     LEFT JOIN departments d ON d.id = si.department_id
     WHERE sa.student_id = ? AND sa.quiz_id = ?`,
    [studentId, quizId],
  );

  // compute score
  let score = 0;
  const answers = (rows || []).map((row) => {
    if (row.is_correct) score += 1;
    return {
      question_id: row.question_id,
      selected_option_id: row.option_id,
      correct_option_id: correctOptions[row.question_id],
      is_correct: !!row.is_correct,
    };
  });

  // fetch student basic info (if no answers rows present above)
  let studentInfo: {
    id: number;
    name?: string;
    department_id?: number | null;
    department?: string | null;
  } = { id: studentId };
  if (!rows || rows.length === 0) {
    const [studentRows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.name, si.department_id, d.name as department
       FROM users u
       LEFT JOIN student_info si ON si.user_id = u.id
       LEFT JOIN departments d ON d.id = si.department_id
       WHERE u.id = ?`,
      [studentId],
    );
    if (studentRows && studentRows.length > 0) {
      const s = studentRows[0];
      studentInfo = {
        id: s.id,
        name: s.name,
        department_id: s.department_id,
        department: s.department,
      };
    }
  } else {
    const r = rows[0];
    studentInfo = {
      id: studentId,
      name: r.student_name,
      department_id: r.student_department_id,
      department: r.student_department,
    };
  }

  return {
    quiz,
    student: studentInfo,
    score,
    total_questions: (quiz.questions || []).length,
    answers,
  };
};
