var express = require('express');
var router = express.Router();
var instaReq = require('../models/insta');

/* GET home page. */
router.get('/', function(req, res, next) {
  // instaReq.getInsta().then(function(data){
  //   console.log(data);
  // });

  res.render('index', { title: 'Express' });
});



module.exports = router;
