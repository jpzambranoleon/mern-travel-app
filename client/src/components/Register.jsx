import { Cancel, Room } from "@mui/icons-material";
import { useContext, useRef, useState } from "react";
import "./register.css";
import { publicRequest } from "../requestMethods";
import { InfoContext } from "../utils/InfoProvider";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginRequest, loginSuccess } from "../redux/userSlice";

export default function Register({ setShowRegister }) {
  const { setStatus } = useContext(InfoContext);
  const { loading, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginRequest());
      const response = await publicRequest.post("/auth/register", {
        email,
        username,
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
    <div className="registerContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>LamaPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          min="8"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
