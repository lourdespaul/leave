/**
 * Created by agil on 12/6/17.
 */
var mongoose = require('mongoose');

var teacherSchema = mongoose.Schema({
    name: String,
    phone: String,
    salary: Number,
    address: String,
    password: String,
    gender: String,
    isPrincipal:{
        type:Boolean,
        default:false
    },
    leave:[{type: mongoose.Schema.Types.ObjectId, ref:'leave'}]
});

var Teachers = mongoose.model('teachers', teacherSchema);

module.exports = Teachers;