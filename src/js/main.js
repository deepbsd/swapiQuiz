// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper
const state = {
  currentPage: 'start',
  currentQuestion: 0,
  quizzedPeople: [],
  missedCharacters: [],
  people: [],
  scores: {
    right: [],
    wrong: []
  },
};

const maxQuestions = 10;



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

  })
  .then(function(state) {
    console.log('state object: ',state);
    renderIntro();
    return state;
  })  // end of getAllPeople()


function renderIntro(){
  var introTempl = "<h2 class='intro'>Welcome!</h2> "
  introTempl += "<div class='safety-intro'><p class='intro-text'>The Star Wars Saga is still continuing after 40 years, long after the careers of some of the original actors!  How is it that this story has penetrated generations of human lives and kept informing us of insights into the human conditions after all these years?  Remind yourself of some of these unforgettable characters by having fun with this quiz!</p><form id='js-quizz-start-form'><label class='start-quiz-label' for='quizapp-start'>Start Your Star Wars Quiz?</label><input type='hidden' name='start-quiz' id='start-quiz'><button id='start-quiz' type='submit'>Start Quiz</button></form></div> <!-- end of quiz-intro  -->"

  $(".output").html(introTempl);

    $("#js-quizz-start-form").submit(function(ev) {
      ev.preventDefault();
      // var obj = state.people;
      state.currentPage = 'question';

      proceedQuiz();
    });
}  // end of renderIntro()


function generateWhoQuestion(obj){
  // assign the answer and the alternatives...
  let char =  { name: fetchRandomCharacter(obj),
                correct: true }

  // if the name has already been quizzed, get another one
  if (state.quizzedPeople.indexOf(char.name) > -1){
    char = { name: fetchRandomCharacter(obj),
             correct: true }
  } else {
    // Keep track of quizzed people so we don't quiz on the same character twice
    state.quizzedPeople.push(char.name);
  }

  // set up the list of choices...
  let false1 = fetchRandomCharacter(obj),
      false2 = fetchRandomCharacter(obj),
      false3 = fetchRandomCharacter(obj),
      false4 = fetchRandomCharacter(obj);
  let choices = [false1, false2, false3, false4, char.name ];

  // Redundant now but make sure no duplicates exist--be sure!
  if (noDupes(choices)){
    console.log('No Duplicates!!!!');
  } else {
    console.log('There be Duplicates!!!!');
    removeDupes(choices, obj);
  }
  shuffleArray(choices);
  renderQuestion(obj, char, choices);
}  // end of generateWhoQuestion()



// Actually lay out the question
function renderQuestion(obj, char, choices){
  let template = `
  <div class="image-wrap">
    <img src="${obj[char.name].img_url}"/>
  </div>
  <div class="formsBox">
    <form id="characterQuestion" class="radioButtons" value="radio">
      <p class="questionText">Who is this?</p>
      <p class="optionPick">
          <input class="radio" type="radio" id="option-1" name="character" value="${choices[0]}">
          <label for="option-1">${choices[0]}</label>
      </p>
      <p class="optionPick">
        <input class="radio" type="radio" id="option-2" name="character" value="${choices[1]}">
        <label for="option-2">${choices[1]}</label>
      </p>
      <p class="optionPick">
          <input class="radio" type="radio" id="option-3" name="character" value="${choices[2]}">
          <label for="option-3">${choices[2]}</label>
      </p>
      <p class="optionPick">
          <input class="radio" type="radio" id="option-4" name="character" value="${choices[3]}">
          <label for="option-4">${choices[3]}</label>
      </p>
      <p class="optionPick">
          <input class="radio" type="radio" id="option-5" name="character" value="${choices[4]}">
          <label for="option-5">${choices[4]}</label>
      </p>
      <input type="submit" value="Submit" class="formSubmit"></input>
    </form>
  </div>`;



  $(".output").html(template);

  $(".radioButtons").submit(function(ev) {
    ev.preventDefault();
    var choice = $("input:radio[name='character']:checked").val();

    scoreQuestion(choice, char);

    proceedQuiz();
  });
}  //end of renderQuestion()


function scoreQuestion(choice, char){
  var message;
  if (choice === char.name) {
    message = " You are right!";
    state.scores.right.push(state.currentQuestion);
  } else {
    message = " Sorry, no.  You are mistaken.";
    state.scores.wrong.push(state.currentQuestion);
    state.missedCharacters.push(char.name);
  }
  console.log('You chose: ', choice, message);
  console.log('Missed Characters: ', state.missedCharacters)
}  // end or scoreQuestion()


// increments state variables and directs the flow of the quiz
function proceedQuiz(){
  console.log('inside proceedQuiz');
  if (state.currentQuestion < maxQuestions && state.currentPage === 'question') {
    state.currentQuestion++;
    console.log(`current Page: ${state.currentPage} and question number is: ${state.currentQuestion}.` )
    generateWhoQuestion(state.people);
  } else {
    state.currentPage = 'final';
    console.log('Final Page Reached!')
    renderFinalPg();
  }
  console.log(`Your score is right: ${state.scores.right.length}  wrong: ${state.scores.wrong.length}.`)
}  // End of proceedQuiz()


function renderFinalPg(){
  console.log('Final Page!');
}

// this exists just in case (used to use it more directly than now)
function noDupes(arr){
  let unique = [...new Set(arr)];
  if (unique.length !== arr.length){
    return false;
  } else {
    return true;
  }
}  // end of noDupes()


// Hopefully this is not needed now, but I keep it just in case.
function removeDupes(arr, obj){
  console.log('Calling removeDupes()!!!')
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
