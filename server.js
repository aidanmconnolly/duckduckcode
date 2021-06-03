var PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const User = require('./models/user');
const Quiz = require('./models/quiz');
var fs = require('fs');

const dbURI = "mongodb+srv://admin:test123@duckduckgoose.qkunt.mongodb.net/DuckDuckGoose?retryWrites=true&w=majority";
var users = [];
var quizzes = [];

function Question(question, answers) {
  this.question = question;
  this.answers = answers;
}

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    Quiz.find()
      .then((result) => {
        for (var i = 0; i < result.length; i++) {
          quizzes.push({
            title: result[i].title,
            questions: result[i].questions
          })
        }
      })
    User.find()
    .then((result) => {
      for (var i = 0; i < result.length; i++) {
        users.push({
          id : result[i].id,
          name: result[i].name,
          email: result[i].email,
          password: result[i].password
        })
      }
      console.log(quizzes);
      console.log(users);
      app.listen(PORT);
    })
    .catch((err) => {
      console.log(err);
    });
  })
  .catch((err) => console.log(err));

//app.set('view engine', 'html');
//app.engine('html', require('ejs').renderFile);

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.get('/add-quiz', (req, res) => {
  var questionsArray = []
  questionsArray[0] = new Question("What is 1 + 1?",  
    [{text: "1", correct: false},
    {text: "2", correct: true},
    {text: "3", correct: false},
    {text: "4", correct: false}]);
  questionsArray[1] = new Question("What color is the sky?",
    [{text: "Blue", correct: true},
    {text: "Green", correct: false},
    {text:"Red", correct: false},
    {text: "Yellow", correct: false}]);
  questionsArray[2] = new Question("Who is the best computer science teacher?",
  [{text: "Mr. Respass", correct: true},
  {text: "Mr. Isecke", correct: true},
  {text:"Mr. Wang", correct: true},
  {text: "Ansh", correct: false}]);
  const quiz = new Quiz({
    title: "test1",
    questions: questionsArray
  });

  quiz.save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    })
});

app.get('/add-user', (req, res) => {
  const user = new User({
    id: Date.now().toString(),
    name: 'bob',
    email: 'bob@mgmail.com',
    password: '$2b$10$MsEWijf/9rtamIowwG71N.3rW0nyRvfOX7CM2iqRnX8cu3G4C0CjW'
  });

  user.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
});

app.get('/all-users', (req, res) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/single-user', (req, res) => {
  User.findById('6085ef7a7b96403e8fc92b2b')
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
})

/*
fs.readFile('accounts.txt', 'utf8', function(err, data) {
  if (err) throw err;
  var accountInfo = data.trim().split("\n")
  for (var i = 0; i < accountInfo.length; i++) {
    accountInfo[i] = accountInfo[i].split(" ")
    users.push({
      id: accountInfo[i][0],
      name: accountInfo[i][1],
      email: accountInfo[i][2],
      password: accountInfo[i][3]
    })
  }
  console.log(users)
});
*/

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.set('view-engine', 'ejs')
app.use('/views', express.static('views'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  var name = null
  if (!(typeof req.user == "undefined")) {
    name = req.user.name
  }
  res.render('home.ejs', {name:name});
  //res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs', {loggedOut: typeof user == "undefined"})
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    const user = new User({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
  
    user.save()
      .then((result) => {
        res.send(result)
      })
      .catch((err) => {
        console.log(err)
      });
    
    console.log(users[users.length-1]);
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
})

app.get('/home', (req, res) => {
  var name = null;
  if (!(typeof req.user == "undefined")) {
    name = req.user.name;
  }
  res.render('home.ejs', {name: name});
})

app.get('/java', (req, res) => {
  var name = null;
  if (!(typeof req.user == "undefined")) {
    name = req.user.name;
  }
  res.render('java.ejs', {name:name});
})

app.get('/python', (req, res) => {
  var name = null;
  if (!(typeof req.user == "undefined")) {
    name = req.user.name;
  }
  res.render('python.ejs', {name:name});
})

app.get('/quizzes', (req, res) => {
  var name = null;
  if (!(typeof req.user == "undefined")) {
    name = req.user.name;
  }
  res.render('quizzes.ejs', {name: name, quizzes: quizzes});
})

app.get('/createquiz', (req, res) => {
  var name = null;
  if (!(typeof req.user == "undefined")) {
    name = req.user.name;
  }
  res.render('createquiz.ejs', {name:name});
})

app.post('/takequiz', async (req, res) => {
  try {
    var quiz = quizzes[req.body.selectedQuiz];
    res.render('takequiz.ejs', {quiz: quiz});
  } catch (error) {
    console.log(error)
    res.redirect('/quizzes')
  }
})


app.post('/createquiz', async (req, res) => {
  try {
    var questions = [new Question(req.body.question, 
      [{text: req.body.correctAnswer, correct: true},
      {text: req.body.answer2, correct: false},
      {text: req.body.answer3, correct: false},
      {text: req.body.answer4, correct: false}]),
    new Question(req.body.question2,
      [{text: req.body.correctAnswer2, correct: true},
      {text: req.body.answer2_2, correct: false},
      {text: req.body.answer3_2, correct: false},
      {text: req.body.answer4_2, correct: false}]),
      new Question(req.body.question3,
        [{text: req.body.correctAnswer3, correct: true},
        {text: req.body.answer2_3, correct: false},
        {text: req.body.answer3_3, correct: false},
        {text: req.body.answer4_3, correct: false}]),
      new Question(req.body.question4,
      [{text: req.body.correctAnswer4, correct: true},
      {text: req.body.answer2_4, correct: false},
      {text: req.body.answer3_4, correct: false},
      {text: req.body.answer4_4, correct: false}]),
      new Question(req.body.question5,
        [{text: req.body.correctAnswer5, correct: true},
        {text: req.body.answer2_5, correct: false},
        {text: req.body.answer3_5, correct: false},
        {text: req.body.answer4_5, correct: false}])]
    for (var i = 0; i < questions.length; i++) {
      questions[i].answers = questions[i].answers.sort(() => Math.random() - .5)
    }
    quizzes.push({
      title: req.body.title,
      questions: questions
    });
    const quiz = new Quiz({
      title: req.body.title,
      questions: questions
    });
  
    quiz.save()
      .then((result) => {
        res.send(result)
      })
      .catch((err) => {
        console.log(err)
      });
    
    console.log(quizzes[quizzes.length-1]);
    res.redirect('/createquiz');
  } catch {
    res.redirect('/createquiz');
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}