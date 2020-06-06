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
    fecha date NOT NULL,
	categoria VARCHAR(50) NOT NULL
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
GO

--Query para el caso F3
--drop proc CASOF3
delimiter//
Create Proc CASOF3(@busqueda varchar(255))
AS
BEGIN
	Create Table #tmpC3
	(
		ID int(11),
		ubicacion VARCHAR(50),
		posicion VARCHAR(50),
		compañia VARCHAR(50),
		fecha date,
		categoria VARCHAR(50)
	)

	Declare @ID int(11);
	Declare	@ubicacion VARCHAR(50);
	Declare	@posicion VARCHAR(50);
	Declare	@compañia VARCHAR(50);
	Declare	@fecha date;
	Declare	@categoria VARCHAR(50);

	Declare C_Datos Cursor for
	--Aqui va le query cabrona
	Select * from trabajo where categoria like @busqueda or ubicacion like @busqueda 
	or posicion like @busqueda or compañia like @busqueda or fecha like @busqueda;

	Open C_Datos
	while 1=1
	begin
		fetch next from C_Datos into @ID, @ubicacion, @posicion, @compañia, @fecha, @categoria
		if @@FETCH_STATUS != 0
		begin
			break
		end

		Insert Into #tmpC3 values(@ID, @ubicacion, @posicion, @compañia, @fecha, @categoria)
	end
	Close C_Datos
	Deallocate C_Datos

	Select * from #tmpC3
END
//
delimiter;
Go
