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

let params = (new URL(location.href)).searchParams;
let myId = params.get('id');


function editar() {
    if(myId !== null || myId !== undefined){
        const xhttp = new XMLHttpRequest();
        xhttp.open('GET','/job/get/'+myId,true);
        
        xhttp.send();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let datos = JSON.parse(this.responseText);
                console.log(datos);

               let id = document.querySelector('#id');
               id.value = datos.ID;

                let categoria = document.querySelector('#categoria');
                categoria.value = datos.categoria;

                let compañia = document.querySelector('#compañia');
                compañia.value = datos.compañia;
                
                let ubicacion = document.querySelector('#ubicacion');
                ubicacion.value = datos.ubicacion;

                let logo = document.querySelector('#logo');
                logo.value = datos.logo;

                let posicion = document.querySelector('#posicion');
                posicion.value = datos.posicion;

                let descripcion = document.querySelector('#descripcion');
                descripcion.value = datos.descripcion;

                var tipos = document.getElementsByName("tipo");

                for(var i = 0; i < tipos.length; i++) {
                    if(tipos[i].value == datos.tipo){
                        tipos[i].checked = true;
                    }
                }

                let formulario = document.querySelector('#formulario');
                formulario.action = '/job/edit/'+myId;
                formulario.method = 'PUT';
                formulario.addEventListener('submit', async function () {
                    e.preventDefault();
                    const resp = await fetch(`/job/edit/${myId}`, { method: 'PUT', body: { 
                        "ID":id.value,
                        "categoria": categoria.value,
                        "tipo": tipo.value,
                        "compañia":compañia.value,
                        "ubicacion": ubicacion.value,
                        "logo": logo.value,
                        "posicion": posicion.value,
                        "descripcion": descripcion.value
                     } });
                     const data = await resp.json();
                     console.log(data);
                   });

            }
        }
    }
}

editar();

