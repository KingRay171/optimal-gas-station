import React, {useState, useCallback, forwardRef, useEffect} from 'react';
import {GoogleMapsProvider} from '@ubilabs/google-maps-react-hooks';
import GoogleMapReact from "google-map-react"
import Nav from './navbar';

function App() {
  const [val, setVal] = useState({lat: 10, lng: 10});
  const [stationLocs, setStationLocs] = useState({})
  const [e, setE] = useState(0)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setVal({lat: pos.coords.latitude, lng: pos.coords.longitude})
      })
    }
  }, [e])

  const interval = setInterval(() => {
    setE(e + 1)
  }, 500)

  const fn = () => {console.log("hi")}
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '90vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY }}
        center={val}


        defaultZoom={9}

      >

      </GoogleMapReact>
    <Nav onClick={() => console.log("hi")} />
    </div>
  );
}

export default App;