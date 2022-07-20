const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction = require('../models/transaction');
const lendDetail = require('../models/lendDetail')
//const fetch=require('node-fetch')

//add

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}');

router.get('/infobook/:email', ensureAuthenticated, (req, res) => {
    var resultarray = [];
    Book.find({ OriginalEmail: req.params.email }, function (err, mybook) {
        // console.log("my book is "+mybook[0].name);
        //console.log(mybook)books/borrowedBooks/nivedh@iitk.ac.in
        for (var i = 0; i < mybook.length; i++) {

            if ((mybook[i]) && (mybook[i].OriginalEmail == mybook[i].CurrentEmail)) {
                resultarray.push(mybook[i]);

            }
        }
        var NoMatch = null;
        if (resultarray.length < 1) {
            NoMatch = 'No Books have been added'
        }
        res.render('infobook', {
            user: req.user,
            book: resultarray,
            NoMatch: NoMatch
        })
        // Book.findByIdAndUpdate(req.query.book,{$set:{}})
        //var d=new Date();

        if (req.query.email) {

            console.log(req.query.book)
            Book.findByIdAndUpdate(req.query.book, { $set: { CurrentEmail: req.query.email } }, (err, book) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(req.query.book)
                    //lendDetail.find({books:book._id},(err,ld)=>{
                    lendDetail.findOneAndUpdate({
                        books: req.query.book

                    }, { "$push": { "Persons_Taken": req.query.email, "date_Array": new Date() } }, (function (err, ld) {
                        if (err) {
                            console.log(err)
                        } else {

                            console.log(`person array is ${ld.Persons_Taken} and date array is ${ld.date_Array}`)
                            // console.log(ld.date_Array)
                            //console.log(req.query.book.CurrentEmail)
                            Book.findById(req.query.book, (err, foundBook) => {
                                const msg = {
                                    to: foundBook.CurrentEmail,
                                    from: 'openlib@openlib.com',
                                    subject: 'Confirmation of book',
                                    text: 'Do not of reply',
                                    html: '<strong>This is an auto-generated mail , do not reply</strong>',

                                    templateId: '4cf76db7-60d7-478d-9663-779a542ed4b3',

                                    substitutions: {
                                        bookName: foundBook.name,
                                        author: foundBook.author,
                                        method: foundBook.lend,
                                        edition: foundBook.edition,
                                        genre: foundBook.genre,
                                        subject: foundBook.subject,
                                        name: req.user.name,
                                        email: req.user.email,
                                        phone: req.user.number,

                                    },
                                };

                                sgMail.send(msg);
                                req.flash(
                                    'success_msg',
                                    'You confirmed the request'
                                );
                                res.redirect('/dashboard');
                            });

                        }
                    }))

                }
            })


        }
    })
});



router.get('/sharedBooks/:email', ensureAuthenticated, (req, res) => {
    Book.find({
        OriginalEmail: req.params.email
    }, (err, book) => {
        var NoMatch = null;
        var bookArray = [];
        for (var i = 0; i < book.length; i++) {
            if (book[i] && (book[i].CurrentEmail !== req.params.email)) {

                bookArray.push(book[i])
            }
        }
        if (bookArray.length < 1) {
            NoMatch = "No books have been shared"
        }
        res.render('sharedBooks', {
            user: req.user,
            book: bookArray,
            NoMatch: NoMatch
        })
    })
})



router.get('/borrowedBooks/:email', ensureAuthenticated, (req, res) => {
    Book.find({ CurrentEmail: req.params.email }, (err, book) => {
        var bookArray = [];
        var NoMatch = null;

        for (var i = 0; i < book.length; i++) {
            if (book[i].OriginalEmail !== req.params.email) {
                bookArray.push(book[i]);
            }
        }
        if (bookArray.length < 1) {
            NoMatch = 'No books Borrowed'
        }
        res.render('borrowedBooks', {
            user: req.user,
            book: bookArray,
            NoMatch: NoMatch
        })
    })
    // var d=new Date();
    if (req.query.email) {
        var id = req.query.book;
        Book.findByIdAndUpdate(id, { $set: { CurrentEmail: req.query.email } }, (err, book) => {
            if (err) {
                console.log(err)
            } else {
                // var d=new Date();
                //lendDetail.find({books:book._id},(err,ld)=>{
                lendDetail.findOneAndUpdate({
                    books: req.query.book
                }, { $set: { "$push": { "Persons_Taken": req.query.email, "date_Array": new Date() } } }, (function (err, ld) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(ld.Persons_Taken)
                        res.redirect('/borrowedBooks/:email')
                    }
                }))

            }
        })
    }
})
router.get('/add/:email', ensureAuthenticated, (req, res) => res.render('books', {
    user: req.user
})
);

//delete
router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    Book.findOneAndRemove({ _id: id }, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        req.flash(
            'success_msg',
            'You have successfully deleted your book'
        );
        return res.redirect('/dashboard/');
    });

});









//add handle
router.post('/add/:email', ensureAuthenticated, (req, res) => {
    const { name, author, edition, genre, subject, description, lend } = req.body;


    let errors = [];

    //check required fields
    if (!name) {
        errors.push({ msg: 'Please fill in the name' })
    }
    if (!author) {
        errors.push({ msg: 'Please fill in the author \'s name' })
    }
    if (!edition) {
        errors.push({ msg: 'Please fill in the edition' })
    }
    if (!lend) {
        errors.push({ msg: 'Please fill in the lending way' })
    }
    console.log("experiment " + Book.name);

    if (errors.length > 0) {
        res.render('books', {
            errors,
            name,
            author,
            edition,
            genre,
            subject,
            description,
            lend,
            email: req.user.email,
            Phn_no: req.user.number

        });
    }
    else {
        //adding the book
        const newBook = new Book({
            name,
            author,
            edition,
            genre,
            subject,
            description,
            lend,
            OriginalEmail: req.user.email,
            CurrentEmail: req.user.email,
            Phn_no: req.user.number
            //email:req.params.email

        });
        //save  book to database

        newBook.save()
            .then(book => {
                // var d=new Date();
                const newLendDetail = new lendDetail({
                    Owner: req.user.email,
                    books: book._id,
                    Persons_Taken: [req.user.email],
                    date_Array: [new Date()]
                })

                newLendDetail.save()
                    .then(nld => {
                        console.log(nld.Persons_Taken)
                        console.log(nld.date_Array);
                        req.flash(
                            'success_msg',
                            'Book has been added successfully'
                        );
                        res.redirect('/dashboard');
                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));

        //console.log(newBook)

    }
});

module.exports = router;
