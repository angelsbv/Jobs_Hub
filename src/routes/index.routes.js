const router = require('express').Router();
const passport = require('passport');

/*
Layouts:
M: Materialize
B: Bootstrap
*/

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

router.get('/authed', (req, res, next) => {
    if(isAuth(req)) res.json(req.user);
    else next();
})

router.get('/register', (req, res) => {
    if(!isAuth(req)){
        res.render('register', {
            layout: 'layouts/M'
        });
    }
    else
        res.redirect('/');
});

// router.post('/register', passport.authenticate('local-signup', {
//     successRedirect: '/authed',
//     failureRedirect: '/register',
//     passReqToCallback: true
// }));

router.post('/register', function(req, res, next) {
    if(!isAuth(req)){
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/register'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/authed');
            });
        })(req, res, next); 
    }
    else
        res.redirect('/');
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

router.use((req, res, next) => {
    // res.status(404).render('layout', {
    //     page: 'error/error-404',
    //     title: 'Error 404'
    // });
    res.status(404).send('Error 404');
});

const isAuth = (req) => (req.isAuthenticated() ? true : false);

module.exports = router;