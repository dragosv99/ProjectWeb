var socket = new WebSocket("ws://localhost:3000");
var DONE = false
var permission = false;
socket.onopen = function(){         //If users clicks on start, the message "Ready" is sent
    socket.send("Ready");
}
socket.onmessage = function(event){
    if(event.data === "LEFT")
    {
        // document.getElementById("para").innerHTML = "You Left";
        socket.send("Ready");
    }
    if (event.data === "GP"){
        document.getElementById("para").innerHTML = "It's Your turn";
        permission = true;
    }

    if(event.data === "LOST")
    {
        document.getElementById("para").innerHTML = "GAME LOST";
        DONE = true;
        return;
    }

    if(event.data === "WIN")
    {
        document.getElementById("para").innerHTML = "GAME WON";
        DONE = true;
        return;
    }

    if(event.data === "PLACE")
    {
        document.getElementById("para").innerHTML = "Place your ships";
    }
    if(event.data === "WAIT")
    {
        document.getElementById("para").innerHTML = "Searching for opponent";
    }

    if (event.data.includes("PV")){
        let position = parseInt(event.data);
        let posx = parseInt(position/10)+1;
        let posy = position%10;
        if (mytable[posx][posy] != 0)
        {
            alive[mytable[posx][posy]] --;
            if(alive[mytable[posx][posy]] === 0)
            {
                for(var i=0;i<=10;i++)
                    for(var j=0;j<=10;j++)
                    {
                        if(mytable[i][j] === mytable[posx][posy])
                        {
                            document.getElementById((i-1)*10+j+"one").style.backgroundColor = 'black';
                        }
                    }
                socket.send(position + "HIT");
            }
            else
            {
                document.getElementById(position+"one").style.backgroundColor = 'grey';
                socket.send(position + "HIT");
            }
            var gamecontinues = false;
            for(let i=1;i<=3;i++)
            {
                if(alive[i] != 0) gamecontinues = true;
            }
            if(!gamecontinues)
            {
                socket.send("ILOST");
            }
        }
        else
        {
            socket.send(position + "MISS");
        }
    }

    if (event.data.includes("MISS")){
        let position = parseInt(event.data) + 'two';
        console.log(position);
        document.getElementById(position).style.backgroundColor = 'grey';
        document.getElementById("para").innerHTML = "It's the opponent's turn";
    }

    if (event.data.includes("HIT")){
        let position = parseInt(event.data) + 'two';
        console.log(position);
        document.getElementById(position).style.backgroundColor = 'red';
        document.getElementById("para").innerHTML = "It's the opponent's turn";
    }
}

function tableCreate(name){         //Create the javasacript table
    var body = document.body, table  = document.createElement('table');
    table.id = name; 
    var letter = "ABCDEFGHIJ";
    for(var i = 0; i <= 10; i++)
    {
        var tr = table.insertRow();
        for(var j = 0; j <= 10; j++){

            var td = tr.insertCell();
            if (i == 0 && j != 0)
            {
                var nextChar = letter.charAt(j - 1);
                td.appendChild(document.createTextNode(nextChar));
            }

            if (j == 0 && i != 0)
            {
                td.appendChild(document.createTextNode(i));
            }

            if (j != 0 && i != 0)
            {
                td.style.border = '2px solid red';
                td.id = ((i-1)*10 + j-1).toString();
                if(name == 'player1') td.id += "one";
                if(name == 'player2') td.id += "two";
            }
        }
    }
    body.appendChild(table);
}

mytable = [];
var rotate = 0;
var antirotate = 1 - rotate;
var shipindex=1;
var alive = [0];
type  = 1;
available = [];
for(let i=1;i<=5;i++) 
{
    available[i] = 1;
}

for(var i = 0; i <= 10; i++){           //Create the matrix that contains 0 if empty cell or 1 if occupied
    mytable[i]=[];
    for(var j = 0; j <= 10; j++)
    {
        mytable[i][j]=0;
    }
}

function verify(id,type)
{
    var coordx = parseInt(id/10+1);
    var coordy = id%10;

    if(type == 1)
    {
        if(mytable[coordx][coordy] === 0 && mytable[coordx+rotate][coordy+antirotate] === 0) return true;
        else return false;
    }

    if(type == 2)
    {
        if(mytable[coordx][coordy] === 0 && mytable[coordx+rotate][coordy+antirotate] === 0 && mytable[coordx-rotate][coordy-antirotate] === 0 ) return true;
        else return false;
    }

    if(type == 3)
    {
        if(mytable[coordx][coordy] === 0 && mytable[coordx+rotate][coordy+antirotate] === 0 && mytable[coordx + (2*rotate)][coordy+(2*antirotate)] === 0 && mytable[coordx + (3*rotate)][coordy+(3*antirotate)] === 0) return true;
        else return false;
    }
}

function complete(type,coordx,coordy)
{
    mytable[coordx][coordy]=shipindex;
    var position = (coordx-1)*10;
    position += coordy;
    
    if(type == 1)
    {
        document.getElementById((position).toString()+'one').style.backgroundColor = '#84DE02';
        document.getElementById((position + antirotate+10*rotate).toString()+'one').style.backgroundColor = '#84DE02';
        
        mytable[coordx+rotate][coordy+antirotate]=shipindex;
        alive[shipindex] = 2;

    }

    if(type == 2)
    {
        document.getElementById((position + antirotate + 10*rotate).toString()+'one').style.backgroundColor = '#A0E6FF';
        document.getElementById((position - antirotate - 10*rotate).toString()+'one').style.backgroundColor = '#A0E6FF';
        document.getElementById((position).toString()+'one').style.backgroundColor = '#A0E6FF';
    
        mytable[coordx + rotate][coordy + antirotate]=shipindex;
        mytable[coordx - rotate][coordy - antirotate]=shipindex;
        alive[shipindex] = 3;
    }

    if(type == 3)
    {
        document.getElementById((position + (3*antirotate) + 30*rotate).toString()+'one').style.backgroundColor = '#770909';
        document.getElementById((position + (2*antirotate) + 20*rotate).toString()+'one').style.backgroundColor = '#770909';
        document.getElementById((position + antirotate + 10*rotate).toString()+'one').style.backgroundColor = '#770909';
        document.getElementById((position).toString()+'one').style.backgroundColor = '#770909';
    
        mytable[coordx + (3*rotate)][coordy + (3*antirotate)]=shipindex;
        mytable[coordx + (2*rotate)][coordy + (2*antirotate)]=shipindex;
        mytable[coordx + rotate][coordy + antirotate]=shipindex;
        alive[shipindex] = 4;
    }
    shipindex++;
}

function rotationvalidation1(rotate,posx,posy)
{
    return (posy >= 0 && (1-rotate) && posy<=8)||(rotate && posx>=1 && posx<10);
}

function rotationvalidation2(rotate,posx,posy)
{
    return (posy >= 1 && (1-rotate) && posy<=8)||(rotate && posx>1 && posx<10);
}

function rotationvalidation3(rotate,posx,posy)
{
    return (posy >= 0 && (1-rotate) && posy<=6)||(rotate && posx>=1 && posx<=7);
}

function completeout(type,coordx,coordy)
{
    var position = (coordx-1)*10;
    position += coordy;
    if(type == 1)
    {
        if(mytable[coordx+rotate][coordy+antirotate] == 0)
        {
            document.getElementById((position).toString()+'one').style.backgroundColor = '';
            document.getElementById((position + antirotate+ (10*rotate)).toString()+'one').style.backgroundColor = '';
        }
    }

    if(type == 2)
    {
        if(mytable[coordx-rotate][coordy-antirotate] == 0)
        {
            document.getElementById((position-antirotate-10*rotate).toString()+'one').style.backgroundColor = '';
            document.getElementById((position).toString()+'one').style.backgroundColor = '';
        }

        if(mytable[coordx+rotate][coordy+antirotate] == 0)
        {
            document.getElementById((position+antirotate+10*rotate).toString()+'one').style.backgroundColor = '';
        }
    }

    if(type == 3)
    {
        if(mytable[coordx + rotate][coordy + antirotate] == 0)
        {
            document.getElementById((position).toString()+'one').style.backgroundColor = '';
            document.getElementById((position+antirotate+10*rotate).toString()+'one').style.backgroundColor = '';
        }

        if(mytable[coordx + (2*rotate)][coordy + (2*antirotate)] == 0)
        {
            document.getElementById((position + (2*antirotate) + 20*rotate).toString()+'one').style.backgroundColor = '';
        }

        if(mytable[coordx + (3*rotate)][coordy + (3*antirotate)] == 0)
        {
            document.getElementById((position + (3*antirotate) + 30*rotate).toString()+'one').style.backgroundColor = '';
        }
    }
}

function completeover(type,coordx,coordy)
{
    var position = (coordx-1)*10;
    position += coordy;

    if(type == 1)
    {
            document.getElementById((position).toString()+'one').style.backgroundColor = 'white';
            document.getElementById((position + antirotate + 10*rotate).toString()+'one').style.backgroundColor = 'white';
    }

    if(type == 2)
    {
        if(mytable[coordx+rotate][coordy+antirotate] == 0 && mytable[coordx-rotate][coordy-antirotate] == 0) 
        {
            document.getElementById((position + antirotate + 10*rotate).toString()+'one').style.backgroundColor = 'white';
            document.getElementById((position - antirotate - 10*rotate).toString()+'one').style.backgroundColor = 'white';
            document.getElementById((position).toString()+'one').style.backgroundColor = 'white';
        }
    }

    if(type == 3)
    {
        if(mytable[coordx+rotate][coordy+antirotate] == 0 && mytable[coordx + (2*rotate)][coordy + (2*antirotate)] == 0 && mytable[coordx + (3*rotate)][coordy + (3*antirotate)] == 0) 
        {
            document.getElementById((position + (3*antirotate) + 30*rotate).toString()+'one').style.backgroundColor = 'white';
            document.getElementById((position + (2*antirotate) + 20*rotate).toString()+'one').style.backgroundColor = 'white';
            document.getElementById((position + antirotate + 10*rotate).toString()+'one').style.backgroundColor = 'white';
            document.getElementById((position).toString()+'one').style.backgroundColor = 'white';
        }
    }
}

var main = function start(){
    tableCreate('player1');
    tableCreate('player2');
    $("td").on("click" , function() {     
  
        var cell = document.getElementById(this.id);
        if(this.id.includes('one')){
            var position = parseInt(cell.id);
            var posx = parseInt(position/10) + 1;
            var posy = position % 10;
            
           if(type === 1 && verify(position,1) && available[type] && rotationvalidation1(rotate, posx, posy)) 
           {
                available[type] --;
                complete(1,posx,posy);
           }
           else if(type === 2 && verify(position,2) && available[type] && rotationvalidation2(rotate, posx, posy)) 
           {
               available[type]--;
               complete(2,posx,posy);
           }

           else if(type === 3 && verify(position,3) && available[type] && rotationvalidation3(rotate, posx, posy)) 
           {
               available[type]--;
               complete(3,posx,posy);
           }
        } 

        if (this.id.includes('two')){
            if (permission && !DONE){
                socket.send(parseInt(cell.id) + 'PC');
                permission = false;
                document.getElementById("para").innerHTML = "Opponent's turn";
            }
        }
    });

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
    $("#done").on("click", function()
    {
        var ok = true;
        for(let i=1;i<=3;i++)
        {
            if(available[i] != 0 ) ok = false;
        }
        if(ok)
        {
            socket.send("DONE");
            console.log("DONE");
        }
    });

    $("#rotate3").on("click", function()
    {
        rotate = 1-rotate;
        antirotate = 1 - antirotate;
    });

    $("td").on("mouseover",function()
    {
        var position = parseInt(this.id);
        var posx = parseInt(position/10) +1;
        var posy = position % 10;
        if(this.id.includes('one') && mytable[posx][posy] === 0 && available[type] != 0)
        {
            if(type===1 && rotationvalidation1(rotate,posx,posy))
            {
               completeover(1,posx,posy);
            }
            if(type===2 && rotationvalidation2(rotate,posx,posy))
            {
                completeover(2,posx,posy);
            }
            if(type===3 && rotationvalidation3(rotate,posx,posy))
            {
                completeover(3,posx,posy);
            } 
        }
    });

    $("td").on("mouseout", function()
    {
        var position = parseInt(this.id);
        var posx = parseInt(position/10) +1;
        var posy = position % 10;
        if(this.id.includes('one') && mytable[posx][posy] === 0)
        {
            if(type===1 && available[type] != 0)
            {
                completeout(1,posx,posy);
            }
            if(type===2 && available[type] != 0)
            {
                completeout(2,posx,posy);
            }

            if(type===3 && available[type] != 0)
            {
                completeout(3,posx,posy);
            }
        }
    });
}

$(document).ready(main);

$(document).ready(function(e) {
    var height = $(document).height();

    function goRight() {
        $("#animate").animate({
        top: height - 165 
      }, 5000, function() {
         setTimeout(goLeft, 50);
      });
    }
    function goLeft() {
        $("#animate").animate({
        top: 0
      }, 1000, function() {
         setTimeout(goRight, 50);
      });
    }

    setTimeout(goRight, 50);
});