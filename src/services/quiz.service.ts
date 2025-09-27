import type { RowDataPacket } from "mysql2";
import pool from "@config/db.js";
import type { Quiz, QuizFormData } from "@src/types/index.js";
import * as ErrorClasses from "@helpers/error/classes.js";
import { getUserById } from "./user.service.js";
import { getDepartmentById } from "./department.service.js";

// ---------------- CREATE QUIZ ----------------
export const createQuiz = async (
  quizData: QuizFormData,
  created_by: number,
): Promise<Quiz> => {
  const [quizResult] = await pool.query(
    `INSERT INTO quizzes (teacher_id, title, description, duration_minutes) 
     VALUES (?, ?, ?, ?)`,
    [
      created_by,
      quizData.title,
      quizData.description,
      quizData.duration_minutes,
    ],
  );
  const quizId = (quizResult as any).insertId;

  // Insert questions + options
  for (const q of quizData.questions || []) {
    const [questionResult] = await pool.query(
      `INSERT INTO questions (quiz_id, question_text, explanation) 
       VALUES (?, ?, ?)`,
      [quizId, q.question_text, q.explanation || null],
    );
    const questionId = (questionResult as any).insertId;

    for (const opt of q.options || []) {
      await pool.query(
        `INSERT INTO options (question_id, option_text, is_correct) 
         VALUES (?, ?, ?)`,
        [questionId, opt.option_text, !!opt.is_correct],
      );
    }
  }

  return getQuizById(quizId);
};

// ---------------- GET ALL QUIZZES ----------------
export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const [quizzes] = await pool.query<RowDataPacket[]>(
    `SELECT q.*, u.name as teacher_name, u.email as teacher_email
     FROM quizzes q
     JOIN users u ON q.teacher_id = u.id
     ORDER BY q.created_at DESC`,
  );

  // attach questions + options
  for (const quiz of quizzes as any[]) {
    const [questions] = await pool.query<RowDataPacket[]>(
      "SELECT id, question_text, explanation FROM questions WHERE quiz_id = ?",
      [quiz.id],
    );

    for (const question of questions as any[]) {
      const [options] = await pool.query<RowDataPacket[]>(
        "SELECT id, option_text FROM options WHERE question_id = ?",
        [question.id],
      );
      question.options = options;
    }
    quiz.questions = questions;
  }
  return quizzes as Quiz[];
};

// ---------------- GET QUIZ BY ID ----------------
export const getQuizById = async (quizId: number): Promise<Quiz> => {
  const [quizArr] = await pool.query<RowDataPacket[]>(
    `SELECT q.*, u.name as teacher_name, u.email as teacher_email
     FROM quizzes q
     JOIN users u ON q.teacher_id = u.id
     WHERE q.id = ?`,
    [quizId],
  );
  if (quizArr?.length === 0)
    throw new ErrorClasses.NotFoundError("Quiz not found");

  const quiz = (quizArr as any[])[0];

  const [questions] = await pool.query<RowDataPacket[]>(
    "SELECT id, question_text, explanation FROM questions WHERE quiz_id = ?",
    [quizId],
  );

  for (const question of questions as any[]) {
    const [options] = await pool.query<RowDataPacket[]>(
      "SELECT id, option_text FROM options WHERE question_id = ?",
      [question.id],
    );
    question.options = options;
  }

  quiz.questions = questions;
  return quiz;
};

// ---------------- ASSIGN QUIZ (specific student) ----------------
export const assignQuiz = async (
  quizId: number,
  {
    batch_year,
    department_id,
    assigned_by,
  }: { batch_year: number; department_id: number; assigned_by: number },
) => {
  const quiz = await getQuizById(quizId);
  const user = await getUserById(assigned_by);
  const department = await getDepartmentById(department_id);
  await pool.query(
    `INSERT INTO quiz_assignments (quiz_id, created_by, batch_year, department_id) 
     VALUES (?, ?, ?, ?)`,
    [quizId, assigned_by, batch_year, department_id],
  );
  return { quiz_id: quizId, batch_year, department_id, assigned_by };
};

// ---------------- ASSIGN QUIZ ADVANCED ----------------
export const assignQuizAdvanced = async (
  quizId: number,
  payload: {
    student_ids?: number[];
    batch_year?: number;
    department_id?: number;
    assigned_by: number;
  },
) => {
  // 1. Assign specific students
  if (payload.student_ids && payload.student_ids.length > 0) {
    for (const studentId of payload.student_ids) {
      await pool.query(
        `INSERT INTO quiz_assignments (quiz_id, student_id, teacher_id) 
         VALUES (?, ?, ?)`,
        [quizId, studentId, payload.assigned_by],
      );
    }
    return { count: payload.student_ids.length };
  }

  // 2. Batch + Department
  if (payload.batch_year && payload.department_id) {
    const [students] = await pool.query<RowDataPacket[]>(
      `SELECT u.id FROM users u
       JOIN student_info s ON u.id = s.user_id
       WHERE s.batch_year = ? AND s.department_id = ? AND u.role = 'student'`,
      [payload.batch_year, payload.department_id],
    );

    for (const s of students) {
      await pool.query(
        `INSERT INTO quiz_assignments (quiz_id, student_id, teacher_id, batch_year, department_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          quizId,
          s.id,
          payload.assigned_by,
          payload.batch_year,
          payload.department_id,
        ],
      );
    }
    return { count: students.length };
  }

  // 3. Batch only
  if (payload.batch_year && !payload.department_id) {
    const [students] = await pool.query<RowDataPacket[]>(
      `SELECT u.id FROM users u
       JOIN student_info s ON u.id = s.user_id
       WHERE s.batch_year = ? AND u.role = 'student'`,
      [payload.batch_year],
    );

    for (const s of students) {
      await pool.query(
        `INSERT INTO quiz_assignments (quiz_id, student_id, teacher_id, batch_year) 
         VALUES (?, ?, ?, ?)`,
        [quizId, s.id, payload.assigned_by, payload.batch_year],
      );
    }
    return { count: students.length };
  }

  // 4. Department only
  if (!payload.batch_year && payload.department_id) {
    const [students] = await pool.query<RowDataPacket[]>(
      `SELECT u.id FROM users u
       JOIN student_info s ON u.id = s.user_id
       WHERE s.department_id = ? AND u.role = 'student'`,
      [payload.department_id],
    );

    for (const s of students) {
      await pool.query(
        `INSERT INTO quiz_assignments (quiz_id, student_id, teacher_id, department_id) 
         VALUES (?, ?, ?, ?)`,
        [quizId, s.id, payload.assigned_by, payload.department_id],
      );
    }
    return { count: students.length };
  }

  return { count: 0 };
};

// ---------------- START QUIZ ----------------
export const startQuiz = async (quizId: number, studentId: number) => {
  const [result] = await pool.query(
    `INSERT INTO quiz_attempts (assignment_id, started_at) 
     SELECT qa.id, NOW()
     FROM quiz_assignments qa
     WHERE qa.quiz_id = ? AND qa.student_id = ? LIMIT 1`,
    [quizId, studentId],
  );
  return { attemptId: (result as any).insertId, quizId, studentId };
};

// ---------------- SUBMIT QUIZ ----------------
export const submitQuiz = async (attemptId: number, answers: any[]) => {
  let score = 0;

  for (const ans of answers) {
    const [[correct]] = await pool.query<RowDataPacket[]>(
      `SELECT is_correct FROM options WHERE id = ?`,
      [ans.option_id],
    );

    const isCorrect = !!correct?.is_correct;
    if (isCorrect) score++;

    await pool.query(
      `INSERT INTO student_answers (attempt_id, question_id, option_id, is_correct) 
       VALUES (?, ?, ?, ?)`,
      [attemptId, ans.question_id, ans.option_id, isCorrect],
    );
  }

  await pool.query(
    `UPDATE quiz_attempts SET ended_at = NOW(), score = ? WHERE id = ?`,
    [score, attemptId],
  );

  return { attemptId, score };
};

// ---------------- UPDATE QUIZ ----------------
export const updateQuiz = async (quizId: number, quizData: Partial<Quiz>) => {
  const quiz = await getQuizById(quizId);

  await pool.query(
    `UPDATE quizzes 
     SET title = ?, description = ?, duration_minutes = ? 
     WHERE id = ?`,
    [quizData.title, quizData.description, quizData.duration_minutes, quizId],
  );

  if (quizData.questions) {
    // Clear old
    const [oldQuestions] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM questions WHERE quiz_id = ?",
      [quizId],
    );
    for (const q of oldQuestions) {
      await pool.query("DELETE FROM options WHERE question_id = ?", [q.id]);
    }
    await pool.query("DELETE FROM questions WHERE quiz_id = ?", [quizId]);

    // Insert new
    for (const q of quizData.questions) {
      const [questionResult] = await pool.query(
        `INSERT INTO questions (quiz_id, question_text, explanation) VALUES (?, ?, ?)`,
        [quizId, q.question_text, q.explanation || null],
      );
      const questionId = (questionResult as any).insertId;

      for (const opt of q.options || []) {
        await pool.query(
          `INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)`,
          [questionId, opt.option_text, !!opt.is_correct],
        );
      }
    }
  }
  return getQuizById(quizId);
};

// ---------------- DELETE QUIZ ----------------
export const deleteQuiz = async (quizId: number) => {
  // 1. Delete student answers linked to attempts of this quiz
  await pool.query(
    `DELETE sa 
       FROM student_answers sa
       JOIN quiz_attempts qa ON sa.attempt_id = qa.id
       JOIN quiz_assignments qa2 ON qa.assignment_id = qa2.id
       WHERE qa2.quiz_id = ?`,
    [quizId],
  );

  // 2. Delete attempts
  await pool.query(
    `DELETE qa 
       FROM quiz_attempts qa
       JOIN quiz_assignments qas ON qa.assignment_id = qas.id
       WHERE qas.quiz_id = ?`,
    [quizId],
  );

  // 3. Delete assignments
  await pool.query(`DELETE FROM quiz_assignments WHERE quiz_id = ?`, [quizId]);

  // 4. Delete options
  await pool.query(
    `DELETE o 
       FROM options o 
       JOIN questions q ON o.question_id = q.id 
       WHERE q.quiz_id = ?`,
    [quizId],
  );

  // 5. Delete questions
  await pool.query(`DELETE FROM questions WHERE quiz_id = ?`, [quizId]);

  // 6. Delete quiz itself
  await pool.query(`DELETE FROM quizzes WHERE id = ?`, [quizId]);

  return { quiz_id: quizId };
};

// ---------------- UNASSIGN QUIZ ----------------
export const unassignQuiz = async (quizId: number, studentId: number) => {
  await pool.query(
    "DELETE FROM quiz_assignments WHERE quiz_id = ? AND student_id = ?",
    [quizId, studentId],
  );
};
