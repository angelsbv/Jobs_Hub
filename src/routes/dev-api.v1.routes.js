// API v1

const router = require('express').Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const { funcs: { 
    searchJob,
    getJob,
    getByJob,
    getAllJob
} } = require('./jobs.routes');

const { API_TOKEN_KEY } = process.env;

const verifyToken = async (token) => {
    try {
        if(token){
            let { payload } = await jwt.verify(token, API_TOKEN_KEY);
            let data = payload.split('/');
            let userID = data[0];
            const [user] = await pool.query(`SELECT * FROM PostersInfo WHERE userID = '${userID}'`);
            return (user.APIUID === data[1]);
        }
    } catch (error) {
        throw error;
    }
}

const auth = async (req, res, next) => {
    try {
        let { ajh } = req.headers;
        if(ajh){
            const verified = await verifyToken(ajh);
            if(verified) next();
            else res.sendStatus(403);
        }
        else res.sendStatus(403);
    } catch (error) {
        throw error;
    }
}

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100
});
 
router.use(cors());
router.use(auth);
router.use(apiLimiter);

router.get('/search/:keywords', searchJob);
router.get('/get/:id', getJob);
router.get('/get-by/:by/:data', getByJob)
router.get('/get-all', getAllJob);

module.exports = router;