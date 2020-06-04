'use strict';

const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const { v4: uuidV4 } = require('uuid');

const { 
    USER_MAIL,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_ACCESS_TOKEN,
    CONFIRMATION_CODE_KEY
} = process.env;

module.exports.hashpwd = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};

module.exports.comparepwd = (password, dbpwd) => {
    return bcrypt.compareSync(password, dbpwd);
};

module.exports.sendConfirmationMail = async ({ headers: { origin } }, { email }) => {

    const setEmailServerNSend = async (token) => {
        const mailOpts = {
            to: email,
            from: USER_MAIL,
            subject: 'Confirmación',
            html: `<h1>Confirmacion</h1>
                <p>${origin}/c/${token}</p>
            `
        }
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: USER_MAIL,
              clientId: GMAIL_CLIENT_ID,
              clientSecret: GMAIL_CLIENT_SECRET,
              refreshToken: GMAIL_REFRESH_TOKEN,
              accessToken: GMAIL_ACCESS_TOKEN,
            },
          });
    
        try {
            const res = await transporter.sendMail(mailOpts);
            return res;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    const key = uuidV4();
    jwt.sign({ 
        "importantes": "CREDIT CARDS, BANK ACCOUNT, IMPORTANT THINGS!!!", 
        "ponyOwned": email,
        "owned": "$2a$10$/61VoDZ.4iPvN4UxrKfxMuW7sD42NuQ5GGtYt3fKou3rPJFj.a6Kq",
        "pony": "fcb180df-1eae-4ea5-974e-9b1f111b50c2",
        "own": "$2a$10$AV/Ar.riYuMmFH5Rjm6vPupMUnXMrkNiGv.64TsxdePOcVgGCh44S",
        "notOwn": key,
        "claves": "UN VIAJE DE CLAVES",
    }, CONFIRMATION_CODE_KEY, { expiresIn: '1d' }, async (err, token) => {
        if(err) throw err;
        try {
            const qry = `UPDATE users SET emailConfirmationCode = '${key}' WHERE email = '${email}'`
            await pool.query(qry);
            setEmailServerNSend(token)
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

};