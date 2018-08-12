/*
  This file contains route methods like middleware
*/
const mongoose = require('mongoose');


const Product = require('../../models/products'); //mongoose Schema

//add new Product
exports.add = (req,res,next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.file.path
  });

  product
    .save()
    .then(result =>{
      res.status(201).json({
        Itemcreated: result
      });
    }).catch(error => {
      res.status(500).json({
        alert: 'mongoose cant save Product',
        error
      });
    });
}

//find all Products
exports.get_all = (req,res,next) => {
  Product.find().exec()
    .then(items => {
      if (items.length > 0) {
        res.status(200).json(items);
      } else {
        res.status(404).json({
          err: 'Not Found'
        });
      }
    }).catch(error => {
      res.status(500).json({
        alert: 'mongoose cant find Products',
        error
      });
    });
}

//get Product by id
exports.get = (req,res,next) => {
  const id = req.params.itemID;


  Product.findById(id).exec()
    .then(data => {
      if (data){
        res.status(200).json({data});
      } else {
        res.status(404).json({
          err: 'Not found'
        });
      }      
    })
    .catch(error => {
      res.status(500).json({
        alert: 'mongoose cant findById Product',
        error
      });
    });
}

//update Product information
exports.update = (req,res,next) => {
  const id = req.params.itemID;

  let update = {};

  for (let param in req.body) {
    update[param] = req.body[param]
  }


  Product.findByIdAndUpdate(id, { $set: update }).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({
        alert: 'mongoose cant findByIdAndUpdate Product',
        error
      });
    });
}

//delete Product by id
exports.delete = (req,res,next) => {
  const id = req.params.itemID;
  Product.findByIdAndRemove(id).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({
        alert: 'mongoose cant findByIdAndRemove Product',
        error
      });
    });
}