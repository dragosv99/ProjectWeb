var connection = new WebSocket("ws://localhost:3000");

connection.onmessage = function(event) {
    if(event.data.includes("CONNECTED"))
    {
        $("#online").text(`Players Online: ${parseInt(event.data)}`);
    }
};


var main = function () {
    "use strict";
    

    $(".buttons").on("click", function(event) {
        
        var audio = new Audio('media/click.wav');
        audio.play();
    });

    $("#playButton").on("click", function(event){
        $(".buttons").hide();

        var $message = $("<p>" , {class: "redirect"});
        $message.text("Searching for opponent...");
        $message.hide();
        $("body").append($message);
        $message.fadeIn();

        function openGameScreen() {
            location.href = "GameScreen.html";
        };
        window.setTimeout(openGameScreen,3000);
    
    });
    
    $("#howButton").on("click", function(event){
        $(".buttons").hide();

        var $message = $("<p>" , {class: "redirect"});
        $message.text("Redirecting...");
        $message.hide();
        $("body").append($message);
        $message.fadeIn();

        function openWikipedia() {
            location.href = "https://en.wikipedia.org/wiki/Battleship_(game)";
        };
        window.setTimeout(openWikipedia,1500);
    
    });

    


};

$(document).ready(main);