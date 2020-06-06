    const pw = document.getElementById("pw");
    const cpw = document.getElementById("cpw");
    const email = document.getElementById("mail");
    const form = document.getElementById("form");
    var error = document.getElementById("error");
    error.style.color = 'red';


function validate()
{
    var text = document.getElementById('pw');

    text.addEventListener( 'keyup',(event) =>{
    
       var inputText = event.path[0].value;
      // document.querySelector('.mostrar').innerHTML = inputText;
    });

    var erroresMSM = [];

    if(pw.value == null)
    {
         erroresMSM.push('No se aceptan campos vacios');
         erroresMSM.push('Insertar nombre');

         
    }
    

    form.addEventListener("submit", e=>
    {
           e.defaultPrevented();
           if(pw.nodeValue,length <6)
           {
               alert("Contraseña muy debil")
           }
    })

   
}
