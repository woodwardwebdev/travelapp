let mongoose = require("mongoose");

let locationSchema = new mongoose.Schema({
    name: String,
    postcode: String
})

module.exports = mongoose.model("Location", locationSchema);
