// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper
// allCharacters will contain all the Star Wars characters as an array of objects
// with
// var allCharacters = [];


function getAllPeople (page) {
  var people = []

  return new Promise(function (outerRes, outerRej) {
    function getPeoplePage(page) {
      return new Promise(function (innerRes, innerRej) {
        swapiModule.getPeople(page, function (data) {
          people = people.concat(data.results);
          console.log(people);
          if (data.next !== null) {
            innerRes(getPeoplePage(page + 1));
          }
          else {
            outerRes(people);
          }
        })
      })
    }
    getPeoplePage(page);
  })
}

getAllPeople(1)
  .then(function (data) {
    // allCharacters = data;
    console.log('Who is this? ', data[29].name)
  })


// Set up the array for all characters; populated it from the swapi site

//var allCharacters = [];

// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper

// function getData(page, arr){
//   swapiModule.getPeople(page, function(data){
//     data.results.forEach(function(character){
//       arr.push(character);
//       console.log("Name: ", character.name);
//     });
//     if (data.next) { getData(page+1, arr); }
//   })
//   return arr;
// }

// function getData(page, arr){
//   return new Promise(function(resolve){
//     swapiModule.getPeople(page, function(data){
//       data.results.forEach(function(character){
//         arr.push(character);
//         console.log("Name: ", character.name);
//       });
//       if (data.next) { getData(page+1, arr); }
//     })
//     resolve(arr);
//   })
// }  // end of getData()


// getData(1, allCharacters).then(function(array){ console.log("HERE: ",array[83].name)});

// setTimeout( function() {
//   console.log("Here: ",allCharacters[83].name);
// },  3000);
