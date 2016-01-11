var express = require('express');
var sqlite3 = require('sqlite3');
var moment = require('moment');
var router = express.Router();


router.get('/:int(\\d+)', function(req, res, next) {

	if( req.user ){

		var id = req.path;
		id = Number(id.substr(1));

		// verbindung zur datenbank aufbauen
		var db = new sqlite3.Database('../database.db', function(error){

			if(error != null){
				console.log("Datenbankverbindung konnte nicht aufgebaut werden ");
			}
			else{

				db.get("SELECT events.id AS id, events.name AS name, events.description AS description, events.price AS price, events.time AS time, events.locationLatitude AS locationLatitude, events.locationLongitude AS locationLongitude, events.authorId AS authorId, `events-media`.mediaId AS mediaId, media.type AS mediaType, media.filename AS mediaFileName FROM events, `events-media`, media WHERE events.id = ? AND `events-media`.`eventId` = ? AND `events-media`.`mediaId` = media.id;", [ id, id ], function(err, row){
					if (err) {
						console.log("Error: \n");
						console.log( err.message + "\n " + err );
					}
					else{
						if( typeof row === 'undefined' ){
							var row = {};
							row.name = "Dieses Event ist leider nicht mehr verfügbar.";
							row.description = "";
							row.time = "";
							row.price = "";
							row.locationLatitude = "49.930070";
							row.locationLongitude = "8.931786";
							row.image = "";
							res.render('details', { layout:false, event: row });
						}
						else{
								var ending = row.mediaFileName.split(".");
								ending = ending[ (ending.length-1) ];
								row.image = "event"+row.id+"-min."+ending;
								row.time = moment.unix(row.time).format("Do MM YYYY, HH:mm");
								res.render('details', { layout:false, event: row });
						}
					}
				});

			}

			db.close();

		});

	}
	else{
		res.redirect('welcome');
	}

});


router.get('/location/:int(\\d+)', function(req, res, next) {

	if( req.user ){

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
						if( typeof row === 'undefined'){
							location.lat = 0;
							location.lng = 0;
						}
						else{
							location.lat = row.locationLatitude;
							location.lng = row.locationLongitude;
						}
						res.send( JSON.stringify(location) );
					}
				});

			}

			db.close();

		});

	}
	else{
		res.redirect('welcome');
	}

});

module.exports = router;
