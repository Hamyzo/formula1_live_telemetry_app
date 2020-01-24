const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RaceSchema = new Schema({
    cars: [
        {
            car: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "cars"
            },
            lap_times: [[Number]],
            status: {
                type: String,
                enum: ['pending', 'participating', 'dnf', 'finished']
            }
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
    },
    status: {
        type: String,
        enum: ['pending', 'finished', 'ongoing']
    }
});

const Races = mongoose.model("races", RaceSchema);

module.exports = Races;
