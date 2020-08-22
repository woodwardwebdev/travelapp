let mongoose = require("mongoose");

let journeySchema = new mongoose.Schema({
    startpoint: String,
    destination: String,
    returncheckbox: Boolean,
    mileage: Number,
    date: {
        type: Date,
        default: new Date().toISOString().slice(0, 10)
    }
});

module.exports = mongoose.model("Journey", journeySchema);