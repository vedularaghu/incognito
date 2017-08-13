var express = require('express');
var router = express.Router();
var User = require('../models/users');
function auth(req,res,next){
   if(req.session.user){
    next();
  }else{
    res.redirect('/');
  }
}

router.post('/register',function(req,res,next){
  console.log(req.body);
  var newUser = new User({
    name: req.body.nameofuser,
    password: req.body.password,
    username: req.body.username
  });
  User.findOne({username: newUser.username},function(err,existingUser) {
    console.log(existingUser);
    if(err) {
      console.log(err);
      res.send("Server Error");
    }
    if(!existingUser) {
      newUser.save(function (err,savedUser) {
        if(err){
          console.log(err);
          res.send(err);
        }else{
          req.session.user = savedUser.name;
          res.redirect('/users/dashboard');
        }
      });
    }else{
      res.send("Username already exists!")
    }
  });
});
router.post('/login',function(req,res,next){
  console.log(req.body);
  User.findOne({username: req.body.loginuser}, function(err, user){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      if(user){
        if(user.password==req.body.loginpassword){
          req.session.user = user.name;
          console.log('Logged In');
          console.log(req.session);
          res.redirect('/users/dashboard');
        }else{
          res.send('Incorrect password');
        }
      }else{
        res.send("No user found");
      }
    }
  });
});
router.get('/submit/:username', function(req,res,next){
  res.render('message', {username: req.params.username});
});

router.post('/message/:username', function(req,res,next){
  User.findOne({username: req.params.username}, function(err, users){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      User.update({"username": req.params.username},
      {$push:{msg : {body:req.body.msg,date:new Date()}}}, function (err, msg) {
        if(err){
          console.log("There was some error. Please try again later");
          res.send(err);
        }
        res.send('Successfully saved');
      });
    }
  });
});

router.get('/logout',function (req,res,next) {
  delete req.session.user;
  res.redirect('/');
});
router.get('/dashboard', function(req,res,next) {
  User.findOne({name:req.session.user},function(err,user) {
      if(err){
        console.log(err);
        res.send("There was some error.");
      }else{
        res.render('dashboard', {users:user});
      }
  });
});
module.exports = router;
