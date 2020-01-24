const express = require('express');
const mongoose = require('mongoose');
const env = require('./config/env');

const Cars = require('./models/cars');
const Circuits = require('./models/circuits');
const Races = require('./models/races');

let app = express();

mongoose.connect('mongodb://localhost:27017/rasp15', {useNewUrlParser: true, useUnifiedTopology: true});

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('raspberry message', (msg) => {
		console.log('message received from raspberry: ', msg);
		console.log('message body received from raspberry: ', msg.response);
		io.emit('message', msg.response);
	});
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

server.listen(env.port);


// --------------------- CSS --------------------- //

app.get('/style.css', function(req, res) {
	res.setHeader('Content-Type', 'text/css');
	res.sendFile( __dirname + '/style.css');
});


// --------------------- HOME --------------------- //

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/home.html');
});

app.get('/getOngoingRaces', async (req, res) => {
	const races = await Races.find().populate("circuit").populate("cars.car");
	res.json(races);
});


// --------------------- RACE MANAGEMENT --------------------- //

app.get('/raceManagement', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/raceManagement.html');
});

app.get('/raceManagement.js', function(req, res) {
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/raceManagement.js');
});

app.get('/getAllRaces', async (req, res) => {
	const races = await Races.find().populate("circuit").populate("cars.car");
	res.json(races);
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


// --------------------- CAR MANAGEMENT --------------------- //

app.get('/carManagement', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/carManagement.html');
});

app.get('/carManagement.js', function(req, res) {
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/carManagement.js');
});

app.get('/getAllCars', async (req, res) => {
	const cars = await Cars.find();
	res.json(cars);
});

app.get('/updateCar/:id', async (req, res) => {
	console.log(req.query);
	console.log(req.params.id);
	let car = req.query;
	const response = await Cars.updateOne({"_id": req.params.id}, car);
	console.log(response);
});


// --------------------- CIRCUIT MANAGEMENT --------------------- //

app.get('/circuitManagement', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/circuitManagement.html');
});

app.get('/circuitManagement.js', function(req, res) {
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/circuitManagement.js');
});

app.get('/getAllCircuits', async (req, res) => {
	const circuits = await Circuits.find();
	res.json(circuits);
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


// --------------------- TELEMETRY --------------------- //

app.get('/telemetry', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/telemetry.html');
});

app.get('/telemetry.js', function(req, res) {
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/telemetry.js');
});

app.get('/getOngoingRaces', async (req, res) => {
	const races = await Races.find({"status": "ongoing"}).populate("circuit").populate("cars.car");
	res.json(races);
});

app.get('/getRace/:id', async (req, res) => {
	const race = await Races.findOne({"_id": req.params.id}).populate("circuit").populate("cars.car");
	res.json(race);
});
