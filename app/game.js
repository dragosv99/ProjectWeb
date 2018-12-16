var game = function (gameID) 
{   //Game Class
    this.fp = null;
    this.sp = null;
    this.Aready = false;
    this.Bready = false;
    this.gameID = gameID;
    this.gamestarted = false;
};


game.prototype.getAready = function(){
    return this.ADone;
}

game.prototype.getBready = function(){
    return this.BDone;
}

game.prototype.getFP = function(){                 //Get method for class
    return this.fp;
};

game.prototype.getSP = function(){                //Get method for class
    return this.sp;
};

game.prototype.getGameID = function(){                      //Get method for class
    return this.gameID;
};

game.prototype.hasTwoConnectedPlayers = function()
{
    return (this.fp != null && this.sp != null);
}
game.prototype.hasOnePlayerConnected = function()
{
    return (this.sp == null || this.fp == null);
}

game.prototype.addPlayer = function(id){
    if (this.fp == null) 
    {
        this.fp = id;
    }
    else 
    {
        this.sp = id;
    }
};

module.exports = game;