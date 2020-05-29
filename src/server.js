const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();

// Settings
app.set('view engine', ejs);
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));