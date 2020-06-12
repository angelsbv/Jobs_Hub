const router = require('express').Router();
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);

const forAdmins = (req, res, next) => {
    const { userRol } = req.user
    if(userRol >= 2) next();
    else res.status(404).render('error-404', {
        layout: 'layouts/M'
    });
}

router.get('/get-site-config', forAdmins, async (req, res) => {
    try {
        let data = await (await readFile(path.join(__dirname, '../site.config.json')));
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
})

module.exports = router;