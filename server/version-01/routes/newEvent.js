var express = require('express');
var sqlite3 = require('sqlite3');
var moment = require('moment');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('newEvent', { layout:false });
});

router.post('/process', function(req, res, next) {


	var eventTitle 		= req.body.title;
	var eventDescription 	= req.body.description;
	var eventPrice 		= req.body.price;
	var eventTime 		= req.body.time;
	var eventLocationLat 	= req.body.lat;
	var eventLocationLng 	= req.body.lng;

	var time = moment().format('MM/DD/YYYY');
	time += " " + eventTime;

	eventTime = Date.parse( time )/1000;

	console.log( eventTime );

	if(
		eventTitle === '' || eventDescription === '' ||
		eventTime === '' ||
		eventLocationLat === '' || eventLocationLng === ''
	){

		res.render('newEvent', { layout:false, error: "Du musst das Formular vollständig ausfüllen :)" });

	}
	else{

		//	hier muss ein wortfilter hin für eventname, beschreibung, etc.

		// verbindung zur datenbank aufbauen
		var db = new sqlite3.Database('../database.db', function(error){

			if(error != null){
				console.log("Datenbankverbindung konnte nicht aufgebaut werden ");
			}
			else{

				db.run("INSERT INTO events ( name, description, price, time, locationLatitude, locationLongitude, authorId ) VALUES ( ?, ?, ?, ?, ?, ?, 0 )", [ eventTitle, eventDescription, eventPrice, eventTime, eventLocationLat, eventLocationLng ], function(err){
					if (err) {
						console.log("Error: \n");
						console.log( err.message + "\n " + err );
					}
				});

			}

			db.close();

		});

	  	res.render('newEventProcess', { layout:false });
	}
});

module.exports = router;
