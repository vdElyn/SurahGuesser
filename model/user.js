const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    token: { type: String },
    username: { type: String },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'room' }
}, {
    versionKey: false
});

module.exports = mongoose.model("user", userSchema);
