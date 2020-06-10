-- Query para el caso F3
DELIMITER ;;
DROP PROCEDURE IF EXISTS searchJob ;;

CREATE PROCEDURE searchJob(
		IN search VARCHAR(50)
	)
BEGIN
	SELECT * FROM Jobs WHERE categoria = search or ubicacion = search
	or posicion = search or compañia = search or tipo = search or descripcion = search;
END ;;
DELIMITER ;

-- Para usar el sp se usa el siguiente comando:
-- Call searchJob('aqui iria la palabra buscada');