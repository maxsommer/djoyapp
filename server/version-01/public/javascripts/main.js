(function(){

	/*
	*	Djoya; Styling Test;
	*	12. Dezember 2015
	*/

	var dot = document.querySelectorAll('.dot');
	var checkbox = document.querySelectorAll('input[type=checkbox]');
	var nav = document.querySelector('nav');
	var navtoggle = document.querySelector('#navtoggle');
	var meSymbolText = document.querySelector("#meSymbolText");
	var actionButton = document.querySelector("#actionButton");
	var refreshButton = document.querySelector("#refreshButton");
	var eventContainer = document.querySelector("#eventContainer");

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


// create WebAudio API context
var context = new AudioContext()
// Create lineOut
var lineOut = new WebAudiox.LineOut(context)


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
					console.log("Leider gibt es aktuell keine Events in deiner Nähe.");
				}
				else{
					events.forEach(function(event){

						var eventPositionX = event.locationLongitude;
						var eventPositionY = event.locationLatitude;

						var currentPositionX = position.coords.longitude;
						var currentPositionY = position.coords.latitude;

						var eventPositionScreenX = eventPositionX.map( currentPositionX-0.015, currentPositionX+0.015, 0, 100 );
						var eventPositionScreenY = eventPositionY.map( currentPositionY-0.01, currentPositionY+0.01, 0, 100 );
						console.log( eventPositionScreenX + "\n" + eventPositionScreenY );

						eventContainer.innerHTML += "<a class=\"event\" href=\"/details/" + event.id + "\" style=\"left: "+ eventPositionScreenX +"%; bottom: "+ eventPositionScreenY +"%\"></a>";

					});
				}

			}
		);
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
