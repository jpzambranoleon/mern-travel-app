import { Rating } from "@mui/material";
import { format } from "timeago.js";
import { publicRequest, userRequest } from "../requestMethods";
import { InfoContext } from "../utils/InfoProvider";
import { useContext } from "react";
import { useSelector } from "react-redux";

export default function Card({ pin, setPins }) {
  const { setStatus } = useContext(InfoContext);
  const { currentUser } = useSelector((state) => state.user);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await userRequest.delete(`/pins/delete/${pin._id}`);
      setStatus({
        open: true,
        message: res.data.message,
        severity: "success",
      });

      const allPins = await publicRequest.get("/pins/getAll");

      setPins(allPins.data);
    } catch (err) {
      let message = err.response ? err.response.data.message : err.message;
      setStatus({ open: true, message: message, severity: "error" });
    }
  };

  return (
    <div className="card">
      <label>Place</label>
      <h4 className="place">{pin.title}</h4>
      <label>Review</label>
      <p className="desc">{pin.desc}</p>
      <label>Rating</label>
      <div className="stars">
        <Rating
          name="half-rating"
          defaultValue={pin.rating}
          precision={0.5}
          readOnly
        />
      </div>
      <label>Information</label>
      <span className="username">
        Created by <b>{pin.username}</b>
      </span>
      <span className="date">{format(pin.createdAt)}</span>
      {p.username === currentUser.username && (
        <button className="submitButton" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
}
