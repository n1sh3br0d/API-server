/*
  This file contains middleware that adding CORS headers
*/

module.exports = (req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  console.log(req.body);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Accept, Authorization, Content-type');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  }
  next();
}