/**
 * Created by agil on 16/6/17.
 */
var express = require('express');
var Leave = require('../models/leaves');
var msg91 = require('msg91-sms');
var moment = require('moment');
var router = express.Router();

var apiKey = "153760A7ehQ8Uc5926af23";

function formatdate(date){
    var mnt = moment(date);
    return mnt.format("DD-MM-YY")
}

router.get('/', function (req, res) {
    Leave.find()
        .limit(10)
        .sort({createdAt: -1})
        .populate('teacher')
        .exec(function (err, requests) {
            if (err) throw err;
            if(requests) {
                res.render('admin',{requests:requests});
            }
        });
});

router.get('/accept/:id', function (req, res) {
    Leave.findById(req.params.id)
        .populate('teacher')
        .exec(function (err, result) {
        if(err) throw err;
        if(result){
            array = [];
            if(result.session == "fn"){
                array = ['fn', 'fullday']
            }
            else if(result.session == 'an'){
                array = ['an', 'fullday']
            }
            else {
                array = ['fn', 'an', 'fullday']
            }
            Leave.where('date', result.date)
                .where('session').in(array)
                .where('accepted', true)
                .count(function (err, count) {
                    if(count<3){
                        result.accepted = true;
                        result.save(function (err, data) {
                            var message = "Your Request for leave on "+formatdate(result.date)+" is accepted by "+req.user.name;
                            var number = '91'+result.teacher.phone;
                            msg91.sendOne(apiKey,number,message,'MTMHSS','4','91',function (response) {
                                if(response){
                                    console.log(response);
                                    res.redirect('/principal');
                                }
                            });
                        })
                    }
                    else{
                        req.flash('loginMessage','Limit exceeded');
                        res.redirect('/principal');
                    }
                });
        }
    })
});

router.get('/cancel/:id', function (req, res) {
     var id = req.params.id;
     Leave.findById(id)
         .populate('teacher')
         .exec(function (err, result) {

                if (result){
                    result.canceled = true;
                    result.save(function (err, success) {
                        if(success){
                            var phone = '91'+ result.teacher.phone;
                            var message = "Your Request for leave on "+formatdate(result.date)+" is cancelled by "+req.user.name;
                            msg91.sendOne(apiKey,phone,message,'MTMHSS','4','91',function (response) {
                                if(response){
                                    console.log(response);
                                    res.redirect('/principal');
                                }
                            });
                        }
                    });
                }
            })
});

module.exports = router;