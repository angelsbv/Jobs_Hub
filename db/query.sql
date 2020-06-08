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

CREATE TABLE trabajo 
(
    ID int (11) NOT null,
    ubicacion VARCHAR(50) NOT NULL,
    posicion VARCHAR(50) NOT NULL,
    compañia VARCHAR(50) NOT NULL,
    fecha TIMESTAMP NOT NULL,
	categoria VARCHAR(50) NOT NULL,
    tipo varchar(50) NOT NULL,
    logo varchar(255) NOT NULL,
    descripcion VARCHAR(255)
);

ALTER TABLE trabajo
    ADD PRIMARY KEY (ID);

ALTER TABLE trabajo MODIFY ID int(11) AUTO_INCREMENT, AUTO_INCREMENT = 1;

CREATE TABLE enviarPuestoJob
(
    ID int(11) NOT NULL,
	GMAIL VARCHAR(50) NOT NULL,
	URLapp VARCHAR(100),
	IDJOB INT
    
);

CREATE TABLE TIPO
(
    TiempoFull varchar(10) NOT NULL,
	TiempoMedio varchar(10) NOT NULL,
	FREELANCE VARCHAR(10) NOT NULL
	
);

ALTER TABLE enviarPuestoJob ADD FOREIGN KEY (IDJOB) REFERENCES TRABAJO(ID);