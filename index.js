let express = require('express');
let expressMongoDb = require('express-mongo-db');
let env = require('./config/env');

let app = express();

app.use(expressMongoDb('mongodb://localhost/rasp15'));

let ejs = require('ejs');

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.listen(env.port);


app.get('/', function(req, res, next) {

	res.setHeader('Content-Type', 'text/html');
	res.render('menu');
});

app.get('/parcelsHistory', function(req, res) {
	// send the main (and unique) page
	res.setHeader('Content-Type', 'text/html');
	res.sendFile( __dirname + '/views' + '/raceManagement.html');
});


app.get('/raceManagement.js', function(req, res) {
	// send the angular app
	res.setHeader('Content-Type', 'application/javascript');
	res.sendFile( __dirname + '/js' + '/raceManagement.js');
});

app.get('/getAllCustomers', function(req, res) {
	let db = req.db;
	db.collection('customers').find().aggregate([
		{
			$lookup:
				{
					from: "locations",
					localField: "_id",
					foreignField: "parcels.destLocation",
					as: "parcels.destLocation"
				}
		}
	]).toArray(function(err, docs) {
		if (err)
			throw err;
		res.json(docs);
	});
});
