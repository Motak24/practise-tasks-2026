CREATE DATABASE korochki;
USE korochki;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  payment_method ENUM('cash', 'transfer') NOT NULL,
  status ENUM('Новая', 'Идет обучение', 'Обучение завершено') DEFAULT 'Новая',
  review TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
