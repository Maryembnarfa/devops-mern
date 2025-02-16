var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const routerusers = require('./routes/users.route');
const routerlogin = require('./routes/login.route');
const routerdelivry = require('./routes/delivry.route');
const passport = require('passport');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la connexion à MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err.message));

/* Initialisation de Passport */
app.use(passport.initialize());
require('./security/passport')(passport);

// Configuration CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));

// Gérer explicitement les requêtes préflight (OPTIONS)
app.options('*', cors()); // Répond aux requêtes OPTIONS pour toutes les routes

// Déclaration des routes
app.use('/api', routerusers);
app.use('/api', routerlogin);
app.use('/api', routerdelivry);

module.exports = app;
