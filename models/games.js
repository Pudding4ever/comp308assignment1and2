// import  the mongoose npm package
 let mongoose = require('mongoose');
 
 // create a model class
 let gamesSchema = mongoose.Schema({
     name: String,
     phone: String,
     email: String
 },
 {
   collection: "contacts"
 });
 
 module.exports = mongoose.model('contacts', gamesSchema);