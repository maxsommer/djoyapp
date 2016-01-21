function nextPage(){
	window.location.href = "radar.html";
}

$(function() {
	var pull 		= $('#pull');
		menu 		= $('nav ul');
		menuHeight	= menu.height();

	$(pull).on('click', function(e) {
		e.preventDefault();
		menu.slideToggle();
	});

	$(window).resize(function(){
		var w = $(window).width();
		if(w > 320 && menu.is(':hidden')) {
			menu.removeAttr('style');
		}
	});
});

$(window).resize(function(){
    var w = $(window).width();
    if(w > 320 && menu.is(':hidden')) {
        menu.removeAttr('style');
    }
}); 

$(function() {

    var ul = $(".slider ul");
    var slide_count = ul.children().length;
    var slide_width_pc = 100.0 / slide_count;
    var slide_index = 0;

    ul.find("li").each(function(indx) {
        var left_percent = (slide_width_pc * indx) + "%";
        $(this).css({"left":left_percent});
        $(this).css({width:(100 / slide_count) + "%"});
    });

    // Listen for click of prev button
    $(".slider .prev").click(function() {
        slide(slide_index - 1);
    });

    // Listen for click of next button
    $(".slider .next").click(function() {
        slide(slide_index + 1);
    });

    $(".button-container .circle0").click(function() {
        slide(slide_index = 0);
    });

    $(".button-container .circle1").click(function() {
        slide(slide_index = 1);
    });

    $(".button-container .circle2").click(function() {
        slide(slide_index = 2);
    });

    function slide(new_slide_index) {

        if(new_slide_index < 0 || new_slide_index >= slide_count) return; 

        var margin_left_pc = (new_slide_index * (-100)) + "%";

        ul.animate({"margin-left": margin_left_pc}, 400, function() {

        slide_index = new_slide_index

        if(slide_index == 0){
            $(".button-container .circle0").addClass("active");
            $(".button-container .circle1").removeClass('active');
            $(".button-container .circle2").removeClass('active');
        }
        else if(slide_index == 1){
            $(".button-container .circle1").addClass("active");
            $(".button-container .circle0").removeClass('active');
            $(".button-container .circle2").removeClass('active');
        } 
        else if(slide_index == 2){
            $(".button-container .circle2").addClass("active");
            $(".button-container .circle1").removeClass('active');
            $(".button-container .circle0").removeClass('active');
        }

        });
    }
});

