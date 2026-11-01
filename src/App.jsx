import Logo from './components/logoanimation/logo.jsx';
import './components/logoanimation/animation.css';
import waze from './imgs/logowaze.png';
import maps from './imgs/logomaps.png';
import PdfIcon from './components/pdficon.jsx';
import { InfoIcon2 } from './components/infoicon.jsx';
import MapIcon from './components/mapicon.jsx';
import FileDownloadIcon from './components/downloadicon.jsx';
import checkbox from './imgs/checkbox.png';
import SUICO from './imgs/maps/306/SUICO.png';
import BRAUNES from './imgs/maps/306/BRAUNES.png';
import BarcodeForPDF from './components/barcodecomponent.jsx';

import { useState, useEffect, useMemo } from 'react';
import './App.css';
import * as xlsx from 'xlsx';
import styled from 'styled-components';
import './responsive.css';
import { InputLoec, InputCoord } from './components/inputs.jsx';
import { Page, Text, View, Image, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

export default function App() {
  let mapBairro = [{ id: BRAUNES, download: './mapsDownload/306/BRAUNES.svg' }, { id: SUICO, download: './mapsDownload/306/SUICO.svg' }];

  const [lista, setLista] = useState([]);
  const [coordLista, setCoordLista] = useState([]);
  const [index, setIndex] = useState(0);
  // const [listaDeEntrega] = useState([]);
  
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const date = String(today.getDate()).padStart(2, '0');
  const year = String(today.getFullYear());
  var filename = "Lista - " + year + "-" + month + "-" + date;
  var currentDate = date + '/' + month + '/' + year;

  const [showContent, setShowContent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const allowedExtensions = ["ods", "xlsx"];

  const toggleContent = () => {
    setShowContent(!showContent);
    setIsVisible(true);
  };

  useEffect(() => {
    if (showContent && isVisible) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 880,
          behavior: 'smooth'
        });
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showContent, isVisible]);

  useEffect(() => {
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
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // comentado em 31/10/2026 para testes
  // const readUploadLoecFile = (e) => {
  //   e.preventDefault();
  //   if (e.target.files) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = e.target.result;
  //       const workbook = xlsx.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const json = xlsx.utils.sheet_to_json(worksheet);

  //       var PontosDeEntrega = new Set(json.map(grupo => (grupo.GRUPO)));
  //       var QtdPontosDeEntrega = [...PontosDeEntrega];
  //       var QtdPontos = QtdPontosDeEntrega.length;

  //       if (QtdPontos > 1) {
  //         let Loec = [];
  //         for (let i = 0; i <= QtdPontos; i++) {
  //           var Pontos = json.filter(ponto => (ponto.GRUPO === i));
  //           Loec.push(Pontos);
  //         }

  //         if (Loec[1][0].OBJETO !== undefined) {
  //           let ArrayToDisplay = [];
  //           for (let i = 1; i <= QtdPontos; i++) {
  //             if (!Loec[i][0]?.GRUPO) {
  //               alert("Erro: Campo 'GRUPO' com falhas no preenchimento!");
  //             }
  //             const PontoAtual = Loec[i][0].GRUPO;
  //             const Endereco = Loec[i][0].ENDEREÇO;
  //             const Objetosreturn = Loec[i].map(ponto => (ponto.OBJETO));
  //             const Objetos = Objetosreturn.sort();
  //             const QtdObjetos = Objetos.length;
  //             const Coordenadas = Loec[i][0].COORDENADAS;
  //             const Distrito = Loec[i][0].DISTRITO;

  //             ArrayToDisplay.push([QtdPontos, PontoAtual, Endereco, QtdObjetos, Objetos, Coordenadas, Distrito]);
  //           }
  //           setLista([ArrayToDisplay]);
  //         } else {
  //           setDisabled(false);
  //           alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Loec, confira o arquivo carregado');
  //           document.getElementById('uploadLoec').value = '';
  //         }
  //       } else if (QtdPontos <= 1) {
  //         setDisabled(false);
  //         alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
  //         document.getElementById('uploadLoec').value = '';
  //       }
  //     };
  //     reader.readAsArrayBuffer(e.target.files[0]);
  //   }
  // };

  // const readUploadCoordenadasFile = (e) => {
  //   e.preventDefault();
  //   if (e.target.files) {
  //     const readercoord = new FileReader();
  //     readercoord.onload = (e) => {
  //       const coorddata = e.target.result;
  //       const coordworkbook = xlsx.read(coorddata, { type: "array" });
  //       const coordsheetName = coordworkbook.SheetNames[0];
  //       const coordworksheet = coordworkbook.Sheets[coordsheetName];
  //       const coordjson = xlsx.utils.sheet_to_json(coordworksheet);

  //       var CoordOrdemDeEntrega = new Set(coordjson.map(grupo => (grupo.TRECHO)));
  //       var QtdCoordDeEntrega = [...CoordOrdemDeEntrega];
  //       var QtdPontos = QtdCoordDeEntrega.length;

  //       if (QtdPontos > 1) {
  //         let Loec = [];
  //         for (let i = 0; i <= QtdPontos; i++) {
  //           var PontosEmSequencia = coordjson.filter(ponto => (ponto.TRECHO === i));
  //           Loec.push(PontosEmSequencia);
  //         }

  //         if (Loec[1][0].COORDENADAS !== undefined) {
  //           let ArrayCoordToDisplay = [];
  //           for (let i = 1; i <= QtdPontos; i++) {
  //             const NumeroDeOrdem = Loec[i][0].TRECHO;
  //             const PontosDeEntrega = Loec[i][0].PONTOS;
  //             const Endereco = Loec[i][0].ENDEREÇO;
  //             const NumeroDeEntrega = Loec[i][0].NUMERO;
  //             const Coordenadas = Loec[i][0].COORDENADAS;
  //             const Bairro = Loec[i][0].BAIRRO;

  //             ArrayCoordToDisplay.push([NumeroDeOrdem, PontosDeEntrega, Endereco, NumeroDeEntrega, Coordenadas, Bairro]);
  //           }
  //           setCoordLista([ArrayCoordToDisplay]);
  //         } else {
  //           setDisabled(false);
  //           alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Coordenadas, confira o arquivo carregado');
  //           document.getElementById('uploadCoord').value = '';
  //         }
  //       } else if (QtdPontos <= 1) {
  //         setDisabled(false);
  //         alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
  //         document.getElementById('uploadCoord').value = '';
  //       }
  //     };
  //     readercoord.readAsArrayBuffer(e.target.files[0]);
  //   }
  // };

  // function testLoecFile(e) {
  //   var loecFileInput = document.getElementById('uploadLoec');
  //   var loecFilePath = loecFileInput.value;
  //   if (loecFilePath.includes(allowedExtensions[0]) || loecFilePath.includes(allowedExtensions[1])) {
  //     setDisabled(true);
  //     readUploadLoecFile(e);
  //     setTimeout(() => { setDisabled(false); }, 2000);
  //   } else {
  //     alert(`Este arquivo de Loec não é válido, tente novamente. \n\nFormatos aceitos:  ${allowedExtensions[0]}  e  ${allowedExtensions[1]}.`);
  //     document.getElementById('uploadLoec').value = '';
  //   }
  // }

  // function testCoordFile(e) {
  //   var coordFileInput = document.getElementById('uploadCoord');
  //   var coordFilePath = coordFileInput.value;
  //   if (coordFilePath.includes(allowedExtensions[0]) || coordFilePath.includes(allowedExtensions[1])) {
  //     setDisabled(true);
  //     readUploadCoordenadasFile(e);
  //     setTimeout(() => { setDisabled(false); }, 2000);
  //   } else {
  //     alert(`Este arquivo de Coordenadas não é válido, tente novamente. \n\nFormatos aceitos:  ${allowedExtensions[0]}  e  ${allowedExtensions[1]}.`);
  //     document.getElementById('uploadCoord').value = '';
  //   }
  // }

  // let compare = [];
  // let compareCoord = [];
  // let ruasSemCoordenadas = '';

  // if (lista.length !== 0 && coordLista.length !== 0) {
  //   for (var i = 0; i < lista[0].length; i++) {
  //     const compareAdress = lista[0][i][2];
  //     compare.push(compareAdress);
  //   }

  //   for (var o = 0; o < coordLista[0].length; o++) {
  //     const compareCoordAdress = coordLista[0][o][2] + " " + coordLista[0][o][3];
  //     compareCoord.push(compareCoordAdress);
  //   }

  //   let intersection = compare.filter(x => !compareCoord.includes(x));
  //   let itemsToRemove = [];

  //   for (var z = 0; z < intersection.length; z++) {
  //     for (var y = 0; y < compareCoord.length; y++) {
  //       if (intersection[z].includes(compareCoord[y])) {
  //         let adressesItemsToRemove = intersection[z];
  //         itemsToRemove.push(adressesItemsToRemove);
  //       }
  //     }
  //   }

  //   let foraDasCoordenadas = intersection.filter(x => !itemsToRemove.includes(x));
  //   foraDasCoordenadas.sort();

  //   let listaFinal = compareCoord;
  //   intersection.reverse();
  //   ruasSemCoordenadas = intersection.sort();

  //   let indexlistafinal = listaFinal.length;

  //   for (var d = 0; d < foraDasCoordenadas.length; d++) {
  //     listaFinal.splice(indexlistafinal, 0, foraDasCoordenadas[d]);
  //     indexlistafinal++;
  //   }

  //   listaDeEntrega.length = 0;
  //   for (var e = 0; e < listaFinal.length; e++) {
  //     for (var f = 0; f < lista[0].length; f++) {
  //       if (listaFinal[e] === lista[0][f][2]) {
  //         const endfinal = listaFinal[e];
  //         const objfinal = lista[0][f][4];
  //         listaDeEntrega.push([endfinal, objfinal]);
  //       }
  //     }
  //   }
  // }

  // const ruasSemCoordenadasTamanho = ruasSemCoordenadas.length;
  // const listaPDF = listaDeEntrega;
  // if (lista.length !== 0 && coordLista.length !== 0) {
  //   listaPDF.length = lista[0].length;
  // }

  // var element = '';
  // var endcoord = undefined;
  // var bairro = '';

  // if (lista.length !== 0 && coordLista.length !== 0) {
  //   if (listaDeEntrega[index]) {
  //     const enderecoatual = listaDeEntrega[index][0];
  //     for (var ind = 0; ind < coordLista[0].length; ind++) {
  //       if (enderecoatual === (coordLista[0][ind][2] + " " + coordLista[0][ind][3])) {
  //         element = coordLista[0][ind][4];
  //         endcoord = coordLista[0][ind][4];
  //         bairro = coordLista[0][ind][5];
  //       } else if (endcoord === undefined || endcoord === "undefined") {
  //         element = enderecoatual + ", Nova Friburgo, RJ";
  //         if (enderecoatual.includes(coordLista[0][ind][2])) {
  //           bairro = coordLista[0][ind][5];
  //         }
  //       }
  //     }
  //   }
  // }

  // let mapaBairro = '';
  // let downloadMapaBairro = '';
  // if (lista.length !== 0 && coordLista.length !== 0) {
  //   if (mapBairro.some(bairroCheck => bairroCheck.id.includes(bairro))) {
  //     let mapView = mapBairro.filter(bairroCheck => bairroCheck.id.includes(bairro));
  //     mapaBairro = mapView[0].id;
  //     downloadMapaBairro = mapView[0].download;
  //   }
  // }

  // function refreshPage() {
  //   const refreshAnimation = document.getElementById('Capa_1');
  //   if (refreshAnimation) refreshAnimation.classList.add('selected');
  //   setTimeout(() => { window.location.reload(); }, 1000);
  // }

  // function wazeNav() {
  //   if (endcoord === undefined) {
  //     window.open(`waze://?q=${encodeURIComponent(element)}&navigate=yes&zoom=15`);
  //   } else {
  //     window.open(`waze://?ll=${element}&navigate=yes&zoom=17`);
  //   }
  // }

  // function mapsNav() {
  //   if (userLocation) {
  //     window.open(`https://google.com{userLocation.latitude}%2C${userLocation.longitude}&destination=${encodeURIComponent(element)}&travelmode=driving`, "_blank");
  //   } else {
  //     window.open(`https://google.com{encodeURIComponent(element)}&travelmode=driving`, "_blank");
  //   }
  // }

  const readUploadLoecFile = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);

          var PontosDeEntrega = new Set(json.map(grupo => grupo.GRUPO));
          var QtdPontosDeEntrega = [...PontosDeEntrega];
          var QtdPontos = QtdPontosDeEntrega.length;

          if (QtdPontos > 1) {
            let Loec = [];
            for (let i = 0; i <= QtdPontos; i++) {
              var Pontos = json.filter(ponto => ponto.GRUPO === i);
              Loec.push(Pontos);
            }

            if (Loec[1] && Loec[1][0] && Loec[1][0].OBJETO !== undefined) {
              let ArrayToDisplay = [];
              for (let i = 1; i <= QtdPontos; i++) {
                if (!Loec[i] || !Loec[i][0] || !Loec[i][0].GRUPO) {
                  continue;
                }
                const PontoAtual = Loec[i][0].GRUPO;
                const Endereco = Loec[i][0].ENDEREÇO;
                const Objetosreturn = Loec[i].map(ponto => ponto.OBJETO);
                const Objetos = Objetosreturn.sort();
                const QtdObjetos = Objetos.length;
                const Coordenadas = Loec[i][0].COORDENADAS;
                const Distrito = Loec[i][0].DISTRITO;

                ArrayToDisplay.push([QtdPontos, PontoAtual, Endereco, QtdObjetos, Objetos, Coordenadas, Distrito]);
              }
              setLista([ArrayToDisplay]);
            } else {
              alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Loec, confira o arquivo carregado');
              document.getElementById('uploadLoec').value = '';
            }
          } else if (QtdPontos <= 1) {
            alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
            document.getElementById('uploadLoec').value = '';
          }
        } catch (err) {
          console.error("Erro ao ler LOEC:", err);
          alert("Ocorreu um erro no processamento do arquivo LOEC.");
        } finally {
          setDisabled(false);
        }
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const readUploadCoordenadasFile = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const readercoord = new FileReader();
      readercoord.onload = (evt) => {
        try {
          const coorddata = evt.target.result;
          const coordworkbook = xlsx.read(coorddata, { type: "array" });
          const coordsheetName = coordworkbook.SheetNames[0];
          const coordworksheet = coordworkbook.Sheets[coordsheetName];
          const coordjson = xlsx.utils.sheet_to_json(coordworksheet);

          var CoordOrdemDeEntrega = new Set(coordjson.map(grupo => grupo.TRECHO));
          var QtdCoordDeEntrega = [...CoordOrdemDeEntrega];
          var QtdPontos = QtdCoordDeEntrega.length;

          if (QtdPontos > 1) {
            let Loec = [];
            for (let i = 0; i <= QtdPontos; i++) {
              var PontosEmSequencia = coordjson.filter(ponto => ponto.TRECHO === i);
              Loec.push(PontosEmSequencia);
            }

            if (Loec[1] && Loec[1][0] && Loec[1][0].COORDENADAS !== undefined) {
              let ArrayCoordToDisplay = [];
              for (let i = 1; i <= QtdPontos; i++) {
                if (!Loec[i] || !Loec[i][0]) continue;
                const NumeroDeOrdem = Loec[i][0].TRECHO;
                const PontosDeEntrega = Loec[i][0].PONTOS;
                const Endereco = Loec[i][0].ENDEREÇO;
                const NumeroDeEntrega = Loec[i][0].NUMERO;
                const Coordenadas = Loec[i][0].COORDENADAS;
                const Bairro = Loec[i][0].BAIRRO;

                ArrayCoordToDisplay.push([NumeroDeOrdem, PontosDeEntrega, Endereco, NumeroDeEntrega, Coordenadas, Bairro]);
              }
              setCoordLista([ArrayCoordToDisplay]);
            } else {
              alert('Arquivo inválido, possível formatação incorreta ou não é arquivo de Coordenadas, confira o arquivo carregado');
              document.getElementById('uploadCoord').value = '';
            }
          } else if (QtdPontos <= 1) {
            alert('Arquivo inválido, possível formatação incorreta, confira o arquivo carregado');
            document.getElementById('uploadCoord').value = '';
          }
        } catch (err) {
          console.error("Erro ao ler Coordenadas:", err);
          alert("Ocorreu um erro no processamento do arquivo de coordenadas.");
        } finally {
          setDisabled(false);
        }
      };
      readercoord.readAsArrayBuffer(e.target.files[0]);
    }
  };

  function testLoecFile(e) {
    var loecFileInput = document.getElementById('uploadLoec');
    var loecFilePath = loecFileInput.value;
    const ext = loecFilePath.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(ext)) {
      setDisabled(true);
      readUploadLoecFile(e);
    } else {
      alert(`Este arquivo de Loec não é válido, tente novamente. \n\nFormatos aceitos: ${allowedExtensions.join(' e ')}.`);
      document.getElementById('uploadLoec').value = '';
    }
  }

  function testCoordFile(e) {
    var coordFileInput = document.getElementById('uploadCoord');
    var coordFilePath = coordFileInput.value;
    const ext = coordFilePath.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(ext)) {
      setDisabled(true);
      readUploadCoordenadasFile(e);
    } else {
      alert(`Este arquivo de Coordenadas não é válido, tente novamente. \n\nFormatos aceitos: ${allowedExtensions.join(' e ')}.`);
      document.getElementById('uploadCoord').value = '';
    }
  }

  // CORREÇÃO CRÍTICA: Junção perfeita das planilhas com contingência ordenada em ordem alfabética no fim da fila
  const dadosProcessados = useMemo(() => {
    let deliverList = [];
    let ruasSemCoordenadas = [];

    if (lista.length !== 0 && coordLista.length !== 0 && lista[0] && coordLista[0]) {
      const matrizLoec = lista[0];
      const matrizCoord = coordLista[0];

      // 1. Extrair os endereços mapeados da planilha de coordenadas (Rua + Número)
      const enderecosMapeadosComCoordenadas = matrizCoord.map(c => `${c[2]} ${c[3]}`);

      // 2. Filtrar quais pontos da LOEC possuem coordenadas correspondentes
      const pontosComCoordenadas = matrizLoec.filter(p => enderecosMapeadosComCoordenadas.includes(p[2]));

      // 3. Filtrar quais pontos da LOEC NÃO foram localizados no arquivo de coordenadas
      const pontosSemCoordenadas = matrizLoec.filter(p => !enderecosMapeadosComCoordenadas.includes(p[2]));

      // 4. Organizar os pontos órfãos rigorosamente em Ordem Alfabética pelo Endereço
      pontosSemCoordenadas.sort((a, b) => a[2].localeCompare(b[2]));

      // 5. Montar a fila final de entrega (Primeiro os geolocalizados, depois a repescagem alfabética)
      const listaFilaUnificada = [...pontosComCoordenadas, ...pontosSemCoordenadas];

      // 6. Estruturar no formato [Endereço, ListaDeObjetos] esperado pelo seu HTML e pelo PDF
      deliverList = listaFilaUnificada.map(p => [p[2], p[4]]);

      // 7. Salvar os nomes das ruas sem coordenadas para renderizar na caixinha de aviso
      ruasSemCoordenadas = pontosSemCoordenadas.map(p => p[2]);
    }

    const ruasSemCoordenadasTamanho = ruasSemCoordenadas.length;
    let listaPDF = [...deliverList];

    return {
      listaDeEntrega: deliverList,
      ruasSemCoordenadas,
      ruasSemCoordenadasTamanho,
      listaPDF
    };
  }, [lista, coordLista]);

  const { listaDeEntrega, ruasSemCoordenadas, ruasSemCoordenadasTamanho, listaPDF } = dadosProcessados;

  // CORREÇÃO CRÍTICA: Captura reativa dos dados de navegação atual
  const localizacaoAtual = useMemo(() => {
    var element = '';
    var endcoord = undefined;
    var bairro = '';

    if (lista.length !== 0 && coordLista.length !== 0 && lista[0] && coordLista[0] && listaDeEntrega[index]) {
      const enderecoatual = listaDeEntrega[index][0];
      const matrizCoord = coordLista[0];

      // Procura a rua correspondente na tabela de coordenadas para pegar o bairro e o par lat/long original
      const correspondente = matrizCoord.find(c => enderecoatual === `${c[2]} ${c[3]}`);

      if (correspondente) {
        element = correspondente[4];
        endcoord = correspondente[4];
        bairro = correspondente[5];
      } else {
        // Se cair aqui, significa que o ponto é um dos que foi jogado para o fim da fila (sem coordenadas cadastrada)
        element = enderecoatual + ", Nova Friburgo, RJ";
        
        // Tenta descobrir o bairro de forma aproximada se o nome da rua bater com algum trecho conhecido
        const correspondentePorAproximacao = matrizCoord.find(c => enderecoatual.includes(c[2]));
        if (correspondentePorAproximacao) {
          bairro = correspondentePorAproximacao[5];
        }
      }
    }

    let mapaBairro = '';
    let downloadMapaBairro = '';
    if (bairro && mapBairro) {
      let mapView = mapBairro.find(bairroCheck => bairroCheck.id.includes(bairro));
      if (mapView) {
        mapaBairro = mapView.id;
        downloadMapaBairro = mapView.download;
      }
    }

    return { element, endcoord, bairro, mapaBairro, downloadMapaBairro };
  }, [listaDeEntrega, coordLista, index, lista]);

  const { element, endcoord, bairro, mapaBairro, downloadMapaBairro } = localizacaoAtual;

  function refreshPage() {
    const refreshAnimation = document.getElementById('Capa_1');
    if (refreshAnimation) refreshAnimation.classList.add('selected');
    setTimeout(() => { window.location.reload(); }, 1000);
  }

  function wazeNav() {
    if (endcoord === undefined) {
      window.open(`waze://?q=${encodeURIComponent(element)}&navigate=yes&zoom=15`);
    } else {
      window.open(`waze://?ll=${element}&navigate=yes&zoom=17`);
    }
  }

  function mapsNav() {
    if (userLocation) {
      window.open(`https://google.com{userLocation.latitude}%2C${userLocation.longitude}&destination=${encodeURIComponent(element)}&travelmode=driving`, "_blank");
    } else {
      window.open(`https://google.com{encodeURIComponent(element)}&travelmode=driving`, "_blank");
    }
  }

  const styles = StyleSheet.create({
    page: { padding: 25, backgroundColor: '#FFF' },
    section: { margin: 10, padding: 10, flexGrow: 1, fontSize: 10 },
    currentDateView: { position: 'absolute', fontSize: 10, bottom: 15, left: 30 },
    pageNumber: { position: 'absolute', fontSize: 10, bottom: 15, right: 30 },
  });

  const MyDocument = () => (
    <Document>
      <Page wrap size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={{ fontSize: 30, marginBottom: 10 }}>LISTA DE ENTREGA DIST [ {lista[0]?.[0]?.[6] ?? ''} ]</Text>
          
          {listaPDF.map((item, idx) => {

            // Verifica se este item específico é exatamente o primeiro da lista sem coordenadas
            const ehOPrimeiroSemCoordenada = idx === (listaPDF.length - ruasSemCoordenadasTamanho);
            
            return (
            <View wrap={false} key={idx} break={ehOPrimeiroSemCoordenada} style={{ marginBottom: 20, borderBottom: 0.5, paddingBottom: 10 }}>
              {ehOPrimeiroSemCoordenada && ( <Text style={{ fontSize: 20, marginBottom: 10 }}>SEM COORDENADAS</Text>)}

              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ flexDirection: 'column', flexWrap: 'wrap', width: '70%' }}>
                  <Text style={{ fontSize: 10, marginBottom: 5 }}>Ponto de Entrega: {idx + 1} de {listaPDF.length}</Text>
                  <Text style={{ fontSize: 10, marginBottom: 5 }}>Endereço: {item?.[0]} <Image src={checkbox} style={{ width: 30 }} /></Text>
                </View>
                {item?.[1]?.[0] && <BarcodeForPDF value={item[1][0]} options={{ width: 2, height: 50 }} />}
              </View>
              <Text style={{ marginBottom: 5 }}>Objeto(s) :</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                {item?.[1]?.map((objetos, oIdx) => (
                  <Text key={oIdx} style={{ width: '23.5%', padding: "1 0 1 0", textAlign: 'right' }}>{oIdx + 1} - {objetos}</Text>
                ))}
              </View>
            </View>
            )
          })}

          <Text style={styles.currentDateView} fixed>{currentDate}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
        </View>
      </Page>
    </Document>
  );

  var ListaButton = () => (
    <PDFDownloadLink style={{ paddingRight: 8, paddingLeft: 8, fontSize: 16, fontWeight: 500, textDecoration: 'none', color: 'white' }} document={<MyDocument />} fileName={filename}>
      <p style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginTop: 0 }}>Gerar Lista<PdfIcon /></p>
    </PDFDownloadLink>
  );

  return (
    <div className="App">
      <header className="App-header">
        <Logo />
        <div className='filesselection'>
          <InputLoec disabled={disabled} className="file" type="file" name="uploadLoec" id="uploadLoec" onChange={testLoecFile}></InputLoec>
          <InputCoord disabled={disabled} className="file" type="file" name="upload" id="uploadCoord" onChange={testCoordFile}></InputCoord>
        </div>
        <button className="container-btn-file-blue" onClick={refreshPage}>
          <svg xmlns="http://w3.org" xmlSpace="preserve" id="Capa_1" width="45" height="45" version="1.1" viewBox="0 0 50.926 49.024">
            <g id="setas">
              <path id="seta-baixo" d="m35.801 32.734-1.654-1.07a.68.68 0 0 0-.917.167 7.2 7.2 0 0 1-5.847 2.954c-1.94 0-3.8-.777-5.152-2.14l.529-.175a.682.682 0 0 0 .239-1.153l-3.78-3.369a.69.69 0 0 0-.666-.138.68.68 0 0 0-.452.508l-1.028 4.958a.682.682 0 0 0 .88.783l.878-.29c2.011 2.762 5.12 4.342 8.552 4.342 3.402 0 6.617-1.649 8.601-4.41a.682.682 0 0 0-.183-.967" />
              <path id="seta-cima" d="M36.425 22.573a.69.69 0 0 0-.665-.138l-.879.29c-2.011-2.762-5.12-4.342-8.552-4.342a10.61 10.61 0 0 0-8.601 4.41.683.683 0 0 0 .183.967l1.654 1.07a.677.677 0 0 0 .916-.167 7.2 7.2 0 0 1 5.848-2.954c1.939 0 3.8.777 5.152 2.14l-.53.175a.68.68 0 0 0-.238 1.153l3.78 3.369a.679.679 0 0 0 1.118-.37l1.027-4.958a.68.68 0 0 0-.213-.645" />
            </g>
            <path id="tela" d="M48.472 2.464H5.24a2.956 2.956 0 0 0-2.953 2.953v38.732a2.956 2.956 0 0 0 2.953 2.953h43.232a2.956 2.956 0 0 0 2.952-2.953V5.417a2.956 2.956 0 0 0-2.952-2.953m-8.903 4.958c0-.602.488-1.09 1.09-1.09h1.09c.603 0 1.09.488 1.09 1.09v1.236a1.09 1.09 0 0 1-1.09 1.09h-1.09a1.09 1.09 0 0 1-1.09-1.09zm-5.07 0c0-.602.488-1.09 1.09-1.09h1.09c.602 0 1.09.488 1.09 1.09v1.236a1.09 1.09 0 0 1-1.09 1.09h-1.09a1.09 1.09 0 0 1-1.09-1.09zM47.88 43.558H5.83V13.024h42.05zm.028-34.9a1.09 1.09 0 0 1-1.09 1.09h-1.09a1.09 1.09 0 0 1-1.09-1.09V7.422c0-.602.488-1.09 1.09-1.09h1.09c.602 0 1.09.488 1.09 1.09z" />
          </svg>
          Recarregar Página
        </button>
      </header>

      <div className='App-body'>
        {lista.length !== 0 && coordLista.length !== 0 ? (
          <div className='screen'>
            <div className='nav'>
              <button className='next10Prev' disabled={lista[0][index][1] < 11} onClick={() => setIndex(index - 10)}>10 Anteriores</button>
              <button className='nextPrev' disabled={index === 0} onClick={() => setIndex(index - 1)}>Ponto de entrega Anterior</button>
              <button className='nextPrev' disabled={index >= lista[0][0][0] - 1} onClick={() => setIndex(index + 1)}>Próximo ponto de entrega</button>
              <button className='next10Prev' disabled={index >= lista[0][0][0] - 10} onClick={() => setIndex(index + 10)}>10 Posteriores</button>
            </div>

            <div className='info'>
              <div className='pontos'>
                <h4>Distrito </h4> <h2>{lista[0][0][6]}</h2>
              </div>

              <div className='pontos'>
                <h4>Ponto de entrega </h4> <h2>{lista[0][index][1]}</h2> <h4>de</h4> <h2>{lista[0][index][0]} </h2>
              </div>
              
              <div className='objetos'>
                <div className='qtd-objetos'>
                  <h4>Qtd de Objetos neste ponto: </h4> <h2>{listaDeEntrega[index]?.[1]?.length ?? 0}</h2>
                </div>
                <UlObjetos>
                  {listaDeEntrega[index]?.[1]?.map((OBJETO) => (
                    <li key={OBJETO}>{OBJETO}</li>
                  ))}
                </UlObjetos>
              </div>

              <div className='navinfo'>
                <h6>Endereço: <p className='endereco'>{listaDeEntrega[index]?.[0] ?? ''}</p> </h6>
                <h6>Bairro: <p className='endereco'>{bairro}</p> </h6>
                <h6 className='mapicons'>
                  <a href={mapaBairro} target="_blank" rel="noopener noreferrer"><MapIcon /></a> Mapa 
                  <FileDownloadIcon href={downloadMapaBairro} name={`${bairro}.svg`} />
                </h6>

                {endcoord === undefined || endcoord === "undefined" ? (
                  <h6> Coordenadas: 
                    <p>Informações indisponíveis no arquivo de coordenadas,<br />coordenadas baseadas pelo endereço informado</p>
                    <p className='alert'>ATENÇÃO: endereço sem coordenada <br />cadastrada, possível CEP incorreto</p>
                    <p style={{ display: "none" }} id='Coordenadas'>{element}</p>
                  </h6>
                ) : (
                  <h6> Coordenadas: <p id='Coordenadas'>{element}</p></h6>
                )}

                <h2>Escolha o App de Navegação:</h2>
                <div className='navapps'>
                  <div style={{ width: '65px', height: '65px', display: 'inline-block' }}>
                    <img src={maps} alt="logomaps" onClick={mapsNav} />
                  </div>
                  <div style={{ width: '65px', height: '65px', display: 'inline-block' }}>
                    <img src={waze} alt="logowaze" onClick={wazeNav} />
                  </div>
                </div>
              </div>

              <div className='noCoordContainer'>
                {ruasSemCoordenadasTamanho > 1 ? (
                  <p className='noCoord'> <InfoIcon2 /> Há {ruasSemCoordenadasTamanho} pontos de entrega sem cadastro de coordenadas</p>
                ) : (
                  <p className='noCoord'> <InfoIcon2 /> Há {ruasSemCoordenadasTamanho} ponto de entrega sem cadastro de coordenadas</p>
                )}
                <p className='click'>clique<button onClick={toggleContent}>aqui</button>para ver</p>

                {showContent && (
                  <div>
                    <p className='noCoord'>Endereços desta Loec sem coordenadas cadastradas.</p>
                    <p className='noCoord'>Ordem Alfabética</p>
                    <UlRuas>
                      {ruasSemCoordenadas.map((rua) => (
                        <li key={rua}>{rua}</li>
                      ))}
                    </UlRuas>
                  </div>
                )}
                <ListaButton />
              </div>
            </div>
          </div>
        ) : (
          <h4> CARREGA A LISTA ANIMAL</h4>
        )}
      </div>
    </div>
  );
}

const UlObjetos = styled.ul`
  grid-template-columns: 140px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 40px;
  max-height: 120px; 
  width: 170px;
  border-radius: 5px;
  padding: 10px 30px;
  margin-block-end: 0;
  background-color: grey;
  justify-self: center;
  justify-content: space-between;

  li {
    text-align: center;
    font-size: 1rem;
    width: 140px;
    margin-left: 20px;
    list-style: decimal;
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
  }
  
  @media screen and (min-width: 375px) {
    flex-direction: column;
    align-items: center;
    height: 68px;
  }
`;

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
    font-family: "Roboto", sans-serif;
  }
  
  @media screen and (max-width: 375px) {
    flex-direction: column;
    align-items: center;
    height: 68px;
width: 300px;
li {
font-size: 0.8rem;
width: 300px;
}
}
@media screen and (min-width: 768px) {
margin-top: 0;
}
`;