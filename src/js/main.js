// Set up the array for all characters; populated it from the swapi site

var allCharacters = [];

// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper



// var getData = function(page, arr){
//   swapiModule.getPeople(page, function(data){
//     data.results.forEach(function(character){
//       arr.push(character);
//       console.log("Name: ", character.name);
//     });
//     if (data.next) { getData(page+1, arr); }
//   })
//   return arr;
// }


var getData = function(page, arr, callback){
  swapiModule.getPeople(page, function(data){
    data.results.forEach(function(character){
      arr.push(character);
      console.log("Name: ", character.name);
    });
    if (data.next) { getData(page+1, arr); }
  })
  return arr;
}


const testArr = new Promise((resolve, reject) => {
  const result = getData(1, allCharacters);
  resolve(result);
  //return result;
}).then(result => console.log(`Result is: ${result[83].name}` ));

// new Promise(function(resolve, reject) {
//   getData(1, allCharacters);
//   var myCharacters = resolve;
//   var err_msg = reject;
// })
// .then(function(payload){
//   console.log("HERE'S THE NAME: ", payload[83].name);
// })
// .catch(function(err){
//   console.log("Error: ", err);
// });

//getData(1, allCharacters);

// setTimeout( function() {
//   console.log(allCharacters[83].name);
// },  4000);
