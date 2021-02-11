
var localPort = 8000;
var express = require("express");
var serveStatic = require("serve-static");
var webserver = express();
webserver.use(serveStatic("./", {"index": ["home.html"]}));
webserver.listen(localPort);
console.log("Listening on port " + localPort + " open a browser to http://localhost:" + localPort);

/*
const http = require('http');
const fs = require('fs');
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


});
*/