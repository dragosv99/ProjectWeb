var express = require("express");
var http = require("http");
var websocket = require("ws");
var game = require("./game");
var ejs = require("ejs");
var cookieParser = require('cookie-parser')


var GamesCreated = 0;
var gamesPlayed = 0;
var users = [];
var games = [];
var port = process.argv[2];
var app = express();

function opponent (game,id)
{
    if (id === game.fp)
    {
        return game.sp;
    }
    return game.fp;
}

app.use(cookieParser());
app.use(express.static(__dirname+"/static"));
app.get("/",function(req,res)
{


    var cookie = req.cookies;
    if(cookie.visits)
    {
        cookie.visits++;
    }
    else
    {
        cookie.visits = 1;
    }
    res.cookie('visits',cookie.visits).render("Splash-screen.ejs", {nPlayers : playersOnline,nGames : gamesPlayed, n: cookie.visits});
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
    playersOnline++;
    if(playersOnline == 1) currentGame = new game(++GamesCreated);
    ws.send(playersOnline + "CONNECTED");
    ws.onclose = function()
    {
        playersOnline--;
        if(opponent(games[ws.id],ws.id) != null && playersOnline > 0 && users[opponent(games[ws.id],ws.id)].readyState === websocket.OPEN){
        users[opponent(games[ws.id], ws.id)].send("LEFT");
        }
    }
    ws.on("message", function incoming(message)
    {
        if(message.includes("PLAY"))
        {
            if(playersOnline % 2 == 1) currentGame = new game(++GamesCreated);
            ID++;
            console.log(ID);
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
            console.log("from" + ws.id + "to " + users[opponent(games[ws.id], ws.id)]);
            users[opponent(games[ws.id], ws.id)].send(parseInt(message) + "VERIFY");
        }
        if(message.includes("MISS") || message.includes("HIT"))
        {
            console.log("GOOD");
            users[opponent(games[ws.id], ws.id)].send(message);
            users[ws.id].send("MOVE");
        }
        if(message.includes("ILOST"))
        {
            gamesPlayed++;
            users[opponent(games[ws.id], ws.id)].send("WIN");
            users[ws.id].send("LOST");
        }
    });

});

server.listen(port);

console.log(`Server listening on port ${port}`);

