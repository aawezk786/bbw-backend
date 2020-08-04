const mongoose = require('mongoose');

const subcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subcategory : {type : Array}

});

module.exports = mongoose.model('Subcategory', subcategorySchema);