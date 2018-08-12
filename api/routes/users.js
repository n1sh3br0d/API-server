const express = require('express');
const router = express.Router();


const User = require('./beautify/users'); //mongoose Schema
const checkAuth = require('../middleware/checkAuth');//middleware for check 'is user login?'
const checkLevel = require('../middleware/checkLevel');//middleware for check user level


router.post('/signup', User.add);

router.post('/signin', User.login);

router.get('/', User.get_all);

router.get('/:userID', checkAuth, checkLevel, User.get);

router.patch('/:userID', checkAuth, checkLevel, User.update);

router.delete('/:userID', checkAuth, checkLevel, User.delete);


module.exports = router; 