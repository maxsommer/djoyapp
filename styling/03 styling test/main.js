(function(){

	/*
	*	Djoya; Styling Test;
	*	12. Dezember 2015
	*/

	var dot = document.querySelectorAll('.dot');
	var checkbox = document.querySelectorAll('input[type=checkbox]');
	var nav = document.querySelector('nav');
	var navtoggle = document.querySelector('#navtoggle');

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
