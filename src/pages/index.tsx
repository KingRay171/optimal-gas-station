
import { useLoadScript, GoogleMap, MarkerF, Marker, useGoogleMap } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useMemo, useState, useEffect, useRef } from 'react';
import Nav from './navbar';
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

function sortNumbers(a: {id: number, lat: number, lng: number, price: any, distance: number, distanceAdjPrice: any}, b: {id: number, lat: number, lng: number, price: any, distance: number, distanceAdjPrice: any}) {
  if (parseFloat(a.distanceAdjPrice) > parseFloat(b.distanceAdjPrice)) {
    return 1;
  } else if (parseFloat(b.distanceAdjPrice) > parseFloat(a.distanceAdjPrice)) {
    return -1;
  } else {
    return 0;
  }
}

const Home: NextPage = () => {
  const libraries = useMemo(() => ['places'], []);
  const [val, setVal] = useState({lat: 0, lng: 0})
  const [stations, setStations] = useState([{id: 0, lat: 0, lng: 0, price: 0, distance: 0, distanceAdjPrice: 0}])
  const [e, setE] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentStation, setCurrentStation] = useState({id: 0, lat: 0, lng: 0, price: 0, distance: 0, distanceAdjPrice: 0})
  const [closestStation, setClosestStation] = useState(0)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setVal({lat: pos.coords.latitude, lng: pos.coords.longitude})

        fetch("/api/hello", {method: "POST", body: JSON.stringify({lat: pos.coords.latitude, lng: pos.coords.longitude})}).then(data => data.json()).then(data => {
          setStations(data)
          
        })
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
    <div className='flex flex-col'>
      <GoogleMap
        options={mapOptions}
        zoom={13}
        center={val}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ height: '90vh', width: '100%' }}
        onLoad={() => console.log('Map Component Loaded...')}>
        
          {stations.filter(e => !isNaN(e.price)).sort(sortNumbers).map((station, idx) => (
            <Marker key={station.id} position={{lat: station.lat, lng: station.lng}} label={`${station.price}`} icon={ {
              path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
              fillColor: idx !== 0 ? '#FF0000' : '#0000FF',
              fillOpacity: .6,
              anchor: new google.maps.Point(0,0),
              strokeWeight: 0,
              scale: 1
          }} onClick={() => {
              setCurrentStation(station)
              setDialogOpen(true)
            }}/>
          ))}
          
          <MarkerF position={val} />
          <Dialog open={dialogOpen} onClose={() => {setDialogOpen(false)}}>
            <DialogTitle>Station</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {currentStation.distance}
                <br></br>
                {currentStation.distanceAdjPrice}
              </DialogContentText>
            </DialogContent>
          </Dialog>
      </GoogleMap>
      <Nav onClick={() => setE(e + 1)} />
    </div>
  );
};

export default Home;