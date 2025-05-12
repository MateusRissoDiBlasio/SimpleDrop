import logo from './imgs/logo-fundo-branco-escrito-em-branco.png';
import { useState, useEffect } from 'react';
// import { readUploadFile } from './components/converter';
import './App.css';
import * as xlsx from 'xlsx';
import styled from 'styled-components'
// import Intro from './NavigationMap';
import './responsive.css'



export function App() {

const [lista, setLista] = useState([]);
const [coordLista, setCoordLista] = useState([]);
let [index, setIndex] = useState(0);


const readUploadLoecFile = (e) => {
  
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

const readUploadCoordenadasFile = (e) => {

  e.preventDefault();
  if (e.target.files) {
      const readercoord = new FileReader();
      readercoord.onload = (e) => {
          const coorddata = e.target.result;
          const coordworkbook = xlsx.read(coorddata, { type: "array" });
          const coordsheetName = coordworkbook.SheetNames[0];
          const coordworksheet = coordworkbook.Sheets[coordsheetName];
          const coordjson = xlsx.utils.sheet_to_json(coordworksheet);
          

          var CoordOrdemDeEntrega = new Set(coordjson.map(grupo => (grupo.GRUPO)));

          var QtdCoordDeEntrega = [...CoordOrdemDeEntrega];

          var QtdPontos = QtdCoordDeEntrega.length;

          let Loec = []
          for (let i = 0 ; i <= QtdPontos; i++){
          var Pontos = coordjson.filter(ponto => (ponto.GRUPO === i));
          Loec.push(Pontos)
          delete Loec[0];

          }

          console.log(CoordOrdemDeEntrega)
          console.log(QtdPontos)
          console.log(Loec)
        
          let ArrayCoordToDisplay = []
          for (let i = 1 ; i <= QtdPontos; i++){

          const NumeroDeOrdem = Loec[i][0].GRUPO;

          const Endereco = Loec[i][0].ENDEREÇO;
          
          const Coordenadas = Loec[i][0].COORDENADAS;

          ArrayCoordToDisplay.push([NumeroDeOrdem, Endereco, Coordenadas]);
              
          }
          setCoordLista([ArrayCoordToDisplay]);
          console.log(ArrayCoordToDisplay)
          
        };
        readercoord.readAsArrayBuffer(e.target.files[0]);
        
    }
    
}

// console.log(lista[0][0][2])
// console.log(coordLista[0][0][1])
var [listaDeEntrega, setListaDeEntrega] = useState([]);


let compare = []
let compareCoord = []

if (lista.length !== 0 && coordLista.length !== 0){

  

  for( var i =0; i < lista[0].length; i++){

    const compareAdress = lista[0][i][2]

    compare.push(compareAdress)

  }
  console.log(compare)

  // console.log(coordLista[0][0][1])

  for( var o =0; o < coordLista[0].length; o++){

    const compareCoordAdress = coordLista[0][o][1]

    compareCoord.push(compareCoordAdress)

  }
  console.log(compareCoord)

  
  let intersection = compare.filter(x => !compareCoord.includes(x));
  console.log(intersection);

  
  let itemsToRemove = []
  
for( var z = 0; z < intersection.length; z++ ){

  for ( var y = 0; y < compareCoord.length; y++ ){
  
    if(intersection[z].includes(compareCoord[y])){
    // console.log(intersection[z])

    let adressesItemsToRemove = intersection[z] 
    itemsToRemove.push(adressesItemsToRemove) 
  }

}
}


let mesmaCoordenada = intersection.filter(x => itemsToRemove.includes(x));
console.log(mesmaCoordenada)

let foraDasCoordenadas = intersection.filter(x => !itemsToRemove.includes(x));
foraDasCoordenadas.sort()
console.log(foraDasCoordenadas);  


  console.log(lista[0].length)
  let coordindex = coordLista[0].length;
  console.log(coordindex)

  
// console.log(intersection[0].includes(compareCoord[2]))

let listaFinal = compareCoord

console.log(listaFinal[2])
console.log(intersection[0])
intersection.reverse()


// console.log(compareCoord.indexOf(compareCoord[0]))
// let somaindex = compareCoord.indexOf(compareCoord[0]) + 1
// console.log(somaindex)


for( var zy = 0; zy < intersection.length; zy++ ){

  for ( var xy = 0; xy < compareCoord.length; xy++ ){ 

    if(intersection[zy].includes(compareCoord[xy])){

      let somaindex = compareCoord.indexOf(compareCoord[xy]) + 1;
      listaFinal.splice(somaindex,0,intersection[zy]);
      xy++;  
    }
    
  }}

//   console.log(listaFinal.length)
//   let indexlistafinal = listaFinal.length

//   console.log(listaFinal)

//   for( var d = 0; d < foraDasCoordenadas.length; d++){

//   listaFinal.splice(indexlistafinal,0,foraDasCoordenadas[d])
//   indexlistafinal++
// }
//   console.log(listaFinal)

//   console.log(listaFinal[0])

// console.log(lista[0][0][2])

// console.log(lista)

let teste2 = []

for( var e = 0; e < listaFinal.length; e++){

    for( var f = 0; f < lista[0].length; f++)
    if(listaFinal[e] === lista[0][f][2]){

            // console.log(lista[0][f][4])
            // let somaindex2 = listaFinal.indexOf(listaFinal[e]) + 1;
            // listaFinal.splice(somaindex2,0,lista[0][f][4])
            listaFinal.push(lista[0][f][4])
                    
            
            const endfinal = listaFinal[e]
            const objfinal = lista[0][f][4]
          
            teste2.push([endfinal, objfinal])
    }


}

console.log(teste2)
  

// bloco 1 for
  // for( var zy = 0; zy < intersection.length; zy++ ){
  
  //     if(intersection[zy].includes(compareCoord[zy])){
  
  //       listaFinal.splice(listaFinal.indexOf(listaFinal[zy]+1),0,intersection[zy]);
  //     }
    
  
  //   }  

// console.log(intersection.indexOf(intersection[2]))
// console.log(listaFinal)


  // for( var m = 0; m < coordindex; m++){
  
  //   for (var n = 0; n < lista[0].length; n++){
    
      

  //     if(coordLista[0][m][1].includes(lista[0][n][2])){
  //       if(lista[0][n][2].includes(coordLista[0][m][1])){
    
  //       console.log(lista[0][n][4])      

  //   }

  // }}}

    // let intersection = lista[0][o][2].filter(x => !coordLista.includes(x));
    //     console.log(intersection);
    
    

    // if(coordLista[0][m][1] !== (!lista[0][o][2])){
    //   console.log(lista[0][o][4])
    // }
  } 
    // console.log(coordLista[0][o][1])
         
      // if(enderecoatual === coordLista[0][ind][1]){
      // if(coordLista[0][o][1].includes(lista[0][o][2])){
      // // var element = "até que enfim achei essa porra";
      
      // listaDeEntrega = coordLista[0][o][2];
      // console.log(listaDeEntrega);
      // var endcoord = coordLista[0][o][1];
      // } else if(endcoord === undefined){
                
        
      // }
    // }
// }
// }

// console.log(listaDeEntrega)


const [userLocation, setUserLocation] = useState(null);

const getUserLocation = () => {
      
      if (navigator.geolocation) {
      
        navigator.geolocation.getCurrentPosition(
          (position) => {
      
            const { latitude, longitude } = position.coords;
      
            setUserLocation({ latitude, longitude });
          },
      
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      }
      
      else {
        console.error('Geolocation is not supported by this browser.');
      }
    };


    useEffect(() =>{
      getUserLocation();

    }, [setUserLocation] );

const [cidade, setCidade] = useState(null);
const [estado, setEstado] = useState(null);

    if(lista.length !== 0 && coordLista.length !== 0){
    // console.log(userLocation.latitude)
    // console.log(userLocation.longitude)
    
    async function getCidadeEstado(latitude, longitude) {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // console.log(data)
    
        if (data.results && data.results.length > 0) {
          const results = data.results[0];
          let cidade = null;
          let estado = null;
    
          // Procura pela cidade e estado nos componentes do resultado
          for (const component of results.address_components) {
            if (component.types.includes('administrative_area_level_2')){
              cidade = component.long_name;
            } 
            if(component.types.includes('administrative_area_level_1' )){
              estado = component.short_name;
            }
          }
    
          return { cidade, estado };
        } else {
          return null; // Retorna null se não encontrar resultados
        }
      } catch (error) {
        console.error("Erro ao obter informações de geocoding:", error);
        return null;
      }
    }
    
    if(lista.length !== 0 && coordLista.length !== 0){
    getCidadeEstado(userLocation.latitude, userLocation.longitude)
  .then(result => {
    if (result) {
      // console.log("Cidade:", result.cidade);
      setCidade(result.cidade)
      // console.log("Estado:", result.estado);
      setEstado(result.estado)
    } else {
      console.log("Não foi possível encontrar a cidade e o estado.");
    }
  });
}
}

// gerar comparação para buscar a coordenada exata do ponto de entrega
// Array to display [i][3]
// Array Coord to display [i][2]

// const FindCoord = (ArrayCoordToDisplay, ArrayToDisplay) => {
//   return ArrayCoordToDisplay.filter(element => ArrayToDisplay.includes(element));
// }
// console.log(FindCoord);

// console.log(lista);




// let listaDeObjetos = ArrayToDisplay


// console.log(index)
// console.log(lista)

if (lista.length !== 0){


// console.log(lista[0][index][2]);

const enderecoatual = lista[0][index][2]

// console.log(coordLista[0][index])



// let coordindex = coordLista.findIndex(
//   element => element === enderecoatual
// );
if (coordLista.length !== 0){

  // console.log(coordLista[0])    
  // console.log(coordLista[0].length)

for (var ind = 0; ind < coordLista[0].length; ind++)
{
  // console.log(coordLista[ind])     
    // if(enderecoatual === coordLista[0][ind][1]){
    if(enderecoatual.includes(coordLista[0][ind][1])){
    // var element = "até que enfim achei essa porra";
    var element = coordLista[0][ind][2];
    var endcoord = coordLista[0][ind][1];
    } else if(endcoord === undefined){
      // var elementcomplement = ", NOVA FRIBURGO, RIO DE JANEIRO"
      element = enderecoatual + ", " + cidade + ", " + estado
      
      
      
    }

  // console.log(coordLista[0][ind][1])    
}
console.log(enderecoatual)
console.log(endcoord)
console.log(element) 
}

// console.log(coordLista[1][2])

// const coord = lista[0][index][5]
// console.log(coord)
}

  function refreshPage(){
    window.location.reload(false)
  };

  return (
    <div className="App">

      <h1>just testing</h1>
      <header className="App-header">
        
        <img src={logo} className='logo' alt="logo" />        
        <form>
            <label htmlFor="upload">Importar LOEC</label><br></br>
            
            <input
                type="file"
                name="uploadLoec"
                id="uploadLoec"
                onChange={readUploadLoecFile}
            />
        </form>
        <form>
            <label htmlFor="upload">Coordenadas</label><br></br>
            
            <input
                type="file"
                name="upload"
                id="uploadCoord"
                onChange={readUploadCoordenadasFile}
            />
        </form>
        <button onClick={refreshPage}>Recarregar Página</button>

      </header>
        
        <div className='App-body'>

        

        <div>
{lista.length !== 0 && coordLista.length !== 0 ?

      
          
          
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
                {/* <h4>  Qtd de Objetos neste ponto: </h4> <h2>{lista[0][index][3]}</h2> */}
                {/* <h4>  Qtd de Objetos neste ponto: </h4> <h2>{teste2[index].length}</h2> */}
              </div>
              <UlObjetos> 
                
                {lista[0][index][4].map((OBJETO) => (
                  <li key={OBJETO}>{OBJETO}</li>
                ))}
                
              </UlObjetos>  
            </div>
            
            <div className='info'>

              <h4>  Endereço: {lista[0][index][2]}</h4>
              {/* <h6> Coordenadas: <p id='Coordenadas'>{lista[0][index][5]}</p></h6>       */}
              {endcoord === undefined ? <h6> Coordenadas: <p>Informações indisponíveis no arquivo<br></br>de coordenadas, coordenadas baseadas<br></br>pelo endereço informado</p><br></br><p className='alert'>ATENÇÃO: endereço sem coordenada <br></br>cadastrada, possível CEP incorreto</p><p style={{display: "none"}} id='Coordenadas'>{element}</p></h6> : <h6> Coordenadas: <p id='Coordenadas'>{element}</p></h6> }
              {/* <h6> Coordenadas: <p id='Coordenadas'>{element}</p></h6>      */}
            
            </div>             
                                          
                                      
          </div>
        </div>

          : <h4> CARREGA A LISTA ANIMAL</h4>}
          
        </div>
        {/* {lista.length !== 0 && coordLista.length !== 0 ? <Intro key={index} /> : ''} */}
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