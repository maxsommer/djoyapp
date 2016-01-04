var express = require('express');
var sqlite3 = require('sqlite3');
var moment = require('moment');
var router = express.Router();


router.get('/:int(\\d+)', function(req, res, next) {

	var id = req.path;
	id = Number(id.substr(1));

	// verbindung zur datenbank aufbauen
	var db = new sqlite3.Database('../database.db', function(error){

		if(error != null){
			console.log("Datenbankverbindung konnte nicht aufgebaut werden ");
		}
		else{

			db.get("SELECT * FROM events WHERE id = ?", [ id ], function(err, row){
				if (err) {
					console.log("Error: \n");
					console.log( err.message + "\n " + err );
				}
				else{
					row.time = moment.unix(row.time).format("Do MM YYYY, HH:mm");
				  	res.render('details', { layout:false, event: row });
				}
			});

		}

		db.close();

	});

});


router.get('/location/:int(\\d+)', function(req, res, next) {

	var id = req.path;
	id = Number( id.substr(10) );

	var db = new sqlite3.Database('../database.db', function(error){

		if(error != null){
			console.log("Datenbankverbindung konnte nicht aufgebaut werden ");
		}
		else{

			db.get("SELECT * FROM events WHERE id = ?", [ id ], function(err, row){
				if (err) {
					console.log("Error: \n");
					console.log( err.message + "\n " + err );
				}
				else{
					var location = {};
					location.lat = row.locationLatitude;
					location.lng = row.locationLongitude;
				  	res.send( JSON.stringify(location) );
				}
			});

		}

		db.close();

	});

});

module.exports = router;
