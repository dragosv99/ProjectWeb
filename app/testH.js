function tableCreate(name){
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
                td.style.border = '2px solid black';
                td.id = ((i-1)*10 + j).toString();
                if(name == 'player1') td.id += "one";
                if(name == 'player2') td.id += "two";
            }
        }
    }
    body.appendChild(table);
}
mytable = [];
var rotate = 0;
available = [];
for(let i=1;i<=5;i++) available[i] = 2;
for(var i = 1;i<=10;i++){
    mytable[i]=[];
    for(var j=1;j<=10;j++)
    {
        mytable[i][j]=0;
    }
}
function verify(id,type)
{
    var coordx = parseInt(id/10+1);
    var coordy = id%10;
    if(type == 2)
    {
        if(mytable[coordx][coordy] === 1 || mytable[coordx][coordy+1] === 1 || mytable[coordx][coordy-1] === 1 ) return false;
        else return true;
    }
    if(type == 1)
    {
        if(mytable[coordx][coordy] === 1) return false;
        else return true;
    }
}
function complete(type,coordx,coordy)
{
    mytable[coordx][coordy]=1;
    var position = (coordx-1)*10;
    position += coordy;
    if(type == 1)
    {
        document.getElementById((position).toString()+'one').style.backgroundColor = 'blue';
    }
    if(type == 2)
    {
        document.getElementById((position+1).toString()+'one').style.backgroundColor = 'red';
        document.getElementById((position-1).toString()+'one').style.backgroundColor = 'red';
        document.getElementById((position).toString()+'one').style.backgroundColor = 'red';
        mytable[coordx][coordy+1]=1;
        mytable[coordx][coordy-1]=1;
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
        if(mytable[coordx][coordy+1] == 0)document.getElementById((position+1).toString()+'one').style.backgroundColor = 'transparent';
        if(mytable[coordx][coordy-1] == 0)document.getElementById((position-1).toString()+'one').style.backgroundColor = 'transparent';
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
        if(mytable[coordx][coordy-1] == 0 && mytable[coordx][coordy+1] == 0) 
        {
            document.getElementById((position+1).toString()+'one').style.backgroundColor = 'green';
            document.getElementById((position-1).toString()+'one').style.backgroundColor = 'green';
            document.getElementById((position).toString()+'one').style.backgroundColor = 'green';
        }
    }


}
var main = function start(){
    tableCreate('player1');
    tableCreate('player2');
    var type = 1;
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
           }
           else if(type === 2 && verify(parseInt(cell.id),2) && available[type] && parseInt(cell.id)%10 > 1) 
           {
               available[type]--;
               complete(2,posx,posy);
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
    $("td").on("mouseover",function()
    {
        var position = parseInt(this.id);
        var posx = parseInt(position/10) +1;
        var posy = position%10;
        if(this.id.includes('one') && mytable[posx][posy] == 0)
        {
            if(type===1)
            {
               completeover(1,posx,posy);
            }
            if(type===2 && position%10 > 1)
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
        if(this.id.includes('one') && mytable[posx][posy] == 0){
        if(type===1)
        {
            completeout(1,posx,posy);
        }
        if(type===2)
        {
            completeout(2,posx,posy);
        }}
      });
}
$(document).ready(main);
