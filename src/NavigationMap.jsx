"use client";
import { useEffect, useState } from 'react';
import carro from './imgs/carrofundobrancopequeno2.png';

import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps';  

export default function Intro() {
  
  return(

    <div className='try' style={{height:"60vh", width: "340px", border: "10px solid goldenrod", borderRadius: "10px", marginTop: "25px"}}>
        
      <APIProvider 
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map 
          fullscreenControl={false} >
            <Directions />

          </Map>
      </APIProvider>

    </div>
  )
}

export function Directions() {
  const [userLocation, setUserLocation] = useState(null);
  const [userDestination, setUserDestination] = useState(null);
  
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

  const getUserDestination = () => {
    
    const element = document.getElementById('Coordenadas');

    if (element !== null){
    setUserDestination(element.textContent)
    }
  }

  useEffect(() =>{
    getUserLocation();
    getUserDestination();
  }, [setUserLocation, setUserDestination] );


  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];
  useEffect(() =>{
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));

  }, [routesLibrary, map] );

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    if (userLocation === null ) return;
    if(userLocation !== null ){
    directionsService.route({
      origin: `${userLocation.latitude} , ${userLocation.longitude}`,
      destination: `${userDestination}`,
      travelMode: 'DRIVING',
      provideRouteAlternatives: true,

    }).then(response => {
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
    });

    }
  }, [directionsService, directionsRenderer, userLocation, userDestination]);

  useEffect(() => {
    if(!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer, userLocation, userDestination])

  if (!leg) return null;

  return <div className='directions' > 
    <h2>Rota selecionada: {routeIndex+1}. {selected.summary}</h2>
    <p>Ponto de partida: {leg.start_address.split(",")[0]}</p> 
    <p>Destino: {leg.end_address.split(",")[0]} </p>
    <p>Distância: {leg.distance?.text}</p>
    <p>Duração: {leg.duration?.text}</p>

    { routes.length > 1 ? <h2>Opções de Rota:</h2> : <h2>Opção de Rota:</h2>}
    <ul>
      {routes.map((route, index) => (
        <li key={route.summary}>
          <button onClick={() => setRouteIndex(index) }>{route.summary}</button>
        </li>
      ))}
    </ul>
    <div className='navdiv'>
      <button onClick={() => window.location.replace(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude}%2C${userLocation.longitude}&destination=${userDestination}&travelmode=driving`)}>Iniciar Navegação</button>
      <img src={carro} onClick={() => window.location.replace(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude}%2C${userLocation.longitude}&destination=${userDestination}&travelmode=driving`)} alt="" />
    </div>
  </div>
}