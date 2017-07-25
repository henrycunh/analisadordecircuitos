function linha(){
    this.startX = null;
    this.startY = null;
    this.endX = null;
    this.endY = null;

    this.draw = () => { line(this.startX, this.startY, this.endX, this.endY); }
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