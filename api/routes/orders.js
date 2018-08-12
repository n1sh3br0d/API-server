/*
  This file contains routes for /Order
*/
const express = require('express');
const router = express.Router();


const Order = require('./beautify/orders'); //containts route methods like middleware


router.post('/add', Order.add);


router.get('/', Order.get_all);


router.get('/:itemID', Order.get);


router.patch('/:itemID', Order.update);


router.delete('/:itemID', Order.delete);

module.exports = router; 