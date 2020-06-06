/*
    Endpoints
    * 
    
    Layouts:
    * M: Materialize
    * B: Bootstrap
*/

const router = require('express').Router();

const bLayout = 'layouts/B';
const mLayout = 'layouts/M';

router.get('/post', (req, res) => {
    res.render('post-job', {
        layout: bLayout
    });
});

router.get('/details', (req, res) => {
    res.render('job-details', {
        layout: bLayout
    });
});

router.get('/category', (req, res) => {
    res.render('job-category', {
        layout: bLayout
    })
})

module.exports = router;