var express = require('express');
var router = express.Router();
var flash = require('express-flash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/leave');
  // res.render('index', { title: 'Express' });
});

module.exports = router;