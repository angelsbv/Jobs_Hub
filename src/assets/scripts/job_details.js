//console.log('Correcto');

function traerDatos() {
    
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET','/job/get/5',true);

    xhttp.send();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            
            let datos = JSON.parse(this.responseText);
            console.log(datos);
           
           let compania = document.querySelector('#compania');
           compania.innerText = datos.compañia;

           let ubicacion = document.querySelector('#ubicacion');
           ubicacion.innerText = datos.ubicacion;
           let desc_trabajo = document.querySelector('#desc_trabajo');
           desc_trabajo.innerHTML = datos.posicion + " - " //+ datos.tipo;

           let descripcion = document.querySelector('#descripcion');
           //descripcion.innerText = datos.descripcion;
        }
    }
}

traerDatos();
