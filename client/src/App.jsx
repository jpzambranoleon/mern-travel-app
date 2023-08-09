import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles/styles.scss";
import Card from "./components/Card";
import Navbar from "./components/Navbar";

function App() {
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });

  return (
    <div>
      <Navbar />
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          ...viewport,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker latitude={48.858093} longitude={2.294694}>
          <i
            className="fa-solid fa-location-dot"
            style={{
              fontSize: 7 * viewport.zoom,
              cursor: "pointer",
              color: "slateblue",
            }}
          />
        </Marker>
        <Popup
          latitude={48.858093}
          longitude={2.294694}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
        >
          <Card />
        </Popup>
      </Map>
    </div>
  );
}

export default App;
