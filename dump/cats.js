
// router.get('/:categories', (req, res, next) => {
//     const perPage = 12;
//     const page = req.query.page;
//     async.parallel([
//         function (callback) {
//             Book.count({ categories: req.params.categories }, (err, count) => {
//                 var totalBooks = count;
//                 callback(err, totalBooks);
//             });
//         },
//         function (callback) {
//             Book.find({ categories: req.params.categories })
//                 .skip(perPage * page)
//                 .limit(perPage)
//                 .exec((err, books) => {
//                     if (err) return next(err);
//                     callback(err, books);
//                 });
//         },
//         function (callback) {
//             Book.findOne({ categories: req.params.categories }, (err, categories) => {
//                 callback(err, categories)
//             });
//         }
//     ], function (err, results) {
//         var totalBooks = results[0];
//         var books = results[1];

//         res.json({
//             success: true,
//             books: books,
//             totalBooks: totalBooks,
//             pages: Math.ceil(totalBooks / perPage - 1)
//         });

//     });

// }
// );