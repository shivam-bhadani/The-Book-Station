const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var User =require('../models/User');
const bcrypt = require('bcryptjs');
const Book = require('../models/Book');


//delete
router.get('/remove/:email',function(req,res){
  var Email = req.params.email;
  Book.deleteMany({email:Email},function(err){
    if(err){
      console.log(err);
      return res.status(500).send();
    }
  });
  User.findOneAndRemove({email:Email},function(err){
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    return res.redirect('/remove');
  });

});


//update
router.get('/update/:id', ensureAuthenticated, (req, res) => 
  res.render('update',{
    user: req.user
  })
);

router.post('/update/:id', (req, res) => {
    
    const { name, email, password, password2,number } = req.body;
    let errors = [];
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password&&password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    //
    if(number && number.length!=10){
      errors.push({ msg: 'Type valid Mobile number' });
    }
    if (errors.length > 0) {
      res.render('update', {
        user: req.user, errors,name,
        email,number,password,password2
      });
    } 
    else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('update', {
            user: req.user,errors,name,
            email,number,password,password2
          });
        } 
        else {
          var id=req.params.id;
          User.findOne({_id:id},function(err,foundObject){
            if(err){
              console.log(err);
              res.status(500).send();
            } else {
              if(!foundObject){
                res.status(404).send();
              } else {
                if(req.body.name){
                  foundObject.name=req.body.name;
                }
        
                if(req.body.email){
                  foundObject.email=req.body.email;
                }
        
                if(req.body.number){
                  foundObject.number=req.body.number;
                }
        
                if(req.body.password!=''){
                  foundObject.password=req.body.password;
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(foundObject.password, salt, (err, hash) => {
                      if (err) throw err;
                      foundObject.password = hash;
                      foundObject
                        .save()
                        .then(user => {
                          req.flash(
                            'success_msg',
                            'You have updated your details'
                          );
                          res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                    });
                  });
                
                }else{
                  foundObject
                        .save()
                        .then(user => {
                          req.flash(
                            'success_msg',
                            'You have updated your details'
                          );
                          res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                }
              }
            }
          
            
          });  
        }
      });
    }
  });

router.get('/mydetails',ensureAuthenticated,  (req, res) =>
  res.render('mydetails', {
    user: req.user
  })
);
  
module.exports = router;
 
