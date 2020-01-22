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

app.get('/getAllRaces', async (req, res) => {
	const races = await Races.find().populate("circuit").populate("cars.car");
	res.json(races);
});

app.get('/getAllCircuits', async (req, res) => {
	const circuits = await Circuits.find();
	res.json(circuits);
});

app.get('/getAllCars', async (req, res) => {
	const cars = await Cars.find();
	res.json(cars);
});

app.get('/createRace', async (req, res) => {

	console.log(req.query);
	const newRace = new Races(req.query);

	const race = await newRace.save();
	console.log(race);
});

app.get('/updateRace/:id', async (req, res) => {
	console.log(req.query);
	let race = req.query;
	race.cars = JSON.parse(req.query.cars);
	console.log(race);
	const response = await Races.updateOne({"_id": req.params.id}, race);
	console.log(response);
});



app.get('/carManagement', function(req, res) {
	// send the main (and unique) page
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/carManagement.html');
});


app.get('/carManagement.js', function(req, res) {
	// send the angular app
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/carManagement.js');
});

app.get('/updateCar/:id', async (req, res) => {
	console.log(req.query);
	console.log(req.params.id);
	let car = req.query;
	const response = await Cars.updateOne({"_id": req.params.id}, car);
	console.log(response);
});



app.get('/circuitManagement', function(req, res) {
	// send the main (and unique) page
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/circuitManagement.html');
});


app.get('/circuitManagement.js', function(req, res) {
	// send the angular app
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/circuitManagement.js');
});

app.get('/createCircuit', async (req, res) => {

	console.log(req.query);
	const newCircuit = new Circuits(req.query);

	const circuit = await newCircuit.save();
	console.log(circuit);
});

app.get('/updateCircuit/:id', async (req, res) => {
	console.log(req.query);
	console.log(req.params.id);
	let circuit = req.query;
	const response = await Circuits.updateOne({"_id": req.params.id}, circuit);
	console.log(response);
});
