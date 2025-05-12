import * as xlsx from 'xlsx';

export const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsx.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = xlsx.utils.sheet_to_json(worksheet);
            

            var PontosDeEntrega = new Set(json.map(grupo => (grupo.GRUPO)));

            var QtdPontosDeEntrega = [...PontosDeEntrega];

            var QtdPontos = QtdPontosDeEntrega.length;

            let Loec = []
            for (let i = 0 ; i <= QtdPontos; i++){
            var Pontos = json.filter(ponto => (ponto.GRUPO === i));
            Loec.push(Pontos)
            delete Loec[0];

            // console.log(Pontos)
            }
            // console.log(Loec[1][0].GRUPO)


            let ArrayToDisplay = []
            for (let i = 1 ; i <= QtdPontos; i++){

            const PontoAtual = Loec[i][0].GRUPO;

            const Endereco = Loec[i][0].ENDEREÇO;

            const Objetosreturn = Loec[i].map(ponto => (ponto.OBJETO));

            const Objetos = Objetosreturn.sort()

            const QtdObjetos = Objetos.length;
            
            const Coordenadas = Loec[i][0].COORDENADAS;

            ArrayToDisplay.push([QtdPontos, PontoAtual, Endereco, QtdObjetos, Objetos, Coordenadas ]);
                       
            }
          
            // RENDER
            // return(
            //             <div>
                        
                            
            //                     <h4>  Quantidade de pontos de entrega: {ArrayToDisplay[0][0]}</h4>
            
            //                     <h4>  Ponto atual de entrega: {ArrayToDisplay[0][1]}</h4>
                                
            //                     <h4>  Qtd de Objetos neste ponto: {ArrayToDisplay[0][3]}</h4>
            
            //                     <h4>  Endereço: {ArrayToDisplay[0][2]}</h4>
            
            //                     <h6>  Objetos: {ArrayToDisplay[0][4]}</h6>
            
            //                     <h6> Coordenadas: {ArrayToDisplay[0][5]}</h6>      
            
                            
                        
            //         </div>
            // )
            console.log(ArrayToDisplay)

            // Formatação
            // console.log(`Pontos de Entrega Previstos: ${QtdPontos}`);
            // console.log(`Ponto atual de entrega ${PontoAtual}`)
            // console.log(`Endereço: ${Endereco}`);
            // console.log(`Quantidade de objetos: ${QtdObjetos}`);
            // console.log(`Objetos: ${Objetos}`);
            // console.log(`Coordenadas do Google Maps de Baixa:${Coordenadas}`);

            

            // const PontoAtual = Pontos[0].GRUPO

            // const Endereco = Pontos[0].ENDEREÇO;

            // const Objetosreturn = Pontos.map(ponto => (ponto.OBJETO));

            // const Objetos = Objetosreturn.sort()

            // const QtdObjetos = Objetos.length;
            
            // const Coordenadas = Pontos[0].COORDENADAS;
            
            

            // function setPontosDeEntrega(pontos) {
            //     return [ pontos.GRUPO === 1];
            //     }
            // console.log(setPontosDeEntrega);   
            // console.log(Pontos);
            
            // console.log(QtdPontosDeEntrega);
            // console.log(`Ponto de Entrega atual: ${PontoAtual + 1}`);

            // Formatação
            // console.log(`Pontos de Entrega Previstos: ${QtdPontosDeEntrega.length}`);
            // console.log(`Ponto atual de entrega ${PontoAtual}`)
            // console.log(`Endereço: ${Endereco}`);
            // console.log(`Quantidade de objetos: ${QtdObjetos}`);
            // console.log(`Objetos: ${Objetos}`);
            // console.log(`Coordenadas do Google Maps de Baixa:${Coordenadas}`);
            
            // console.log(Pontos)
            // console.log(array)
                // for ( Pontos = 0; Pontos < QtdPontos; Pontos++){
                //     var FormatoDesejado = [{QtdPontos, PontoAtual, Endereco, QtdObjetos, Objetos, Coordenadas }];    
                // }
            
            // var FormatoDesejado = [{QtdPontos, PontoAtual, Endereco, QtdObjetos, Objetos, Coordenadas }];

            // console.log(FormatoDesejado);
                    
        };
        reader.readAsArrayBuffer(e.target.files[0]);
        
    }
}