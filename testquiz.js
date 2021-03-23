/*const startButton = document.getElementById('start-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click');

let shuffledQuestions, currentQuestionIndex;

function startQuiz() {
    console.log("quizStarted");
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    nextButton.classList.remove('hide');
    setNextQuestion()
}

function setNextQuestion() {
    //resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild;
        (answerButtonsElement.firstChild);
    }
}*/

//const { isConstructorDeclaration } = require("typescript")

const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')

let shuffledQuestions, currentQuestionIndex;

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function Question(question) {
    this.question = question;
    this.answers = [];
    this.answer = "";
}

function parseQuestions(text) {
  const stringArray2 = text.split("\n");
  var j;
  for(j = 0; j < stringArray2.length; j++) {
    const stringArray = stringArray2[j].split(",");
    if(questions.length === 0) {
        var i;
        for(i = 0; i < stringArray.length; i++) {
            questions.push(new Question(stringArray[i].substring(1, stringArray[i].indexOf(":")-1)));
        }
    }
    var i;
    for(i = 0; i < stringArray.length; i++) {
        questions[i].answers.push(stringArray[i].substring(stringArray[i].indexOf(":")+2, stringArray[i].length-1));
    }
  }
  questions[0].answers.pop();
  questions[0].answers.pop();
  //alert(questions[0].answers.length);
  var i;
  for(i = 0; i < questions.length; i++) {
      questions[i].answer = parseInt(questions[i].answers.pop());
  }
  //alert(questions[0].answers.length);
  //alert(questions[1].answers.length);

  //shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
  //alert("hey");
  //alert(questions);
  //questionElement.innerText = questions[0;
}

function processCommand(command) {
  //document.body.style.background = 'yellow';
  parseQuestions(command);
  //alert("heyyyyy");
  //alert(command);
}

function startGame() {
  const host = 'localhost';
  socket = new WebSocket(`ws://${host}:8000`);
  socket.addEventListener('message', (event) => { processCommand(event.data); });
  startButton.classList.add('hide')
}

function setNextQuestion() {
  resetState()
  showQuestion(questions[currentQuestionIndex])
}

function showQuestion(question2) {
  //alert(question2)
  questionElement.innerText = question2.question;
  /*question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })*/
  var i;
  //alert(question2.answer)
  for(i = 0; i < question2.answers.length; i++) {
    const button = document.createElement('button')
    button.innerText = question2.answers[i];
    button.classList.add('btn')
    if (i === question2.answer) {
      button.dataset.correct = true;
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  }
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct);
  })
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    //startButton.innerText = 'Restart';
    //startButton.classList.remove('hide');
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

//const questions = [

//]

//const fs = require('fs');

const questions = [
    /*{
        question: 'How do you print a new line?',
        answers: [
            {text: 'System.out.println();', correct: true},
            {text: 'System.out.print();', correct: false},
            {text: 'print();', correct: false},
            {text: 'println();', correct: false}
        ]
    },
    {
        question: 'What is 5 / 2 in Java?',
        answers: [
            {text: '1', correct: false},
            {text: '2', correct: true},
            {text: '3', correct: false},
            {text: '0', correct: false}
        ]
    }*/
];