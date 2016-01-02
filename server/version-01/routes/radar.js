var express = require('express');
var sqlite3 = require('sqlite3');
var moment = require('moment');

var router = express.Router();

router.post('/', function(req, res, next) {
	// in req.body stehen die aktuellen location daten
	// diese lesen wir aus und verwenden sie hier dann weiter

	var kilometerScale = 1.0;

	var currentPosition 		= {};
	currentPosition.longitude 	= Number(req.body.longitude);
	currentPosition.latitude 	= Number(req.body.latitude);

	var currentTime			= moment().unix();
	var filterTime			= currentTime + ( 60 * 60 * 6 ); // 6 Stunden im voraus ..

	var events = [];


	// jetzt speichern wir hier einmal 4 positionen ab
	// die den umkreis (ca 1km) abstecken sollen in dem gesucht wird
	var northPosition 			= {};
	northPosition.longitude 		= currentPosition.longitude;
	northPosition.latitude 			= currentPosition.latitude + 0.01 * kilometerScale;
	var southPosition 			= {};
	southPosition.longitude 		= currentPosition.longitude;
	southPosition.latitude 			= currentPosition.latitude - 0.01 * kilometerScale;
	var westPosition 				= {};
	westPosition.longitude 			= currentPosition.longitude - 0.015 * kilometerScale;
	westPosition.latitude 			= currentPosition.latitude;
	var eastPosition 				= {};
	eastPosition.longitude 			= currentPosition.longitude + 0.015 * kilometerScale;
	eastPosition.latitude 			= currentPosition.latitude;


		// verbindung zur datenbank aufbauen
		var db = new sqlite3.Database('../database.db', function(error){

			if(error != null){
				console.log("Datenbankverbindung konnte nicht aufgebaut werden ");
			}
			else{

				db.all("SELECT * FROM events WHERE locationLongitude < ? AND locationLongitude > ? AND locationLatitude < ? AND locationLatitude > ? AND time < ? AND time > ?", [ eastPosition.longitude, westPosition.longitude, northPosition.latitude, southPosition.latitude, filterTime, currentTime ], function(err, rows){
					if (err) {
						console.log("Error: \n");
						console.log( err.message + "\n " + err );
					}
					else{
						res.send( rows );
					}
				});

			}

			db.close();

		});

});

router.get('/', function(req, res, next) {
  //res.send( req.body.data );
  res.send("404 <3!");
});


module.exports = router;
