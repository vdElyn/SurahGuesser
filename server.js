const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIO = require('socket.io');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

const publicPath = path.join(__dirname, "/public");
app.use(express.static(publicPath));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Routes
// app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/", (req, res) => res.sendFile(__dirname + "/public/home.html"));

require("./routes/quran.routes")(app);

let server = http.createServer(app);
let io = socketIO(server);

// ToDo: Mongo pour stocker les rooms
class Room {
  constructor(id, name, host, players) {
      this.id = id;
      this.name = name;
      this.host = host;
      this.players = players;
  }
}

function generateRoomId(length) {
  // ToDo: check si l'ID n'existe pas déjà en DB
  // return Math.random().toString(36).slice(2);
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

availableRooms = Array();

io.on('connection', (socket) => {
  console.log('A user just connected.');

  socket.on('createRoom', (data) => {
    console.log("CreateRoom received");
    
    // ToDo: stocker les rooms dispos sur la DB
    let r = new Room(generateRoomId(4), data.name, data.host, 1);
    console.log("Room créée:", r)
    availableRooms.push(r);
    io.emit('newRoom', r);
  })

  socket.on('joinRoom', (data) => {
    // ToDo: routine joinRoom (ajouter l'user à la DB)
    console.log(`${data.nick} rejoint la room ${data.roomId}`);
  })

  socket.on('disconnect', () => {
      console.log('A user has disconnected.');
  })
});

const PORT = process.env.PORT;
const HOST = process.env.HOST;
server.listen(PORT, () => {
  console.log(`listening on http://${HOST}:${PORT}`);
});
