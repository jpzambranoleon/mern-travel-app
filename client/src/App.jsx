import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Room } from "@mui/icons-material";
import Register from "./components/Register";
import Login from "./components/Login";
import { publicRequest, userRequest } from "./requestMethods";
import { Avatar, Rating } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { logout } from "./redux/userSlice";
import Card from "./components/Card";

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewState, setViewState] = useState({
    latitude: "47.040182",
    longitude: "17.071727",
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: lng });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat.toArray();

    setNewPlace({
      lat: latitude,
      lng: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser.username,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      lng: newPlace.lng,
    };

    try {
      const res = await userRequest.post("/pins/create", newPin);
      console.log(res.data);
      setPins([...pins, res.data.pin]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await publicRequest.get("/pins/getAll");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, [newPlace]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
  };

  return (
    <Map
      {...viewState}
      mapLib={import("mapbox-gl")}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onMove={(e) => setViewState(e.viewState)}
      onDblClick={currentUser && handleAddClick}
      style={{ height: "100vh" }}
    >
      {pins.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.lng}
            offsetLeft={-3.5 * viewState.zoom}
            offsetTop={-7 * viewState.zoom}
          >
            <Room
              style={{
                fontSize: 7 * viewState.zoom,
                color:
                  currentUser?.username === p.username ? "tomato" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(p._id, p.lat, p.lng)}
            />
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
              key={p._id}
              latitude={p.lat}
              longitude={p.lng}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
            >
              <Card pin={p} setPins={setPins} />
            </Popup>
          )}
        </>
      ))}
      {newPlace && (
        <>
          <Marker
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            offsetLeft={-3.5 * viewState.zoom}
            offsetTop={-7 * viewState.zoom}
          >
            <Room
              style={{
                fontSize: 7 * viewState.zoom,
                color: "tomato",
                cursor: "pointer",
              }}
            />
          </Marker>
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <Rating
                  name="half-rating"
                  defaultValue={0}
                  precision={0.5}
                  onChange={(e) => setRating(e.target.value)}
                />
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        </>
      )}
      {currentUser ? (
        <>
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
          <Avatar src={currentUser.profilePic} sx={{}} />
        </>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Log in
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && <Login setShowLogin={setShowLogin} />}
    </Map>
  );
}

export default App;
