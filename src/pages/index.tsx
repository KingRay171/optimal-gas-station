
import { useLoadScript, GoogleMap, MarkerF, useGoogleMap } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useMemo, useState, useEffect, useRef } from 'react';
import Nav from './navbar';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

const Home: NextPage = () => {
  const libraries = useMemo(() => ['places'], []);
  const [val, setVal] = useState({lat: 0, lng: 0})
  const [stations, setStations] = useState({primaryStations: [{id: 0, lat: 0, lng: 0, price: "0"}], secondaryStations: [{id: 0, lat: 0, lng: 0, price: "0"}]})
  const [e, setE] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentStation, setCurrentStation] = useState({id: 0, lat: 0, lng: 0, price: "0", distance: "0"})

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setVal({lat: pos.coords.latitude, lng: pos.coords.longitude})
        fetch("/api/hello", {method: "POST", body: JSON.stringify({lat: pos.coords.latitude, lng: pos.coords.longitude})}).then((data) => data.json()).then((data) => setStations(data))
      })
    }
  }, [e])


  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
      
    }),
    [e]
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div >
      <GoogleMap
        options={mapOptions}
        zoom={13}
        center={val}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ height: '90vh', width: '100%' }}
        onLoad={() => console.log('Map Component Loaded...')}>
          {stations.primaryStations.map((station) => (
            <MarkerF key={station.id} position={{lat: station.lat, lng: station.lng}} label={station.price}/>
          ))}
          {stations.secondaryStations.map((station) => (
            <MarkerF key={station.id} position={{lat: station.lat, lng: station.lng}} label={station.price} onClick={() => {
              fetch(
                `/api/directions`, 
                {
                  method: "POST", 
                  body: JSON.stringify({currentLat: val.lat, currentLng: val.lng, destLat: station.lat, destLng: station.lng})
                }
              ).then(data => data.json()).then(data => {
                console.log(data.rows[0].elements[0].distance.text)
                setCurrentStation({id: 0, lat: 0, lng: 0, price: "0", distance: data.rows[0].elements[0].distance.text})
                setDialogOpen(true)
              })
            }}/>
          ))}
          <MarkerF position={val} />
          <Dialog open={dialogOpen} onClose={() => {setDialogOpen(false)}}>
            <DialogTitle>Station</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {currentStation.distance}
              </DialogContentText>
            </DialogContent>
          </Dialog>
      </GoogleMap>
      <Nav onClick={() => setE(e + 1)} />
    </div>
  );
};

export default Home;