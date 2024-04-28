import { Cancel, Room } from "@mui/icons-material";
import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginRequest, loginSuccess } from "../redux/userSlice";
import "./login.css";
import { publicRequest } from "../requestMethods";
import { InfoContext } from "../utils/InfoProvider";

export default function Login({ setShowLogin }) {
  const { setStatus } = useContext(InfoContext);
  const { loading, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginRequest());
      const response = await publicRequest.post("/auth/login", {
        email,
        password,
      });
      setStatus({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      dispatch(loginSuccess(response.data.user));
    } catch (error) {
      let message = error.response
        ? error.response.data.message
        : error.message;
      setStatus({ open: true, message: message, severity: "error" });
      dispatch(loginFailure());
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>LeonPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          min="6"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
