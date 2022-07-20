const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction=require('../models/transaction');
const lendDetail=require('../models/lendDetail');

router.get('/sharedBooks/bookInfo/:email/:id',ensureAuthenticated,(req,res)=>{
    lendDetail.findOne({books:req.params.id}).populate('books').exec((err,fld)=>{
        //console.log(fld)
       var dmy=[];
       for(var i=0;i<fld.date_Array.length;i++){
           var str=fld.date_Array[i].getDate() + "/" + (fld.date_Array[i].getMonth() + 1) + "/" +fld.date_Array[i].getFullYear();
           dmy.push(str)
       }

        console.log(dmy)
        console.log(fld.Persons_Taken)
        res.render('sharedInfo',{
            user:req.user,
            fld:fld,
            dates:dmy
        })
    })
})

module.exports = router ;