var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  //res.send( req.body.data );
  res.send( req.body );
});

router.get('/', function(req, res, next) {
  //res.send( req.body.data );
  res.send("404 <3!");
});


module.exports = router;
