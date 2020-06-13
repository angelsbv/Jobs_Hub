let params = (new URL(location.href)).searchParams;

let myId = params.get('id');
var comprobar = false;

function permiso(){
    if(myId == null || myId == undefined || myId == 0){
        comprobar = true;
    }
}

permiso();

function traerDatos() {

    const xhttp = new XMLHttpRequest();
    xhttp.open('GET','/job/get/'+myId,true);
    
    xhttp.send();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            
            let datos = JSON.parse(this.responseText);
           
            let logo = document.querySelector('#logo');
            logo.src = datos.logo;

           let compania = document.querySelector('#compania');
           compania.innerText = datos.compañia;

           let ubicacion = document.querySelector('#ubicacion');
           ubicacion.innerText = datos.ubicacion;
           
           let desc_trabajo = document.querySelector('#desc_trabajo');
           desc_trabajo.innerHTML = datos.posicion + " - " + datos.tipo;

           let descripcion = document.querySelector('#descripcion');
           descripcion.innerText = datos.descripcion;
        } else if(this.status == 404){
            location.href = "/error404";
        }
    }
}
if(comprobar){
    location.href = "/error404";
}else{
traerDatos();
}

function eliminar() {
    var opcion = confirm('Esta seguro?');
    if(opcion === true){
        const xhttp = new XMLHttpRequest();
        xhttp.open('DELETE','/job/remove/'+myId,true);
    
        xhttp.send();
        window.location="/";
    }else{
        window.location="/job/details?id="+myId;
    }
}

function editar() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('PUT','/job/edit/'+myId,true);
    
    xhttp.send();
    window.location="/job/post?id="+myId;
}