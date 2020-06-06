CREATE DATABASE p3_web;
USE p3_web;

CREATE TABLE users(
    ID int(11) NOT NULL,
    username VARCHAR(21) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    emailConfirmationCode VARCHAR(255),
    emailConfirmed BOOLEAN
);

ALTER TABLE users
    ADD PRIMARY KEY (ID);

ALTER TABLE users MODIFY ID int(11) AUTO_INCREMENT, AUTO_INCREMENT = 1;

