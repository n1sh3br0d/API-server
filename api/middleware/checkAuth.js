/*
  This file contains middleware for check 'is user login?'
*/
const jwt = require('jsonwebtoken');
const secret_key = require('../../config.json').secret_key; //secret_key for jsonwebtoken from config file


module.exports = (req,res,next) => {
  const header = req.headers.authorization;
  console.log(header);
  if (typeof header !== 'undefined') {
    token = header.split(' ');    
    jwt.verify(token[1], secret_key,(error, decode) => {
      if (error) {
        res.status(500).json({
          alert: 'jwt cant verify token',
          error
        });
      }
      if (decode) {
        req.headers.id = decode.id;
        next();
      } else {
        res.status(401).json({
          alert: 'Auth failed, wrong token',
          error
        });
      }
    });
  } else {
    res.status(401).json({
      alert: 'Auth failed, wrong token',
    });
  }
}