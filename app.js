//jshint esversion:6
const express = require('express');
const bParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const ejs = require('ejs');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bParser.urlencoded({
  extended: true
}));

const uri = "mongodb://192.168.0.190:27017/user_db";
mongoose.connect(uri, {
  useNewUrlParser: true
});


//Create user_schema
const user_schema = new mongoose.Schema({
  email: String,
  password: String
});

// Create secret key for encryption
const secret = "SecretWord";
user_schema.plugin(encrypt, {
  secret: secret, encryptedFields: ['password']});

//Create User model from user_schema
const User = new mongoose.model("User", user_schema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  const new_user = new User({
    email: req.body.username,
    password: req.body.password
  });
  console.log(new_user);
  new_user.save(function(err) {
    if (err)
      console.log(err);
    else {
      res.render("secrets");
    }
  });
});

app.route('/login')
  .get(function(req, res) {
    console.log('login');
    res.render('login', {
      status: "Hello and welcome :)"
    });
  })

  .post(function(req, res) {
    User.findOne({
      email: req.body.username
    }, function(err, found_user) {
      if (err)
        console.log(err);
      else {
        console.log(found_user);
        console.log(req.body.username);
        console.log(req.body.password);
        if (found_user.password === req.body.password) {
          console.log("Found!", found_user);
          res.render("secrets");
        }
        else{
          res.render("login",{status:"Wrong email or password. Please try again!"});
        }
      }
    });
  });

const server = app.listen(process.env.PORT || 8080, function(req, res) {
  const port = server.address().port;
  console.log("Successfully started server @ ", port);
});


app.get("/logout", function(req, res) {
  res.render("logout");
});
