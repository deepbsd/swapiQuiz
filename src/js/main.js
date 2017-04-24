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

    return data;

  }) //Yep the data gets into the next promise just fine...
  .then(function(data) {
    for (num=0; num<5; num++){
      generateWhoQuestion(data);
    }
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
    removeDupes(choices, obj);
  }

  shuffleArray(choices);


  // Here're the questions, followed the an array of possible answers...
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


function removeDupes(arr, obj){
  if ( arr[0] === arr[1] ) {
    arr[0] = fetchRandomCharacter(obj);
  }
  if ( arr[0] === arr[2] ) {
    arr[0] = fetchRandomCharacter(obj);
  }
  if (arr[0] === arr[3] ) {
    arr[0] = fetchRandomCharacter(obj);
  }
  if (arr[0] === arr[4] ) {
      arr[0] = fetchRandomCharacter(obj);
  }
  if (arr[1] === arr[2] ) {
    arr[1] = fetchRandomCharacter(obj);
  }
  if (arr[1] === arr[3] ) {
    arr[1] = fetchRandomCharacter(obj);
  }
  if (arr[1] === arr[4] ) {
    arr[1] = fetchRandomCharacter(obj);
  }
  if (arr[2] === arr[3] ) {
    arr[2] = fetchRandomCharacter(obj);
  }
  if (arr[2] === arr[4] ) {
    arr[2] = fetchRandomCharacter(obj);
  }
  if ( arr[3] === arr[4] ) {
    arr[3] = fetchRandomCharacter(obj)
  }
  return arr;
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
