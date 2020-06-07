const mysql = require('mysql');
const squel = require('squel');

let conexion = mysql.createConnection({
    host: 'locaslhost',
    user: 'root',
    password: '',
    database: 'p3_web'
});

conexion.connect;



let consulta = squel.select()
   .field('ID')
   .field('ubicacion')
   .field('posicion')
   .field('compañia')
   .from('trabajos');

    console.log('Consulta SQL:', consulta.toString());

   conexion.query(consulta.toString(), function(error, registros, campos){
       if(Error){
       throw Error
       }

       registros.forEach(function( registros, indice, arreglo){
           console.log('ID', registros.id);
           console.log('ubicacion', registros.ubicacion);
           console.log('posicion', registros.posicion);
           console.log('compañia', registros.compañia);
           console.log('trabajos', registros.trabajos);
       });

       conexion.end();
   });