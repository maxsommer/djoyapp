//	variables
var currentEvents = [];
var currentTime = moment().unix();

// create WebAudio API context
var context = new AudioContext();
// Create lineOut
var lineOut = new WebAudiox.LineOut(context);

//	elements
var dot = document.querySelectorAll('.dot');
var checkbox = document.querySelectorAll('input[type=checkbox]');
var nav = document.querySelector('nav');
var navtoggle = document.querySelector('#navtoggle');
var meSymbolText = document.querySelector("#meSymbolText");
var actionButton = document.querySelector("#actionButton");
var refreshButton = document.querySelector("#refreshButton");
var eventContainer = document.querySelector("#eventContainer");

(function(){

	/*
	*	Djoya; Styling Test;
	*	12. Dezember 2015
	*/

	//	Echtzeitausführung
	window.setInterval(function(){

		//	lokale Zeit aktualisieren
		currentTime = moment().unix();

		//	gibt es Events, die nicht mehr auf dem Bildschirm angezeigt
		//	werden sollten weil sie schon nicht mehr aktuell sind?
		checkEvents();

	}, 10000);


	/*
	*	Öffnen der Navigation
	*/

	navtoggle.addEventListener("click", function(){

		if( nav.style.left === "-95vw" || nav.style.left === "" ){
			nav.style.left = "0px";
			navtoggle.style.left = "80vw";
		}
		else{
			nav.style.left = "-95vw";
			navtoggle.style.left = "0px";
		}

	});

	/*
	*	Location laden und senden
	*/
	refreshButton.addEventListener("click", function(){
		playSound("tap.mp3");
		getLocation();
	});


	/*
	*	Checkboxen
	*/

	for(i = 0; i < dot.length; i++){
		dot[i].addEventListener( "click", function(){
			for(j = 0; j < dot.length; j++){
				if( Object.is( this, dot[j] ) ){
					checkbox[j].checked = !checkbox[j].checked;
				}
			}

		});
	}

}());


/*
*	AJAX daten laden
*/
function ajaxPost( datastring, url, callback ){

	xhttp = new XMLHttpRequest;

	if( typeof callback === 'undefined' ){

		xhttp.onreadystatechange = function() {
		  if (xhttp.readyState == 4 && xhttp.status == 200) {
		    return xhttp.responseText;
		  }
		};

	}
	else{

		xhttp.onreadystatechange = function() {
		  if (xhttp.readyState == 4 && xhttp.status == 200) {
			  if( typeof callback === 'function' ){
				  callback( xhttp.responseText );
			  }
		  }
		};

	}

	xhttp.open("POST", "http://localhost:3000/radar", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send( datastring );

}


function getLocation() {
    if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(sendPosition);
    } else {
	  meSymbolText.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function sendPosition(position) {
	ajaxPost(
			"latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude + "",
			"http://localhost:3000/radar",
			function( events ){

				events = JSON.parse( events );

				if( events.length === 0 ){
					console.log("Leider gibt es aktuell keine neuen Events in deiner Nähe.");
				}
				else{
					var addedEventCounter = 0;

					if(currentEvents.length === 0){
						events.forEach(function(event){

							//	in die liste der aktuell angezeigten events mit aufnehmen
							currentEvents.push( event );

							// 	die Bildschirmposition des Events wird hier bestimmt
								var eventPositionX = event.locationLongitude;
								var eventPositionY = event.locationLatitude;

								var currentPositionX = position.coords.longitude;
								var currentPositionY = position.coords.latitude;

								var eventPositionScreenX = eventPositionX.map( currentPositionX-0.015, currentPositionX+0.015, 0, 100 );
								var eventPositionScreenY = eventPositionY.map( currentPositionY-0.01, currentPositionY+0.01, 0, 100 );

							//	zeitliche Nähe bestimmen
								//var

							//	 das Event wird auf dem Bildschirm hinzugefügt
							eventContainer.innerHTML += "<a class=\"event\" href=\"/details/" + event.id + "\" style=\"left: "+ eventPositionScreenX +"%; bottom: "+ eventPositionScreenY +"%\"></a>";

							//	statusmeldung
							console.log("Event #"+event.id+" wurde zur Karte hinzugefügt.");
							addedEventCounter++;

						});
						if( addedEventCounter === 1 ){ console.log("1 Event wurde zur Karte hinzugefügt."); }
						else{console.log( addedEventCounter + " Events wurden zur Karte hinzugefügt." );}
						addedEventCounter = 0;
					}
					else{

						/*
						*	Hier wird zunächst geprüft ob die einzufügenende
						*	Elemente schon vorhanden sind. Falls ja, werden
						*	diese nicht eingefügt.
						*/

						var tests = [];
						for(var i=0;i<events.length;i++){tests.push(0);}

						for(var i=0; i<events.length; i++){
							event = events[i];

							for(var j=0; j<currentEvents.length; j++){

								exEvent = currentEvents[j];
								if( event.id === exEvent.id ){
									tests[i] = 1;
								}else{
								}


							}

						}

						for(var i=0;i<tests.length;i++){

							event = events[i];

							if(tests[i] === 0){
								//	das event hinzufügen
								currentEvents.push( event );

								// 	die Bildschirmposition des Events wird hier bestimmt
									var eventPositionX = event.locationLongitude;
									var eventPositionY = event.locationLatitude;

									var currentPositionX = position.coords.longitude;
									var currentPositionY = position.coords.latitude;

									var eventPositionScreenX = eventPositionX.map( currentPositionX-0.015, currentPositionX+0.015, 0, 100 );
									var eventPositionScreenY = eventPositionY.map( currentPositionY-0.01, currentPositionY+0.01, 0, 100 );

								//	zeitliche Nähe bestimmen
									//var

								//	 das Event wird auf dem Bildschirm hinzugefügt
								eventContainer.innerHTML += "<a class=\"event\" href=\"/details/" + event.id + "\" style=\"left: "+ eventPositionScreenX +"%; bottom: "+ eventPositionScreenY +"%\"></a>";

								//	statusmeldung
								console.log("Event #"+event.id+" wurde zur Karte hinzugefügt.");
								addedEventCounter++;
							}
							else{
								console.log("Event #"+event.id+" wurde nicht hinzugefügt, da es bereits auf der Karte zu finden ist.");
							}

						}

						if( addedEventCounter === 1 ){ console.log("1 Event wurde zur Karte hinzugefügt."); }
						else{console.log( addedEventCounter + " Events wurden zur Karte hinzugefügt." );}
						addedEventCounter = 0;

					}
				}

			}
		);
}

function checkEvents(){

	var tests = [];
	for(var i=0;i<currentEvents.length;i++){tests.push(0);}

	if( currentEvents.length != 0 ){

		for( var i=0; i < currentEvents.length; i++ ){
			var event = currentEvents[i];

			if( event.time < currentTime ){
				tests[i] = 1;
			}

		}

	}
	for(var i=0;i < currentEvents.length;i++){
		var anzeige = currentEvents[i].id;
		if(tests[i] === 1){

			//	event aus der internen liste herausstreichen
			currentEvents.splice(i, 1);

			//	event aus der darstellung herausnehmen
			var element = document.querySelector("a.event[href='/details/"+ i +"']");
			eventContainer.removeChild( element );

			//	Statusanzeige
			console.log("Event #" + anzeige + " ist nicht mehr aktuell und wurde von der Karte entfernt.");

		}
	}

}

Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

function playSound( soundname ){
	// load a sound and play it immediatly
	WebAudiox.loadBuffer(context, 'sounds/' + soundname, function(buffer){
	    // init AudioBufferSourceNode
	    var source  = context.createBufferSource();
	    source.buffer   = buffer
	    source.connect(lineOut.destination)

	    // start the sound now
	    source.start(0);
	});
}
