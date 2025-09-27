-- ==============================================
-- QUIZ SYSTEM DATABASE - INITIAL MIGRATION
-- ==============================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS quiz_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_app;

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL  -- e.g., "BCA", "IT", "CS"
);

-- ========================
-- USERS (Admin, Teacher, Student)
-- ========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    login_start DATETIME NULL,   -- for students (when login allowed)
    login_end DATETIME NULL,     -- for students (when login expires)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- TEACHER INFO (1:1 with users, extra fields)
-- ========================
CREATE TABLE IF NOT EXISTS teacher_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- FK to users(id)
    department_id INT NOT NULL, -- FK to departments(id)
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- ========================
-- STUDENT INFO (1:1 with users, extra fields)
-- ========================
CREATE TABLE IF NOT EXISTS student_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,          -- FK to users(id)
    department_id INT NOT NULL,    -- FK to departments(id)
    roll_number VARCHAR(50) UNIQUE,
    batch_year INT,                -- e.g., 2016
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- ========================
-- QUIZZES (created by teacher)
-- ========================
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL, -- quiz timer in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- ========================
-- QUESTIONS
-- ========================
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    explanation TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- ========================
-- OPTIONS (for each question)
-- ========================
CREATE TABLE IF NOT EXISTS options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- ========================
-- QUIZ ASSIGNMENTS (admin assigns quiz to students)
-- ========================
CREATE TABLE IF NOT EXISTS quiz_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_by INT NOT NULL,
    quiz_id INT NOT NULL,
    student_id INT NULL,        -- optional (for single student)
    department_id INT NULL,     -- optional (for entire department)
    batch_year INT NULL,        -- optional (for specific batch)
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- ========================
-- STUDENT ANSWERS
-- ========================
CREATE TABLE IF NOT EXISTS student_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    quiz_id INT NOT NULL,
    question_id INT NOT NULL,
    option_id INT NOT NULL,
    is_correct BOOLEAN,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (option_id) REFERENCES options(id)
);

-- ========================
-- INDEXES (performance optimization)
-- ========================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_quizzes_teacher ON quizzes(teacher_id);
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_options_question ON options(question_id);
CREATE INDEX idx_assignments_quiz_student ON quiz_assignments(quiz_id, student_id);
CREATE INDEX idx_answers_student ON student_answers(student_id);
CREATE INDEX idx_answers_quiz ON student_answers(quiz_id);
CREATE INDEX idx_answers_question ON student_answers(question_id);
CREATE INDEX idx_answers_option ON student_answers(option_id);