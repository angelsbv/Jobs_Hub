const resultsTemplate = `
<div class="category">
    <h1>Resultados Coincidentes</h1>
    <table class="table tabla-design table-hover">
        <thead class="thead-light">
            <tr>
                <th>Location</th>
                <th>Position</th>
                <th>Company</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody class="results">
        </tbody>
    </table>
</div>
`
const searchForm = document.querySelector('#search-form');
const searchField = document.querySelector('#search-field');

const searchFormSubmitHandler = (e) => {
    e.preventDefault();
    if(searchField.value.trim().length > 0){
        getResults()
        .then(({ results }) => {
            if(undefined !== results && results.length > 0){
                container.innerHTML = resultsTemplate;
                const resultsTbody = document.querySelector('.results');
                for(let i in results){
                    let job = results[i];
                    let tr = document.createElement("tr");
                    tr.id = job.ID;
                    tr.style.cursor = "pointer";
                    for(let t in job)
                    {       
                        if(t === 'ubicacion' 
                        || t === 'posicion' 
                        || t === 'compañia'
                        || t === 'categoria'
                        ){
                            let td = document.createElement('td');
                            td.innerHTML = job[t]; 
                            tr.appendChild(td);
                        }
                    }
                    resultsTbody.appendChild(tr);
                }
            }else{
                container.innerHTML = 'No pudimos encontrar resultados, intente con palabras distintas.';
            }
        })
        .catch((err) => {
            throw err;
        });
    }
}

const getResults = async () => {
    try {
        const resp = await fetch (`/job/search/${encodeURIComponent(searchField.value)}`)
        const data = await resp.json();
        return data;
    } catch (error) {
        throw error;
    }
}

searchForm.addEventListener('submit', searchFormSubmitHandler);