// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper

function getAllPeople (page) {
  var people = {}

  // Outter promise that will wait til inner promises are done being collected
  return new Promise(function (outerRes, outerRej) {
    function getPeoplePage(page) {
      // inner promises for each page of data from swapi API...
      return new Promise(function (innerRes, innerRej) {
        swapiModule.getPeople(page, function (swapipage) {
          swapipage.results.forEach( character => {
            people[character.name] = character;
          });
          if (swapipage.next !== null) {
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
    var images = {};
    // populate the images object with urls for each character
    for (k in data) {
      images[k] = `/img/${k.replace(/\s/g, '_').toLowerCase()}.jpg`;
    }
    // add the img_url to each character object
    for (k in data) {
      if ( images[k] ) {
          data[k]["img_url"] = images[k];
      }
    }
    console.log(data);
    console.log(images);
    console.log('Whose url is this? Name: ', data["BB8"].name, ' URL: ',data["BB8"].img_url);
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
