-- ==============================================
-- QUIZ SYSTEM DATABASE - CLEANUP SCRIPT
-- Keeps USERS table intact
-- Deletes all quiz-related data
-- ==============================================
USE quiz_app;

-- Disable foreign key checks to allow truncation
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE student_answers;
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE quiz_assignments;
TRUNCATE TABLE options;
TRUNCATE TABLE questions;
TRUNCATE TABLE quizzes;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Optional: Reset AUTO_INCREMENT counters for a fresh start
ALTER TABLE quizzes AUTO_INCREMENT = 1;
ALTER TABLE questions AUTO_INCREMENT = 1;
ALTER TABLE options AUTO_INCREMENT = 1;
ALTER TABLE quiz_assignments AUTO_INCREMENT = 1;
ALTER TABLE quiz_attempts AUTO_INCREMENT = 1;
ALTER TABLE student_answers AUTO_INCREMENT = 1;

-- Keep USERS as is (Admin, Teacher, Student still exist)
