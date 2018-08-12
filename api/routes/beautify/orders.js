/*
  This file contains route methods like middleware
*/
const mongoose = require('mongoose');


const Order = require('../../models/orders'); //mongoose Schema

//add new Order
exports.add = (req,res,next) => {

  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    consumer: req.body.consumer,
    products: req.body.product,
    quantity: req.body.quantity,
  });

  order
    .save()
    .then(result =>{
      res.status(201).json({
        Itemcreated: result
      });
    }).catch(error => {
      res.status(500).json({
        alert: 'mongoose cant save Order',
        error
      });
    });
}

//find all Orders
exports.get_all = (req,res,next) => {
  Order.find().exec()
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
        alert: 'mongoose cant find Orders',
        error
      });
    });
}

//get Order by id
exports.get = (req,res,next) => {
  const id = req.params.itemID;


  Order.findById(id).exec()
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
        alert: 'mongoose cant findById Order',
        error
      });
    });
}

//update Order information
exports.update = (req,res,next) => {
  const id = req.params.itemID;

  let update = {};

  for (let param in req.body) {
    update[param] = req.body[param]
  }


  Order.findByIdAndUpdate(id, { $set: update }).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({
        alert: 'mongoose cant findByIdAndUpdate Order',
        error
      });
    });
}

//delete Order by id
exports.delete = (req,res,next) => {
  const id = req.params.itemID;
  Order.findByIdAndRemove(id).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({
        alert: 'mongoose cant findByIdAndRemove Order',
        error
      });
    });
}