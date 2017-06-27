/**
 * Created by agil on 14/6/17.
 */
var mongoose = require('mongoose');

var leaveSchema = new mongoose.Schema({
    teacher:{type: mongoose.Schema.Types.ObjectId, ref:'teachers'},
    date:Date,
    session:String,
    reason:String,
    accepted:{
        type:Boolean,
        default:false
    },
    canceled:{
        type:Boolean,
        default:false
    },
    approvedBy:{
        type:String,
        required:false
    },
    createdAt:{type:Date, default:Date.now()}
});

var Leave = mongoose.model('leave',leaveSchema);

module.exports = Leave;