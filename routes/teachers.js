/**
 * Created by agil on 12/6/17.
 */
var express = require('express');
var Teachers = require('../models/teachers');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post('/register', function (req,res, next) {
   var data = req.body;
   var teacher = new Teachers({
       name: data.name.trim(),
       phone: data.phone.trim(),
       salary: data.salary.trim(),
       address: data.address.trim(),
       gender: data.gender.trim()
   });
   if(data.isPrincipal){
       teacher.isPrincipal = data.isPrincipal
   }
   teacher.save(function (err, result) {
       if(err) console.log(err);
       if(result) {
           console.log(result);
           res.send(result);
       }
   })
});


module.exports = router;