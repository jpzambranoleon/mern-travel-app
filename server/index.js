const express = require("express");
const cors = require("cors");
const MongooseConnection = require("./utility/mongoose.connection");
const helmet = require("helmet");
require("dotenv").config();

// Create application with express
const app = express();

// Connect to database
MongooseConnection();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const PORT = process.env.PORT || 8000;

// serving the frontend
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/pins", require("./routes/pin.routes"));

app.listen(PORT, () => {
  console.log(`Backend server is running on ${PORT}`);
});
