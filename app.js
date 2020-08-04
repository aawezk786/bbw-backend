const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const bookRoutes = require('./api/routes/books');
const categoryRoutes = require('./api/routes/category');
const filterRoutes = require('./api/routes/filters');
const cartItemRoutes = require('./api/routes/cartItems');
const searchRoutes = require('./api/routes/search');
const wishlistRoutes = require('./api/routes/wishlists');
const subcategoryRoutes = require('./api/routes/subcategory');

mongoose.connect(
    'mongodb+srv://zewaa:'
    + process.env.MONGO_ATLAS_PW +
    '@shoppingcart-ss028.mongodb.net/sow?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
         useFindAndModify: false 
    }
);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/filter', filterRoutes);
app.use('/api/cart', cartItemRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/subcategory', subcategoryRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;