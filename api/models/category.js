const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    icon_name : {type : String},
    category : { type: String, required: true },
    subcategory : [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    }],
    active : {type:Boolean ,default : true}

});

module.exports = mongoose.model('Category', categorySchema);