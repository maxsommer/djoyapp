var express = require('express');
var router = express.Router();
var crypto              = require('crypto');
var sqlite3             = require('sqlite3');
var db                  = new sqlite3.Database('../database.db');


router.get('/', function(req, res, next) {
  	res.render('register-form', { title: 'Djoya' });
});

router.post('/', function(req, res, next){

	if( req.body.username != 'undefined' || req.body.password != 'undefined' ){

		var hash = crypto.createHash('sha256');
		var salt = crypto.randomBytes(16).toString('base64');
		hash.update( req.body.password );
		hash.update( salt );
		var finalhash = hash.digest('hex');

		var username = req.body.username;
		var privacy = req.body.privacyEnabled;
		var location = req.body.locationEnabled;

		db.run("INSERT INTO users ( username, password, salt, privacyEnabled, locationEnabled ) VALUES ( ?, ?, ?, ?, ? )", [ username, finalhash, salt, privacy, location ], function(err){
			if (err) {
				//console.log("Error: \n");
				//console.log( err.message + "\n " + err );
				res.render('register-error', {title: "Djoya", error: 'Leider konntest du nicht registriert werden, bitte versuche es noch einmal.'});
			}
		});

		res.render('register-success', {title: "Djoya"});

	}
	else{

		res.render('register-error', {title: "Djoya", error: 'Bitte fülle alle Formularfelder aus :)'});

	}
});

module.exports = router;
