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

router.get('/post', (req, res) => {
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

router.get('/search/:keywords', async (req, res) => {
    try {
        const keywords = req.params.keywords.split(' ');
        let results = [];
        for(let k in keywords){
            let keyword = keywords[k];
            let [rs] = await pool.query(`CALL searchJob('${keyword}')`)
            for(let r in rs){
                results.push(rs[r]);
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
});

router.get('/get/:id', async (req, res, next) => {
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
});

router.get('/get-by/:by/:data', async (req, res, next) => {
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
})

router.get('/get-all', async (req, res) => {
    try {
        const jobs = await pool.query('SELECT * FROM Jobs');
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
});

router.post('/add', async (req, res) => {
    try {
        const { body } = req;
        await pool.query('INSERT INTO Jobs SET ?', body);
        res.json({
            ok: true,
            agregado: true,
            body
        });
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            agregado: false,
            error: 'Imposible agregar este usuario actualmente :/',
            info: 'console',
            fecha: new Date().toLocaleString()
        });
    }
});

router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        await pool.query('UPDATE Jobs SET ? WHERE ID = '+id, body);
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
            info: 'console',
            fecha: new Date().toLocaleString()
        });
    }
});

router.delete('/remove/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Jobs WHERE id = ?', id);
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
});

module.exports = router;