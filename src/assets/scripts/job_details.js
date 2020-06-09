let params = (new URL(location.href)).searchParams;

let myId = params.get('id');
console.log(myId);

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
        }
    }
}
if(myId == null){
    window.location="http://localhost:3000/error404";
}else{
traerDatos();
}