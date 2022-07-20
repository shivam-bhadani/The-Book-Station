const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction = require('../models/transaction');
var User = require('../models/User');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.setSubstitutionWrappers('{{', '}}'); 


router.get("/request/:id", function (req, res) {
    Book.findOne({ _id: req.params.id }, function (err, foundBook) {
        if (err) {
            console.log(err);
        }
        else {
            const msg = {
                to: foundBook.CurrentEmail,
                from: 'openlib@openlib.com',
                subject: 'Request of book ',
                text: 'Do not reply',
                html: '<h3>Do not reply ,this is an auto generated mail</h3>',
                templateId: '4294c421-bac6-4f83-aa84-7e66f3037289',
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
                    user_id: req.user._id,
                    book_id: foundBook._id,
                    dummy: 'movies'
                },

            };

            sgMail.send(msg);
            req.flash(
                'success_msg',
                'Your request has been sent successfully'
            );
            res.redirect('/dashboard');
        }
    });

});
router.get("/reject/:id/:requestorId", function (req, res) {
    Book.findOne({ _id: req.params.id }, function (err, foundBook) {
        if (err) {
            console.log(err);
        }
        else {
            User.findById(req.params.requestorId, (err, foundUser) => {
                const msg = {
                    to: foundUser.email,
                    from: 'openlib@openlib.com',
                    subject: 'Rejection of requested book ',
                    text: 'Do not reply',
                    html: '<h3>Do not reply ,this is an auto generated mail</h3>',
                    templateId: 'fe3f4c09-320c-4f87-83b6-d2956b673729',
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
                        //dummy:'messages',

                    },
                };
                sgMail.send(msg);
                req.flash(
                    'success_msg',
                    'You have rejected the request'
                );
                res.redirect('/dashboard');
            });
        }
    });

});


module.exports = router