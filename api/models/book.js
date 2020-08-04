const mongoose = require('mongoose');

const mongooseAlgolia = require('mongoose-algolia');

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
        type : String,
        required : true
    }
},{
    toObject : {virtuals : true},
    toJSON : {virtuals : true}
});

// bookSchema.plugin(mongooseAlgolia, {
//     appId: 'JF5EPDPH1R',
//     apiKey: 'dfa3ef2bde335a6e8d006df5eabdde15',
//     indexName: 'bbw',
//      selector : '_id book_name author_name Isbn_no categories language'   ,
//      populate : {
//          path : 'categories',
//          select : 'category sub_category'
//      },
//     defaults: {
//       author: 'uknown'
//     },
//     mappings: {
//       book_name: function(value) {
//         return `${value}`
//       }
//     },
//     debug: true
//   })




// let Model = mongoose.model('Book', bookSchema);

// Model.SyncToAlgolia();
// Model.SetAlgoliaSettings({
//     searchableAttributes: [ 'author_name' , 'book_name' ]
// });


module.exports = mongoose.model('Book', bookSchema);


