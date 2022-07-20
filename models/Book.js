const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    edition: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lend: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    OriginalEmail: {
        type: String,
        required: true
    },
    CurrentEmail: {
        type: String,
        required: true
    },
    Phn_no: {
        type: String,
        required: true
    }

})



const Book = mongoose.model('Book', BookSchema)

module.exports = Book;