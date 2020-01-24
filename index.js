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
	const newRace = new Races(req.query);
	const race = await newRace.save();
});

app.get('/updateRace/:id', async (req, res) => {
	let race = req.query;
	race.cars = JSON.parse(req.query.cars);
	const response = await Races.updateOne({"_id": req.params.id}, race);
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
	let car = req.query;
	console.log(car);
	const response = await Cars.updateOne({"_id": req.params.id}, car);
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
	const newCircuit = new Circuits(req.query);

	const circuit = await newCircuit.save();
});

app.get('/updateCircuit/:id', async (req, res) => {
	let circuit = req.query;
	const response = await Circuits.updateOne({"_id": req.params.id}, circuit);
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
