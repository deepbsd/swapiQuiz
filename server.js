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


app.get('/heartbeat', function(req, res) {
  res.json({
    is: 'working'
  })
});


var swapiPeople = [];



var getData = function(data) {
  //console.log(data);
  // app.get('/swapi', function(req, res) {
    var page = data+1;
    axios.get(`${swapi}${data}`)
      .then(result => {
      var valid = result.data.next;

      swapiPeople.push(result.data);

      //console.log(result.data);

      checkNext(page, valid);
          // }
      })
      .catch(err => console.log(err));
  // });
}

var checkNext = function(nextPage, valid) {
  if(valid != null) {
    getData(nextPage);
  } else {
      app.get( '/swapi', function(req, res) {
        res.json({
          swapi: swapiPeople
        });
      console.log('how ya doin');
    });
  }
}


getData(1);



// var blah = getData(1);
// until blah.data.next == null do {getData}




//module.exports = require('swapi-node');
// swapi.getPerson(7).then(function (result) {
//   console.log(result.name);
// }).catch(function (err) {
//   console.log('error: ', err);
// });



app.listen(PORT, function() {
  console.log(`The server at port ${PORT} is listening.`);
});
