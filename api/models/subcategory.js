const mongoose = require('mongoose');
const subcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {type : String}
    
});
module.exports = mongoose.model('Subcategory', subcategorySchema);