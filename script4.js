//Variables = qNumber(null), timer(num), score(num), initials(text)
let timer = 60;
let runningTimer;
let score;
let username = "";
let qNumber;
let finalScore;
const MAX_HIGH_SCORES = 7;

//DOM Objects = START BUTTON, ANSWER BUTTONS, QUESTION CONTAINER, QUESTION ELEMENT
const startButton = document.getElementById("startButton");
const qContainer = document.getElementById("questionsContainer");
const qElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const countdown = document.getElementById("timerArea");
const scoreArea = document.getElementById("scoreArea");
const highScoresButton = document.getElementById("showScoresButton");

//LocalStorage Objects
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//

startButton.addEventListener("click", startGame);
highScoresButton.addEventListener("click", displayScores);

//function to start the game
//called when start button is clicked, should run the function to display questions and the function to start the timer

function startGame() {
  startButton.classList.add("hide");
  scoreArea.classList.add("hide");
  answerButtons.classList.remove("hide");
  qNumber = 0;
  qContainer.classList.remove("hide");
   document.getElementById("chk").innerHTML = "";
   document.getElementById("imgx").innerHTML = "";
   document.getElementById("imgx2").innerHTML = "";
  scoreArea.innerHTML = "";
  startClock();
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  showQuestion(questions[qNumber]);
}

//function to display the questions
//should load one object from the questions array into the proper html elements, then run the function to collect answers
function showQuestion(question) {
  qElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

//function to start the timer
//should run a countdown that is displayed in the HTML, when time is up, should run the game over function
function startClock() {
  countdown.innerHTML = "Time Remaining: " + timer;
  if (timer <= 0) {
    gameOver();
  } else {
    timer -= 1;
    runningTimer = setTimeout(startClock, 1000);
  }
}

//function to collect answers
//should listen for what answer the user clicks on, compare it to the correct answer, and decrease the timer if wrong. should then run the next question function
//unless the current question is the last, then it should run the game over function
function selectAnswer(e) {
  const selectedButton = e.target;
  if (!selectedButton.dataset.correct) {
    timer = timer - 10;
    console.log(timer);
  }
  if (qNumber == questions.length - 1) {
    gameOver();
  } else {
    clearQuestion();
    qNumber++;
    showQuestion(questions[qNumber]);
    console.log(score);
  }
}

//function to clear the current question
//should empty the HTML elements that are occupied with the currently displayed question
function clearQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

//function for game over
//should grab the current time remaining and set it as the score, hide the questions area, display the score to the user, and give them the chance to try again or submit
//their high scores via a text box for intials and the high scores function
function gameOver() {
  clearInterval(runningTimer);
  countdown.innerHTML = "Finished";
  clearQuestion();
  showResults();
  startButton.innerText = "Restart";
  startButton.classList.remove("hide");
  timer = 90;
  score = 0;
}

function showResults() {
  finalScore = timer;
  if (finalScore < 0) {
    finalScore = 0;
  }
  qElement.innerText = "";
  scoreArea.classList.remove("hide");
  answerButtons.classList.add("hide");
  scoreArea.innerHTML = `Your score is ${finalScore} !<div id="init">Name: <input type="text" name="initials" id="initials" placeholder="Enter Your Name"><button id="save-btn" class="save-btn btn" onclick="submitScores(event)" disabled>Save</button>`;
  username = document.getElementById("initials");
  saveButton = document.getElementById("save-btn");
  username.addEventListener("keyup", function() {
    saveButton.disabled = !username.value;
  });
  if(finalScore>=20){
    document.getElementById("chk").innerHTML = "Well done, you scored good! ";
    var x = document.createElement("IMG");
  x.setAttribute("src", "thumb.png");
  x.setAttribute("width", "70");
  x.setAttribute("height", "70");
  x.setAttribute("alt", "The Pulpit Rock");
  document.getElementById("imgx").appendChild(x);
  var y= document.createElement("IMG");
  y.setAttribute("src", "thumb.png");
  y.setAttribute("width", "70");
  y.setAttribute("height", "70");
  y.setAttribute("alt", "The Pulpit Rock");
  
  document.getElementById("imgx2").appendChild(y);
  }
  else if(finalScore>=10){
    document.getElementById("chk").innerHTML = "You can do better!";
    var x = document.createElement("IMG");
  x.setAttribute("src", "better.png");
  x.setAttribute("width", "70");
  x.setAttribute("height", "70");
  x.setAttribute("alt", "The Pulpit Rock");
  document.getElementById("imgx").appendChild(x);
  var y= document.createElement("IMG");
  y.setAttribute("src", "better.png");
  y.setAttribute("width", "70");
  y.setAttribute("height", "70");
  y.setAttribute("alt", "The Pulpit Rock");
  
  document.getElementById("imgx2").appendChild(y);
  }
  else{
  document.getElementById("chk").innerHTML = "Try again! Your score isn't good. ";
  
  var x = document.createElement("IMG");
  x.setAttribute("src", "sadf.png");
  x.setAttribute("width", "70");
  x.setAttribute("height", "70");
  x.setAttribute("alt", "The Pulpit Rock");
  document.getElementById("imgx").appendChild(x);
  var y= document.createElement("IMG");
  y.setAttribute("src", "sadf.png");
  y.setAttribute("width", "70");
  y.setAttribute("height", "70");
  y.setAttribute("alt", "The Pulpit Rock");
  
  document.getElementById("imgx2").appendChild(y);
  }
}

//function to submit high scores
//should grab the users score and initials and add it to the high scores object, ranked numerically, and run the function to display the high scores
function submitScores(e) {
  const score = {
    score: finalScore,
    name: username.value
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayScores();
}

//function to display high scores
//should populate the HTML with a ranked display of the high scores and and provide the option to clear the scores via a function
function displayScores() {
  clearInterval(runningTimer);
  countdown.innerHTML = "";
  clearQuestion();
  qElement.innerText = "";
  scoreArea.classList.remove("hide");

  scoreArea.innerHTML = `<h2>High Scores</h2><ul id="highScoresList"></ul><button id="clearScores" class="btn" onclick="clearScores()">Clear Scores</button>`;
  const highScoresList = document.getElementById("highScoresList");
  highScoresList.innerHTML = highScores
    .map(score => {
      return `<li class="scoresList">${score.name} - ${score.score}</li>`;
    })
    .join("");
  startButton.classList.remove("hide");
  highScoresButton.classList.add("hide");
}

//function to clear high scores
//should fire on click, and erase the values of the high scores object
function clearScores() {
  highScores = [];
  highScoresList.innerHTML = "<h3>Scores have been Cleared</h3>";
  document.getElementById("clearScores").classList.add("hide");
}

/////
//Questions go Here
/////
const questions = [
  {
    question: "Which of the following type of variable takes precedence over other if names are same?",
    answers: [
      { text: "global variable", correct: false },
      { text: " local variable", correct: true },
      { text: "Both of these", correct: false },
      { text: "None of these", correct: false }
    ]
  },
  {
    question: "Which of the following jQuery method gets the height property of an element?",
    answers: [
      { text: "getcssheight()", correct: false },
      { text: "getheight()", correct: false },
      { text: "Both of these", correct: false },
      { text: "height()", correct: true }
    ]
  },
  {
    question: " Which of the following jQuery method stops the rest of the event handlers from being executed?",
    answers: [
      { text: "preventDefault()", correct: false },
      { text: "stopImmediatePropagation( )", correct: true },
      { text: "preventProp()", correct: false },
    ]
  },
  {
    question: ' Which of the following jQuery method apply a style on an element?',
    answers: [
      { text: 'addCSSClass(classes)', correct: false },
      { text: 'addStyle()', correct: false },
      { text: 'None of these', correct: false },
      { text: 'addClass(classes)', correct: true }
    ]
  },
  {
    question: 'jQuery is a --- side library.',
    answers: [
      { text: 'server', correct: false },
      { text: 'web', correct: false },
      { text: 'dns', correct: false },
      { text: 'client', correct: true }
    ]
  },
  
];
