require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path= require('path');
const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(`Database connection error : ${err}`));

// EJS

app.set('view engine', 'ejs');

app.set('View', path.join(__dirname , 'views'));

app.set(express.static(path.join(__dirname,'public')));
// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use(express.static('public'))
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/details',require('./routes/details.js'));
app.use('/books',require('./routes/sharedInfo.js'))
app.use(expressLayouts);
//app.use('/books',require('./routes/mybooks.js'))
app.use('/myaccount', require('./routes/myaccount.js'));
app.use('/books',require('./routes/books.js'));

//app.use('/details',require('./routes/details.js'));

app.use('/mailing',require('./routes/mailing'))
app.use('/', require('./routes/users.js'));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
