
//call jquery and setup page; import the swapiPeople object.

var allCharacters = [];


// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper
swapiModule.getPeople(function(data){
  console.log("Big Object: ", data);
  data.results.forEach(function(character){
    console.log("Name: ",character.name, "Species: ",character.species);
  })
});


function getData(page, arr){
  swapiModule.getPeople(page, function(data){
    data.results.forEach(function(character){
      arr.push(character);
    });
  });
  //console.log(arr);
  return arr;
}

getData(5, allCharacters);


console.log('allCharacters: ', allCharacters);
