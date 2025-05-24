import logo from './imgs/logo-fundo-branco-escrito-em-branco.png';
import waze from './imgs/logowaze.png';
import maps from './imgs/logomaps.png';
import refresh from './imgs/icons/refreshpagetest.png';
import { useState, useEffect } from 'react';
import './App.css';
import * as xlsx from 'xlsx';
import styled from 'styled-components'
// import Intro from './NavigationMap';
import './responsive.css'

import { InputLoec } from './components/inputs';
import { InputCoord } from './components/inputs';



export function App() {

const [lista, setLista] = useState([]);
const [coordLista, setCoordLista] = useState([]);
let [index, setIndex] = useState(0);
var [listaDeEntrega] = useState([]);

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
      
      console.log(QtdPontosDeEntrega)
      console.log(QtdPontos <= 1)
      console.log(QtdPontos)


      if(QtdPontos > 1){
  
        let Loec = []
        for (let i = 0 ; i <= QtdPontos; i++){
        var Pontos = json.filter(ponto => (ponto.GRUPO === i));
        Loec.push(Pontos)
        delete Loec[0];
        }
       
      //  MEXER AQUI
      
        console.log(Loec[1][0].OBJETO)

        if(Loec[1][0].OBJETO !== undefined){
          console.log(Loec)
          
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
        }else{
          alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Loec, confira o arquivo carregado');
            document.getElementById('uploadLoec').value='';
            console.log(document.getElementById('uploadLoec').value)
          }
    
      }else if (QtdPontos <= 1){
        alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
        console.log(document.getElementById('uploadLoec').value)
        document.getElementById('uploadLoec').value='';
        console.log(document.getElementById('uploadLoec').value)
      }
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

      if(QtdPontos > 1){

        let Loec = []
        for (let i = 0 ; i <= QtdPontos; i++){
          var Pontos = coordjson.filter(ponto => (ponto.GRUPO === i));
          Loec.push(Pontos)
          delete Loec[0];
        }
      console.log(Loec)
        if(Loec[1][0].COORDENADAS !== undefined){

          let ArrayCoordToDisplay = []
          for (let i = 1 ; i <= QtdPontos; i++){

            const NumeroDeOrdem = Loec[i][0].GRUPO;

            const Endereco = Loec[i][0].ENDEREÇO;
            
            const Coordenadas = Loec[i][0].COORDENADAS;

            ArrayCoordToDisplay.push([NumeroDeOrdem, Endereco, Coordenadas]);
              
          }
          setCoordLista([ArrayCoordToDisplay]);
          console.log(ArrayCoordToDisplay)
        }else{
            alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Coordenadas, confira o arquivo carregado');
            document.getElementById('uploadCoord').value='';
            console.log(document.getElementById('uploadCoord').value)
        }
      }else if (QtdPontos <= 1){
        alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
        console.log(document.getElementById('uploadCoord').value)
        document.getElementById('uploadCoord').value='';
        console.log(document.getElementById('uploadCoord').value)
      }
    };
    readercoord.readAsArrayBuffer(e.target.files[0]);  
  }
}

var allowedExtensions = ["ods", "xlsx"];
console.log(allowedExtensions)

function testLoecFile(e) {

  var loecFileInput = document.getElementById('uploadLoec');
  var loecFilePath = loecFileInput.value;

  console.log(loecFilePath);

  function getFileExtension(filename) {
    return filename.split('.').pop();
  }
  console.log(getFileExtension(loecFilePath))
  console.log(loecFilePath.includes(allowedExtensions[0]) || loecFilePath.includes(allowedExtensions[1]))
  
  if (loecFilePath.includes(allowedExtensions[0]) || loecFilePath.includes(allowedExtensions[1])){

    readUploadLoecFile(e);

  }else{
    
    alert(`Este arquivo de Loec não é válido, tente novamente. \n\nFormatos aceitos:  ${allowedExtensions[0]}  e  ${allowedExtensions[1]}.`);
    document.getElementById('uploadLoec').value='';
  
  }
}

function testCoordFile(e) {

  var coordFileInput = document.getElementById('uploadCoord');
  var coordFilePath = coordFileInput.value;

  console.log(coordFilePath);

  function getFileExtension(filename) {
    return filename.split('.').pop();
  }
  console.log(getFileExtension(coordFilePath))
  if (coordFilePath.includes(allowedExtensions[0]) || coordFilePath.includes(allowedExtensions[1])){
  
    readUploadCoordenadasFile(e);

  }else{

    alert(`Este arquivo de Coordenadas não é válido, tente novamente. \n\nFormatos aceitos:  ${allowedExtensions[0]}  e  ${allowedExtensions[1]}.`);
    document.getElementById('uploadCoord').value='';

  }
}


// INSERINDO TESTE DE EXTENSÃO DE ARQUIVO
// function fileValidation() {
// 			var loecFileInput = document.getElementById('uploadLoec');
// 			var loecFilePath = loecFileInput.value;
// 			var coordFileInput = document.getElementById('uploadCoord');
// 			var coordFilePath = coordFileInput.value;
		
// 			// Allowing file type
// 			var allowedExtensions = [".ods", ".xlxs"];
			
// 			if (!allowedExtensions.exec(loecFilePath) || !allowedExtensions.exec(coordFilePath)) {
// 				alert('Este tipo de arquivo não é suportado, verifique a seleção.');
// 				loecFileInput.value = '';
//         coordFileInput.value = '';
// 				return false;
// 			} 
// }

// function testLoecFile() {

// fileValidation();
// readUploadLoecFile();
// }

// function testCoordFile() {

// fileValidation();
// readUploadCoordenadasFile();
// }


let compare = []
let compareCoord = []

if (lista.length !== 0 && coordLista.length !== 0){

  for( var i =0; i < lista[0].length; i++){

    const compareAdress = lista[0][i][2]

    compare.push(compareAdress)

  }

  for( var o =0; o < coordLista[0].length; o++){

    const compareCoordAdress = coordLista[0][o][1]

    compareCoord.push(compareCoordAdress)

  }
  
  let intersection = compare.filter(x => !compareCoord.includes(x));
  console.log(intersection);

  let itemsToRemove = []
  
  for( var z = 0; z < intersection.length; z++ ){

    for ( var y = 0; y < compareCoord.length; y++ ){
    
      if(intersection[z].includes(compareCoord[y])){

      let adressesItemsToRemove = intersection[z] 
      itemsToRemove.push(adressesItemsToRemove) 
      }
    }
  }

  let foraDasCoordenadas = intersection.filter(x => !itemsToRemove.includes(x));
  foraDasCoordenadas.sort()

  let listaFinal = compareCoord
  intersection.reverse()

  for( var zy = 0; zy < intersection.length; zy++ ){

    for ( var xy = 0; xy < compareCoord.length; xy++ ){ 

      if(intersection[zy].includes(compareCoord[xy])){

        let somaindex = compareCoord.indexOf(compareCoord[xy]) + 1;
        listaFinal.splice(somaindex,0,intersection[zy]);
        xy++;  
      }
    }
  }

  let indexlistafinal = listaFinal.length

  for( var d = 0; d < foraDasCoordenadas.length; d++){

    listaFinal.splice(indexlistafinal,0,foraDasCoordenadas[d])
    indexlistafinal++
  }

  for( var e = 0; e < listaFinal.length; e++){

      for( var f = 0; f < lista[0].length; f++){
      if(listaFinal[e] === lista[0][f][2]){

              listaFinal.push(lista[0][f][4])
                                
              const endfinal = listaFinal[e]
              const objfinal = lista[0][f][4]
            
              listaDeEntrega.push([endfinal, objfinal])
      }
    }
  }
} 

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


  // SÓ FUNCIONA SE O API ESTIVER EM USO

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
        
        setCidade(result.cidade)
        setEstado(result.estado)

      } else {
        console.log("Não foi possível encontrar a cidade e o estado.");
      }
    });
  }
}

if (lista.length !== 0 && coordLista.length !== 0){

  const enderecoatual = listaDeEntrega[index][0]

  if (coordLista.length !== 0){

    for (var ind = 0; ind < coordLista[0].length; ind++){

      if(enderecoatual.includes(coordLista[0][ind][1])){

      var element = coordLista[0][ind][2];
      var endcoord = coordLista[0][ind][1];
      } else if(endcoord === undefined){

        // element = enderecoatual + ", " + cidade + ", " + estado
        element = enderecoatual + ", Nova Friburgo, RJ"
        // element = enderecoatual
      }
    }
  }
}

function refreshPage(){
  window.location.reload(false)
};

function wazeNav(){
  // window.open(`https://www.waze.com/ul?ll=${element}&navigate=yes&zoom=17`, "_blank"); 
  // window.open(`waze://?ll=${element}&navigate=yes&zoom=17`, "_blank"); 
  if (endcoord === undefined){
    // window.open(`waze://?q=${element}&ll=${userLocation.latitude},${userLocation.longitude}&navigate=yes&z=10`);
    window.open(`waze://?q=${element}&navigate=yes&zoom=15`);
    // window.open(`waze://?q=${element}&zoom=17`);
  }else{ 
    window.open(`waze://?ll=${element}&navigate=yes&zoom=17`);
  }
}

function mapsNav(){ 
  window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude}%2C${userLocation.longitude}&destination=${element}&travelmode=driving`, "_blank");
}
console.log(endcoord)
console.log(element)

return (
  <div className="App">

    {/* <h1>just testing</h1> */}
    <header className="App-header">
      
      <img src={logo} className='logo' alt="logo" />    
    <div className='filesselection'>
      <InputLoec className="file" type="file" name="uploadLoec" id="uploadLoec" onChange={testLoecFile}></InputLoec>
      <InputCoord className="file" type="file" name="upload" id="uploadCoord" onChange={testCoordFile}></InputCoord>
      {/* <InputLoec className="file" type="file" name="uploadLoec" id="uploadLoec" onChange={readUploadLoecFile}></InputLoec>
      <InputCoord className="file" type="file" name="upload" id="uploadCoord" onChange={readUploadCoordenadasFile}></InputCoord> */}
    </div>
    
      {/* <div className='filesselection'>
        <form>
            <label htmlFor="upload">Importar LOEC</label>
            
            <input
                type="file"
                name="uploadLoec"
                id="uploadLoec"
                onChange={readUploadLoecFile}
            />
        </form>
        <form>
            <label htmlFor="upload">Coordenadas</label>
            
            <input
                type="file"
                name="upload"
                id="uploadCoord"
                onChange={readUploadCoordenadasFile}
            />
        </form>
      </div>       */}
      <button className="container-btn-file-blue" onClick={refreshPage}> <img src={refresh} alt="refreshlogo" />Recarregar Página</button>

    </header>
      
    <div className='App-body'>

      
        {lista.length !== 0 && coordLista.length !== 0 ?
          
        <div className='screen'>
          
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
                  <h4>  Qtd de Objetos neste ponto: </h4> <h2>{listaDeEntrega[index][1].length}</h2>
                </div>
                <UlObjetos> 
                  
                  {listaDeEntrega[index][1].map((OBJETO) => (
                    <li key={OBJETO}>{OBJETO}</li>
                  ))}
                  
                </UlObjetos>  
              </div>
              
              <div className='navinfo'>
                
                <h4>  Endereço: {listaDeEntrega[index][0]}</h4>

                {endcoord === undefined ? <h6> Coordenadas: <p>Informações indisponíveis no arquivo de coordenadas,<br></br>coordenadas baseadas pelo endereço informado</p><p className='alert'>ATENÇÃO: endereço sem coordenada <br></br>cadastrada, possível CEP incorreto</p><p style={{display: "none"}} id='Coordenadas'>{element}</p></h6> : <h6> Coordenadas: <p id='Coordenadas'>{element}</p></h6> }
              
                <h2>Escolha o App de Navegação:</h2>
                <div className='navapps'>
                  <img src={maps} alt="logomaps" onClick={() => mapsNav()} />
                  <img src={waze} alt="logowaze" onClick={() => wazeNav()} />
                </div>

              </div>             
            </div>
          </div>

            : <h4> CARREGA A LISTA ANIMAL</h4>}
            
      
        {/* {lista.length !== 0 && coordLista.length !== 0 ? <Intro key={index} /> : ''} */}
    </div>
  </div>
  );
}

const UlObjetos = styled.ul`
  
  // display: grid;
  grid-template-columns: 140px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 40px;
  max-height: 120px; 
  width: 170px;
  border-radius: 5px;
  padding: 10px 20px 10px 40px;

  background-color: grey;
  justify-self: center;
  justify-content: space-between;

  li {
    text-align: center;
    font-size: 1rem;
    width: 140px;
    margin-left: 10px;
    // list-style: none;
    list-style: decimal;
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
  }
  
  @media screen and (min-width: 375px) {
    height: 68px;
  }
`
export default App;