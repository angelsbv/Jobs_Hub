'use strict';

const tbody = document.querySelector('tbody');
const title = document.querySelector('#category-title');

const init = async () => {
    try {
        let params = (new URL(location.href)).searchParams;
        let categoryName = params.get('categoryName');
        const resp = await fetch(`/job/get-by/categoria/${categoryName}`);
        const { jobs } = await resp.json();
        if(jobs.length > 0){
            for(let j in jobs) 
            {
                let job = jobs[j];
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
                tbody.appendChild(tr);
            }
            $('#datatable').DataTable();
        }
    } catch (error) {
        throw error;     
    }
}

// const tRowClickHandler = (e) => {
//     let trow = e.target.parentElement;
//     if(trow){
//         if(trow.tagName == 'TR' && trow.childNodes[1].tagName !== 'TH'){
//             location.href = `${location.origin}/job/details?id=${trow.id}`;
//         }
//     }
// }

// tbody.addEventListener('click', tRowClickHandler)
window.addEventListener('load', init);