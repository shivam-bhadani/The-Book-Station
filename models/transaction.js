const mongoose = require('mongoose');

const transactionSchema=new mongoose.Schema({
    Person_given:String,
    Person_taken:String,
    Date:{
        type:Date,
        default:Date.now
    }
})

const transaction = mongoose.model('transaction',transactionSchema);

module.exports=transaction;