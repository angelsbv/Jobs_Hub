function categorias() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET','/adm/get-site-config',true);
    
    xhttp.send();
    
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let datos = JSON.parse(this.responseText);

            const tbody = document.querySelector('tbody');
            for(let i in datos.config.categories){
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.setAttribute('contenteditable','true')
                td.setAttribute('id','cell'+i);
                td.innerHTML = datos.config.categories[i];
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            let newMax = 1
            let max = document.querySelector('#max');
            max.value = datos.config.maxJobsInMainPage;
            let setMax = document.querySelector('#setMax')
            setMax.addEventListener('click',function(){
                newMax = max.value;
            })

            let confirm = document.querySelector('#confirm');
            confirm.addEventListener('click', async function (e) {
                    e.preventDefault();
                    const resp = await fetch(`/adm/set-site-config`, { 
                        method: 'POST', 
                        body: JSON.stringify({ 
                            "maxJobsInMainPage": max.value,
                            "categories": [
                                document.getElementById('cell0').innerText,
                                document.getElementById('cell1').innerText,
                                document.getElementById('cell2').innerText,
                                document.getElementById('cell3').innerText,
                                document.getElementById('cell4').innerText
                            ]
                        }),
                        headers:{
                            "Content-Type": "application/json"
                        }
                    });
                    // const data = await resp.json();
                    alert('Los datos han sido guardados correctamente.');
                    location.href = "/adm/categoria_adm";
            });
        }
    }
}

categorias();