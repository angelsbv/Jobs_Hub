/*
    Endpoints
    * 
    
    Layouts:
    * M: Materialize
    * B: Bootstrap
*/

const router = require('express').Router();
const { isAuth } = require('./index.routes');
const pool = require('../db');
const bLayout = 'layouts/B';

router.use((req, res, next) => {
    if(isAuth(req))
        next();
    else
        res.redirect('/');
})

const forPosters = (req, res, next) => {
    const { userRol } = req.user
    if(userRol >= 1) next();
    else res.status(404).render('error-404', {
        layout: 'layouts/M'
    });
}

router.get('/post', forPosters, (req, res, next) => {
    res.render('post-job', {
        layout: bLayout
    });
});

router.get('/details', (req, res) => {
    res.render('job-details', {
        layout: bLayout
    });
});

router.get('/category', (req, res) => {
    res.render('job-category', {
        layout: bLayout
    });
});

const searchJob = async (req, res) => {
    try {
        const keywords = req.params.keywords.split(' ');
        let results = [];
        let exists = {};
        for(let k in keywords){
            let keyword = keywords[k];
            let [rs] = await pool.query(`CALL searchJob('${keyword}')`)
            for(let r in rs){
                if(exists[rs[r]] === undefined)
                    results.push(rs[r]);
                exists[rs[r]] = rs[r].ID;
            }
        }
        res.json({ 
            ok: true, 
            results
        });
    } catch (error) {
        res.json({
            ok: false,
            error: 'Hubo un error, no pudimos encontrar los datos solicitados :/',
            date: new Date().toLocaleString()
        })
    }
}

const getJob = async (req, res, next) => {
    try {
        const { id } = req.params
        const [job] = await pool.query(`SELECT * FROM Jobs WHERE ID = ${id}`);
        job !== undefined
        ? res.json(job)
        : next()
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            error: 'Hubo un error; nada grave, pero intenta luego',
            fecha: new Date().toLocaleString()
        });
    }
}

const getByJob = async (req, res, next) => {
    try {
        const { by, data } = req.params;
        const jobs = await pool.query(`SELECT * FROM Jobs WHERE ${by} = '${data}'`);
        jobs.length > 0
        ? res.json({ 
            ok: true,
            jobs 
        })
        : res.json({
            ok: false,
            error: 'No pudimos encontrar trabajos con los datos solicitados'
        })
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            error: 'Hubo error al intentar buscar sus datos :(',
            fecha: new Date().toLocaleString()
        });
    }
}

const getAllJob = async (req, res) => {
    try {
        const jobs = await pool.query('SELECT * FROM Jobs ORDER BY ID DESC');
        jobs.length > 0
        ? res.json(jobs)
        : res.json({
            ok: false,
            error: 'No pudimos encontrar trabajos con los datos solicitados'
        })
    } catch (error) {
        console.error(error);   
        res.json({
            error: 'No pudimos conseguirle esta informacion :(',
            fecha: new Date().toLocaleString()
        });
    }
}

const addJob = async (req, res) => {
    try {
        const { body } = req;
        await pool.query('INSERT INTO Jobs SET ?', body);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            agregado: false,
            error: 'Imposible agregar este usuario actualmente :/',
            info: 'console',
            fecha: new Date().toLocaleString()
        });
        res.redirect('/');
    }
}

const editJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        await pool.query(`UPDATE Jobs SET ? WHERE ID = ${id}`, body);
        res.json({
            ok: true,
            editado: true,
            jobID: id,
            newData: body
        })
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            agregado: false,
            error: 'Este usuario no se quiere editar, lo estamos intentado :(',
            fecha: new Date().toLocaleString()
        });
    }
}

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Jobs WHERE ID = ?', id);
        res.json({
            ok: true,
            eliminado: true,
            "bye :(": body
        })
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            agregado: false,
            error: 'No pudimos eliminar este usuario :(',
            fecha: new Date().toLocaleString()
        });
    }
}

router.get('/search/:keywords', searchJob);
router.get('/get/:id', getJob);
router.get('/get-by/:by/:data', getByJob)
router.get('/get-all', getAllJob);
router.post('/add', forPosters, addJob);
router.put('/edit/:id', forPosters, editJob);
router.delete('/remove/:id', forPosters, deleteJob);

module.exports = router;

module.exports.funcs = { 
    searchJob,
    getJob,
    getByJob,
    getAllJob
};