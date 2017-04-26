// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper
const state = {
  currentPage: 'start',
  currentQuestion: 0,
  people: [],
  scores: []
};

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

    // Add People to the overall object
    state.people = data;
    // testing testing...
    console.log('state.people: ',state.people);

    return state.people;

  }) //Yep the data gets into the next promise just fine...
  // .then(function(data) {
  //   var maxQuestions = 5;
  //   for (num=0; num<maxQuestions; num++){
  //     generateWhoQuestion(data);
  //   }
  // })
  .then(function(state) {
    console.log('state object: ',state);
    renderIntro();
    return state;
  })


function renderIntro(){
  var introTempl = "<h2 class='intro'>Welcome to the Star Wars Character Quiz!</h2> "
  introTempl += "<div class='safety-intro'><p class='intro-text'>The Star Wars Saga is still continuing after 40 years, long after the careers of some of the original actors!  How is it that this story has penetrated generations of human lives and kept informing us of insights into the human conditions after all these years?  Remind of yourself of some of these unforgettable characters and have fun with the quiz at the same time!</p><form id='js-quizz-start-form'><label for='quizapp-start'>Start Your Star Wars Quiz?</label><input type='hidden' name='start-quiz' id='start-quiz'><button id='start-quiz' type='submit'>Start Quiz</button></form></div> <!-- end of quiz-intro  -->"

    // console.log('this is state.people: ', state.people);

  $(".output").html(introTempl);


    $("#start-quiz").click(function(ev) {
      ev.preventDefault();
      var obj = state.people;

      generateWhoQuestion(obj);
    });

}



function generateWhoQuestion(obj){
  console.log('inside generateWhoQuestion:  ',obj);
  // assign the answer and the alternatives...
  let char =  { name: fetchRandomCharacter(obj),
                correct: true }
  let false1 = fetchRandomCharacter(obj);
  let false2 = fetchRandomCharacter(obj);
  let false3 = fetchRandomCharacter(obj);
  let false4 = fetchRandomCharacter(obj);
  let choices = [false1, false2, false3, false4, char.name ];

  // push the right answer onto the array of answers
  // choices.push(char);

  // make sure no duplicates exist in the answer array
  if (noDupes(choices)){
    console.log('No Duplicates!!!!');
  } else {
    console.log('There be Duplicates!!!!');
    removeDupes(choices, obj);
  }

  shuffleArray(choices);

  renderQuestion(obj, char, choices);

  // Here're the questions, followed the an array of possible answers...
  //console.log(`Who is this: ${obj[char.name].img_url}?`);
  //console.log(`${choices}`);
}  // end of generateWhoQuestion()

function renderQuestion(obj, char, choices){
  let template = `<img src="${obj[char.name].img_url}"/><br> `
  template += `<p class="questionText">Who is this?</p>`
  template += `<form class="radioButtons" value="radio"> `
  template += `<input type="radio" value="${choices[0]}" name="A">${choices[0]}</input>  `
  template += `<input type="radio" value="${choices[1]}" name="B">${choices[1]}</input>  `
  template += `<input type="radio" value="${choices[2]}" name="C">${choices[2]}</input>  `
  template += `<input type="radio" value="${choices[3]}" name="D">${choices[3]}</input>  `
  template += `<input type="radio" value="${choices[4]}" name="E">${choices[4]}</input><br>`
  template += `<input type="submit" value="Submit"></input></form>`


  $(".output").html(template);
}  //end of renderQuestion()



function scoreQuestion(choice){
  if (choice.correct) {
    return true;
  } else {
    return false;
  }
}  // end or scoreQuestion()


function noDupes(arr){
  let unique = [...new Set(arr)];
  if (unique.length !== arr.length){
    return false;
  } else {
    return true;
  }
}  // end of noDupes()


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
}  // end of removeDupes()


function shuffleArray(arr){
  for (let i = arr.length; i; i--){
    let j = Math.floor(Math.random() * i);
    [arr[i-1], arr[j]] = [arr[j], arr[i-1]];
  }
  return arr;
}  // end of shuffleArray()


function fetchRandomCharacter(obj) {
  var keys = [];
  for (key in obj) {
    keys.push(key);
  }
  return keys[Math.floor(Math.random() * keys.length)];
}  // end of fetchRandomCharacter()


// just for testing...
console.log('at bottom: ',state);
