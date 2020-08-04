const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    icon_name : {type : String, required:true},
    category : { type: String, required: true },
    subcategory : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    }

});

module.exports = mongoose.model('Category', categorySchema);