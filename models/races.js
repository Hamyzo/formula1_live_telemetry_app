const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RaceSchema = new Schema({
    cars: [
        {
            car: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "cars"
            },
            lap_times: [
                {
                    type: Number
                }
            ]
        }
    ],
    date: {
        type: Date
    },
    circuit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "circuits"
    },
    country: {
        type: String
    },
    nb_laps: {
        type: Number
    }
});

const Races = mongoose.model("races", RaceSchema);

module.exports = Races;
