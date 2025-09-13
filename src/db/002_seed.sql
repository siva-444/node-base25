-- ==============================================
-- QUIZ SYSTEM DATABASE - SEED DATA
-- ==============================================
USE quiz_app;

-- ========================
-- QUIZ CREATED BY TEACHER
-- ========================
INSERT INTO quizzes (teacher_id, title, description, duration_minutes)
VALUES (
    (SELECT id FROM users WHERE email = 'teacher@example.com'),
    'General Knowledge Quiz',
    'This is a demo quiz with basic GK questions.',
    10
);

-- ========================
-- QUESTIONS
-- ========================
INSERT INTO questions (quiz_id, question_text, explanation)
VALUES 
(
    (SELECT id FROM quizzes WHERE title = 'General Knowledge Quiz'),
    'What is the capital of France?',
    'Paris is the capital and most populous city of France.'
),
(
    (SELECT id FROM quizzes WHERE title = 'General Knowledge Quiz'),
    'Which planet is known as the Red Planet?',
    'Mars is called the Red Planet because of its reddish appearance.'
);

-- ========================
-- OPTIONS FOR QUESTION 1
-- ========================
INSERT INTO options (question_id, option_text, is_correct)
VALUES
((SELECT id FROM questions WHERE question_text = 'What is the capital of France?' LIMIT 1), 'Paris', TRUE),
((SELECT id FROM questions WHERE question_text = 'What is the capital of France?' LIMIT 1), 'London', FALSE),
((SELECT id FROM questions WHERE question_text = 'What is the capital of France?' LIMIT 1), 'Berlin', FALSE),
((SELECT id FROM questions WHERE question_text = 'What is the capital of France?' LIMIT 1), 'Madrid', FALSE);

-- ========================
-- OPTIONS FOR QUESTION 2
-- ========================
INSERT INTO options (question_id, option_text, is_correct)
VALUES
((SELECT id FROM questions WHERE question_text = 'Which planet is known as the Red Planet?' LIMIT 1), 'Mars', TRUE),
((SELECT id FROM questions WHERE question_text = 'Which planet is known as the Red Planet?' LIMIT 1), 'Jupiter', FALSE),
((SELECT id FROM questions WHERE question_text = 'Which planet is known as the Red Planet?' LIMIT 1), 'Venus', FALSE),
((SELECT id FROM questions WHERE question_text = 'Which planet is known as the Red Planet?' LIMIT 1), 'Saturn', FALSE);

-- ========================
-- ASSIGN QUIZ TO STUDENT
-- ========================
INSERT INTO quiz_assignments (quiz_id, student_id)
VALUES (
    (SELECT id FROM quizzes WHERE title = 'General Knowledge Quiz'),
    (SELECT id FROM users WHERE email = 'student@example.com')
);

-- ========================
-- SIMULATE A QUIZ ATTEMPT
-- ========================
INSERT INTO quiz_attempts (assignment_id, score, ended_at)
VALUES (
    (SELECT id FROM quiz_assignments WHERE quiz_id = (SELECT id FROM quizzes WHERE title = 'General Knowledge Quiz') LIMIT 1),
    10, -- example score
    NOW()
);

-- ========================
-- RECORD STUDENT ANSWERS
-- ========================
INSERT INTO student_answers (attempt_id, question_id, option_id, is_correct)
VALUES
(
    (SELECT id FROM quiz_attempts ORDER BY id DESC LIMIT 1),
    (SELECT id FROM questions WHERE question_text = 'What is the capital of France?' LIMIT 1),
    (SELECT id FROM options WHERE option_text = 'Paris' LIMIT 1),
    TRUE
),
(
    (SELECT id FROM quiz_attempts ORDER BY id DESC LIMIT 1),
    (SELECT id FROM questions WHERE question_text = 'Which planet is known as the Red Planet?' LIMIT 1),
    (SELECT id FROM options WHERE option_text = 'Mars' LIMIT 1),
    TRUE
);
