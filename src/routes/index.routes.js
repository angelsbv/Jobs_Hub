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

router.use((req, res, next) => {
    // res.status(404).render('layout', {
    //     page: 'error/error-404',
    //     title: 'Error 404'
    // });
    res.status(404).send('Error 404');
});

module.exports.isAuth = isAuth = (req) => (req.isAuthenticated() ? true : false);

module.exports = router;