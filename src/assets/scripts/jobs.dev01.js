
let newCategoryTemplate = `<div class="category">
    <h1>{title}</h1>
    <table class="table tabla-design table-hover table-bordered border-dark">
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
    <a class="more-jobs" href="/job/category?categoryName={category-name}">{rest}</a>
</div>`

const container = document.querySelector(".contenedor")

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
        newCategory = newCategoryTemplate
                        .replace('{title}', category)
                        .replace('{category}', category)
                        .replace('{category-name}', category);
        let categoryLength = categories[category].length; 
        if(categoryLength > 10){
            newCategory = newCategory.replace('{rest}', `Y ${categoryLength - 10} trabajo(s) m&aacute;s...`);
            categoryLength = 10;
        }else
            newCategory = newCategory.replace('{rest}', ``);
        
        container.innerHTML += newCategory;
        newCategory = document.querySelector(`.${category}`)
        category = categories[category];
        for(let a = 0; a < categoryLength; a++) 
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