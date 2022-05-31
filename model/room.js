const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({
    id: { type: String },
    created: { type: Date, default: Date.now }, // Date de création de la room
    name: { type: String },
    host: { type: String },
    private: { type: Boolean, default: false },
    players: [String]
}, {
    versionKey: false
});

module.exports = mongoose.model("room", roomSchema);
