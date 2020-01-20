const express = require('express');
const mongoose = require('mongoose');
const env = require('./config/env');

const Cars = require('./models/cars');
const Circuits = require('./models/circuits');
const Races = require('./models/races');

let app = express();

mongoose.connect('mongodb://localhost:27017/rasp15', {useNewUrlParser: true});

app.listen(env.port);

app.get('/', function(req, res, next) {

	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/menu.html');
});

app.get('/raceManagement', function(req, res) {
	// send the main (and unique) page
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/raceManagement.html');
});


app.get('/raceManagement.js', function(req, res) {
	// send the angular app
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/raceManagement.js');
});

app.get('/getAllRaces', function(req, res) {
	const races = Races.find({}, (err, docs) => {
		if (err)
			throw err;
		res.json(docs);
	});
});

app.get('/getAllCircuits', function(req, res) {
	const circuits = Circuits.find({}, (err, docs) => {
		if (err)
			throw err;
		res.json(docs);
	});
});

app.get('/createRace', async (req, res) => {

	console.log(req.query);
	const newRace = new Races(req.query);

	const race = await newRace.save();
	console.log(race);
});
