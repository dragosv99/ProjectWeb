var express = require("express");
var http = require("http");
var websocket = require("ws");

var game = require("./game");
var gameStatus = require("./statTracker");

var userCounter = 0;
var users = [];
var parties = [];

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
app.get("/", function(_require, res){
    res.sendFile("Splash.html", {root: "./public"});
});

app.get("/game", function(_require, res){               //Access gamescreen with /game without .html
    res.sendFile("game.html", {root: "./public"});
});

var server = http.createServer(app);                    //Create server
const wss = new websocket.Server({ server });

var currentGame = new game(gameStatus.gamesInitilialized);
var connectionID = 0;

wss.on("connection", function(ws) {
    userCounter++;                                      //Increment user counter when user connects
    
    console.log("Users online : " + userCounter);       //Prints out the number of users online when user connects
     ws.onclose = function()
     {
             users[parties[0].opponent(parties[ws.id], ws.id)].send("LEFT");
            console.log("BYE");
     };
    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message);                //Prints to command the specific message
        if (message === "Ready"){

            ws.id = connectionID;
            connectionID++;
            users[ws.id] = ws;
            parties[ws.id] = currentGame;
            if (currentGame.hasTwoConnectedPlayers()){
                
                console.log("GAME " + gameStatus.gamesInitilialized + " HAS BEEN CREATED");
                gameStatus.gamesInitialized++;
                currentGame = new game(gameStatus.gamesInitilialized);
            }
            currentGame.addPlayer(ws.id);
            if(currentGame.hasOnePlayerConnected())
            {
                ws.send("WAIT");
            }
            else
            {
                users[currentGame.firstplayer].send("PLACE");
                users[currentGame.secondplayer].send("PLACE");
            }
        }

        if(message === "DONE")
        {
            if(ws.id === currentGame.firstplayer){
                currentGame.ADone = true;
            }
            else{
                currentGame.BDone = true;
            }

            if(currentGame.ADone === true && currentGame.BDone === true && currentGame.gamestarted === false){
                console.log("Game ready to start");
                
                currentGame.turn = ws.id;
                users[currentGame.firstplayer].send("GP");
            }
        }

        if (message.includes("PC")){
            //console.log(parseInt(message));
            users[currentGame.opponent(parties[ws.id], ws.id)].send(parseInt(message) + "PV");
        }

        if (message.includes("MISS")){
            users[currentGame.opponent(parties[ws.id], ws.id)].send(message);
            users[ws.id].send("GP");
        }

        if (message.includes("HIT")){
            users[currentGame.opponent(parties[ws.id], ws.id)].send(message);
            users[ws.id].send("GP");
        }
        if(message.includes("ILOST"))
        {
            users[currentGame.opponent(parties[ws.id],ws.id)].send("WIN");
            users[ws.id].send("LOST");
        }
    });

//    ws.onclose=function(event){
//        userCounter--;                                  //Increment user counter when user connects
//        console.log("Users online : " + userCounter);   //Prints out the number of users online when user disconnects
        
//         // Broadcast to everyone else.
//     wss.clients.forEach(function each(client) {
//        if (client !== ws && client.readyState === websocket.OPEN) {
//         client.send("usersonline: " + userCounter);     //Sends to every users in console number of users online
//         }
//     });
//     }
});


server.listen(port);