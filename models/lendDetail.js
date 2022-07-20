const mongoose = require('mongoose');

const lendDetailSchema = new mongoose.Schema({
    Owner:{
        type:String,
        required:true
    },
   
     books:{type:mongoose.Schema.Types.ObjectId,ref:'Book'},

     Persons_Taken:{
         type:Array,
         required:true
     },
     date_Array:{
         type:Array,
         required:true
     }
})

const lendDetail= mongoose.model('lendDetails',lendDetailSchema)

module.exports=lendDetail;