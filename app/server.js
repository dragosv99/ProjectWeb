var express = require("express");
var http = require("http");
var websocket = require("ws");
var game = require("./game");

var GamesCreated = 0;
var users = [];
var games = [];
var port = process.argv[2];
var app = express();

app.use(express.static(__dirname+"/static"));
app.get("/",function(req,res)
{
    res.sendFile("Splash-screen.html", {root: "./static"});
});

app.get("/game", function(req,res)
{
    res.sendFile("GameScreen", {root: "./static"});
});

var server = http.createServer(app);
const wss = new websocket.Server({server});

var currentGame = new game(++GamesCreated);
var ID = 0;
var playersOnline = 0;

wss.on("connection", function(ws)
{
    ID++;
    playersOnline++;
    console.log(ID);
    ws.send(playersOnline + "CONNECTED");
    ws.on("message", function incoming(message)
    {
        if(message.includes("Play"))
        {
            ws.id = ID;
            users[ID] = ws;
            if(currentGame.hasTwoConnectedPlayers())
            {
                currentGame = new game(++GamesCreated);
            }
            games[ID] = currentGame;
            currentGame.addPlayer(ID);
            if(currentGame.hasOnePlayerConnected())
            {
                ws.send("WAIT");
            }
            else
            {
                users[currentGame.fp].send("PLACE");
                users[currentGame.sp].send("PLACE");
            }
        }
        if(message.includes("DONE"))
        {
            if(games[ws.id].fp == ws.id)
            {
                games[ws.id].Aready = true;
            }
            else
            {
                games[ws.id].Bready = true;
            }
            if(games[ws.id].Aready == true && games[ws.id].Bready == true)
            {
                users[games[ws.id].fp].send("MOVE");
                users[games[ws.id].sp].send("OPTURN");
            }
        }
        if(message.includes("PC"))
        {
            console.log("from" + ws.id + "to " + currentGame.opponent(games[ws.id], ws.id));
            users[currentGame.opponent(games[ws.id], ws.id)].send(parseInt(message) + "VERIFY");
        }
        if(message.includes("MISS") || message.includes("HIT"))
        {
            console.log("GOOD");
            users[currentGame.opponent(games[ws.id], ws.id)].send(message);
            users[ws.id].send("MOVE");
        }
        if(message.includes("ILOST"))
        {
            users[currentGame.opponent(games[ws.id], ws.id)].send("WIN");
            users[ws.id].send("LOST");
        }
    });

});

server.listen(port);

console.log(`Server listening on port ${port}`);

