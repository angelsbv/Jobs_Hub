CREATE DATABASE p3_web;
USE p3_web;

CREATE TABLE users(
    ID int(11) NOT NULL,
    username varchar(21) NOT NULL,
    email varchar(255) NOT NULL,
    pwdhash varchar(255) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (ID);

ALTER TABLE users MODIFY ID int(11) AUTO_INCREMENT, AUTO_INCREMENT = 1;

