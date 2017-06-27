/**
 * Created by agil on 14/6/17.
 */
var express = require('express');
var Teacher = require('../models/teachers');
var Leave = require('../models/leaves');
var router = express.Router();

router.get('/', function (req,res,next) {
    if(req.user.isPrincipal){
        res.redirect('/principal');
    }
    res.render('leave-request.hbs');
});



router.post('/', function (req, res, next) {
   var data = req.body;
   var date = new Date(data.date);
   var leave = new Leave({
       teacher:req.user._id,
       date:date,
       session:data.session,
       reason:data.reason
   });
   var user = req.user;
   leave.save(function (err, result) {
       if(err) res.send(err);
       if(result){
           Teacher.findByIdAndUpdate(user._id,{$push:{leave:result._id}}, function (err, result) {
               if(err) console.log(err);
               if(result) res.redirect('/leave/history');
           });
       }
   });

 });

router.get('/history', function (req,res,next) {
   Teacher.findById(req.user._id)
       .populate('leave')
       .sort({'leave.createdAt':-1})
       .exec(function (err, result) {
           var total = 0;
           result.leave.forEach(function (item) {
              if(item.accepted){
                  if(item.session == 'fullday')
                      total +=1;
                  else
                      total = total+0.5;
              }
           });
           res.render('history',{leave:result.leave, total:total});
       });
});

module.exports = router;
