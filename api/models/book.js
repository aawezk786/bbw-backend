const mongoose = require('mongoose');



const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    book_name: {
        type: String
        
    },
    active_bool:{
        type:Number,
        default : 1
    },
    mrp_dollar:{
        type:String
    },
    mrp_euro:{
        type:String
    },
    mrp_pound:{
        type:String
    },
    mrp_aus_dollar:{
        type:String
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
        type: String
    },

    sale_price :{
        type: String
        
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
        type : String
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
        
    },
    subcategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    sku : {
        type : String,
        
    },
    country_origin :{
        type : String
    },
    discount_per:{
        type : String
    },
    discount_rs:{
        type : String
    },
    excel_file : {
        type : String
    },
    final_price:{
        type:String
    },
    sale_disc_per:{
        type:String
    },
    sale_disc_inr:{
        type:String
    },
    sale_rate:{
        type:String
    },
},{
    toObject : {virtuals : true},
    toJSON : {virtuals : true}
});



module.exports = mongoose.model('Book1', bookSchema);


