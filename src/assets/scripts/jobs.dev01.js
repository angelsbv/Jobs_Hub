
let newCategoryTemplate = `<div class="category">
    <h1>{title}</h1>
    <table class="table tabla-design table-hover">
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

const handleTRowClick = (e) => {
    console.log(e.target);
}

async function getJobs()
{
    const res = await fetch('/job/get-all');
    const data = await res.json();
    let category = '';
    let categories = {};
    for(let i = 0; i < data.length; i++){
        category = data[i].categoria
        categories[category] = data.filter((c) => 
            c.categoria === category
        );
    }
    for(let category in categories)
    {
        newCategory = newCategoryTemplate.replace('{title}', category).replace('{category}', category)
        container.innerHTML += newCategory
        newCategory = document.querySelector(`.${category}`)
        category = categories[category];
        for(let a = 0; a < category.length; a++) 
        {
            let job = category[a]
            let tr = document.createElement("tr");
            tr.id = job.ID;
            tr.style.cursor = "pointer";
            for(let t in job)
            {       
                if(t === 'ubicacion' 
                ||t === 'posicion' 
                ||t === 'compañia'
                ){
                    let td = document.createElement('td');
                    td.innerHTML = job[t]; 
                    tr.appendChild(td);
                }
            }
            newCategory.appendChild(tr)
        }
    }
}

const tRowClickHandler = (e) => {
    let trow = e.target.parentElement;
    if(trow.tagName == 'TR'){
        location.href = `${location.origin}/job/details?id=${trow.id}`;
    }
}

container.addEventListener('click', tRowClickHandler)
window.addEventListener('load', getJobs);