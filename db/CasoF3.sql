-- Query para el caso F3
DELIMITER ;;
DROP PROCEDURE IF EXISTS CASOF3 ;;

CREATE PROCEDURE CASOF3(
		IN search VARCHAR(50)
	)
BEGIN
	-- Aqui va la query cabrona
	SELECT * FROM trabajo WHERE categoria = search or ubicacion = search 
	or posicion = search or compañia = search or fecha = search;

END ;;
DELIMITER ;

-- Para usar el sp se usa el siguiente comando:
-- Call CASOF3('aqui iria la palabra buscada');