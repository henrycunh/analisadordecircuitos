#include <stdio.h>
#include <math.h>
#include <conio.h>

struct ramO{
	int numRamos;
	float resTotal[100];
	float rEqui;
	float correnteTotal;
	float tensao;
};

typedef struct ramO ramo;

float matrix[25][25],
		 inverse[25][25], 
		 correntes[25], 
		 voltagem = 0, 
		 volts, 
		 tensoes[25], 
		 reseq;

int numeroNos;

ramo ramos[50][50];

float fillNode(float tensao, int nNos);
float determinant(float [][25], float);
void cofactor(float [][25], float);
void transpose(float [][25], float [][25], float);
void mostraTensao();
void mostraCorrente();

int x, item, dados = 0, bat, res, i, j, k, l;
char disp;

void menu(void);
void dadosin(void);

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main() {
	system("cls");
	do{
		menu();
		switch(item){
			case 1:
				dadosin();
				break;
			case 2:
				if(!dados){
					printf("\nNao houve entrada de dados!\n");
					printf("Pressione um tecla!");
					while(!kbhit()){}
				}
				else{
					printf("\nTensao total das fontes: %7.3fV\n", voltagem);
					printf("Pressione uma tecla!");
					while(!kbhit()){}
				}
				
				break;
			case 3:
				if(!dados){
					printf("\nNao houve entrada de dados!\n");
					printf("Pressione uma tecla!");
					while(!kbhit()){}
				}
				else{
					printf("\nResistor equivalente: %8.2f Ohm\n", reseq);
					printf("Pressione uma tecla");
					while(!kbhit()){}
					
				}	
				break;
			case 4:
				if(!dados){
					printf("\nN�o houve entrada de dados!\n");
					printf("Pressione uma tecla");
					while(!kbhit()){}
					
				}
				else {
					mostraTensao();
					printf("Pressione uma tecla");
					while(!kbhit()){}
						
				}
				break;
			case 5:
				if(!dados){
					printf("\nNao houve entrada de dados\n");
					printf("Pressione uma tecla");
					while(!kbhit()){}
				}
				else {
					mostraCorrente();
					printf("Pressione uma tecla");
					while(!kbhit()){}
					
				}
				break;
			case 0: 
				break;
				
		}
	}while (item != 0);
}

void menu(void){
	do{
		system("cls");
		printf("\n(0) - Sai");
		printf("\n(1) - Entrada de dados");
		printf("\n(2) - Calcular tensao total das fontes no circuito");
		printf("\n(3) - Calcular resistencia equivalente");
		printf("\n(4) - Calcular tensoes nos resistores");
		printf("\n(5) - Calcular correntes nos resistores\n\n->");
		scanf("%d", &item);
		if((item > 5) || (item < 0)){
			printf("Invalido! Pressione uma tecla");
			while(!kbhit());
		}
	}while((item < 0) || (item > 5));
}

void dadosin(void){
	system("cls");
	do{
		printf("\nEntre com o numero total de fontes (max. 100): ");
		scanf("%d", &bat);
	}while((bat > 100) || (bat < 1));
	
	int i;
	for(i = 0; i < bat; i ++){
		printf("\nEntre com a %d bateria: ", i);
		scanf("%f", &volts);
		voltagem = voltagem + volts;
	}
	printf("\nTensao total: %f", voltagem);
	printf("\nQuantos nos (min = 2)?\n");
	scanf("%d", &numeroNos);
	fillNode(voltagem, numeroNos);
	
	printf("\nDados completos! Pressione uma tecla...");
	while(!kbhit());
	dados = 1;
}

float fillNode(float tensao, int nNos){	
	char op;
	float ramosAdmi[nNos][nNos];
	int cont = 0;
	for(i = 0; i < nNos; i++){
		for(j = 0; j < nNos; j++){
			if (j <= i){
				continue;
			}
			printf("\nQuantos ramos do no %d para o no %d? (0 = GND 1 = VCC)\n", i, j);
			scanf("%d", &ramos[i][j].numRamos);
			if(ramos[i][j].numRamos == 0){
				continue;
			}
			for(k = 0; k < ramos[i][j].numRamos; k++){
				printf("\nQual o valor da %d carga?\n", k+1);
				scanf("%f", &ramos[i][j].resTotal[k]);
			}
			for(k = 0; k < ramos[i][j].numRamos ; k++){
				ramos[i][j].rEqui = ramos[i][j].rEqui + 1/(ramos[i][j].resTotal[k]);
			}
			ramos[i][j].rEqui = 1/ramos[i][j].rEqui;
		}
	}
	//printf("\nMatriz de resist�ncias:\n");
	//Loop para mostrar na tela a matriz de resist�ncias e espelha-la 
	for(i = 0; i < nNos; i++){
		for(j = 0; j < nNos; j++){
			ramos[j][i] = ramos[i][j];	
			//printf("%f\t", ramos[i][j].rEqui);
		}
		//printf("\n");
	}
	//printf("\nVetor correntes:\n");
	//Loop para calcular as correntes e fazer parcialmente a transforma��o de Norton (somando os valores da linha 1 �s linhas adjacentes
	for(i = 1; i < nNos; i++){
		if(i > 1){
			if((int)ramos[i][1].rEqui != 0){
				//printf("\n%d\n",ramos[i][1].rEqui);
				correntes[i-1] = tensao/(ramos[i][1].rEqui);
			}else{
				correntes[i-1] = 0;
			}
		}else{
			if(ramos[i-1][1].rEqui != 0){
				correntes[i-1] = tensao/(ramos[i-1][1].rEqui);
			}
		}
		//printf("%f\n", correntes[i-1]);	
	}
	//printf("\n");
	//Loop para completar a matriz de admit�ncias
	for(i = 2; i < nNos; i++){
		for(j = 2; j < nNos; j++){
			if(i == j){
				continue;
			}
			if ((int)ramos[i][j].rEqui != 0)
				ramosAdmi[i-1][j-1] = - 1 / ramos[i][j].rEqui; 
		}
	}
	for(i = 1; i < nNos - 1; i++){
		if ((int)ramos[0][i+1].rEqui != 0)
			ramosAdmi[0][i] = - 1 / ramos[0][i+1].rEqui;
		ramosAdmi[i][0] = ramosAdmi[0][i];
	}
	for(i = 1; i < nNos - 1; i++){
		if ((int)ramos[i + 1][1].rEqui != 0)
			ramosAdmi[i][0] = ramosAdmi[i][0] - 1 / ramos[i + 1][1].rEqui;
		ramosAdmi[0][i] = ramosAdmi[i][0];
	}
	//Calculo dos valores da matriz de admit�ncias para i=i
	for(i = 0; i < nNos - 1; i++){
		for(j = 0; j < nNos - 1; j++){
			if(i == j){
				continue;
			}
			ramosAdmi[i][i] = ramosAdmi[i][i] - ramosAdmi[i][j];
			if (ramosAdmi[i][i] < 0){
				ramosAdmi[i][i] = ramosAdmi[i][i] * -1;
			}
		}
	}
	//Matriz que armazenar� o valor da inversa da matriz
	float ratio, a;
	//printf("\nMatriz admitancia:\n");
	//Completa a matriz inversa e imprime a matriz admit�ncia
	for(i = 0; i < (nNos - 1); i++){
		for(j = 0; j < (nNos - 1); j++){
			if (ramosAdmi[i][i] < 0){
				ramosAdmi[i][i] = ramosAdmi[i][i] * -1;
			}
			//printf("%f\t", ramosAdmi[i][j]);
			matrix[i][j] = ramosAdmi[i+1][j+1];	
		}
		//printf("\n");
	}	
	int n = nNos - 2;
	//Processo para encontrar o inverso da admit�ncia, que � a matriz imped�ncia 
	float d = determinant(matrix, n);
	cofactor(matrix, n);
    //Imprime a matriz inversa
    //printf("\nMatriz impedancia:\n");
    for(i = 0; i < n; i++){
        for(j = 0; j < n; j++){
            //printf("%.2f", matrix[i][j]);
            //printf("\t");
        }
        //printf("\n");
    }
    //Calculo das tensoes
    //printf("\nVetor tensoes nodais:\n");
    for(i = 0; i < nNos; i++){
    	correntes[i] = correntes[i+1];
	}
    for(i = 0; i < n; i++){
    	tensoes[i] = 0;
    	for(j = 0; j < n; j++){
    		tensoes[i] = tensoes[i] + correntes[j]*inverse[i][j];
		}
		//printf("%.2f", tensoes[i]);
    	//printf("\n");
	}
	for(i = (nNos-1); i >= 2; i--){
		tensoes[i] = tensoes[i-2];
		
	}
	tensoes[1] = tensao;
	tensoes[0] = 0; 
	float cTotal;
	for(i = 0; i < numeroNos; i++){
		for(j = 0; j < numeroNos; j++){
			ramos[i][j].tensao = tensoes[i] - tensoes[j];
		}
	}
	for(i = 0; i < numeroNos; i++){
		for(j = 0; j < numeroNos; j++){
			if((int)ramos[i][j].rEqui != 0)
				ramos[i][j].correnteTotal = (ramos[i][j].tensao)/(ramos[i][j].rEqui);
			if (i == j)
				ramos[i][j].correnteTotal = 0;
				
		}
	}	
	for(i = 0; i < nNos; i++){
		if(ramos[i][1].correnteTotal < 0){
			cTotal = cTotal + ramos[i][1].correnteTotal * -1;	
		}else{
			cTotal = cTotal + ramos[i][1].correnteTotal;
		}
	}
	reseq = voltagem/cTotal;
    return 0;
}

void mostraTensao(){
	printf("\nMatriz DDP's':\n");
	for(i = 0; i < numeroNos; i++){
		for(j = 0; j < numeroNos; j++){
			ramos[i][j].tensao = tensoes[i] - tensoes[j];
			printf("%8.4f\t", ramos[i][j].tensao);
				
		}
		printf("\n");
	}
}

void mostraCorrente(){
	printf("\nMatriz Correntes:\n");
	for(i = 0; i < numeroNos; i++){
		for(j = 0; j < numeroNos; j++){
			if((int)ramos[i][j].rEqui != 0)
				ramos[i][j].correnteTotal = (ramos[i][j].tensao)/(ramos[i][j].rEqui);
			if (i == j)
				ramos[i][j].correnteTotal = 0;
			printf("%8.4f\t", ramos[i][j].correnteTotal);
				
		}
		printf("\n");
	}	
}

/*For calculating Determinant of the Matrix */
float determinant(float a[25][25], float k) {
  float s = 1, det = 0, b[25][25];
  int i, j, m, n, c;
  if (k == 1) {
    return (a[0][0]);
  } else {
    det = 0;
    for (c = 0; c < k; c++) {
      m = 0;
      n = 0;
      for (i = 0; i < k; i++) {
        for (j = 0; j < k; j++) {
          b[i][j] = 0;
          if (i != 0 && j != c) {
            b[m][n] = a[i][j];
            if (n < (k - 2))
              n++;
            else {
              n = 0;
              m++;
            }
          }
        }
      }
      det = det + s * (a[0][c] * determinant(b, k - 1));
      s = -1 * s;
    }
  }

  return (det);
}

void cofactor(float num[25][25], float f) {
    float b[25][25], fac[25][25];
    int p, q, m, n, i, j;
    for (q = 0; q < f; q++) {
      for (p = 0; p < f; p++) {
        m = 0;
        n = 0;
        for (i = 0; i < f; i++) {
          for (j = 0; j < f; j++) {
            if (i != q && j != p) {
              b[m][n] = num[i][j];
              if (n < (f - 2))
                n++;
              else {
                n = 0;
                m++;
              }
            }
          }
        }
        fac[q][p] = pow(-1, q + p) * determinant(b, f - 1);
      }
    }
    transpose(num, fac, f);
  }
  /*Finding transpose of matrix*/
void transpose(float num[25][25], float fac[25][25], float r) {
  int i, j;
  float b[25][25], d;

  for (i = 0; i < r; i++) {
    for (j = 0; j < r; j++) {
      b[i][j] = fac[j][i];
    }
  }
  d = determinant(num, r);
  for (i = 0; i < r; i++) {
    for (j = 0; j < r; j++) {
      inverse[i][j] = b[i][j] / d;
    }
  }
  //printf("\n\nInversa : \n");

  for (i = 0; i < r; i++) {
    for (j = 0; j < r; j++) {
      //printf("%f\t", inverse[i][j]);
    }
    //printf("\n");
  }
}

