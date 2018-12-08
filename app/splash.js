var main = function () {
    "use strict";
    

    $(".buttons").on("click", function(event) {
        
        var audio = new Audio('click.wav');
        audio.play();
    });

   $("#playButton").on("click", function(event){
    $(".buttons").hide();

    var $message = $("<p>");
    $message.text("Searching for opponent...");
    $message.hide();
    $("body").append($message);
    $message.fadeIn();

    function openGameScreen() {
        location.href = "GameScreen.html";
    };
     window.setTimeout(openGameScreen,3000);
    
});


};

$(document).ready(main);