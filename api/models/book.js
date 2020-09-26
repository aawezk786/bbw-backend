const mongoose = require('mongoose');



const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    book_name: {
        type: String
        
    },
    active_bool:{
        type:Number,
        default: 1
    },
    mrp_dollar:{
        type:Number
    },
    mrp_euro:{
        type:Number
    },
    mrp_pound:{
        type:Number
    },
    mrp_aus_dollar:{
        type:Number
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
    print_format: {
        type: String
        
    },
    mrp_inr: {
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
        type: String
    },
    rate : {
        type : Number
    },
    language: {
        type: String
        
    },
    dimensions: {
        type: String
    },
    weight: {
        type: String
        
    },
    categories: {
        type: String,
        ref: 'Category'
        
    },
    subcategory : {
        type : String,
        ref: 'Subcategory'
    },
    sku : {
        type : String,
        
    },
    country_origin :{
        type : String
    },
    discount_per:{
        type : Number
    },
    discount_rs:{
        type : Number
    },
    final_price:{
        type: Number
    },
    sale_disc_per:{
        type:Number
    },
    sale_disc_inr:{
        type:Number
    },
    sale_rate:{
        type:Number
    },
},{
    toObject : {virtuals : true},
    toJSON : {virtuals : true}
});



module.exports = mongoose.model('Book', bookSchema);


