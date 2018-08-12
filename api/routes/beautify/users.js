/*
  This file contains route methods like middleware
*/
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../../models/users'); //mongoose Schema
const secretkey = require('../../../config.json').secret_key; // secretkey for auth token from config file


//create new user
exports.add = (req,res,next) => {
  User.find({email: req.body.email}).exec()
    .then(user =>{
      if (user.length > 0) {
        res.status(409).json({
          error: 'User exist'
        });
      } else {
        bcrypt.hash(req.body.password, 10,(error, hash) => {
          if (error) {
            res.status(500).json({
              alert: 'bcrypt cant hash password',
              error
            });
            console.log(error);
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
      
            user
            .save()
            .then(result =>{
              res.status(201).json({
                usercreated: result
              });
            }).catch(error => {
              res.status(500).json({
                alert: 'mongoose cant save user',
                error
              });
              console.log(error);
            });
          }
        }); 
      }
    }).catch(error => {
      res.status(500).json({
        alert: 'mongoose cant find user email',
        error
      });
      console.log(error);
    });
}

//login
exports.login = (req,res,next) => {
  User.find({email: req.body.email}).select('-__v').exec()
    .then(user =>{
      if (user.length < 1) {
        res.status(401).json({
          error: 'Auth failed, wrong email'
        });
      } 
      bcrypt.compare(req.body.password, user[0].password,(error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({
            alert: 'bcrypt cant compare password',
            error
          });
        } 
        if (result) {
          jwt.sign({
            email: user[0].email,
            id: user[0]._id,
            level: user[0].level,
            name: user[0].name
          }, secretkey,
          {
            expiresIn: '1h'
          }, (error,token) => {
            if (error) {
              res.status(500).json({
                alert: 'jwt cant create token',
                error
              });
              console.log(error);
            }
            if (token) {
              res.status(200).json({
                alert: 'Auth succesful',
                token,
                user: user[0]
              });              
            }
          });          
        } else {
          res.status(401).json({
            error: 'Auth failed, wrong password'
          });
        }        
      }); 
    }).catch(error => {
      res.status(500).json({
        alert: 'mongoose cant find user email',
        error
      });
      console.log(error);
    });
}

//find all users
exports.get_all = (req,res,next) => {
  User.find().select(' -__v').exec()
    .then(users => {
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({
          error: 'Not Found'
        });
      }
    }).catch(error => {
      res.status(500).json({
        alert: 'mongoose cant find users',
        error
      });
      console.log('error')
    });
}

//get user by id
exports.get = (req,res,next) => {
  const id = req.params.userID;

  User.findById(id).select(' -__v').exec()
    .then(data => {
      if (data){
        console.log(data);
        res.status(200).json({data});
      } else {
        res.status(404).json({
          alert: 'Not found'
        });
      }      
    })
    .catch(error => {
      res.status(500).json({
        alert: 'mongoose cant findById user',
        error
      });
      console.log(error);
    })
}

//update user information
exports.update = (req,res,next) => {
  const id = req.params.userID;

  let update = {};


  for (let param in req.body) {
    update[param] = req.body[param]
  }

  if (update.level) {
    if (req.level && req.level < 3) {
      delete update.level;
    } 
  }

  if (update.password) {
    bcrypt.hash(update.password, 10,(error, hash) => {
      if (error) {
        res.status(500).json({
          alert: 'bcrypt cant hash password',
          error
        });
        console.log(error);
      } else {
        update.password = hash;
        User.findByIdAndUpdate(id, { $set: update }).select('-__v').exec()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          res.status(500).json({
            alert: 'mongosee cant findByIdAndUpdate user',
            error
          });
          console.log(error);
        }); 
      }      
    });
  } else {
    User.findByIdAndUpdate(id, { $set: update }).select('-__v').exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({
        alert: 'mongosee cant findByIdAndUpdate user',
        error
      });
      console.log(error);
    });
  }
}

//delete user by id
exports.delete = (req,res,next) => {
  const id = req.params.userID;
  const level = req.level; //adding by checkLevel

  if (level > 2) {
    User.findByIdAndRemove(id).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        alert: 'mongoose cant findByIdAndRemove user',
        error
      });
      console.log(error);
    });
  } else {
    res.status(300).json({
      alert: 'Access denien, low level'
    });
  }  
}