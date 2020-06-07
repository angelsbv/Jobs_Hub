'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const { hashpwd, comparepwd } = require('../libs/user.lib')
const pool = require('../db');

const searchUserQuery = "SELECT * FROM users WHERE email = {e} OR username = {u}";

const buildSearchUserQuery = (username = null) => (email = null) => (
    searchUserQuery.replace('{e}', `'${email}'`).replace('{u}', `'${username}'`)
);

/*
    Errores
    * !e!: email registrado
    * !u!: username registrado
    * !pdm!: (Passwords Didn't Match) contraseña y confirmación distintas
    * !ci!: credenciales incorrectas (username/email o password)
    * !nc!: no confirmado
    * !pml!: (Password Minlength) contraseña no tiene 6 o mas digitos
*/

const usernameExists = async (username) => {
    const [user] = await pool.query(buildSearchUserQuery(username)());
    return (user ? true : false);
}

const emailExists = async (email) => {
    const [user] = await pool.query(buildSearchUserQuery()(email));
    return (user ? true : false);
}

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
    const [user] = await pool.query(buildSearchUserQuery(username)());
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //cpwd = confirm password
    const { email, cpwd } = req.body;
    const errs = [];
    if (await usernameExists(username)) errs.push('!u!', ':');
    if (await emailExists(email)) errs.push('!e!', ':');
    if (password !== cpwd) errs.push('!pdm!', ':');
    if(password.length < 6) errs.push('!pml!', ':');
    if (errs.length > 0) {
        done(null, false, req.flash('err', { errCodes: errs, data: req.body }));
    }
    else {
        const newUser = { username, password, email, emailConfirmed: false }
        newUser.password = hashpwd(password);
        await pool.query('INSERT INTO users SET ?', newUser);
        done(null, newUser);
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        let [user] = await pool.query(buildSearchUserQuery(username)());
        if (undefined !== user) {
            if (!comparepwd(password, user.password))
                done(null, false, req.flash('err', { msg: '!ci!', username, password }))
            else if(!user.emailConfirmed)
                done(null, false, req.flash('err', { msg: '!nc!', username }));
            else
                done(null, user)
        }
        else
            done(null, false, req.flash('err', { msg: '!ci!', username, password }));
    } catch (error) {
        console.error(error);
    }
}));