// Váriaveis do DOM
var insBatBtn = document.getElementById('inserirBaterias');
var insResBtn = document.getElementById('inserirResistores');
var tensaoTotal = document.getElementById('tensaoTotal');
var corrente = document.getElementById('corrente');
var resTotal = document.getElementById('resTotal');
// Váriaveis do backbone
var inserindoBaterias = false;
var inserindoResistores = false;
var calculado = false;
var baterias = [];
var resistores = [];
var resistividade = matrix(5,5);
var admitancia = matrix(5,5);
var correntes = [];
var tensoes = [];
var impedancia = matrix(5,5);
var correnteTotal = matrix(5,5);
var ddp = matrix(5,5);
var resEquivalente = 0;

// Váriaveis da Visualização
var _linha = new linha();
var linhas = [];
var drawingLine = false;
var gridSize = 40;
var grid = [];
var canais = [
    {
        color: "#000",
        name: "GND",
        id: 0
    },
    {
        color: "#f00",
        name: "VCC",
        id: 1
    },
    {
        color: "#0f0",
        name: "Canal 1",
        id: 2
    },
    {
        color: "#00f",
        name: "Canal 2",
        id: 3
    },
    {
        color: "#f0f",
        name: "Canal 3",
        id: 4
    }
];
var canalAtual = 0;

function setup(){
    createCanvas(innerWidth, innerHeight);

    for(let row = 0; row < height / gridSize*2; row++){
        for(let col = 0; col < (width-280) / gridSize; col++){
            let x = row*gridSize, y = col*gridSize;
            rect(x-1, y-1, 3, 3);
            grid[`${x},${y}`] = (new node(x,y));
        }        
    }
}

function draw(){
    // Background
    background(255);
    // Cor do grid
    stroke(240);
    // Translando ínicio do grid para dar espaço para os botões
    translate(280,0);
    // Preenchimento do grid
    fill("#fff");

    // Grid
    for(let col = 0; col < (width-280)/gridSize; col++){
        line(col*gridSize, 0, col*gridSize, height);
    }
    for(let row = 0; row < height/gridSize; row++){
        line(0,row*gridSize,width, row*gridSize);
    }

    // Nodes 
    stroke(220);
    for (var node in grid) {    
        node = grid[node];
        rect(node.x - 1, node.y - 1, 3, 3);
    }
    
    // Translando de volta para o início
    stroke(33);
    translate(-280, 0);
    
    // Linhas
    linhas.forEach(linha => linha.draw());

    // Baterias
    if(drawingLine){
        let point = getClosestNode(mouseX, mouseY);
        stroke(canais[canalAtual].color);
        line(_linha.startX, _linha.startY, point.x, point.y);
    } 
    else if(mouseX > 280){
        let point = getClosestNode(mouseX, mouseY);
        if(inserindoBaterias){
            let bat = new bateria(point.x, point.y);
            bat.draw();
        }
        else if(inserindoResistores){
            let res = new resistor(point.x, point.y);
            res.draw();
        } else {
            // Node atual
            stroke("#999");
            fill("#666");
            rect(point.x-3, point.y-3, 5, 5);
        }
    }
    // Desenha todas as baterias na tela
    baterias.forEach(bateria => bateria.draw());
    // Desenha todos os resistores na tela
    resistores.forEach(resistor => resistor.draw());
    // Soma todas as tensões
    tensao = baterias.reduce((prev, curr) =>  prev + parseInt(curr.voltagem), 0);
    tensaoTotal.innerHTML = tensao + "V";

    // Seleção de canal
    fill(canais[canalAtual].color);
    rect(width-60, 10, 50, 50);
    strokeWeight(0);
    text(canais[canalAtual].name, width-60, 80);
    strokeWeight(1);

    // Checando se o mouse está em cima de um resistor
    resistores.forEach( resistor => {
        let area_ = new area(resistor.upper_node.x - gridSize/2, resistor.upper_node.y, gridSize, gridSize);
        if(area_.contains(mouseX, mouseY)){
            fill("rgba(200,200,200,0.8)");
            strokeWeight(0);
            rect(mouseX-100, mouseY-100, 100, 100);
            fill("#333");
            if(calculado){
                text("DDP: " + ddp[resistor.upper_canal.id][resistor.lower_canal.id].toFixed(2) + "V", mouseX-90, mouseY-80);
                if(resistor.id > 0)
                    text("Corrente: " + (correntes[resistor.id] == undefined ? 0 :correntes[resistor.id].toFixed(2)) +"A", mouseX-90, mouseY-65);
            }
            text("Resistência: " + resistor.resistencia +"Ω" , mouseX-90, mouseY-50);
            
            strokeWeight(1);
        }
    });

}

function keyPressed(){
    console.log(keyCode);
    if(keyCode == 90){
        linhas.pop();
        console.log("Linhas", linhas);
    } else if(keyCode == 88){
        baterias.pop();
    } else if(keyCode == 39){
        if(canalAtual < 4)
            canalAtual++;
        else
            canalAtual = 0;
    } else if(keyCode == 37){
        if(canalAtual > 0)
            canalAtual--;
        else
            canalAtual = 4;
    }
}

function mousePressed(){
    if(mouseX < 280){return;}
    let point = getClosestNode(mouseX, mouseY);
    if(inserindoBaterias){
        let volt = prompt("Voltagem da bateria");
        baterias.push(new bateria(point.x, point.y, volt));
        return;
    } else if(inserindoResistores){
        let res = prompt("Resistência");
        let res_ = new resistor(point.x, point.y, res);
        res_.id = resistores.length;
        resistores.push(res_);
        return;
    }
    _linha.startX = point.x;
    _linha.startY = point.y;
    drawingLine = true;
}

function mouseReleased(){
    if(mouseX < 280 || !drawingLine){ return;}
    let point = getClosestNode(mouseX, mouseY);
    _linha.endX = point.x;
    _linha.endY = point.y;
    _linha.canal = canais[canalAtual];
    linhas.push(_linha);
    _linha = new linha();
    drawingLine = false;    
}

/* FUNÇÕES DO DOM */
function inserirDados(){
    if(!inserindoBaterias){
        insBatBtn.className = 'active';
        inserindoBaterias = true;
    } else {
        insBatBtn.className = '';
        inserindoBaterias = false;        
    }

}

function inserirResistores(){
    if(!inserindoResistores){
        insResBtn.className = 'active';
        inserindoResistores = true;
    } else {
        insResBtn.className = '';
        inserindoResistores = false;        
    }
}

function calcular(){
    calculado = true;
    // Calculando resistividades
    resistores.forEach((resistor,i) => {
        let canal_upper = linhas.find( linha => {
            if(linha.startX == resistor.upper_node.x && linha.startY == resistor.upper_node.y){
                return true;
            } else if (linha.endX == resistor.upper_node.x && linha.endY == resistor.upper_node.y){
                return true;
            }
        }).canal;

        let canal_lower = linhas.find( linha => {
            if(linha.startX == resistor.lower_node.x && linha.startY == resistor.lower_node.y){
                return true;
            } else if (linha.endX == resistor.lower_node.x && linha.endY == resistor.lower_node.y){
                return true;
            }
        }).canal;

        resistores[i].lower_canal = canal_lower;
        resistores[i].upper_canal = canal_upper;
        
        let prev = resistividade[canal_lower.id][canal_upper.id];
        if(prev == 0){
            resistividade[canal_lower.id][canal_upper.id] = [resistor.resistencia]; 
            resistividade[canal_upper.id][canal_lower.id] = [resistor.resistencia]; 
        } else {
            resistividade[canal_lower.id][canal_upper.id].push(resistor.resistencia);            
            resistividade[canal_upper.id][canal_lower.id].push(resistor.resistencia);            
        }
    });

    // Calculando resistência equivalente
    for(let row = 0; row < 5; row++){
        for(let col = 0; col < 5; col++){
            if(resistividade[row][col] != 0){
                resistividade[row][col] = 1 / resistividade[row][col].reduce(
                    (soma, atual) => atual != parseFloat(0) ? 1 / parseFloat(atual) : 0, 0
                )
            }
        }
    }

    // Canais em uso
    let canaisUsados = [];
    linhas.forEach(linha => {
        if(canaisUsados.find( id => id == linha.canal.id) == undefined)
            canaisUsados.push(linha.canal.id)
    });
    canaisUsados = canaisUsados.length;
    // console.log("Resistividade", pM(resistividade));
    // Transformada de Norton
    for(i = 1; i < canaisUsados; i++){
		if(i > 1){
			if(resistividade[i][1] != 0){
                // console.log("entrou", tensao / resistividade[i][1]);
				correntes.push(tensao / resistividade[i][1]);
			} else {
				correntes.push(0);
			}
		} else {
			if(resistividade[i - 1][1] != 0){
				correntes.push(tensao/resistividade[i-1][1]);
			} else {
                correntes.push(0);
            }
		}
    }
    // console.log("Correntes\t", correntes);
    // Admitancia
    // console.log("Canais Usados\t",canaisUsados);
    for(i = 2; i < canaisUsados; i++){
		for(j = 2; j < canaisUsados; j++){
			if(i == j){ continue; }
			if (resistividade[i][j] != 0)
				admitancia[i-1][j-1] = - 1 / resistividade[i][j]; 
		}
    }
    // console.log('Passo 1\t', pM(admitancia));
    for(i = 1; i < canaisUsados - 1; i++){
		if (resistividade[0][i+1] != 0)
			admitancia[0][i] = - 1 / resistividade[0][i+1];
		admitancia[i][0] = admitancia[0][i];
    }
    // console.log('Passo 2\t', pM(admitancia));
    for(i = 1; i < canaisUsados - 1; i++){
		if (resistividade[i + 1][1] != 0)
			admitancia[i][0] = admitancia[i][0] - 1 / resistividade[i + 1][1];
		admitancia[0][i] = admitancia[i][0];
    }
    // console.log('Passo 3\t', pM(admitancia));
    for(i = 0; i < canaisUsados - 1; i++){
       for(j = 0; j < canaisUsados - 1; j++){
            if(i == j){ continue; }
            admitancia[i][i] = admitancia[i][i] - admitancia[i][j];
            if (admitancia[i][i] < 0){
                admitancia[i][i] = admitancia[i][i] * -1;
            }
        }
    }
    // console.log('Passo 4\t', pM(admitancia));
    
    var inversa = matrix(canaisUsados,canaisUsados);
    var inversaMini = matrix(canaisUsados-2, canaisUsados-2);
    // for(i = 0; i < (canaisUsados - 2); i++){
	// 	for(j = 0; j < (canaisUsados - 2); j++){
	// 		inversa[i][j] = 1;
	// 	}
    // }
    var ratio, a;

    for(i = 0; i < (canaisUsados - 1); i++){
		for(j = 0; j < (canaisUsados - 1); j++){
			if (admitancia[i][i] < 0){
				admitancia[i][i] = admitancia[i][i] * -1;
			}
			inversa[i][j] = admitancia[i+1][j+1];	
		}
    }
    for(i = 0; i < (canaisUsados - 2); i++){
		for(j = 0; j < (canaisUsados - 2); j++){
			inversaMini[i][j] = inversa[i][j];
		}
    }
    // console.log('Passo 5\t', math.matrix(inversa));

    inversa = math.inv(inversaMini);
    var n = canaisUsados - 2;
    // console.log("Inv\t",inversa);

    var x = tensoes;
    // console.log("Tensões", x);
    for(i = 0; i < n; i++){
    	tensoes[i] = 0;
    	for(j = 0; j < n; j++){
    		tensoes[i] = tensoes[i] + correntes[j+1] * inversa[i][j];
		}
    }
    
	for(i = (canaisUsados-1); i >= 2; i--){
		tensoes[i] = tensoes[i-2];	
    }
    
	tensoes[1] = tensao;
	tensoes[0] = 0; 
    var cTotal = 0;
    
	for(i = 0; i < canaisUsados; i++){
		for(j = 0; j < canaisUsados; j++){
			ddp[i][j] = tensoes[i] - tensoes[j];
		}
	}
	for(i = 0; i < canaisUsados; i++){
		for(j = 0; j < canaisUsados; j++){
			if(resistividade[i][j] != 0)
				correnteTotal[i][j] = ddp[i][j] / resistividade[i][j];
			if (i == j)
				correnteTotal[i][j] = 0;
				
		}
	}	
	for(i = 0; i < canaisUsados; i++){
		if(correnteTotal[i][1] < 0){
			cTotal += correnteTotal[i][1] * -1;	
		}else{
			cTotal += correnteTotal[i][1];
		}
	}
    resEquivalente = tensao / cTotal;

    corrente.innerHTML = cTotal.toFixed(2) + "A";
    resTotal.innerHTML = resEquivalente + "Ω";
    return 0;
} 


function matrix(x,y) {
    var arr = [];
    for(var i = 0; i < y; i++) {
        arr.push(Array(x).fill(0));
    }
    return arr; 
}

function pM(m){
    var str = "\n";
    for(i = 0; i < 5; i++){
		for(j = 0; j < 5; j++){
			str += m[i][j].toFixed(2) + " ";
        }
        str += "\n";
    }
    return str;
}