var express = require('express'),
    axios = require('axios'),
    bodyParser = require('body-parser'),
    app = express(),
    //swapi = require('swapi-node'),
    swapi = 'http://swapi.co/api/people/?page=',
    PORT = process.env.PORT || 3000;




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//c001
app.use( '/', express.static(__dirname + '/public') );
app.use( '/css', express.static(__dirname + '/src/css') );
app.use( '/img', express.static(__dirname + '/src/img') );
app.use( '/js', express.static(__dirname + '/src/js') );
// needed to add fonts to make them available to front end
app.use( '/fonts', express.static(__dirname + '/src/fonts/jedi/starjedi') );
app.use( '/sounds', express.static(__dirname + '/src/sounds') );

//Just to test that the endpoint works...
app.get('/heartbeat', function(req, res) {
  res.json({
    is: 'working'
  })
});




app.listen(PORT, function() {
  console.log(`The server at port ${PORT} is listening.`);
});
