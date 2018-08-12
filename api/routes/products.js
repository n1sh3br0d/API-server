/*
  This file contains routes for /product
*/
const express = require('express');
const router = express.Router();


const upload = require('../middleware/upload');

const Product = require('./beautify/products'); //containts route methods like middleware


router.post('/add', upload, Product.add);


router.get('/', Product.get_all);


router.get('/:itemID', Product.get);


router.patch('/:itemID', Product.update);


router.delete('/:itemID', Product.delete);

module.exports = router; 