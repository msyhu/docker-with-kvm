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

app.get("/api/cpu/:id", (req, res) => {
	let startTime = new Date().getTime();
	let result = 0;
	for (let i=0; i<parseInt(req.params.id); i++) {
		result = ((result + Math.random()*10000)*Math.sqrt(Math.random()*10000))%123456789;
	}
	let endTime = new Date().getTime();
	res.send([endTime-startTime]);
});

app.get("/api/makefile/:id", (req, res) => {
	fs.stat("./json/bigfile"+req.params.id+".json", (err) => {
		if (!err) {
			console.log("file or directory exists");
			res.send(["already exist!"]);
		}
		else if (err.code === 'ENOENT') {
			let obj = {};
			for (let i=1; i<=parseInt(req.params.id); i++) {
				obj["data"+i] = "val"+i;
			}
			let stringJson = JSON.stringify(obj);
			fs.open("./json/bigfile"+req.params.id+".json", 'a', "666", (err, id) => {
				if (err) {
					console.log("file open err!");
				} else {
					fs.write(id, stringJson, null, 'utf8', (err) => {
						console.log("file was saved!");
					});
				}
			});
			res.send([req.params.id]);
		}
	});
});

app.post("/api/jsonio/:id", (req, res, next) => {
	let startTime = new Date().getTime();
	let body = req.body;
	let writer = fs.createWriteStream("./file/bigfile"+req.params.id+".txt");
	for (var i=0; i<1000; i++) {
		for (key in body) {
			writer.write(key+":"+body[key]+"\n");
		}
	}
	writer.end();
	writer.on('finish', () => {});
	console.log('finish'+req.params.id);
	let endTime = new Date().getTime();
});

app.get("/api/io/:id", (req, res) => {
	let startTime = new Date().getTime();
	let writer = fs.createWriteStream("./file/bigfile"+PORT_NUM+".txt");
	for (let i=1; i<=parseInt(req.params.id); i++) {
		writer.write("server #"+i+"\n");
	}
	writer.end();
	writer.on('finish', () => {
	});
	let endTime = new Date().getTime();
	res.send([endTime-startTime]);
});




// 문상 add
app.get("/api/copyfile/:filename", (req, res) => {
	let startTime = new Date().getTime();
	let filename = req.params.filename;
	
	fs.copyFileSync(filename, 'copied' + filename);
	let endTime = new Date().getTime();
	res.send([endTime-startTime]);
});

app.get("/api/justreadfile", (req, res) => {
	let startTime = new Date().getTime();
	
	fs.readFile('./source.txt', 'utf8', function(err, data){
		console.log('complete read!');
	});

	let endTime = new Date().getTime();
	res.send([endTime-startTime]);
});

function downloadfile(url) {

	console.log(url);

	return axios.get(url, {responseType: "stream"} );
}

app.post("/api/downloadandmakefile", (req, res) => {
	let startTime = new Date().getTime();
	console.log("startTime", startTime);
	
  downloadfile(req.body.url)  
	.then(response => {  
	// Saving file to working directory  
		console.log('piped!');
    response.data.pipe(fs.createWriteStream("ultraviolet-wallpaper.jpg"));
	})
	.then(response => {
		let finalTime = new Date().getTime() - startTime;
		console.log("final ", finalTime);
		return res.send([finalTime]);
	})
	.catch(err => {
		console.log(err)
		return res.sendStatus(404);
	});

});

app.get("/api/justdownloadfile", (req, res) => {
	let startTime = new Date().getTime();

  axios.get('http://free4kwallpapers.com/uploads/originals/2019/11/13/ultraviolet-wallpaper.jpg', {responseType: "stream"} )  
  .catch(error => {  
    console.log(error);  
	});  

	let endTime = new Date().getTime();

	return res.send([endTime-startTime]);
});

app.get("/api/sendimage", (req, res) => {

	return res.sendFile(__dirname + '/ultraviolet-wallpaper.jpg');
});

app.listen(PORT_NUM, () => console.log('start'));
