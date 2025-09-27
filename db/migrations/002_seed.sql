
-- ========================
-- SEED DATA (optional for testing)
-- Password: pwd123 is default password for all users
-- ========================
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$uRZO0IgSiyEuZs2IxMWvJQ$IyKq5AB1Ie9wuJg2HHlqx3trrtuEOsOvHs6T7KR7uN8', 'admin');

-- Departments
INSERT INTO departments (name) VALUES
('BCA'),
('MCA'),
('BBA'),
('MBA'),
('B.Sc(CS)'),
('B.Sc(IT)'),
('B.Sc(BioTech)'),
('B.Sc(Physics)'),
('B.Sc(Chemistry)'),
('B.Sc(Mathematics)'),
('M.Sc(Physics)'),
('M.Sc(Chemistry)'),
('M.Sc(Mathematics)');