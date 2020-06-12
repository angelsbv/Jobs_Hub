// API v1

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.use((req, res, next) => {
    req.headers['access-control-expose-headers']
});

router.get('/search ? q', async (req, res) => {
    try {
        const keywords = req.query
        
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