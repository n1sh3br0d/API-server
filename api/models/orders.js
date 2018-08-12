const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  consumer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'
    },
  quantity: { 
      type: Number, 
      default: 1
  },
  
  amount: Number
});

module.exports = mongoose.model('Order', orderSchema);