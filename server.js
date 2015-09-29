var Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    request = require('request'),
    _ = require('lodash'),
    http = require("http"),
    httpserv = http.createServer(handleHTTP);


httpserv.listen(1100, "localhost");

function handleHTTP(req,res) {
  if (req.method === "GET") {
    if (req.url === "/") {
      res.writeHead(200,{
        "Content-type": "text/html"
      });

      //Get the data from the Public API
      request("http://catfacts-api.appspot.com/api/facts", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body); //Data with the cat fact

          res.end(data['facts'][0]);
        }
      })

    }
    else {
      res.writeHead(404);
      res.end("Couldn't find it!");
    }
  }
  else {
    res.writeHead(403);
    res.end("No, don't do that!");
  }
}

