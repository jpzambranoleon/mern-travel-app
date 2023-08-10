import React, { useContext, useEffect, useState } from "react";
import { InfoContext } from "./utils/InfoProvider";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles/styles.scss";
import Card from "./components/Card";
import { publicRequest } from "../requestMethods";
import { Rating } from "@mui/material";

function App() {
  const currentUser = "jpzl_12";
  const { setStatus } = useContext(InfoContext);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewState, setViewState] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await publicRequest.get("/pins/getAll");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
    console.log(lat);
    console.log(lng);
    setViewState((prevViewState) => ({
      ...prevViewState,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleAddClick = (e) => {
    console.log(e);
    console.log(e.lngLat);

    setNewPlace({
      lat: e.lngLat.lat,
      lng: e.lngLat.lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      lng: newPlace.lng,
    };

    try {
      const res = await publicRequest.post("/pins/create", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      setStatus({
        open: true,
        message: res.data.message,
        severity: "success",
      });
    } catch (err) {
      let message = err.response ? err.response.data.message : err.message;
      setStatus({ open: true, message: message, severity: "error" });
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        {...viewState}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%", transitionDuration: "200" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onMove={(e) => setViewState(e.viewState)}
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <React.Fragment key={p._id}>
            <Marker latitude={p.lat} longitude={p.lng}>
              <i
                className="fa-solid fa-location-dot"
                style={{
                  fontSize: 7 * viewState.zoom,
                  cursor: "pointer",
                  color: p.username === currentUser ? "tomato" : "slateblue",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.lng)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.lng}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <Card pin={p} />
              </Popup>
            )}
          </React.Fragment>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder="Tell us somthing about this place."
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <Rating
                name="half-rating"
                defaultValue={0}
                precision={0.5}
                onChange={(e) => setRating(e.target.value)}
              />
              <button className="submitButton" type="submit">
                Add pin
              </button>
            </form>
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default App;
