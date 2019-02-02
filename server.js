const
  bodyParser      = require('body-parser'),
  config          = require('config'),
  morgan          = require('morgan'),
  jwt             = require('jsonwebtoken'),
  tokenModule = require('./jwt_module/tokenModule.js'),
  authenticateRoutes = require('./routes/authenticateRoutes'),
  userRoutes = require('./routes/userRoutes'),
  genreRoutes = require('./routes/genresRoutes'),
  moviesRoutes = require('./routes/moviesRoutes'),
  publicRoutes = require('./routes/publicRoutes'),
  mongoose        = require('mongoose'),
  bluebirdPromise = require('bluebird'),
  express = require('express');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'));
}

const DB_CONNECTION = (process.env.DB_CONNECTION) ?
  process.env.DB_CONNECTION :
  config.get('connectionString');


//db connection
bluebirdPromise.promisifyAll(mongoose);
mongoose.connect(DB_CONNECTION);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


const JWT_SECRET = (process.env.JWT_SECRET) ?  process.env.JWT_SECRET : config.get('jwtSecret');

// get an instance of the router for api routes
var apiRoutes = express.Router();

authenticateRoutes(apiRoutes);
publicRoutes(apiRoutes);

// route middleware to verify a token

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Cartelera API! Hello World!' });
});

apiRoutes.use(tokenModule.congif());

userRoutes(apiRoutes);
genreRoutes(apiRoutes);
moviesRoutes(apiRoutes);

app.use(apiRoutes);

process.on('unhandledRejection', function (reason, promise) {
  console.error('unhandled promise rejection:', reason.message || reason)
})

app.listen(app.get('port'), function() {
  console.log('Cartelera API is running on port', app.get('port'));
});

module.exports = app;
