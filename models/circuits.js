const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CircuitSchema = new Schema({
    name: {
        type: String
    },
    country: {
        type: String
    },
    lap_distance: {
        type: Number
    }
});

const Circuits = mongoose.model("circuits", CircuitSchema);

module.exports = Circuits;
