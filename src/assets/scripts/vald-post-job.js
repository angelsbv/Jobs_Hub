console.log('Toy aqui >:v');
var categoria;
var tipo;
var compañia;
var ubicacion;
var logo;
var posicion;
var descripcion;

let permiso = false;

function validacion() {
    var categoriaInput = document.getElementById('categoria');
    categoria = categoriaInput.value;
    var tipoInput = $('input[name="tipo"]:checked');
    tipo = tipoInput.val();
    var compañiaInput = document.getElementById('compañia');
    compañia = compañiaInput.value.trim();
    var ubicacionInput = document.getElementById('ubicacion');
    ubicacion = ubicacionInput.value.trim();
    var logoInput = document.getElementById('logo');
    logo = logoInput.value;
    
    var posicionInput = document.getElementById('posicion');
    posicion = posicionInput.value .trim();
    var descripcionInput = document.getElementById('descripcion');
    descripcion = descripcionInput.value.trim();

    if(categoria === "" || categoria === null || categoria === undefined){
        alert("Debe completar el formulario" + "\nNo ha elegido una categoria.");
    }else if(tipo === "" || tipo === null || tipo === undefined){
        alert("Debe completar el formulario" + "\nNo ha elegido un tipo.");
    }else if(compañia === "" || compañia === null || compañia === undefined){
        alert("Debe completar el formulario" + "\nNo ha ingresado el nombre de su compañia.");
    }else if(ubicacion === "" || ubicacion === null || ubicacion === undefined){
        alert("Debe completar el formulario" + "\nNo ha ingresado la ubicacion del puesto de trabajo");
    }else if(logo === "" || logo === null || logo === undefined){
        alert("Debe completar el formulario" + "\nNo ha ingresado su logo.");
    }else if(posicion === "" || posicion === null || posicion === undefined){
        alert("Debe completar el formulario" + "\nNo ha determinado la posicion.");
    }else if(descripcion === "" || descripcion === null || descripcion === undefined){
        alert("Debe completar el formulario" + "\nNo ha llenado la descripcion del trabajo.");
    }else{
        console.log('Todo bien');
        alert('Todo bien');
        permiso = true;
    }
    return permiso;
}