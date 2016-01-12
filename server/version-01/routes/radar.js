var express = require('express');
var sqlite3 = require('sqlite3');
var moment = require('moment');

var router = express.Router();

router.post('/', function(req, res, next) {

	if( req.user ){

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
				var results = [];
				var rowsprocessed = 0;
				var rowstobeprocessed = 0;

					db.each("SELECT * FROM events WHERE locationLongitude < ? AND locationLongitude > ? AND locationLatitude < ? AND locationLatitude > ? AND time < ? AND time > ?;", [ eastPosition.longitude, westPosition.longitude, northPosition.latitude, southPosition.latitude, filterTime, currentTime ], function(err, row){

						if (err) {
							console.log("Error: \n");
							console.log( err.message + "\n " + err );
						}
						else{
							if( typeof row === 'undefined' ){
								res.send( [] );
							}
							else{
								db.get("SELECT count() AS count FROM `users-events` WHERE `eventId` = ?", [ row.id ], function(err, data4){
									if( data4.count < row.maximumAttendances ){
										results.push(row);
									}
									rowsprocessed++;
									if( rowsprocessed === rowstobeprocessed ){
										rowsprocessed = 0;
										rowstobeprocessed = 0;
										res.send(results);
										db.close();
									}
								});

							}
						}
					}, function(err, num){
						rowstobeprocessed = num;
					});

				}

			});

	}
	else{
		res.redirect('welcome');
	}



});

router.get('/', function(req, res, next) {
	if( req.user ){
		res.render('radar', { title: 'Djoya' });
	}
	else{
		res.redirect('welcome');
	}
});


module.exports = router;
