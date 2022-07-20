const express = require('express');
const router = express.Router();


//book model
const Book = require('../models/Book');

// SHOW - shows more info about one book
router.get("/:id", function (req, res) {
    //find the book with provided ID
    Book.findById(req.params.id).populate("comments").exec(function (err, foundBook) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that book
            res.render("show", { Book: foundBook });
        }
    });
});


module.exports = router;