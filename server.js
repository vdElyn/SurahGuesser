const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));


const path = require("path");
const htmlPath = path.join(__dirname, "/public");
app.use(express.static(htmlPath));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

require("./routes/quran.routes")(app);

const PORT = process.env.PORT;
const HOST = process.env.HOST;
app.listen(PORT, () => {
  console.log(`listening on http://${HOST}:${PORT}`);
});
