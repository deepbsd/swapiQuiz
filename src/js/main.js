// swapiModule is from https://github.com/cfjedimaster/SWAPI-Wrapper
// In the beginning, I used a wrapper to connect to the SWAPI database, but
// that turned out to be inconsistent with the assignment, so I rewrote that
// part of the script.


// ################### Single State Object ####################
//#############################################################

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

const maxQuestions = 20;

const rootURL = 'https://www.swapi.co/api/people/';

// ######################  State Modification Methods ####################
// #######################################################################

function getAllPeople (page) {
  var people = {}

  // Outter promise that will wait til inner promises are done being collected
  return new Promise(function (outerRes, outerRej) {
    function getPeoplePage(page) {
      // inner promises for each page of data from swapi API...
      return new Promise(function (innerRes, innerRej) {
        $.ajax({
          url: rootURL+'?page='+page,
          type: "GET",
          headers: {
            "accept": "application/json;odata=verbose",
          },
          success: function(swapipage) {
            swapipage.results.forEach( character => {
              people[character.name] = character;
            });
            if (swapipage.next !== null) {
              innerRes(getPeoplePage(page + 1));
            } else {
              outerRes(people);
            }
          },
          error: function(error) {
            console.log('error: ',error);
          }
         });
      })
    }
    getPeoplePage(page);
  })
}  // end of getAllPeople()


// Make the first call with the page "1" argument
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
    //console.log('state.people inside getAllPeople: ',state.people);

    return state.people;

  })
  .then(function(state) {

    console.log('state object: ',state);
    renderIntro();

    return state;
  })  // end of getAllPeople()



// ########################  DOM Modification/Rendering Methods ######################
// ###################################################################################


function renderIntro(){

  // Load the spinning loader animation
 $(".loader").fadeOut('fast');


  var introTempl = "<h2 class='intro'>Welcome!</h2> "
  introTempl += "<div class='safety-intro'><p class='intro-text'>The Star Wars Saga is still continuing after 40 years, long after the careers of some of the original actors!  How is it that this story has penetrated generations of human lives and kept informing us of insights into the human condition after all these years?  Remind yourself of some of those unforgettable characters by having fun with this quiz!</p><form id='js-quizz-start-form'><label class='start-quiz-label' for='quizapp-start'></label><input type='hidden' name='start-quiz' id='start-quiz'><button id='start-quiz' type='submit'>Join Rebellion</button></form></div> <!-- end of quiz-intro  -->"

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
  if (state.quizzedPeople.indexOf(char.name) > -1) {
    console.log('DUPLICATE CHARACTER!!!!!  Not using: ',char.name);
    return generateWhoQuestion(obj);
  } else {
    // if char.name is NOT already in quizzedPeople then add it and proceed
    state.quizzedPeople.push(char.name);
  }

  // set up the list of choices...
  let false1 = fetchRandomCharacter(obj),
      false2 = fetchRandomCharacter(obj),
      false3 = fetchRandomCharacter(obj),
      false4 = fetchRandomCharacter(obj);
  let choices = [false1, false2, false3, false4, char.name ];

  // Redundant now but make sure no duplicate false choices exist--be sure!
  if (noDupes(choices)){
    console.log('No Duplicates in choices.');
  } else {
    console.log('There be Duplicates in choices!!!!');
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
      <ul class="optionPick">
        <li>
            <input class="radio" type="radio" id="option-1" name="character" value="${choices[0]}">
            <label class="radio-label" for="option-1">${choices[0]}</label>
        </li>
        <li>
          <input class="radio" type="radio" id="option-2" name="character" value="${choices[1]}">
          <label class="radio-label" for="option-2">${choices[1]}</label>
        </li>
        <li>
            <input class="radio" type="radio" id="option-3" name="character" value="${choices[2]}">
            <label class="radio-label" for="option-3">${choices[2]}</label>
        </li>
        <li>
            <input class="radio" type="radio" id="option-4" name="character" value="${choices[3]}">
            <label class="radio-label" for="option-4">${choices[3]}</label>
        </li>
        <li>
            <input class="radio" type="radio" id="option-5" name="character" value="${choices[4]}">
            <label class="radio-label" for="option-5">${choices[4]}</label>
        </li>
      </ul>
      <input type="submit" value="Do or Do Not" class="formSubmit"></input>
    </form>
  </div>`;



  $(".output").html(template);

  $(".radioButtons").submit(function(ev) {
    ev.preventDefault();
    // get the chosen value and score the question...
    var choice = $("input:radio[name='character']:checked").val();

    scoreQuestion(choice, char);

    proceedQuiz();
  });
}  //end of renderQuestion()


// The user has made it to the end of the quiz!  Show the results!
function renderFinalPg(){
  let template = `
    <div class="summary">
      <p>Congratulations!  You got ${state.scores.right.length} right and ${state.scores.wrong.length} wrong!</p>
      <p>@missed_characters</p>
    <button class="restart">Play again?</button>
    </div>
  `;

  if (state.scores.wrong.length > 0){
    template = template.replace(/@missed_characters/i, `Missed Characters: ${state.missedCharacters.join(', ')}`);
  } else {
    template = template.replace(/@missed_characters/i, 'No Missed Characters!');
  }

  $(".output").html(template);

  $(".restart").click(function(){
    location.reload();
  });

}  // End of renderFinalPg()

//######################  Control Program Flow ########################
//#####################################################################

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

//######################  Modify State Object ########################
//####################################################################

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
  if (noDupes(arr)) {
    return arr;
  } else {
    return removeDupes(arr, obj);
  }
}  // end of removeDupes()


//Just in case we don't like the answer always being the last pick...
function shuffleArray(arr){
  for (let i = arr.length; i; i--){
    let j = Math.floor(Math.random() * i);
    [arr[i-1], arr[j]] = [arr[j], arr[i-1]];
  }
  return arr;
}  // end of shuffleArray()


//This little function does a lot of work of this program...
function fetchRandomCharacter(obj) {
  var keys = [];
  for (key in obj) {
    keys.push(key);
  }
  return keys[Math.floor(Math.random() * keys.length)];
}  // end of fetchRandomCharacter()


// just for testing...
//console.log('at bottom: ',state);
