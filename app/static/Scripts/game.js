var connection = new WebSocket("ws://localhost:3000");
var GAMEDONE = false;
var allowed = false;

mytable = [];
alive = [];
alive[0] = 0;
var shipno =1;
var rotate = 1;
var antirotate=0;
available = [];
for(let i = 1;i <= 3; i++) available[i] = 2;
for(var i = 1;i <= 10; i++)
{
    mytable[i]=[];
    for(var j = 0;j <= 9; j++)
    {
        mytable[i][j]=0;
    }
}
connection.onopen = function()
{
    connection.send("Play");
};
connection.onmessage = function(event)
{
    if(event.data === "LEFT")
    {
        connection.send("Play");
        return;
    }
    if(event.data === "MOVE")
    {
        $("#messageBox").val("Your turn");
        allowed = true;
        return;
    }
    if(event.data === "LOST")
    {
        document.getElementById("messageBox").innerHTML = "YOU LOST";
        DONE = true;
        return;
    }
    if(event.data === "WIN")
    {
        document.getElementById("messageBox").innerHTML = "It's Your turn";
        DONE = true;
        return;
    }
    if(event.data === "PLACE")
    {
        $("#messageBox").val("Place your ships");
    }
    if(event.data.includes("WAIT"))
    {
        $("#messageBox").val("Searching for opponent");
    }
    if(event.data.includes("VERIFY"))
    {
        console.log("I VERIFIED");
        let position = parseInt(event.data);
        let posx = parseInt(position/10)+1;
        let posy = position%10;
        if(mytable[posx][posy] != 0)
        {
            alive[mytable[posx][posy]] --;
            if(alive[mytable[posx][posy]] == 0)
            {
                for(var i=1;i<=10;i++){
                    for(var j=0;j<=9;j++)
                    {
                        if(mytable[i][j] === mytable[posx][posy])
                        {
                            document.getElementById((i-1)*10+j+"one").style.backgroundColor = '#696969';
                        }
                    }
                }
                connection.send(position+"HIT");
            }
            else
            {
                document.getElementById(position+"one").style.backgroundColor = '#dadce3';
                connection.send(position+"HIT");
            }
            var gamecontinues = false;
            for(let i=1;i<=6;i++)
            {
                if(alive[i] != 0) gamecontinues = false;
            }
            if(!gamecontinues) connection.send("ILOST");
        }
        else
        {
            connection.send(position+"MISS");
        }
    }
    if (event.data.includes("MISS")){
        let position = parseInt(event.data) + 'two';
        console.log(position);
        document.getElementById(position).style.backgroundColor = '#696969';
        $("#messageBox").val("It's opponent's turn");
    }
    if (event.data.includes("HIT")){
        let position = parseInt(event.data) + 'two';
        console.log(position);
        document.getElementById(position).style.backgroundColor = 'red';
        $("#messageBox").val("It's opponent's turn");
    }
    if (event.data.includes("OPTURN"))
    {
        $("#messageBox").val("It's the opponent's turn");
    }
}
function tableCreate(name){
    var body = document.body, table  = document.createElement('table');
    table.id = name; 
    var letter = "ABCDEFGHIJ";
    for(var i = 0; i <= 10; i++)
    {
        var tr = table.insertRow();
        for(var j = 0; j <= 10; j++){

            //var td = tr.insertCell();
            if (i == 0 && j != 0)
            {
                var nextChar = letter.charAt(j - 1);
                //td.appendChild(document.createTextNode(nextChar));
            }

            if (j == 0 && i != 0)
            {
                //td.appendChild(document.createTextNode(i));
            }

            if (j != 0 && i != 0)
            {
                var td = tr.insertCell();
                td.style.border = '5px solid black';
                td.id = ((i-1)*10 + j-1).toString();
                if(name == 'player1') td.id += "one";
                if(name == 'player2') td.id += "two";
            }
        }
    }
    body.appendChild(table);
}
function complete(type,coordx,coordy)
{
    mytable[coordx][coordy]=shipno;
    var position = (coordx-1)*10;
    position += coordy;
    if(type === 1)
    {
        document.getElementById((position).toString()+'one').style.backgroundColor = 'blue';
        alive[shipno]=1;
    }
    if(type === 2)
    {
        document.getElementById((position+rotate+10*antirotate).toString()+'one').style.backgroundColor = 'black';
        document.getElementById((position).toString()+'one').style.backgroundColor = 'black';
        mytable[coordx+antirotate][coordy+rotate]=shipno;
        alive[shipno]=2;
    }
    if(type === 3)
    {
        document.getElementById((position+rotate+10*antirotate).toString()+'one').style.backgroundColor = 'red';
        document.getElementById((position-rotate-10*antirotate).toString()+'one').style.backgroundColor = 'red';
        document.getElementById((position).toString()+'one').style.backgroundColor = 'red';
        mytable[coordx-antirotate][coordy-rotate]=shipno;
        mytable[coordx+antirotate][coordy+rotate]=shipno;
        alive[shipno]=3;
    }
    shipno++;
}
function verify(id,type)
{
    var coordx = parseInt(id/10+1);
    var coordy = id%10;
    if(type === 3)
    {
        if(mytable[coordx][coordy] === 1 || mytable[coordx+antirotate][coordy+rotate] === 1 || mytable[coordx-antirotate][coordy-rotate] === 1 ) return false;
        else return true;
    }
    if(type === 2)
    {
        if(mytable[coordx][coordy] === 1 || mytable[coordx+antirotate][coordy+rotate] === 1) return false;
        else return true;
    }
    if(type === 1)
    {
        if(mytable[coordx][coordy] === 1) return false;
        else return true;
    }
}
function completeout(type,coordx,coordy)
{
    var position = (coordx-1)*10;
    position += coordy;
    if(type == 1)
    {
        document.getElementById((position).toString()+'one').style.backgroundColor = 'transparent';
    }
    if(type == 2)
    {
        if(mytable[coordx+antirotate][coordy+rotate] == 0)document.getElementById((position+rotate+10*antirotate).toString()+'one').style.backgroundColor = 'transparent';
        document.getElementById((position).toString()+'one').style.backgroundColor = 'transparent';
    }
    if(type == 3)
    {
        if(mytable[coordx+antirotate][coordy+rotate] == 0)document.getElementById((position+rotate+10*antirotate).toString()+'one').style.backgroundColor = 'transparent';
        if(mytable[coordx-antirotate][coordy-rotate] == 0)document.getElementById((position-rotate-10*antirotate).toString()+'one').style.backgroundColor = 'transparent';
        document.getElementById((position).toString()+'one').style.backgroundColor = 'transparent';
    }
}
function completeover(type,coordx,coordy)
{
    var position = (coordx-1)*10;
    position += coordy;
    if(type == 1)
    {
        document.getElementById((position).toString()+'one').style.backgroundColor = 'purple';
    }
    if(type == 2)
    {
        if(mytable[coordx+antirotate][coordy+rotate] == 0)
        {
            document.getElementById((position).toString()+'one').style.backgroundColor = 'orange';
            document.getElementById((position+rotate+10*antirotate).toString()+'one').style.backgroundColor = 'orange';
        }
    }
    if(type == 3)
    {
        if(mytable[coordx-antirotate][coordy-rotate] == 0 && mytable[coordx+antirotate][coordy+rotate] == 0) 
        {
            document.getElementById((position+10*antirotate+rotate).toString()+'one').style.backgroundColor = 'green';
            document.getElementById((position-10*antirotate-rotate).toString()+'one').style.backgroundColor = 'green';
            document.getElementById((position).toString()+'one').style.backgroundColor = 'green';
        }
    }


}
var main = function start(){
    tableCreate('player1');
    tableCreate('player2');
    var type = 1;
    var noShipsAvailable = false;
    $("#type1").on("click" , function()
    {
        type = 1;
    });
    $("#type2").on("click" , function()
    {
        type = 2;
    });
    $("#type3").on("click" , function()
    {
        type = 3;
    });
    $("#rotate").on("click" , function()
    {
        rotate = 1-rotate;
        antirotate = 1-antirotate;
    });

    $("td").on("mouseover",function()
    {
        var position = parseInt(this.id);
        var posx = parseInt(position/10) +1;
        var posy = position%10;
        if(this.id.includes('one') && mytable[posx][posy] == 0)
        {
            if(type==1)
            {
               completeover(1,posx,posy);
            }
            if(type==3 && ((antirotate && posy>= 0 && posy<=9) || (rotate && posy>=1 && posy <=8)))
            {
                completeover(3,posx,posy);
            }
            if(type==2 && ((antirotate &&  posx<10) || (rotate && posy<9)))
            {
                completeover(2,posx,posy);
            } 
        }
    });
    $("td").on("mouseout", function()
     {
        var position = parseInt(this.id);
        var posx = parseInt(position/10) +1;
        var posy = position%10;
        if(this.id.includes('one') && mytable[posx][posy] == 0)
        {
        if(type===1)
        {
            completeout(1,posx,posy);
        }
        if(type===3)
        {
            completeout(3,posx,posy);
        }
        if(type===2)
        {
            completeout(2,posx,posy);
        }
        }
    });
    $("td").on("click" , function() {     

        //this.style.color = red;  
        //$("#result").html( this.id );   
        var cell = document.getElementById(this.id);
        if(this.id.includes('one'))
        {
            var position = parseInt(cell.id);
            var posx = parseInt(position/10) +1;
            var posy = position%10;
           if(type === 1 && verify(parseInt(cell.id),1) && available[type]) 
           {
               
                available[type] --;
                complete(1,posx,posy);

                $("#type1").text(`${available[type]} x UFO`);
                if(available[1] === 0)
                {
                    $("#type1").fadeOut();
                }
           }
           if(type === 2 && verify(parseInt(cell.id),2) && available[type] &&  ((antirotate && posx<=9) || (posy<9 && rotate))) 
           {
               
                available[type] --;
                complete(2,posx,posy);

                $("#type2").text(`${available[type]} x Space Shuttle`);
                if(available[2] === 0)
                {
                    $("#type2").fadeOut();
                }
           }
           if(type === 3 && verify(parseInt(cell.id),3) && available[type] && ((posy >= 0 && antirotate && posy<=9) || (posx>1 && posx<10 && rotate))) 
           {
               available[type]--;
               complete(3,posx,posy);

               $("#type3").text(`${available[type]} x Galactic Rocket`);
               if(available[3] === 0)
               {
                   $("#type3").fadeOut();
               }
           }

           if(available[1] == 0  && available[3] == 0 && available[2]  == 0 && noShipsAvailable === false)
           {
               noShipsAvailable = true;

               $("#rotate").fadeOut();
               var $newButton = $("<button>" , {id: "ready"});
               $newButton.text("READY!");
               $newButton.hide();
               $newButton.on("click", function()
               {
                   connection.send("DONE");
                   $("#messageBox").val("WAIT FOR OPPONENT TO PLACE SHIPS");
                   $("#ready").fadeOut();
               });
               $(".buttons").append($newButton);
               
               setTimeout(function() {
                $newButton.fadeIn();
               },1000);
               $("#messageBox").val("Press READY to continue!");
           }
        
        } 
        if (this.id.includes('two'))
        {
            if (allowed && !GAMEDONE)
            {
                connection.send(parseInt(cell.id) + 'PC');
                allowed = false;
            }
        }
        
    });
     // $("#messageBox").val("Place your ships!");
}
$(document).ready(main);
