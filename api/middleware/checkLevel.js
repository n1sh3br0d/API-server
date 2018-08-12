/*
  This file contains middleware for check user level
*/
const User = require('../models/users'); //mongoose Schema


module.exports = (req,res,next) => {
  const id = req.headers.id;
  const path = req.originalUrl;

  if (`/users/${id}` == path) {
    next();
  } else {
    User.findById(id,'level').exec().then(
      data => {
        if (data.level > 1){
          req.level = data.level
          next();
        } else {
          res.status(300).json({
            alert: 'Access denied, low level'
          });
        }      
      }).catch(error => {
      res.status(500).json({
        alert: 'Mongoose cant findById user',  
        error
      });
    });
  }    
}