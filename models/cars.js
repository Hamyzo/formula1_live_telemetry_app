const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarSchema = new Schema({
    team: {
        type: String
    },
    driver: {
        type: String
    },
    manufacturer: {
        type: String
    },
    number: {
        type: Number
    }
});

const Cars = mongoose.model("cars", CarSchema);

module.exports = Cars;
