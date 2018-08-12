const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('./api/middleware/cors');
const productRoute = require('./api/routes/products');
const userRoute = require('./api/routes/users');
const orderRoute = require('./api/routes/orders');


mongoose.connect('mongodb://localhost:27017/testProject',{useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.once('open', () => console.log('db connected'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors);

app.use('/uploads', express.static('uploads'));

app.use('/products', productRoute);
app.use('/users', userRoute);
app.use('/orders', orderRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the backend api server');
});

module.exports = app;