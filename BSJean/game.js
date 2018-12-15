var game = function (gameID) {   //Game Class like in Java
    this.firstplayer = null;
    this.secondplayer = null;
    this.ADone = false;
    this.BDone = false;
    this.gameID = gameID;
    this.gamestarted = false;
    this.opponent = function (game,id){
        if (id === game.firstplayer){
            return game.secondplayer;
        }
        if (id === game.secondplayer){
            return game.firstplayer;
        }
    }
};

game.prototype.turnPlayer = function(){
    return this.turn;
}

game.prototype.getADone = function(){
    return this.ADone;
}

game.prototype.getBDone = function(){
    return this.BDone;
}

game.prototype.getFirstPlayer = function(){                 //Get method for class
    return this.firstplayer;
};

game.prototype.getSecondPlayer = function(){                //Get method for class
    return this.secondplayer;
};

game.prototype.getGameID = function(){                      //Get method for class
    return this.gameID;
};

game.prototype.hasTwoConnectedPlayers = function(){
    return (this.firstplayer != null && this.secondplayer != null);
}
game.prototype.hasOnePlayerConnected = function(){
    return (this.secondplayer == null);
}

game.prototype.addPlayer = function(p){
    if (this.firstplayer === null) {
        this.firstplayer = p;
        return "A";
    }
    else {
        this.secondplayer = p;
        return "B";
    }
};

module.exports = game;