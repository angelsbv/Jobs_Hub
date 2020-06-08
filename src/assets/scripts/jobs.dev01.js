


let newCategoryTemplate = `<div class="category">
    <h1>{title}</h1>
    <table class="table tabla-design">
        <thead class="thead-light">
            <tr>
                <th>Location</th>
                <th>Position</th>
                <th>Company</th>
            </tr>
        </thead>
        <tbody class = "{category}">
        </tbody>
    </table>
</div>`

const container = document.querySelector(".contenedor")

async function getJobs()
{
    const res = await fetch('/job/get-all');
    const data = await res.json();
    
    let cat = '';
    let cats = {};
    for(let i = 0; i < data.length; i++){
        cat = data[i].categoria
        cats[cat] = data.filter((c) => 
            c.categoria === cat
        );
    }

    for(let cat in cats)
    {

        newCat = newCategoryTemplate.replace('{title}', cat).replace('{category}', cat)
        
        container.innerHTML += newCat
        newCat = document.querySelector(`.${cat}`)
        cat = cats[cat]

        for(let a = 0; a < cat.length; a++) 
        {

                
                let tr = document.createElement("tr");

             for(let b in cat[a])
            {

            
                if(b === 'ubicacion' 
                ||b === 'posicion' 
                ||b === 'compañia'
                ){
                let td = document.createElement("td");
                td.innerHTML = cat[a][b]; 
                tr.appendChild(td);

                }
            }

             newCat.appendChild(tr)
        }
    }
}

window.addEventListener('load', getJobs);