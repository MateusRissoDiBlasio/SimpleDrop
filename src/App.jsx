import Logo from './components/logoanimation/logo';
import'./components/logoanimation/animation.css';
import waze from './imgs/logowaze.png';
import maps from './imgs/logomaps.png';
import PdfIcon from './components/pdficon.jsx'
import {InfoIcon2} from './components/infoicon.jsx';
import MapIcon from './components/mapicon.jsx';
import FileDownloadIcon from './components/downloadicon.jsx';
import checkbox from './imgs/checkbox.png';
import SUICO from './imgs/maps/306/SUICO.png'
import BRAUNES from './imgs/maps/306/BRAUNES.png'


import { useState, useEffect } from 'react';
import './App.css';
import * as xlsx from 'xlsx';
import styled from 'styled-components';
import './responsive.css';
import { InputLoec } from './components/inputs';
import { InputCoord } from './components/inputs';
import { Page, Text, View, Image, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
// import Intro from './NavigationMap';
// import refresh from './imgs/icons/refreshpagetest.png';
// import { isVisible } from '@testing-library/user-event/dist/utils';
// import Boxcalc from './components/boxcalc';
// import { Document, Page, Text, View, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

export function App() {

  let mapBairro = [{id: BRAUNES, download: './mapsDownload/306/BRAUNES.svg'}, {id: SUICO, download: './mapsDownload/306/SUICO.svg'}]

  const [lista, setLista] = useState([]);
  const [coordLista, setCoordLista] = useState([]);
  let [index, setIndex] = useState(0);
  var [listaDeEntrega] = useState([]);
  
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const date = String(today.getDate()).padStart(2, '0');
  const year = String(today.getFullYear());
  var filename = "Lista - " + year + "-" + month + "-" + date;

  const [showContent, setShowContent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  

      const toggleContent = () => {
        setShowContent(!showContent);
        setIsVisible(true);
      };

      if (showContent === true && isVisible === true){
          setTimeout(() => {;
            window.scrollTo(
              {
                behavior: 'smooth',
                top: 880
              }
            );
          },300);
          setIsVisible(false);
      }

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
        
        // console.log(QtdPontosDeEntrega);
        // console.log(QtdPontos <= 1);
        // console.log(QtdPontos);


        if(QtdPontos > 1){
    
          let Loec = [];
          for (let i = 0 ; i <= QtdPontos; i++){
          var Pontos = json.filter(ponto => (ponto.GRUPO === i));
          Loec.push(Pontos);
          delete Loec[0];

          }

          // console.log(Loec)
        
        
          // console.log(Loec[1][0].OBJETO);

          if(Loec[1][0].OBJETO !== undefined){
            // console.log(Loec)
            
            let ArrayToDisplay = [];
            for (let i = 1 ; i <= QtdPontos; i++){

            const PontoAtual = Loec[i][0].GRUPO;

            const Endereco = Loec[i][0].ENDEREÇO;

            const Objetosreturn = Loec[i].map(ponto => (ponto.OBJETO));

            const Objetos = Objetosreturn.sort();

            const QtdObjetos = Objetos.length;
            
            const Coordenadas = Loec[i][0].COORDENADAS;

            const Distrito = Loec[i][0].DISTRITO;

            const Bairro = Loec[i][0].BAIRRO;

            ArrayToDisplay.push([QtdPontos, PontoAtual, Endereco, QtdObjetos, Objetos, Coordenadas, Distrito, Bairro]);
                
            }
            setLista([ArrayToDisplay]);
            // console.log(ArrayToDisplay);
            // console.log(lista);
          }else{
            setDisabled(false);
            alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Loec, confira o arquivo carregado');
              document.getElementById('uploadLoec').value='';
              // console.log(document.getElementById('uploadLoec').value);
          }
            
        }else if (QtdPontos <= 1){
          setDisabled(false);
          alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
          // console.log(document.getElementById('uploadLoec').value);
          document.getElementById('uploadLoec').value='';
          // console.log(document.getElementById('uploadLoec').value);
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
        

        var CoordOrdemDeEntrega = new Set(coordjson.map(grupo => (grupo.TRECHO)));

        var QtdCoordDeEntrega = [...CoordOrdemDeEntrega];

        var QtdPontos = QtdCoordDeEntrega.length;

        
        if(QtdPontos > 1){

          let Loec = [];
          for (let i = 0 ; i <= QtdPontos; i++){
            
            var PontosEmSequencia = coordjson.filter(ponto => (ponto.TRECHO === i));
            Loec.push(PontosEmSequencia);
            // delete Loec[0];
          }
          // console.log(Loec);

          if(Loec[1][0].COORDENADAS !== undefined){

            let ArrayCoordToDisplay = [];
            for (let i = 1 ; i <= QtdPontos; i++){
              

              const NumeroDeOrdem = Loec[i][0].TRECHO;

              const PontosDeEntrega = Loec[i][0].PONTOS;

              const Endereco = Loec[i][0].ENDEREÇO;

              const NumeroDeEntrega = Loec[i][0].NUMERO;
              
              const Coordenadas = Loec[i][0].COORDENADAS;

              ArrayCoordToDisplay.push([NumeroDeOrdem, PontosDeEntrega, Endereco, NumeroDeEntrega, Coordenadas]);
                
            }
            setCoordLista([ArrayCoordToDisplay]);
            // console.log(ArrayCoordToDisplay);
          }else{
              setDisabled(false);
              alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Coordenadas, confira o arquivo carregado');
              document.getElementById('uploadCoord').value='';
              // console.log(document.getElementById('uploadCoord').value);
          }
        }else if (QtdPontos <= 1){
          setDisabled(false);
          alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
          // console.log(document.getElementById('uploadCoord').value);
          document.getElementById('uploadCoord').value='';
          // console.log(document.getElementById('uploadCoord').value);
        }
      };
      readercoord.readAsArrayBuffer(e.target.files[0]);  
    }
  }

  var allowedExtensions = ["ods", "xlsx"];
  // console.log(allowedExtensions)

  const [disabled, setDisabled] = useState(false);

  function testLoecFile(e) {

    var loecFileInput = document.getElementById('uploadLoec');
    var loecFilePath = loecFileInput.value;

    // console.log(loecFilePath);

    // function getFileExtension(filename) {
    //   return filename.split('.').pop();
    // }
    // console.log(getFileExtension(loecFilePath));
    // console.log(loecFilePath.includes(allowedExtensions[0]) || loecFilePath.includes(allowedExtensions[1]));
    
    if (loecFilePath.includes(allowedExtensions[0]) || loecFilePath.includes(allowedExtensions[1])){
      setDisabled(true);
      readUploadLoecFile(e);
      setTimeout(() => {setDisabled(false)},2000);

    }else{
      
      alert(`Este arquivo de Loec não é válido, tente novamente. \n\nFormatos aceitos:  ${allowedExtensions[0]}  e  ${allowedExtensions[1]}.`);
      document.getElementById('uploadLoec').value='';
    
    }
  }

  function testCoordFile(e) {

    var coordFileInput = document.getElementById('uploadCoord');
    var coordFilePath = coordFileInput.value;

    // console.log(coordFilePath);

    function getFileExtension(filename) {
      return filename.split('.').pop();
    }
    console.log(getFileExtension(coordFilePath));
    if (coordFilePath.includes(allowedExtensions[0]) || coordFilePath.includes(allowedExtensions[1])){
      setDisabled(true);
      readUploadCoordenadasFile(e);
      setTimeout(() => {setDisabled(false)},2000);
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

  let compare = [];
  let compareCoord = [];

  // console.log(lista);
  let ruasSemCoordenadas = '';

  if (lista.length !== 0 && coordLista.length !== 0){

    for( var i = 0; i < lista[0].length; i++){

      const compareAdress = lista[0][i][2];

      compare.push(compareAdress);
      // console.log(compareAdress);

    }
  // console.log(coordLista);

    for( var o = 0; o < coordLista[0].length; o++){

      //AQUI FOI MEXIDO
      const compareCoordAdress = coordLista[0][o][2] + " " + coordLista[0][o][3];
      // AJUSTAR PARA ORDENAR PERFEITAMENTE
      
      // const compareCoordAdress = coordLista[0][o][2];

      compareCoord.push(compareCoordAdress);

      // console.log(compareCoord);

    }
    
    let intersection = compare.filter(x => !compareCoord.includes(x));
    // console.log(intersection);
    // setSemCoordenadas(intersection);

    let itemsToRemove = [];
    
    for( var z = 0; z < intersection.length; z++ ){

      for ( var y = 0; y < compareCoord.length; y++ ){
      
        if(intersection[z].includes(compareCoord[y])){

        let adressesItemsToRemove = intersection[z] ;
        itemsToRemove.push(adressesItemsToRemove);
        }
      }
      // console.log(itemsToRemove);
    }
    

    let foraDasCoordenadas = intersection.filter(x => !itemsToRemove.includes(x));
    foraDasCoordenadas.sort();

    // console.log(foraDasCoordenadas)
    
    let listaFinal = compareCoord;
    
    // console.log(compareCoord);
    intersection.reverse();
   
    ruasSemCoordenadas = intersection.sort();  
   
    
    // console.log(intersection);
    // console.log(intersection.length);
  
    for( var zy = 0; zy < intersection.length; zy++ ){

      for ( var xy = 0; xy < compareCoord.length; xy++ ){ 

        if(intersection[zy].includes(compareCoord[xy])){

          let somaindex = compareCoord.indexOf(compareCoord[xy]) + 1;
          listaFinal.splice(somaindex,0,intersection[zy]);
          xy++;  
        }
      }
    }

    let indexlistafinal = listaFinal.length;

    for( var d = 0; d < foraDasCoordenadas.length; d++){

      listaFinal.splice(indexlistafinal,0,foraDasCoordenadas[d]);
      indexlistafinal++;
    }
    

    for( var e = 0; e < listaFinal.length; e++){

      for( var f = 0; f < lista[0].length; f++){
        if(listaFinal[e] === lista[0][f][2]){

                listaFinal.push(lista[0][f][4]);
                                  
                const endfinal = listaFinal[e];
                const objfinal = lista[0][f][4];
                const bairrofinal = lista[0][f][7]
              
                listaDeEntrega.push([endfinal, objfinal, bairrofinal]);
        }
      }
    }
  } 

  const ruasSemCoordenadasTamanho = ruasSemCoordenadas.length
  const listaPDF = listaDeEntrega;
  if (lista.length !== 0 && coordLista.length !== 0){
    listaPDF.length = lista[0].length;
  }
  
  
let mapaBairro = '';
let downloadMapaBairro = '';
if (lista.length !== 0 && coordLista.length !== 0){  

  if(mapBairro.some(bairro => bairro.id.includes(listaDeEntrega[index][2]))){
    let mapView = mapBairro.filter(bairro => bairro.id.includes(listaDeEntrega[index][2]));

    // console.log(mapView[0].id);
    mapaBairro = mapView[0].id;
    downloadMapaBairro = mapView[0].download;
    
  }
}
  // console.log(mapBairro)
  // console.log(downloadMapaBairro);

  // console.log(listaDeEntrega)
  // console.log(listaPDF)

const styles = StyleSheet.create({
  page: { padding: 25, backgroundColor: '#FFF' },
  section: { margin: 10, padding: 10, flexGrow: 1, fontSize: 10}
});


const MyDocument = () => (
  <Document>
    <Page  wrap size="A4" style={styles.page}>
      <View style={styles.section}>
            <Text style={{ fontSize: 30, marginBottom: 10}}>LISTA DE ENTREGA DIST [ {lista[0][0][6]} ]</Text>
            
            {listaPDF.map((item, index) => (
              <View wrap={false} key={index} style={{ marginBottom: 20, borderBottom: 0.5, paddingBottom: 10}}>

                {index === (listaPDF.length - ruasSemCoordenadasTamanho) ? <Text style={{ fontSize: 20, marginBottom: 10}}>SEM COORDENADAS</Text> : <Text></Text>}
                <Text style={{ fontSize: 10, marginBottom: 5, alignContent: 'center'}}>Ponto de Entrega:  {index + 1}  de  {listaPDF.length}</Text>
                <Text style={{ fontSize: 10, marginBottom: 5, alignContent: 'center'}}>Endereço:  {item[0]} <Image src={checkbox} style={{width: 30}} /></Text>
                <Text style={{marginBottom: 5}}>Objeto(s) :</Text> 
                  <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>               
                  {item[1].map((objetos, index)=> (
                    <Text key={index} style={{width: '23.5%', padding: "1 0 1 0", boxSizing: 'border-box', textAlign: 'right'}}>{index + 1} - {objetos}</Text>
                  ))}
              </View>
                
              </View>
            ))}
        
      </View>
    </Page>
  </Document>
);

var ListaButton = () => (
      <PDFDownloadLink style={{paddingRight: 8, paddingLeft: 8, fontSize: 16, fontWeight: 500, textDecoration: 'none', color: 'white'}} document={<MyDocument />} fileName={filename}>
        <p style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginTop: 0}}>Gerar Lista<PdfIcon /></p>
      </PDFDownloadLink>
      );

  // console.log(ruasSemCoordenadas);
  let time = ruasSemCoordenadas;
  

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
  }

  useEffect(() =>{
    getUserLocation();

  }, [setUserLocation] );

  // const [cidade, setCidade] = useState(null);
  // const [estado, setEstado] = useState(null);

  // const [setCidade] = useState(null);
  // const [setEstado] = useState(null);

  // if(lista.length !== 0 && coordLista.length !== 0){


    // SÓ FUNCIONA SE O API ESTIVER EM USO

  //   async function getCidadeEstado(latitude, longitude) {
  //     const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    
  //     try {
  //       const response = await fetch(apiUrl);
  //       const data = await response.json();
  //       // console.log(data)
    
  //       if (data.results && data.results.length > 0) {
  //         const results = data.results[0];
  //         let cidade = null;
  //         let estado = null;
    
  //         // Procura pela cidade e estado nos componentes do resultado
  //         for (const component of results.address_components) {
  //           if (component.types.includes('administrative_area_level_2')){
  //             cidade = component.long_name;
  //           } 
  //           if(component.types.includes('administrative_area_level_1' )){
  //             estado = component.short_name;
  //           }
  //         }
    
  //         return { cidade, estado };
  //       } else {
  //         return null; // Retorna null se não encontrar resultados
  //       }
  //     } catch (error) {
  //       console.error("Erro ao obter informações de geocoding:", error);
  //       return null;
  //     }
  //   }
    
  //   if(lista.length !== 0 && coordLista.length !== 0){
  //     getCidadeEstado(userLocation.latitude, userLocation.longitude)
  //     .then(result => {
  //       if (result) {
          
  //         setCidade(result.cidade);
  //         setEstado(result.estado);

  //       } else {
  //         console.log("Não foi possível encontrar a cidade e o estado.");
  //       }
  //     });
  //   }
  // }

  if (lista.length !== 0 && coordLista.length !== 0){

    const enderecoatual = listaDeEntrega[index][0];
    // console.log(enderecoatual);

    if (coordLista.length !== 0){
      // console.log(lista[0].length);
      // console.log(coordLista[0].length);


      for (var ind = 0; ind < coordLista[0].length; ind++){

        if(enderecoatual === (coordLista[0][ind][2] + " " + coordLista[0][ind][3])){

        var element = coordLista[0][ind][4];
        var endcoord = coordLista[0][ind][4];
        } else if(endcoord === undefined || endcoord === "undefined" ){

          // element = enderecoatual + ", " + cidade + ", " + estado
          element = enderecoatual + ", Nova Friburgo, RJ";
          // element = enderecoatual
        }
      }
    }
  }

  // console.log(element);
  // console.log(endcoord);


  const refreshAnimation = document.getElementById('Capa_1');
  function refreshPage(){
    refreshAnimation.classList.add('selected');
    setTimeout(() => {window.location.reload(false)},1000);
  }

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
  // console.log(endcoord)
  // console.log(element)




  return (
    <div className="App">

      {/* <h1>just testing</h1> */}
      <header className="App-header">
        
        {/* <img src={logo} className='logo' alt="logo" />     */}
        <Logo />
      <div className='filesselection'>
        <InputLoec disabled={disabled} className="file" type="file" name="uploadLoec" id="uploadLoec" onChange={testLoecFile}></InputLoec>
        <InputCoord disabled={disabled} className="file" type="file" name="upload" id="uploadCoord" onChange={testCoordFile}></InputCoord>
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
        <button className="container-btn-file-blue" onClick={refreshPage}> 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            id="Capa_1"
            width="45"
            height="45"
            version="1.1"
            viewBox="0 0 50.926 49.024"
          >
            <g id="setas">
              <path
                id="seta-baixo"
                d="m35.801 32.734-1.654-1.07a.68.68 0 0 0-.917.167 7.2 7.2 0 0 1-5.847 2.954c-1.94 0-3.8-.777-5.152-2.14l.529-.175a.682.682 0 0 0 .239-1.153l-3.78-3.369a.69.69 0 0 0-.666-.138.68.68 0 0 0-.452.508l-1.028 4.958a.682.682 0 0 0 .88.783l.878-.29c2.011 2.762 5.12 4.342 8.552 4.342 3.402 0 6.617-1.649 8.601-4.41a.682.682 0 0 0-.183-.967"
              ></path>
              <path
                id="seta-cima"
                d="M36.425 22.573a.69.69 0 0 0-.665-.138l-.879.29c-2.011-2.762-5.12-4.342-8.552-4.342a10.61 10.61 0 0 0-8.601 4.41.683.683 0 0 0 .183.967l1.654 1.07a.677.677 0 0 0 .916-.167 7.2 7.2 0 0 1 5.848-2.954c1.939 0 3.8.777 5.152 2.14l-.53.175a.68.68 0 0 0-.238 1.153l3.78 3.369a.679.679 0 0 0 1.118-.37l1.027-4.958a.68.68 0 0 0-.213-.645"
              ></path>
            </g>
            <path
              id="tela"
              d="M48.472 2.464H5.24a2.956 2.956 0 0 0-2.953 2.953v38.732a2.956 2.956 0 0 0 2.953 2.953h43.232a2.956 2.956 0 0 0 2.952-2.953V5.417a2.956 2.956 0 0 0-2.952-2.953m-8.903 4.958c0-.602.488-1.09 1.09-1.09h1.09c.603 0 1.09.488 1.09 1.09v1.236a1.09 1.09 0 0 1-1.09 1.09h-1.09a1.09 1.09 0 0 1-1.09-1.09zm-5.07 0c0-.602.488-1.09 1.09-1.09h1.09c.602 0 1.09.488 1.09 1.09v1.236a1.09 1.09 0 0 1-1.09 1.09h-1.09a1.09 1.09 0 0 1-1.09-1.09zM47.88 43.558H5.83V13.024h42.05zm.028-34.9a1.09 1.09 0 0 1-1.09 1.09h-1.09a1.09 1.09 0 0 1-1.09-1.09V7.422c0-.602.488-1.09 1.09-1.09h1.09c.602 0 1.09.488 1.09 1.09z"
            >
            </path>
          </svg>
          {/* <img src={refresh} alt="refreshlogo" /> */}
          Recarregar Página
        </button>

      </header>
        
      <div className='App-body'>

        
          {lista.length !== 0 && coordLista.length !== 0 ?
            
          <div className='screen'>
            
              <div className='nav'>
                <button className='next10Prev' disabled={lista[0][index][1] < 11 ? true : false} onClick={() => setIndex(index - 10)}>10 Anteriores</button>
                <button className='nextPrev' disabled={index === 0 ? true : false} onClick={() => setIndex(index - 1)}>Ponto de entrega Anterior</button>
                <button className='nextPrev' disabled={index >= lista[0][0][0]-1 ? true : false} onClick={() => setIndex(index + 1)}>Próximo ponto de entrega</button>
                <button className='next10Prev' disabled={index >= lista[0][0][0]-10 ? true : false} onClick={() => setIndex(index + 10)}>10 Posteriores</button>
              </div>
              
              <div className='info'>    

                <div className='pontos'>
                
                  <h4>Distrito </h4> <h2>{lista[0][0][6]}</h2>
                
                </div>            
                
                <div className='pontos'>   

                
                  <h4>  Ponto de entrega </h4> <h2>{lista[0][index][1]}</h2> <h4>de</h4> <h2>{lista[0][index][0]} </h2>
                  {/* <h4>  Pontos de entrega: </h4> <h2>{lista[0][index][0]} </h2>
                  <h4>  Ponto de entrega: </h4> <h2>{lista[0][index][1]} </h2> */}
                  
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
                  
                    <h6>Endereço: <p className='endereco'>{listaDeEntrega[index][0]}</p> </h6>
                    <h6>Bairro: <p className='endereco'>{listaDeEntrega[index][2]}</p> </h6>
                    <h6 className='mapicons'><a href={mapaBairro} target="_blank" rel="noopener noreferrer"><MapIcon /></a> Mapa <FileDownloadIcon href={downloadMapaBairro} name={`${listaDeEntrega[index][2]}.svg`}/></h6>

                  {endcoord === undefined || endcoord === "undefined" ? <h6> Coordenadas: <p>Informações indisponíveis no arquivo de coordenadas,<br></br>coordenadas baseadas pelo endereço informado</p><p className='alert'>ATENÇÃO: endereço sem coordenada <br></br>cadastrada, possível CEP incorreto</p><p style={{display: "none"}} id='Coordenadas'>{element}</p></h6> : <h6> Coordenadas: <p id='Coordenadas'>{element}</p></h6> }
                
                  <h2>Escolha o App de Navegação:</h2>
                  <div className='navapps'>
                    <img src={maps} alt="logomaps" onClick={() => {getUserLocation(); mapsNav()}} />
                    <img src={waze} alt="logowaze" onClick={() => {getUserLocation(); wazeNav()}} />
                  </div>

                </div>  
                
                    {lista.length !== 0 && coordLista.length !== 0 ?

                    <div className='noCoordContainer'>
                      
                      <p className='noCoord'> <InfoIcon2 /> Há {time.length} pontos de entrega sem cadastro de coordenadas</p>
                      <p className='click'>clique<button onClick={toggleContent}>aqui</button>para ver</p>
                      
                      { showContent ?
                      <div> 
                        <p className='noCoord'>Endereços desta Loec sem coordenadas cadastradas.</p>
                        <p className='noCoord'>Ordem Alfabética</p>
                        <UlRuas> 
                          {time.map((rua) => (
                            <li key={rua}>{rua}</li>
                          ))}
                        </UlRuas> 
                      </div> : ''}
                          <ListaButton />
                      {/* <PDFViewer style={{ width: '100%', height: '50vh' }}>
                        <MyDocument />
                      </PDFViewer> */}
                    </div> : ''}
                    
                          
              </div>
            </div>

              : <h4> CARREGA A LISTA ANIMAL</h4>}

              {/* <Boxcalc /> */}
              
        
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
  padding: 10px 30px 10px 30px;
  margin-block-end: 0;
  background-color: grey;
  justify-self: center;
  justify-content: space-between;

  li {
    text-align: center;
    font-size: 1rem;
    width: 140px;
    margin-left: 20px;
    // list-style: none;
    list-style: decimal;
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
  }
  
  @media screen and (min-width: 375px) {
    // display: flex;
    flex-direction: column;
    align-items: center;
    height: 68px;
       
  }
`
const UlRuas = styled.ul`
  
  display: grid;
  grid-template-columns: 140px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 40px;
  max-height: 120px; 
  width: 380px;
  border-radius: 5px;
  padding: 20px;
  margin-block-end: 0;
  background-color: grey;
  justify-self: center;
  justify-content: space-between;
  margin-bottom: 10px;

  li {
    text-align: left;
    font-size: 1rem;
    width: 380px;
    line-height: 20px;
    list-style: none;
    // color: red;
    // list-style: decimal;
    font-family: "Roboto", sans-serif;
  }
  
  @media screen and (max-width: 375px) {
    // display: flex;
    flex-direction: column;
    align-items: center;
    height: 68px;
    width: 300px;
    li{
      font-size: 0.8rem;
      width: 300px;
    }
  }

  @media screen and (min-width: 768px) {
    margin-top: 0;
  }
`
export default App;