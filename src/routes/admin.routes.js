const router = require('express').Router();
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const configPath = path.join(__dirname, '../site.config.json');

const forAdmins = (req, res, next) => {
    const { userRol } = req.user
    if(userRol >= 2) next();
    else res.status(404).render('error-404', {
        layout: 'layouts/M'
    });
}

router.get('/get-site-config', async (req, res) => {
    try {
        const data = await readFile(configPath);
        res.json({
            ok: true, 
            config: JSON.parse(data.toString())
        });
    } catch (error) {
        res.json({
            ok: false,
            error: 'Hubo un error con su solicitud' 
        });
        throw error;
    }
});

router.post('/set-site-config', forAdmins, async (req, res) => {
    try {
        const { body } = req;
        await writeFile(configPath, JSON.stringify(body, null, 2), 'utf8');
        const data = await readFile(configPath);
        res.json({
            ok: true, 
            config: JSON.parse(data.toString())
        });
    } catch (error) {
        res.json({
            ok: false,
            error: 'Hubo un error con su solicitud' 
        });
        throw error;
    }
});

// let resp = await fetch('/adm/get-site-config');
// let data = await resp.json();
// console.log(data);

// resp = await fetch('/adm/set-site-config', {
//     method: 'POST',
//     headers:{ "Content-Type": "application/json" },
//     body: JSON.stringify(data.config)
// });
// data = await resp.json();
// console.log(data);

module.exports = router;