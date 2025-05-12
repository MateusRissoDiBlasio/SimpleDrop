import logo from './imgs/logo-correios-menor.png';
import { useState } from 'react';
// import { readUploadFile } from './components/converter';
import './App.css';
import * as xlsx from 'xlsx';
import styled from 'styled-components'
import Intro from './NavigationMap';
import './responsive.css'






export function App() {

const [lista, setLista] = useState([]);
let [index, setIndex] = useState(0);


const readUploadFile = (e) => {
  
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
            setLista([ArrayToDisplay]);
            console.log(ArrayToDisplay)

            
          };
          reader.readAsArrayBuffer(e.target.files[0]);
          
      }
      
  }

  // let listaDeObjetos = ArrayToDisplay


// console.log(index)
console.log(lista)

if (lista.length !== 0){

const coord = lista[0][index][5]
console.log(coord)
}

  function refreshPage(){
    window.location.reload(false)
  };

  return (
    <div className="App">
      <header className="App-header">
        
        <img src={logo} className='logo' alt="logo" />        
        <form>
            <label htmlFor="upload">Importar LOEC</label><br></br>
            
            <input
                type="file"
                name="upload"
                id="upload"
                onChange={readUploadFile}
            />
        </form>
        <button onClick={refreshPage}>Recarregar Página</button>

      </header>
        
        <div className='App-body'>

        

        <div>
{lista.length !== 0 ?

      
          
          
      <div>
        
          <div className='nav'>
            <button className='nextPrev' disabled={index === 0 ? true : false} onClick={() => setIndex(index - 1)}>Ponto de entrega Anterior</button>
            <button className='nextPrev' disabled={index >= lista[0][0][0]-1 ? true : false} onClick={() => setIndex(index + 1)}>Próximo ponto de entrega</button>
            
          </div>
          
          <div className='info'>                
            <div className='pontos'>   

              <h4>  Pontos de entrega: </h4> <h2>{lista[0][index][0]} </h2>
              <h4>  Ponto de entrega: </h4> <h2>{lista[0][index][1]} </h2>
              
            </div> 
            <div className='objetos'>
              <div className='qtd-objetos'>
                <h4>  Qtd de Objetos neste ponto: </h4> <h2>{lista[0][index][3]}</h2>
              </div>
              <UlObjetos> 
                
                {lista[0][index][4].map((OBJETO) => (
                  <li key={OBJETO}>{OBJETO}</li>
                ))}
                
              </UlObjetos>  
            </div>
            
            <div>

              <h4>  Endereço: {lista[0][index][2]}</h4>
              <h6> Coordenadas: <p id='Coordenadas'>{lista[0][index][5]}</p></h6>      
            
            </div>             
                                          
                                      
          </div>
        </div>

          : <h4> CARREGA A LISTA ANIMAL</h4>}
          
        </div>
        {lista.length !== 0 ? <Intro key={index} /> : ''}
    </div>

    

    </div>
  );
}

const UlObjetos = styled.ul`
  
  display: grid;
  grid-template-columns: 140px;
  overflow-y: auto;
  min-height: 40px;
  max-height: 120px; 
  width: 160px;
  border-radius: 5px;
  padding: 10px 20px 10px 40px;

  background-color: grey;
  justify-self: center;
  justify-content: space-between;

    li {
      text-align: center;
      font-size: 1rem;
      // list-style: none;
      list-style: decimal;
      font-family: "Roboto", sans-serif;
      text-transform: uppercase;
    }
`
export default App;