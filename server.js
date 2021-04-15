if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
var fs = require('fs');

//app.set('view engine', 'html');
//app.engine('html', require('ejs').renderFile);

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

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
    })
    console.log(users[users.length-1])
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.get('/home', (req, res) => {
  var name = null
  if (!(typeof req.user == "undefined")) {
    name = req.user.name
  }
  res.render('home.ejs', {name: name})
})

app.get('/java', (req, res) => {
  var name = null
  if (!(typeof req.user == "undefined")) {
    name = req.user.name
  }
  res.render('java.ejs', {name:name})
})

app.get('/python', (req, res) => {
  var name = null
  if (!(typeof req.user == "undefined")) {
    name = req.user.name
  }
  res.render('python.ejs', {name:name})
})

app.get('/quizzes', (req, res) => {
  var name = null
  if (!(typeof req.user == "undefined")) {
    name = req.user.name
  }
  res.render('quizzes.ejs', {name:name})
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

app.listen(3000)