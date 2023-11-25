-- Check if the database exists
CREATE DATABASE IF NOT EXISTS TEST_DEV_DB;

-- Switch to the database
USE TEST_DEV_DB;

-- Create Role Table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create User Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  roleId INT NOT NULL,
  FOREIGN KEY (roleId) REFERENCES roles(id)
);

-- Create Classroom Table
CREATE TABLE classrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tutorId INT NOT NULL,
  className VARCHAR(255) NOT NULL,
  FOREIGN KEY (tutorId) REFERENCES users(id)
);

-- Create File Table
CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  classroomId INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploadedBy INT NOT NULL,
  fileType VARCHAR(20) NOT NULL,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (classroomId) REFERENCES classrooms(id),
  FOREIGN KEY (uploadedBy) REFERENCES users(id)
);



--- INSERT ROLES
INSERT INTO roles(name) values('tutor'),('student');

-- INSERT DUMMY DATA
-- Insert a Tutor User
INSERT INTO users (username, password, roleId) VALUES ('tutor1', 'pass123', 1);

-- Insert a Student User
INSERT INTO users (username, password, roleId) VALUES ('student1', 'pass456', 2);