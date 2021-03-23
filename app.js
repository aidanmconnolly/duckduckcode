/*var localPort = 8000;
var express = require("express");
var serveStatic = require("serve-static");
var webserver = express();
webserver.use(serveStatic("./", {"index": ["home.html"]}));
webserver.listen(localPort);
console.log("Listening on port " + localPort + " open a browser to http://localhost:" + localPort);
const fs = require('fs');

fs.appendFile('java.txt', 'This is my text.', function (err, file) {
    if (err) throw err;
    console.log('Saved!');
});

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: localPort });

() => {
    server.on('connection', (ws, req) => {
        console.log('Connection from', req.connection.remoteAddress);
    });
    console.log('The App server is running...');
};

socket.on('message', (buffer) => {
    const command = buffer.toString('utf-8').trim();
    console.log(command);
});*/

/*const http = require('http');
const port = 8000;

const server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.readFile('home.html', function(error, data){
        if (error) {
            res.writeHead(404);
            res.write('Error: file not found');
        } else {
            res.write(data);
        }
        res.end()
    })
});

server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong ', error);
    } else {
        console.log('Server is listening on port ' + port + ". Go to http://localhost:" + port);
    }


});*/

/*const net = require('net');

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log(data.toString());

    });

    socket.write("Hello!");
    socket.end("Server down now.");
}).on('error', (err) => {
    console.error(err);
});

server.listen(8000, () => {
    console.log("opened server on", server.address().port);
});*/

//const http = require('http');
//const WebSocketServer = require('websocket').server;
//const server = http.createServer();
const fs = require('fs');
const csv = require('csv-parser');
//server.listen(8000);
//const wsServer = new WebSocketServer({
//    httpServer: server
//});

/*const questions = [

]*/

/*function Question(question) {
    this.question = question;
    this.answers = [];
    this.answer = "";
}*/

let output = "";

fs.createReadStream('quizzes/testquiz1-Sheet1.csv').pipe(csv()).on('data', (row) => {
    const string = JSON.stringify(row).slice(1, -1);
    output = output + string + "\n";
    //const stringArray = string.split(",");

    /*if(questions.length === 0) {
        var i;
        for(i = 0; i < stringArray.length; i++) {
            questions.push(new Question(stringArray[i].substring(1, stringArray[i].indexOf(":")-1)));
        }
    }
    var i;
    for(i = 0; i < stringArray.length; i++) {
        questions[i].answers.push(stringArray[i].substring(stringArray[i].indexOf(":")+2, stringArray[i].length-1));
    }*/
}).on('end', () => {
    /*console.log(questions);
    var i = 0;
    for(i = 0; i < questions.length; i++) {
        questions[i].answer = parseInt(questions[i].answers.pop());
    }
    console.log(questions);*/
});

/*wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
      console.log('Received Message:', message.utf8Data);
    fs.writeFile('java.java', message.utf8Data, function (err, file) {
        if (err) throw err;
        console.log('Saved!');
    });
      connection.sendUTF('Hi this is WebSocket server!');
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});*/

const { connection } = require('websocket');
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8000 });

(() => {
        server.on('connection', (ws, req) => {
        console.log('Connection from', req.connection.remoteAddress);
        //new Player(null, ws, 0, key);
        //console.log(games);
        new Connect(ws);
        console.log("WASSUP!");
    });
    console.log('The Blackjack server is running...');
})();

class Connect {
    constructor(socket) {
        this.socket = socket;
        this.send(output);
    }

    send(message) {
        try {
            this.socket.send(`${message}\n`);
            console.log("SENT: " + `${message}`);
        } catch (e) {
            console.error(e);
        }
    }
}