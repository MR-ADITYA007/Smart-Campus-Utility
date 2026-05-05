-- Use the auth/register endpoint to create a starter admin and student.
-- Example payload:
-- { "username": "admin", "password": "admin123", "role": "admin" }
-- { "username": "student", "password": "student123", "role": "student" }

INSERT INTO announcements (title, content) VALUES
('Welcome to Smart Campus', 'This portal helps students report issues and view campus announcements.'),
('Service Launch', 'The Smart Campus Utility Application is now live for issue reporting and admin workflows.');
