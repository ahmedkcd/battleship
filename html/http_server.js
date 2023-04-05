/*
simple_http_server.js
Jake Levy
Sept 2020

Adapted from your text NodeJS, Mongo, and Angular Development.

 A simple GET server that serves up static html files.
*/
var fs = require('fs');
var http = require('http');
var wg = require('whatwg-url');

//This is the path where the our html resources are stored, relative to this
//file
var filePath = "./html/";

// Determine how the server should respond to requests
let server = http.createServer(function (req, res) {
    console.log(req.headers);
    //create full address from client request and optional base name
    //every system is called "localhost" when connecting to itself
    let baseURL = 'http://' + req.headers.host;
    var urlOBJ = new URL(req.url, baseURL );
    // url.parse(req.url, true, false);  //DEPRECATED
    
    console.log("Method: " + req.method);  //the request object is HUGE
    
    console.log(urlOBJ); //print the url object for students to study
 
    //read the file specified by the client request
    fs.readFile(filePath + urlOBJ.pathname, function(err, data){

	//if some error occurs, assume 404 error for now
	if (err){
	    res.writeHead(404);
	    res.write("<h1> ERROR 404. FILE NOT FOUND</h1><br><br>");
	    res.end(JSON.stringify(err)); //runs when the response 'end' event
	                                 //is emitted
	}
	//Otherwise send the ok signal and write the data to the response
	res.writeHead(200);
	res.end(data);
    });

    //Start the server up, and set it to listen to Port 3000
}).listen(3000, ()=>{
    console.log("Server is running");
});
