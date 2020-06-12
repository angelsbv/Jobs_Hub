CREATE DATABASE Jobs_Hub;
USE Jobs_Hub;

CREATE TABLE Users(
    ID int(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(21) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    userRol int,
    emailConfirmationCode VARCHAR(255),
    emailConfirmed BOOLEAN,
    PRIMARY KEY (ID)
);


CREATE TABLE PostersInfo(
    ID int(11) NOT NULL AUTO_INCREMENT,
    userID int(11) NOT NULL,
    empresa varchar(54) NOT NULL,
    emailEmpresa varchar(255) NOT NULL,
    telefonoEmpresa varchar(30) NOT NULL,
    APIUID varchar(255) NOT NULL,
    APIToken varchar(255) NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES Users(ID)
);

CREATE TABLE Jobs 
(
    ID int (11) NOT NULL AUTO_INCREMENT,
    ubicacion VARCHAR(50) NOT NULL,
    posicion VARCHAR(50) NOT NULL,
    compañia VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	categoria VARCHAR(50) NOT NULL,
    tipo varchar(50) NOT NULL,
    logo varchar(255) NOT NULL,
    descripcion VARCHAR(1600),
    PRIMARY KEY (ID)
);