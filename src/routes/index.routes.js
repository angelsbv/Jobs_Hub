/*
    Endpoints
    * Principal/Main/Index ||
    * Autenticación
    * Registro
    * Cerrar sesión
    * Confirmar email
    
    Layouts:
    * M: Materialize
    * B: Bootstrap
*/

const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { CONFIRMATION_CODE_KEY } = process.env;
const { sendConfirmationMail } = require('../libs/user.lib');


router.get('/', (req, res) => {
    if(isAuth(req)){
        res.render('index', {
            layout: 'layouts/B'
        });
    }
    else{
        res.render('login', {
            layout: 'layouts/M'
        });
    }
});

router.post('/verify-data', async (req, res) => {
    try {
        const { username, email, empresa, emailEmpresa } = req.body;
        let query = `SELECT * FROM {table} WHERE {condition}`
        if(username || email){
            query = query.replace('{condition}', (
                undefined !== username 
                ? `username = '${username}'`
                : `email = '${email}'`
            )).replace('{table}', 'users');
        }
        else if(empresa || emailEmpresa){
            query = query.replace('{condition}', (
                undefined !== empresa
                ? `empresa = '${empresa}'`
                : `emailEmpresa = '${emailEmpresa}'`
            )).replace('{table}', 'posterInfo')
        }
        console.log(query);
        const [user] = await pool.query(query);
        let exists = (user !== undefined)
        res.json({
            ok: true,
            exists
        });
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            error: 'Hubo un error con su solicitud',
            fecha: new Date().toLocaleString()
        })
    }
});

router.get('/register', (req, res) => {
    if(!isAuth(req)){
        res.render('register', {
            layout: 'layouts/M',
            mustConfirm: false
        });
    }
    else
        res.redirect('/');
});

router.post('/register', (req, res, next) => {
    if(!isAuth(req)){
        passport.authenticate('local-signup', (err, user) => {
            let registerViewConfig = { 
                layout: 'layouts/M', 
                mustConfirm: false
            };

            if (err) return next(err);
            if (!user) return res.render('register', registerViewConfig);

            registerViewConfig.mustConfirm = true;
            registerViewConfig.layout = 'layouts/B';
            sendConfirmationMail(req, user);
            return res.render('register', registerViewConfig);
        })(req, res, next); 
    }
    else return res.redirect('/');
});

router.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/',
    passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    if(isAuth(req)){
        req.logOut();
        res.redirect('/');
    }
    else
        next();
});

// https://www.npmjs.com/package/jsonwebtoken
router.get('/c/:token', (req, res, next) => {
    const { token } = req.params;
    jwt.verify(token, CONFIRMATION_CODE_KEY, async (err, decoded) => {
        try {
            if(err){
                next();
                console.error(err);
            }
            let qry = `SELECT * FROM users WHERE email = '${decoded.ponyOwned}'`;
            const [user] = await pool.query(qry);
            if(user){
                if(user.emailConfirmationCode === decoded.notOwn){
                    if(!user.emailConfirmed){
                        qry = `UPDATE users SET emailConfirmed = true WHERE email = '${decoded.ponyOwned}'`;
                        await pool.query(qry);
                        res.render('confirmado', {
                            layout: 'layouts/B',
                        })
                    }
                    else
                        next();
                }
                else
                    next();
            }else{
                next();
                throw new Error('RES: Usuario no encontrado');
            }
        } catch (err) {
            next();
            console.error(err)
        }
    });
});

module.exports = router;
module.exports.isAuth = isAuth = (req) => (req.isAuthenticated() ? true : false);;