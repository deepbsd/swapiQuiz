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
}  // end of getAllPeople()



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
    // testing testing...
    console.log(data);
    console.log(images);
    //console.log(`Who is this?  Name: ${data["BB8"].name}  Image URL: ${data["BB8"].img_url}`);
    return data;

  }) //Yep the data gets into the next promise just fine...
  .then(function(data) {
    generateWhoQuestion(data);
    //console.log(`Who is ${data[char].name}? Image: ${data[char].img_url}`);
  })

function generateWhoQuestion(obj){
  // assign the answer and the alternatives...
  let char = fetchRandomCharacter(obj);
  let answer = char;
  let false1 = fetchRandomCharacter(obj);
  let false2 = fetchRandomCharacter(obj);
  let false3 = fetchRandomCharacter(obj);
  let false4 = fetchRandomCharacter(obj);
  let choices = [false1, false2, false3, false4];

  // push the right answer onto the array of answers
  choices.push(char);

  // make sure no duplicates exist in the answer array
  if (noDupes(choices)){
    console.log('No Duplicates!!!!');
  } else {
    console.log('There be Duplicates!!!!');
    generateWhoQuestion(obj);
  }

  console.log('before shuffle...');
  console.log(`${choices}`);

  // Shuffle the array sequence to the same anwer doesn't
  // always appear in the same spot...
  shuffleArray(choices);
  console.log('after shuffle...');

  // Here's the questions, followed the an array of possible answers...
  console.log(`Who is this: ${obj[char].img_url}?`);
  console.log(`${choices}`);
}  // end of generateWhoQuestion()

function noDupes(arr){
  let unique = [...new Set(arr)];
  if (unique.length !== arr.length){
    return false;
  } else {
    return true;
  }
}


function shuffleArray(arr){
  for (let i = arr.length; i; i--){
    let j = Math.floor(Math.random() * i);
    [arr[i-1], arr[j]] = [arr[j], arr[i-1]];
  }
  return arr;
}

function fetchRandomCharacter(obj) {
  var keys = [];
  for (key in obj) {
    keys.push(key);
  }
  return keys[Math.floor(Math.random() * keys.length)];
}



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
