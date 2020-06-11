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
        $('#categoria').focus().addClass('is-invalid');
        $('#adverCategoria').css('visibility','visible');
    }else if(tipo === "" || tipo === null || tipo === undefined){
        $(':radio').focus().addClass('is-invalid');
        $('#adverTipo').css('visibility','visible');
    }else if(compañia === "" || compañia === null || compañia === undefined){
        $('#compañia').focus().addClass('is-invalid');
        $('#adverCompa').css('visibility','visible');
    }else if(ubicacion === "" || ubicacion === null || ubicacion === undefined){
        $('#ubicacion').focus().addClass('is-invalid');
        $('#adverUbi').css('visibility','visible');
    }else if(logo === "" || logo === null || logo === undefined){
        $('#logo').focus().addClass('is-invalid');
        $('#adverLogo').css('visibility','visible');
    }else if(posicion === "" || posicion === null || posicion === undefined){
        $('#posicion').focus().addClass('is-invalid');
        $('#adverPos').css('visibility','visible');
    }else if(descripcion === "" || descripcion === null || descripcion === undefined){
        $('#descripcion').focus().addClass('is-invalid');
        $('#adverDes').css('visibility','visible');
    }else{
        $('input').addClass('is-valid');
        $('p').css('visibility','hidden');
        permiso = true;
    }
    return permiso;
}