DROP PROCEDURE IF EXISTS `fill_table`;
DELIMITER $$
CREATE PROCEDURE `fill_table`()
BEGIN
  DECLARE i INT DEFAULT 0;

  WHILE i < 60 DO
    INSERT INTO trabajo (ubicacion, posicion, compañia, fecha, categoria) 
    VALUES (i, i, i, '2020-02-02', 'design');
    SET i = i + 1;
  END WHILE;
END$$
DELIMITER ;
-----------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE Users;
SET FOREIGN_KEY_CHECKS = 1;
