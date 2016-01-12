var express = require('express');
var sqlite3 = require('sqlite3');
var moment = require('moment');
var router = express.Router();

router.get('/:int(\\d+)', function(req, res, next) {

	if( req.user ){

		var userId 		= req.user.id;
		var eventId 	= req.path;
		eventId 		= Number(eventId.substr(1));

		// verbindung zur datenbank aufbauen
		var db = new sqlite3.Database('../database.db', function(error){

			if(error != null){
				console.log("Datenbankverbindung konnte nicht aufgebaut werden ");
			}
			else{

				db.get("SELECT * FROM `users-events` WHERE eventId = ? AND userId = ?; ", [ eventId, userId ], function(err, row){
					if (err) {
						console.log("Error: \n");
						console.log( err.message + "\n " + err );
					}
					else{
						//	wenn noch kein eintrag vorhanden ist
						if( typeof row === 'undefined' ){
							db.run("INSERT INTO `users-events` (`eventId`, `userId`) VALUES (?, ?)", [ eventId, userId ] , function(err){
								if (err) {
									console.log("Error: \n");
									console.log( err.message + "\n " + err );
								}
								else{
									
									res.send("attendance registered");
								}
							});
						}
						else{
							// wenn schon ein eintrag vorhanden ist soll nicht noch einmal teilgenommen werden
							// stattdessen soll die teilnahme abgesagt werden
							db.run("DELETE FROM `users-events` WHERE `userId` = ? AND `eventId` = ?;", [ userId, eventId ], function(err){
								if (err) {
									console.log("Error: \n");
									console.log( err.message + "\n " + err );
								}
								else{
									res.send("attendance cancelled");
								}
							});
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

module.exports = router;
