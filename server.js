const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIO = require('socket.io');
require("dotenv").config();
require("./config/database").connect();

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


const RoomModel = require("./model/room");

async function generateRoomId(length) {
  let roomId = Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1).toLocaleUpperCase();

  while (await RoomModel.findOne({ id: roomId })) {
    console.log(`Une room d'ID #${roomId} existe déjà`);
    roomId = Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1).toLocaleUpperCase();
  }

  return roomId;
}

availableRooms = Array();

io.on('connection', (socket) => {
  console.log('A user just connected.');
  sendRooms(socket);

  socket.on('createRoom', async (data) => {
    console.log("CreateRoom received");
    
    let roomId = await generateRoomId(4);
    new RoomModel({
      id: roomId, 
      name: data.name,
      host: data.host, 
      players: [data.host]
    }).save().then( () => {
      sendRooms(socket);
    });

    // ToDo: créer un get /roomId pour la game (à voir comment faire)
  })

  socket.on('joinRoom', async (data) => {
    // Routine joinRoom (ajouter l'user à la DB)
    console.log(`${data.nick} rejoint la room ${data.roomId}`);
    
    // Get la room en question
    const joinedRoom = await RoomModel.findOne({ id: data.roomId });
    if (!joinedRoom) {
        console.log("ERR - Room non trouvée");
        return;
    }
    await RoomModel.updateOne({ id: data.roomId }, {$push: { players: data.nick }});

    // Actualiser la liste des rooms chez les autres clients
    sendRooms(socket);
  })

  socket.on('disconnect', () => {
      console.log('A user has disconnected.');
  })
});

async function sendRooms(socket) {

  await RoomModel.find({})
    .then(function (rooms) {
      // Tri des rooms par nombre de joueurs
      rooms.sort(function (a, b) {
          return b.players.length - a.players.length
      });

      socket.emit("updatedRooms", rooms);
      
    }).catch((err) =>
            console.log(err)
    );
}

const PORT = process.env.PORT;
const HOST = process.env.HOST;
server.listen(PORT, () => {
  console.log(`listening on http://${HOST}:${PORT}`);
});
