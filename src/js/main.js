// Set up the array for all characters; populated it from the swapi site

var allCharacters = [];

// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper


function getData(page, arr){
  swapiModule.getPeople(page, function(data){
    data.results.forEach(function(character){
      arr.push(character);
      console.log("Name: ", character.name);
    });
    if (data.next) { getData(page+1, arr); }
  })
  return arr;
}

new Promise(function(resolve, reject) {
  var myCharacters = getData(1, allCharacters);
  myCharacters = resolve;
  var err_msg = reject;
})
.then(function(payload){
  console.log("Payload is a: ",typeof payload);
  console.log("HERE'S THE NAME: ", payload[83].name);
})
.catch(function(err){
  console.error("Error: ", err);
})


// setTimeout( function() {
//   console.log(allCharacters[83].name);
// },  4000);
