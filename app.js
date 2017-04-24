// include all of our middleware - internal/external modules
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// modules for authentication
let session = require('express-session');
let passport = require('passport');
let passportlocal = require('passport-local');
let LocalStrategy = passportlocal.Strategy;
let flash = require('connect-flash'); // displays errors / login messages

 // adding the mongoose module
 let mongoose = require("mongoose");
 // connect to mongoDB and use the games database
 
 //let URI = "mongodb://localhost/videogames";
 // Mongoose URI
 let config = require('./config/db');

 /*mongoose.connect(URI, (err) => {
   if(err) {
     console.log("Error connecting to the database");
   }
   else {
     console.log("Connected to MongoDB");
   }
 });*/
 mongoose.connect(process.env.URI||config.URI);
 //mongoose.connect(process.env.URI || config.URI);

 let db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', () => {
   console.log("Conneced to MongoDB...");
 });

//routers
let index = require('./routes/index'); //index (object) for routing to index.html
let games = require('./routes/games'); // routes for games

//let users = require('./models/users'); //index (object) for routing to index.html
// Passport User Configuration

let app = express();

// view engine setup
app.set('content', path.join(__dirname, 'views/content/')); //join 'views' folder with the file-system path
app.set('view engine', 'ejs'); //specify view engine, currently using ejs, can use pug/jade/etc

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: true,
  resave: true
}));

// initialize passport and flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/games', games);

let UserModel = require('./models/user');
let User = UserModel.User; // alias for the User Model - User object
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*// catch 404 and forward to error handler
app.use((req, res, next) =>{
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// Handle 404 Errors
  app.use(function(req, res) {
      res.status(400);
     res.render('errors/404',{
      title: '404: File Not Found'
    });
  });

  // Handle 500 Errors
  app.use(function(error, req, res, next) {
      res.status(500);
      res.render('errors/500', {
        title:'500: Internal Server Error',
        error: error
      });
  });
/*
// error handler
app.use((err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
module.exports = app;
