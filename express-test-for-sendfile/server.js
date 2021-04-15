if (process.argv.length!=3) {
	console.log("you need argvs");
	console.log("ex) node server.js <port>");
	process.exit();
}

const PORT_NUM = process.argv[2];

const express = require("express");
const fs = require('fs');
const app = express();
const axios = require("axios");

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get("/api/sendimage", (req, res) => {

	return res.sendFile(__dirname + '/ultraviolet-wallpaper.jpg');
});

app.get("/api/sendbigfile", (req, res) => {

	return res.sendFile(__dirname + '/bigfile');
});

app.listen(PORT_NUM, () => console.log('start'));
