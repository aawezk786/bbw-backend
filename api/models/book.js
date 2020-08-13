const mongoose = require('mongoose');



const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    book_name: {
        type: String
        
    },
    author_name: {
        type: String
    },
    Isbn_no: {
        type: String
        
        
    },
    book_img: {
        type: Array
        
    },
    publisher: {
        type: String
    },
    condition: {
        type: String
        
    },
    print_type: {
        type: String
        
    },
    mrp: {
        type: Number
    },
    selling_price: {
        type: Number
       
    },
    saved_price: {
        type: Number
        
    },
    sale_price :{
        type: Number
        
    },
    description: {
        type: String
        
    },
    publication_year: {
        type: Date
    },
    quantity: {
        type: Number,
        default: 1
    },
    no_Of_pages: {
        type: Number
    },
    language: {
        type: String
        
    },
    dimensions: {
        type: String
    },
    weight: {
        type: Number
        
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
        
    },
    sku : {
        type : String,
        
    },
    excel_file : {
        type : String
    }
},{
    toObject : {virtuals : true},
    toJSON : {virtuals : true}
});



module.exports = mongoose.model('Book', bookSchema);


