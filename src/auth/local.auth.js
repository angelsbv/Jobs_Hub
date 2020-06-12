'use strict';

const passport = require('passport');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const LocalStrategy = require('passport-local').Strategy;
const { hashpwd, comparepwd } = require('../libs/user.lib');
const pool = require('../db');

const { API_TOKEN_KEY } = process.env;

const searchUserQuery = "SELECT * FROM Users WHERE email = {e} OR username = {u}";

const buildSearchUserQuery = (username = null) => (email = null) => (
    searchUserQuery.replace('{e}', `'${email}'`).replace('{u}', `'${username}'`)
);

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

/*
    Errores
    * !e!: email registrado
    * !u!: username registrado
    * !pdm!: (Passwords Didn't Match) contraseña y confirmación distintas
    * !ci!: credenciales incorrectas (username/email o password)
    * !nc!: no confirmado
    * !pml!: (Password Minlength) contraseña no tiene 6 o mas digitos
*/

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //cpwd = confirm password
    try {
        const { 
            email, 
            cpwd, 
            isPoster, 
            empresa, 
            emailEmpresa, 
            telefonoEmpresa
        } = req.body;
    
        const errs = [];
        if (await usernameExists(username)) errs.push('!u!', ':');
        if (await emailExists(email)) errs.push('!e!', ':');
        if (password !== cpwd) errs.push('!pdm!', ':');
        if(password.length < 6) errs.push('!pml!', ':');
        if (errs.length > 0) {
            done(null, false, req.flash('err', { errCodes: errs, data: req.body }));
        }
        else {
            const newUser = { 
                username, 
                password,
                email, 
                emailConfirmed: false,
                userRol: (isPoster ? 1 : 0)
            };
            newUser.password = hashpwd(password);
            const { insertId: userID } = await pool.query('INSERT INTO Users SET ?', newUser);
            const newPoster = { empresa, emailEmpresa, telefonoEmpresa, userID };

            const uid = uuid();
            newPoster.APIToken = await jwt.sign({ payload: `${userID}/${uid}` }, API_TOKEN_KEY);
            newPoster.APIUID = uid;
            if(isPoster) await pool.query('INSERT INTO PostersInfo SET ?', newPoster);
            done(null, newUser);
        }
    } catch (error) {
        throw error;
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