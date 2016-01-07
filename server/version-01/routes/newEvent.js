var express = require('express');
var sqlite3 = require('sqlite3');
var moment = require('moment');
var multer  = require('multer');
var lwip  = require('lwip');
var fs = require('fs');


var router = express.Router();
var upload = multer({ dest: 'public/uploads/' });

router.get('/', function(req, res, next) {
  res.render('newEvent', { layout:false, currentTime: moment().format("HH:mm") });
});

router.post('/process', upload.single('image') ,function(req, res, next) {

	var eventTitle 		= req.body.title;
	var eventDescription 	= req.body.description;
	var eventPrice 		= req.body.price;
	var eventTime 		= req.body.time;
	var eventLocationLat 	= req.body.lat;
	var eventLocationLng 	= req.body.lng;
      var eventImage          = req.file;

	var time = moment().format('MM/DD/YYYY');
	time += " " + eventTime;

	eventTime = Date.parse( time )/1000;

	if(
		eventTitle === '' || eventDescription === '' ||
		eventTime === '' ||
		eventLocationLat === '' || eventLocationLng === '' ||
            eventImage === '' || eventImage === 'undefined' || typeof eventImage === 'undefined'
	){

		res.render('newEvent', { layout:false, error: "Du musst das Formular vollständig ausfüllen :)"  });

	}
	else{

		//	hier muss ein wortfilter hin für eventname, beschreibung, etc.

		// verbindung zur datenbank aufbauen
		var db = new sqlite3.Database('../database.db', function(error){

			if(error != null){
				console.log("Datenbankverbindung konnte nicht aufgebaut werden ");
			}
			else{

                        var fileNameFull;

				db.run("INSERT INTO events ( name, description, price, time, locationLatitude, locationLongitude, authorId ) VALUES ( ?, ?, ?, ?, ?, ?, 0 )", [ eventTitle, eventDescription, eventPrice, eventTime, eventLocationLat, eventLocationLng ], function(err){
					if (err) {
						console.log("Error: \n");
						console.log( err.message + "\n " + err );
					}

                              var row = {};
                              row.id = this.lastID;

                              var endingA = eventImage.originalname.split(".");
                              var ending = endingA[ (endingA.length-1) ];
                              fileNameFull = "public/uploads/event" + row.id + "." + ending;
                              fs.rename( "public/uploads/" + eventImage.filename, fileNameFull );
                              lwip.open(fileNameFull, function(err, image){
                                image.batch()
                                  .cover( 1000, 600 )
                                  .writeFile("public/uploads/event"+row.id+"-min.jpg", function(err){
                                  });

                              });

                              db.run("INSERT INTO media ( type, filename ) VALUES ( 'image', ? )", [ fileNameFull ], function(err){
                                    if (err) {
                                          console.log("Error: \n");
                                          console.log( err.message + "\n " + err );
                                    }

                                    db.run("INSERT INTO `events-media` ( eventId, mediaId ) VALUES ( ?, ? )", [ row.id, this.lastID ], function(err){
                                          if(err){
                                                console.log("Error: \n");
                                                console.log( err.message + "\n" + err);
                                          }
                                    })

                              });

				});

			}

			db.close();

		});

            res.send("");
	}
});

module.exports = router;
