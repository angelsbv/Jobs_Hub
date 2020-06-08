let params = (new URL(location.href)).searchParams;
console.log(params.get('id'));
const myId = params.get('id');

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

traerDatos();