let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let passportLocalMongoose = require('passport-local-mongoose');

let UserModel = require('../models/user');
let User = UserModel.User; //aliase for User Model - User Object

let game = require('../models/games'); // create game object - reps document in games collection

// Create a function to check if the user is authenticated
function requireAuth(req, res, next) {
	// Checks if the user is logged 
	if(!req.isAuthenticated()){
		return res.redirect('/login');
	}
	next(); // If you are go to the next object
}

/* GET home page. */
router.get('/', (req, res, next) =>{
  let currentDate = new Date(); //local variable for Callback Function
  res.render('content/index', { 
    title: 'Home',
	games: '',
	displayName: req.user ? req.user.displayName: ''
 });
});

/* GET about page. Extra route using about.ejs View*/
router.get('/about', (req, res, next) =>{
    let currentDate = new Date();//local variable for Callback Function
  res.render('content/about', { 
    title: 'About',
	games: '',
	displayName: req.user ? req.user.displayName: '' 
}); //Render about.ejs view, ref. title/date - pass in 'About' and time, etc
});

router.get('/projects', (req, res, next) =>{
    let currentDate = new Date();//local variable for Callback Function
  res.render('content/projects', { 
    title: 'Projects',
	games: '',
	displayName: req.user ? req.user.displayName: '' 
}); //Render about.ejs view, ref. title/date - pass in 'About' and time, etc
});

router.get('/services', (req, res, next) =>{
    let currentDate = new Date();//local variable for Callback Function
  res.render('content/services', { 
    title: 'Services',
	games: '',
	displayName: req.user ? req.user.displayName: '' 
}); //Render about.ejs view, ref. title/date - pass in 'About' and time, etc
});

router.get('/contact', (req, res, next) =>{
    let currentDate = new Date();//local variable for Callback Function
  res.render('content/contact', { 
    title: 'Contact',
	games: '',
	displayName: req.user ? req.user.displayName: '' 
}); //Render about.ejs view, ref. title/date - pass in 'About' and time, etc
});

router.post('/contact', (req, res, next) => {

    let newGame = game({
      "name": req.body.name,
      "phone": req.body.phone,
      "email": req.body.email
    });

    game.create(newGame, (err, game) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect('/contact');
      }
    });
});

// GET /Login - render the Login view
router.get('/login', (req, res, next) => {
	// Check to see if the user is not already logged index
	if(!req.user){
		//render the Login page
		res.render('auth/login', {
			title: "Login",
			games: '',
			messages: req.flash('loginMessage'),
			displayName: req.user ? req.user.displayName: '' //? either .user or .displayname
		});
		return; 
	} else {
		return res.redirect('/games'); //redirect to games list
	}
});


// POST /Login - process the Login attempt
router.post('/login', passport.authenticate('local', {
	successRedirect: '/games',
	failureRedirect: '/login',
	failureFlash: "Incorrect Username/Password", // match the loginMessage above
}));


// GET /register - render the registration view
router.get('/register', (req, res, next)=>{
	 // check to see if the user is not already logged in
	if(!req.user) {
		// render the registration page
			res.render('auth/register', {
			title: "Register",
			games: '',
			messages: req.flash('registerMessage'),
			displayName: req.user ? req.user.displayName : ''
		});
		return;
	} else {
		return res.redirect('/games'); // redirect to index
	}
});

// POST / register - process the registration submission
router.post('/register', (req, res, next)=>{
	User.register(
		new User({
			username: req.body.username,
			//password: req.body.password,
			email: req.body.email,
			displayName: req.body.displayName
		}),
		req.body.password,
		(err) => {
			if(err) {
				console.log('Error inserting new user');
				if(err.name == "UserExistsError") {
					req.flash('registerMessage', 'Registration Error: User Already Exists');
				}
				return res.render('auth/register', {
					title: "Register",
					messages: req.flash('registerMessage'),
					displayName: req.user ? req.user.displayName : ''
				});
			}
			// if registration is successful
			return passport.authenticate('local')(req, res, ()=>{
				res.redirect('/login');
			});
		});
});

// GET /logout - process the logout request
router.get('/logout', (req, res, next)=>{
	req.logout();
	res.redirect('/'); // redirect to the home page
});

module.exports = router;
