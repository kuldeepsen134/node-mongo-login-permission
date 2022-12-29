const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const mySocket = require("./socket")


const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const connectDatabase = require("./src/config/database.js");

const errorMiddleware = require("./src/middleware/error");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}

//database connect
connectDatabase();

// Route Imports
const user = require("./src/routes/userRoute");

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/public"));
});
app.use("/api/v1/user", user);


mySocket(io)

// Middleware for Errors
app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  console.log(`Server is working on ${process.env.PORT}`);
});
