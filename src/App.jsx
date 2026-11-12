import Logo from './components/logoanimation/logo';
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
// Garantindo a importação segura do Intro
// import Intro from './components/Intro.jsx'; 


import { useState, useEffect, useMemo } from 'react';
import './App.css';
import * as xlsx from 'xlsx';
import styled from 'styled-components';
import './responsive.css';
import { InputLoec, InputCoord } from './components/inputs';
import { Page, Text, View, Image, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

export default function App() {
  let mapBairro = [
    { id: BRAUNES, download: './mapsDownload/306/BRAUNES.svg' }, 
    { id: SUICO, download: './mapsDownload/306/SUICO.svg' }
  ];

  const [lista, setLista] = useState([]);
  const [coordLista, setCoordLista] = useState([]);
  const [index, setIndex] = useState(0);
  const [listaDeEntrega] = useState([]);
  
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

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setUserLocation({ latitude, longitude });
          
  //       },
  //       (error) => console.error('Error getting user location:', error)
  //     );
  //   }
  // }, []);

  // Função reutilizável para capturar as coordenadas exatas do GPS no instante da chamada
  const capturarLocalizacaoAtual = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setUserLocation(coords);
            resolve(coords); // Retorna as coordenadas atualizadas com sucesso
          },
          (error) => {
            console.error('Erro ao acessar o GPS do dispositivo:', error);
            reject(error);
          },
          {
            enableHighAccuracy: true, // Força o celular a usar o GPS de alta precisão (Satélite) em vez de redes Wi-Fi
            timeout: 5000,            // Aguarda no máximo 5 segundos pela resposta do chip de GPS
            maximumAge: 0             // Força o navegador a buscar uma posição nova em vez de ler o cache
          }
        );
      } else {
        console.error('Geolocalização não é suportada por este navegador.');
        reject(new Error('Não suportado'));
      }
    });
  };

  // Dispara a busca automática do GPS logo na inicialização do aplicativo
  useEffect(() => {
    capturarLocalizacaoAtual().catch((err) => {
      console.log('Busca inicial de GPS falhou ou foi recusada pelo usuário.');
    });
  }, []); // Array vazio garante que rode apenas uma vez ao abrir o app
  
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
              if (Pontos.length > 0) Loec.push(Pontos);
            }

            if (Loec.length > 0) {
              let ArrayToDisplay = [];
              for (let i = 0; i < Loec.length; i++) {
                if (!Loec[i] || !Loec[i][0]) continue;
                
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
            }
          } else {
            alert('Arquivo inválido ou formatação incorreta.');
          }
        } catch (err) {
          console.error("Erro LOEC:", err);
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
              if (PontosEmSequencia.length > 0) Loec.push(PontosEmSequencia);
            }

            if (Loec.length > 0) {
              let ArrayCoordToDisplay = [];
              for (let i = 0; i < Loec.length; i++) {
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
            }
          }
        } catch (err) {
          console.error("Erro Coordenadas:", err);
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
      setTimeout(() => { setDisabled(false); }, 2000);
    } else {
      alert(`Arquivo inválido. Formatos aceitos: ${allowedExtensions.join(' e ')}.`);
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
      setTimeout(() => { setDisabled(false); }, 2000);
    } else {
      alert(`Arquivo inválido. Formatos aceitos: ${allowedExtensions.join(' e ')}.`);
      document.getElementById('uploadCoord').value = '';
    }
  }

// OTIMIZAÇÃO DEFINITIVA: Processamento de strings sem duplicação no layout
  const dadosProcessados = useMemo(() => {
    let ruasSemCoordenadas = [];

    const arrayLoecReal = lista && lista[0] ? lista[0] : [];
    const arrayCoordReal = coordLista && coordLista[0] ? coordLista[0] : [];

    if (arrayLoecReal.length !== 0 && arrayCoordReal.length !== 0) {
      
      // 1. Extrai o endereço completo da LOEC (Índice 2)
      const todosEnderecosLoec = arrayLoecReal.map(item => item[2]);

      // 2. Monta a chave unificada da tabela de Coordenadas: Rua (Índice 2) + Espaço + Número (Índice 3)
      const todosEnderecosCoordMontados = arrayCoordReal.map(item => {
        const rua = item[2] ? String(item[2]).trim() : '';
        const numero = item[3] !== undefined ? String(item[3]).trim() : '';
        return `${rua} ${numero}`;
      });

      // 3. Identifica as ruas órfãs e organiza em Ordem Alfabética
      ruasSemCoordenadas = todosEnderecosLoec.filter(
        enderecoLoec => !todosEnderecosCoordMontados.includes(enderecoLoec)
      );
      ruasSemCoordenadas.sort((a, b) => a.localeCompare(b));

      // 4. Limpa o estado global de entregas antes do novo preenchimento
      listaDeEntrega.length = 0;

      // 5. PRIMEIRO PASSO: Insere os pontos geolocalizados salvando o endereço de forma SIMPLES e ÚNICA
      for (let i = 0; i < arrayCoordReal.length; i++) {
        const rua = arrayCoordReal[i][2] ? String(arrayCoordReal[i][2]).trim() : '';
        const numero = arrayCoordReal[i][3] !== undefined ? String(arrayCoordReal[i][3]).trim() : '';
        const chaveEnderecoCoord = `${rua} ${numero}`;

        const correspondenteLoec = arrayLoecReal.find(item => item[2] === chaveEnderecoCoord);
        
        if (correspondenteLoec) {
          // CORREÇÃO: Salva apenas a chave simples (Rua + Número), sem repetir o texto
          listaDeEntrega.push([chaveEnderecoCoord, correspondenteLoec]);
        }
      }

      // 6. SEGUNDO PASSO: Anexa os pontos sem coordenadas (Órfãos) de forma simples no fim da fila
      for (let i = 0; i < ruasSemCoordenadas.length; i++) {
        const enderecoSemCoord = ruasSemCoordenadas[i];
        const correspondenteLoec = arrayLoecReal.find(item => item[2] === enderecoSemCoord);
        
        if (correspondenteLoec) {
          listaDeEntrega.push([enderecoSemCoord, correspondenteLoec]);
        }
      }
    }

    const ruasSemCoordenadasTamanho = ruasSemCoordenadas.length;
    let listaPDF = [...listaDeEntrega];

    return { 
      ruasSemCoordenadas, 
      ruasSemCoordenadasTamanho, 
      listaPDF 
    };
  }, [lista, coordLista, listaDeEntrega]);

  const { ruasSemCoordenadas, ruasSemCoordenadasTamanho, listaPDF } = dadosProcessados;


  
 const localizacaoAtual = useMemo(() => {
    var element = '';
    var endcoord = undefined;
    var bairro = '';

    if (lista.length !== 0 && coordLista.length !== 0 && listaDeEntrega[index]) {
      const enderecoatual = listaDeEntrega[index][0]; // Pega o endereço limpo
      const arrayCoordReal = coordLista[0] || [];
      
      for (var ind = 0; ind < arrayCoordReal.length; ind++) {
        const rua = arrayCoordReal[ind][2] ? String(arrayCoordReal[ind][2]).trim() : '';
        const numero = arrayCoordReal[ind][3] !== undefined ? String(arrayCoordReal[ind][3]).trim() : '';
        const fullCoordCheck = `${rua} ${numero}`;

        if (enderecoatual === fullCoordCheck) {
          element = arrayCoordReal[ind][4]; // Coordenadas
          endcoord = arrayCoordReal[ind][4];
          bairro = arrayCoordReal[ind][5];   // Bairro
          break;
        } else if (endcoord === undefined || endcoord === "undefined") {
          element = enderecoatual + ", Nova Friburgo, RJ";
          if (arrayCoordReal[ind][2] && enderecoatual.includes(arrayCoordReal[ind][2])) {
            bairro = arrayCoordReal[ind][5];
          }
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
  }, [listaDeEntrega, coordLista, index, lista.length]);

  const { element, endcoord, bairro, mapaBairro, downloadMapaBairro } = localizacaoAtual;


  console.log(lista)
  console.log(listaDeEntrega)

  function refreshPage() {
    const refreshAnimation = document.getElementById('Capa_1');
    if (refreshAnimation) refreshAnimation.classList.add('selected');
    setTimeout(() => { window.location.reload(); }, 1000);
  }

  // function wazeNav() {
  //   if (endcoord === undefined) {
  //     window.open(`waze://?q=${encodeURIComponent(element)}&navigate=yes&zoom=15`);
  //   } else {
  //     window.open(`waze://?ll=${element}&navigate=yes&zoom=17`);
  //   }
  // }

  function wazeNav() {
    if (!element) return;

    // Atualiza o GPS em segundo plano antes de abrir o aplicativo externo
    capturarLocalizacaoAtual().catch(() => {
      console.log('Abrindo Waze com a última localização salva ou estimada.');
    });

    if (endcoord === undefined) {
      window.open(`waze://?q=${encodeURIComponent(element)}&navigate=yes&zoom=15`);
    } else {
      window.open(`waze://?ll=${element}&navigate=yes&zoom=17`);
    }
  }


  // function mapsNav() {
  //   if (userLocation) {
  //     window.open(`https://google.com{userLocation.latitude}%2C${userLocation.longitude}&destination=${encodeURIComponent(element)}&travelmode=driving`, "_blank");
  //   } else {
  //     window.open(`https://google.com{encodeURIComponent(element)}&travelmode=driving`, "_blank");
  //   }
  // }

  // Modificada para async/await para aguardar rigorosamente o GPS de alta precisão antes de montar a URL do Google Maps
   // Modificada para async/await para aguardar o GPS de alta precisão antes de montar a URL do Google Maps
  // Modificada para async/await para aguardar o GPS de alta precisão antes de montar a URL do Google Maps
  // Modificada para async/await para aguardar o GPS de alta precisão antes de montar a URL do Google Maps
// Modificada para async/await para aguardar o GPS de alta precisão antes de montar a URL do Google Maps
  async function mapsNav() {
    if (!element) return;
    
    let localizacaoParaUso = userLocation;

    try {
      // Aguarda a confirmação das coordenadas de satélite atualizadas
      const coordenadasAtualizadas = await capturarLocalizacaoAtual();
      localizacaoParaUso = coordenadasAtualizadas;
    } catch (err) {
      console.log('Falha ao atualizar GPS em tempo real. Usando rota base do Google Maps.');
    }

    if (localizacaoParaUso) {
      // CORREÇÃO REAL: Inserido o caminho oficial de rotas (/maps/dir/?api=1&origin=) de forma correta
      window.open(`https://google.com/maps/dir/?api=1&origin=${localizacaoParaUso.latitude}%2C${localizacaoParaUso.longitude}&destination=${encodeURIComponent(element)}&travelmode=driving`, "_blank");
    } else {
      // Contingência caso o GPS do celular esteja totalmente desligado ou bloqueado nas permissões
      window.open(`https://google.com/maps/dir/?api=1&origin=${encodeURIComponent(element)}&travelmode=driving`, "_blank");
    }
  }

    const styles = StyleSheet.create({
    page: { padding: 25, backgroundColor: '#FFF' },
    section: { margin: 10, padding: 10, flexGrow: 1, fontSize: 10 },
    currentDateView: { position: 'absolute', fontSize: 10, bottom: 15, left: 30 },
    pageNumber: { position: 'absolute', fontSize: 10, bottom: 15, right: 30 },
  });

  const MyDocument = () => {
    const dadosListaPDF = listaPDF || [];
    
    // Identifica a posição exata onde termina o grupo com GPS e começa a contingência
    const limiteComCoordenadas = dadosListaPDF.length - ruasSemCoordenadasTamanho;

    // Filtra e divide fisicamente os arrays mantendo a estrutura de matrizes intacta antes do loop
    const itensComCoordenadas = dadosListaPDF.filter((_, idx) => idx < limiteComCoordenadas);
    const itensSemCoordenadas = dadosListaPDF.filter((_, idx) => idx >= limiteComCoordenadas);

    // Captura o nome do distrito acessando a posição estável do primeiro registro válido
    const nomeDistrito = dadosListaPDF.length > 0 && dadosListaPDF[0]?.[1]?.[6] 
      ? dadosListaPDF[0][1][6] 
      : '';

    return (
      <Document>
        <Page wrap size="A4" style={styles.page}>
          
          {/* SEÇÃO 1: Bloco estruturado para os pontos geolocalizados */}
          <View style={styles.section}>
            <Text style={{ fontSize: 30, marginBottom: 15 }}>LISTA DE ENTREGA DIST [ {nomeDistrito} ]</Text>
            
            {itensComCoordenadas.map((item, idx) => (
              <View wrap={false} key={`com-${idx}`} style={{ marginBottom: 20, borderBottom: 0.5, paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View style={{ flexDirection: 'column', flexWrap: 'wrap', width: '70%' }}>
                    <Text style={{ fontSize: 10, marginBottom: 5 }}>Ponto de Entrega: {idx + 1} de {dadosListaPDF.length}</Text>
                    <Text style={{ fontSize: 10, marginBottom: 5 }}>Endereço: {item[0]} <Image src={checkbox} style={{ width: 30 }} /></Text>
                  </View>
                  {item[1]?.[4]?.[0] && (
                    <BarcodeForPDF value={item[1][4][0]} options={{ width: 2, height: 50 }} />
                  )}
                </View>
                
                <Text style={{ marginBottom: 5, fontSize: 10 }}>Objeto(s) :</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                  {item[1]?.[4]?.map((objeto, oIdx) => (
                    <Text key={oIdx} style={{ width: '23.5%', padding: "1 0 1 0", textAlign: 'right', fontSize: 10 }}>{oIdx + 1} - {objeto}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* SEÇÃO 2: FECHA A SEÇÃO ANTERIOR E FORÇA A QUEBRA DE PÁGINA DIRETAMENTE NA RAIZ DA PAGE */}
          {itensSemCoordenadas.length > 0 && (
            <View break style={styles.section}>
              <View style={{ marginBottom: 20, paddingBottom: 5 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold'}}>
                  SEM COORDENADAS
                </Text>
              </View>

              {itensSemCoordenadas.map((item, idx) => {
                // Mantém a contagem sequencial total dos pontos de entrega
                const numeroPontoAtual = itensComCoordenadas.length + idx + 1;

                return (
                  <View wrap={false} key={`sem-${idx}`} style={{ marginBottom: 20, borderBottom: 0.5, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <View style={{ flexDirection: 'column', flexWrap: 'wrap', width: '70%' }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>Ponto de Entrega: {numeroPontoAtual} de {dadosListaPDF.length}</Text>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>Endereço: {item[0]} <Image src={checkbox} style={{ width: 30 }} /></Text>
                      </View>
                      {item[1]?.[4]?.[0] && (
                        <BarcodeForPDF value={item[1][4][0]} options={{ width: 2, height: 50 }} />
                      )}
                    </View>
                    
                    <Text style={{ marginBottom: 5, fontSize: 10 }}>Objeto(s) :</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                      {item[1]?.[4]?.map((objeto, oIdx) => (
                        <Text key={oIdx} style={{ width: '23.5%', padding: "1 0 1 0", textAlign: 'right', fontSize: 10 }}>{oIdx + 1} - {objeto}</Text>
                  ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Elementos fixos globais de rodapé */}
          <Text style={styles.currentDateView} fixed>{currentDate}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
        </Page>
      </Document>
    );
  };

  const hasData = lista.length !== 0 && coordLista.length !== 0;

  var ListaButton = () => {
    // PROTEÇÃO ESSENCIAL: Impede que o PDF link seja renderizado em segundo plano antes da planilha fechar
    if (!hasData) return null;

    return (
      <PDFDownloadLink style={{ paddingRight: 8, paddingLeft: 8, fontSize: 16, fontWeight: 500, textDecoration: 'none', color: 'white' }} document={<MyDocument />} fileName={filename}>
        {({ loading }) => (
          <p style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginTop: 0 }}>
            {loading ? 'Preparando Lista...' : 'Gerar Lista'}
            <PdfIcon />
          </p>
        )}
      </PDFDownloadLink>
    );
  };

  // const mostrarMapaIntegrado = false;

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
        {hasData ? (
          <div className='screen'>
            <div className='nav'>
              <button className='next10Prev' disabled={index < 10} onClick={() => setIndex(index - 10)}>10 Anteriores</button>
              <button className='nextPrev' disabled={index === 0} onClick={() => setIndex(index - 1)}>Ponto de entrega Anterior</button>
              <button className='nextPrev' disabled={index >= listaDeEntrega.length - 1} onClick={() => setIndex(index + 1)}>Próximo ponto de entrega</button>
              <button className='next10Prev' disabled={index >= listaDeEntrega.length - 10} onClick={() => setIndex(index + 10)}>10 Posteriores</button>
            </div>

            <div className='info'>
              <div className='pontos'>
                <h4>Distrito </h4> <h2>{lista[0]?.[0]?.[6] || ''}</h2>
              </div>

              <div className='pontos'>
                <h4>Ponto de entrega </h4> <h2>{index + 1}</h2> <h4>de</h4> <h2>{listaDeEntrega.length} </h2>
              </div>
              
              <div className='objetos'>
                <div className='qtd-objetos'>
                  <h4>Qtd de Objetos neste ponto: </h4> <h2>{listaDeEntrega[index]?.[1]?.[3] || 0}</h2>
                </div>
                <UlObjetos>
                  {listaDeEntrega[index]?.[1]?.[4]?.map((OBJETO) => (
                    <li key={OBJETO}>{OBJETO}</li>
                  ))}
                </UlObjetos>
              </div>

              <div className='navinfo'>
                <h6>Endereço: <p className='endereco'>{listaDeEntrega[index]?.[0] || ''}</p> </h6>
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
                    <img src={maps} alt="logomaps" style={{ width: '100%', height: '100%' }} onClick={mapsNav} />
                  </div>
                  <div style={{ width: '65px', height: '65px', display: 'inline-block' }}>
                    <img src={waze} alt="logowaze" style={{ width: '100%', height: '100%' }} onClick={wazeNav} />
                  </div>
                </div>
              </div>
              {ruasSemCoordenadasTamanho === 0 ? " " :
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
              </div>
              }
              <TrashButtonWrapper>
                <ListaButton />
              </TrashButtonWrapper>
            </div>
          </div>
        ) : (
          <h4> POR FAVOR, IMPORTE OS ARQUIVOS ACIMA PARA EXIBIR A LISTA.</h4>
        )}
</div>
    </div>
  );
}

const TrashButtonWrapper = styled.div`
  display: inline-block;
`;

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