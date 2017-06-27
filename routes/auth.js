/**
 * Created by agil on 13/6/17.
 */
var express = require('express');
var router = express.Router();
var flash = require('express-flash');
var passport = require('passport');
var Teacher = require('../models/teachers');
var SendOtp = require('sendotp');
var cookieParser = require('cookie-parser');

var sendOtp = new SendOtp('153760A7ehQ8Uc5926af23');

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/leave', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/logout', function (req,res,next) {
    req.logout();
    res.redirect('/login')
});

router.get('/reset', function (req,res,next) {
    res.render('reset')
});

router.post('/reset', function (req, res, next) {
    var data = req.body;
    Teacher.findOne({phone:data.phone}, function (err,result) {
        if(err){
            res.render('reset', req.flash('No user found'));
        }
        if(result){
            var phone = '91'+ result.phone;
            sendOtp.send(phone, "MTMHSS",function (err, data, response) {
                console.log(result);
                req.session.teacher = result._id;
                res.redirect('/verify');
            });
        }else{
            req.flash('loginMessage', 'No user found');
            res.redirect('/reset');
        }
    });
});

router.get('/verify', function (req, res) {
   res.render('verify');
});


router.post('/verify', function (req, res, next) {
    if(req.session.teacher){
        Teacher.findById(req.session.teacher, function (err, result) {
            if (err) res.send(err);
            var body = req.body;
            if(result){
                var phone = '91'+result.phone;
                sendOtp.verify(phone,body.otp, function (err,data,response) {
                    if(data.type == 'error'){
                        req.flash('loginMessage', 'OTP not matched');
                        res.redirect('verify')
                    }
                    if(data.type == 'success'){
                        if(body.password == body.vpassword){
                            result.password = password;
                            result.save(function(err, slt){
                                if(slt){
                                    res.redirect('/login');
                                }
                            })
                        }
                    }
                })
            }
        });
    }

});

module.exports = router;