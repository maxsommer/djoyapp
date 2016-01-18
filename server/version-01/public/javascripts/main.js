//	variables
var currentEvents = [];
var currentTime = moment().unix();
var currentLocation = [];
var currentLocationSet = false;
var currentMarkers = [];
var currentMarkerLocation = {};
var directionsService;
var directionsDisplay;
var mapNewEvent;
var mapDetails;
var markerDetails;

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
var newEventSubmit;

(function(){

	/*
	*	Djoya; Styling Test;
	*	12. Dezember 2015
	*/


	var currentURL = window.location.href;
	var currentURL = currentURL.split("/");
	var currentPage = currentURL[ currentURL.length-1 ];

	$( window ).resize(function() {
		if($( window ).width() > 769 ){
  	  		$('nav').css({"left":"0"});
	  	  	$('#navtoggle').css({"left":"95wv"});
		}else{
  	  		$('nav').css({"left":"-95vw"});
	  	  	$('#navtoggle').css({"left":"0"});
		}
	});

	if( currentPage === 'radar' ){
		updateLocation( updateEvents );

		//	Echtzeitausführung
		window.setInterval(function(){

			//	lokale Zeit aktualisieren
			currentTime = moment().unix();


			//	gibt es Events, die nicht mehr auf dem Bildschirm angezeigt
			//	werden sollten weil sie schon nicht mehr aktuell sind?
			checkEvents();

			//	neue events laden
			updateEvents();

		}, 10000);

		//	Echtzeitausführung
		window.setInterval(function(){

			//	ort aktualisieren
			updateLocation();

		}, 60000);

	}


	$('#ajaxLoadedContentClose').click(function(){

		$('#ajaxLoadedContentClose').hide( 150 );
		$('#loadedContentBox').slideUp(300);
		$('#eventDetails').slideUp(300);

	});

	if( currentPage === 'radar' || currentPage === 'impress' || currentPage === 'guide' ) {

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

		actionButton.addEventListener( "click", function(){
			playSound( "tap.mp3" );

			if( $('#loadedContentBox').is(":visible") ){
				$('#ajaxLoadedContentClose').hide( 150 );
				$('#loadedContentBox').slideUp( 300, function(){
					$('#ajaxLoadedContent').html("");
				});
			}
			else{

				$( "#ajaxLoadedContent" ).load( "/new", function(){

					$('#ajaxLoadedContent').show( 150 );
					$('#ajaxLoadedContentClose').show( 150 );
					$( "#loadedContentBox" ).slideDown( 300 );
					initializeMap();

					$('#newEventForm').submit(function(){

						$(this).ajaxSubmit({

							error: function(xhr) {

							},

							success: function(response) {
								if( response === '' ){
									$('#ajaxLoadedContentClose').hide( 150 );
									$( "#loadedContentBox" ).slideUp( 300 );
									$( "#loadedContentBox" ).html( "" );
									updateEvents();

								}
								else{
									$('#ajaxLoadedContent').html(response, function(){
										$('#ajaxLoadedContent').slideDown(300, function(){
										});
									});
									$('#loadedContentBox').show();
									initializeMap();
								}
							}
						});

						return false;

					});

				} );

			}

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

	xhttp.open("POST", "/radar", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send( datastring );

}

function updateLocation( callback ){

	currentLocation.latitude 	= 49.930070;
	currentLocation.longitude 	= 8.931786;

    	if (navigator.geolocation) {
	  	navigator.geolocation.getCurrentPosition(function(position){
			currentLocation.latitude = position.coords.latitude;
			currentLocation.longitude = position.coords.longitude;
			currentLocationSet = true;

			if( typeof callback === 'function' ){
				callback();
			}
		}, function(error){
			switch(error.code) {
		        case error.PERMISSION_DENIED:
		            console.log("User denied the request for Geolocation.");
				toggleLocationHint();
		            break;
		        case error.POSITION_UNAVAILABLE:
		            console.log("Location information is unavailable.");
				toggleLocationHint();
		            break;
		        case error.TIMEOUT:
		            console.log("The request to get user location timed out.");
				toggleLocationHint();
		            break;
		        case error.UNKNOWN_ERROR:
		            console.log("An unknown error occurred.");
				toggleLocationHint();
		            break;
    			}
		});
    	} else {
	  	meSymbolText.innerHTML = "Geolocation is not supported by this browser.";
  	}
}

function updateEvents(){

	ajaxPost(
			"latitude=" + currentLocation.latitude + "&longitude=" + currentLocation.longitude + "",
			"/radar",
			function( events ){

				events = JSON.parse( events );

				if( events.length === 0 ){
					//console.log("Leider gibt es aktuell keine neuen Events in deiner Nähe.");
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

								var currentPositionX = currentLocation.longitude;
								var currentPositionY = currentLocation.latitude;

								var eventPositionScreenX = eventPositionX.map( currentPositionX-0.015, currentPositionX+0.015, 0, 100 );
								var eventPositionScreenY = eventPositionY.map( currentPositionY-0.01, currentPositionY+0.01, 0, 100 );

							//	zeitliche Nähe bestimmen
								//var

							//	 das Event wird auf dem Bildschirm hinzugefügt
							eventContainer.innerHTML += "<a class=\"event\" onclick=\"javascript:openDetails("+ event.id +");\" style=\"left: "+ eventPositionScreenX +"%; bottom: "+ eventPositionScreenY +"%\"></a>";

							//	statusmeldung
							console.log("Event #"+event.id+" wurde zur Karte hinzugefügt.");
							addedEventCounter++;

						});
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

									var currentPositionX = currentLocation.longitude;
									var currentPositionY = currentLocation.latitude;

									var eventPositionScreenX = eventPositionX.map( currentPositionX-0.015, currentPositionX+0.015, 0, 100 );
									var eventPositionScreenY = eventPositionY.map( currentPositionY-0.01, currentPositionY+0.01, 0, 100 );

								//	zeitliche Nähe bestimmen
									//var

								//	 das Event wird auf dem Bildschirm hinzugefügt
								eventContainer.innerHTML += "<a class=\"event\" onclick=\"javascript:openDetails("+event.id+");\" style=\"left: "+ eventPositionScreenX +"%; bottom: "+ eventPositionScreenY +"%\"></a>";

								//	statusmeldung
								console.log("Event #"+event.id+" wurde zur Karte hinzugefügt.");
								addedEventCounter++;
							}
							else{
								//console.log("Event #"+event.id+" wurde nicht hinzugefügt, da es bereits auf der Karte zu finden ist.");
							}

						}

						//if( addedEventCounter === 1 ){ console.log("1 Event wurde zur Karte hinzugefügt."); }
						//else{console.log( addedEventCounter + " Events wurden zur Karte hinzugefügt." );}
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
			var element = document.querySelector("a[class='event'][onclick='javascript:openDetails("+ anzeige +");']");
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

function initializeMap() {

	if( currentLocationSet === false ){

		var mapNewEvent = new google.maps.Map(document.getElementById('mapnewevent'), {
		    center: {lat: 49.930070, lng: 8.931786},
		    scrollwheel: false,
		    zoom: 4
		});

		google.maps.event.addListener( mapNewEvent, "click", function(event){
			placeMarkerAndPanTo( event.latLng, mapNewEvent );
		} );

	}
	else{
		var mapNewEvent = new google.maps.Map(document.getElementById('mapnewevent'), {
		    center: {lat: currentLocation.latitude, lng: currentLocation.longitude},
		    scrollwheel: false,
		    zoom: 15
		});

		google.maps.event.addListener( mapNewEvent, "click", function(event){
			placeMarkerAndPanTo( event.latLng, mapNewEvent );
		} );
	}

}

function placeMarkerAndPanTo(latLng, map) {
	if( currentMarkers.length != 0 )
  		setMapOnAll(null);
  	var marker = new google.maps.Marker({
    		position: latLng,
    		map: map
  	});
	currentMarkerLocation.lat = marker.getPosition().lat();
	currentMarkerLocation.lng = marker.getPosition().lng();
	document.querySelector("input[name=lat]").value = currentMarkerLocation.lat;
	document.querySelector("input[name=lng]").value = currentMarkerLocation.lng;
  	currentMarkers.push( marker );
  	map.panTo( latLng );
}
function setMapOnAll(map) {
	  for (var i = 0; i < currentMarkers.length; i++) {
	    	currentMarkers[i].setMap(map);
	  }
}


function openDetails( id ){
	$('#ajaxLoadedContent').load( "/details/" + id, function(){

		$('#ajaxLoadedContent').slideDown(150);
		$('#ajaxLoadedContentClose').show( 150 );
		$('#eventDetails').slideDown(300);

		$.get("/details/location/" + id, function(data){
			locationDetails = JSON.parse( data );

			if( locationDetails.lat != 0 || locationDetails.lng != 0 ){
				  directionsService = new google.maps.DirectionsService;
				  directionsDisplay = new google.maps.DirectionsRenderer;
				mapDetails = new google.maps.Map(document.getElementById('mapDetails'), {
				    center: {lat: locationDetails.lat, lng: locationDetails.lng},
				    scrollwheel: false,
				    zoom: 15
				});
  				directionsDisplay.setMap(mapDetails);
				var myLatLng = new google.maps.LatLng(locationDetails.lat,locationDetails.lng);
				markerDetails = new google.maps.Marker({
			    		position: myLatLng,
			    		map: mapDetails
			  	});
			}else{
				var element = document.querySelector("a[class='event'][onclick='javascript:openDetails("+id+");']");
				eventContainer.removeChild( element );
				console.log("Event #" + id + " ist nicht mehr aktuell und wurde von der Karte entfernt.");
			}
		});

	} );
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, id) {
	markerDetails.setMap(null);
	var currentLatLng = new google.maps.LatLng(currentLocation.latitude,currentLocation.longitude);
	$.get("/details/location/" + id, function(data){
		locationDetails = JSON.parse( data );

		  directionsService.route({
		    origin: currentLatLng,
		    destination: locationDetails,
		    travelMode: google.maps.TravelMode.WALKING
		  }, function(response, status) {
		    if (status === google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		    } else {
		      window.alert('Directions request failed due to ' + status);
		    }
		  });
	});
}

function closeLoadedContentBox(){
	$('#ajaxLoadedContent').slideUp(150);
	$('#ajaxLoadedContentClose').slideUp(150);
	$('#ajaxLoadedContent').html("");
}

function attend(id){
	$.get('/attend/' + id, function(){
		//	aktueller stand:
		//	button zum teilnehmen
		if( $('#attendance').hasClass("attendEvent") ){
			$('#attendance').html("Teilnahme absagen");
			$('#attendance').removeClass("attendEvent");
			$('#attendance').addClass("unattendEvent");
			var x = document.querySelector(".spaceLeft");
			x = x.childNodes[0];
			x = Number(x.innerHTML) - 1;
			$('.spaceLeft').html("<b>"+x+"</b> Plätze übrig");
			$('#loadedContentBoxCloseButton').hide(150);
			$('#ajaxLoadedContentClose').off("click");
			calculateAndDisplayRoute(directionsService, directionsDisplay, id );
		}
		//	aktueller stand:
		//	button zum absagen
		else if( $('#attendance').hasClass("unattendEvent") ){
			$('#attendance').html("Teilnehmen");
			$('#attendance').removeClass("unattendEvent");
			$('#attendance').addClass("attendEvent");
			var x = document.querySelector(".spaceLeft");
			x = x.childNodes[0];
			x = Number(x.innerHTML) + 1;
			$('.spaceLeft').html("<b>"+x+"</b> Plätze übrig");
			$('#loadedContentBoxCloseButton').show(150);
			$('#ajaxLoadedContentClose').click(function(){

				$('#ajaxLoadedContentClose').hide( 150 );
				$('#loadedContentBox').slideUp(300);
				$('#eventDetails').slideUp(300);

			});
		}
	} );
}

function toggleLocationHint(){
	if( $('#locationHint').is('visible') ){
		$('#locationHint').slideUp(150);
		$('#ajaxLoadedContentClose').slideUp(150);
		$('#ajaxLoadedContentClose').click(function(){

			$('#ajaxLoadedContentClose').hide( 150 );
			$('#loadedContentBox').slideUp(300);
			$('#eventDetails').slideUp(300);

		});
	}
	else{
		$('#locationHint').slideDown(150);
		$('#ajaxLoadedContentClose').slideDown(150);
		$('#ajaxLoadedContentClose').off("click");
	}
}
