function linha(){
    this.startX = null;
    this.startY = null;
    this.endX = null;
    this.endY = null;
    this.canal = null;

    this.draw = () => { 
        stroke(this.canal.color);
        fill("#333");
        ellipse(this.startX, this.startY, 3,3);
        line(this.startX, this.startY, this.endX, this.endY);
        ellipse(this.endX, this.endY, 3,3);
     }
}

function bateria(x,y, voltagem = 0){
    this.lower_node = new node(x,y);
    this.upper_node = new node(x, y - gridSize); 
    this.voltagem = voltagem;

    this.draw = () => {
        var thirdFr = this.upper_node.y + gridSize/3;
        fill("#333"); stroke("#333");
        ellipse(this.upper_node.x, this.upper_node.y, 5,5);
        line(this.upper_node.x, this.upper_node.y, this.upper_node.x, thirdFr);
        line(this.upper_node.x - gridSize/2, thirdFr, this.upper_node.x + gridSize / 2, thirdFr);
        line(this.upper_node.x - gridSize/4, thirdFr+10, this.upper_node.x + gridSize / 4, thirdFr+10);
        line(this.lower_node.x, this.lower_node.y, this.lower_node.x, thirdFr+10);        
        ellipse(this.lower_node.x, this.lower_node.y, 5,5);

    }
}

function resistor(x, y, resistencia = 0, horizontal){
    this.lower_node = new node(x,y);
    this.upper_node = new node(x, y - gridSize); 
    this.resistencia = resistencia;
    this.horizontal = horizontal;
    this.upper_canal = null;
    this.lower_canal = null;
    this.id = -1;

    this.draw = () => {
        fill("#333"); stroke("#333");
        ellipse(this.upper_node.x, this.upper_node.y, 5,5);
        line(this.upper_node.x, this.upper_node.y, this.upper_node.x, this.upper_node.y + 5);
        fill("#fff");
        rect(this.upper_node.x - gridSize/6, this.upper_node.y+5, gridSize/3, 30);
        fill("#333");
        line(this.lower_node.x, this.lower_node.y, this.lower_node.x, this.lower_node.y - 5);
        ellipse(this.lower_node.x, this.lower_node.y, 5,5);
        text("R"+this.id, this.lower_node.x+10, this.lower_node.y-5);
    }
}


function node(x = null,y = null){
    this.x = x;
    this.y = y;
}

function getClosestNode(x,y){
    return {
        x: x - x % gridSize,
        y: y - y % gridSize  
    };
}

function area(x,y,w,h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.contains = function (x, y) {
        return this.x <= x && x <= this.x + this.width &&
               this.y <= y && y <= this.y + this.height;
    }
}