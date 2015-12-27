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
	getLocation();


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
			"latitude=" + position.coords.latitude + "+longitude=" + position.coords.longitude,
			"http://localhost:3000/radar",
			function(){

				console.log(position);

			}
		);
}
