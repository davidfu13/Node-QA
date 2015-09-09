var express = require("express");
var app = express();
var mongoose = require("mongoose");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');
mongoose.connect('mongodb://localhost:27017/QA');

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({"extended": "true"}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api_json"}));
app.use(methodOverride());

app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

app.listen(8080);

// define model
var Todo = mongoose.model('Todo', {
	text: String
});

// define apis
app.get("/api/todos", function(req, res) {
	Todo.find(function(err, todos) {
		if (err)
			res.send(err);
		res.json(todos);
	});
});

app.post("/api/todos", function(req, res){
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo) {
		if (err)
			res.send(err);
		Todo.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});
