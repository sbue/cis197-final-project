var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var isAuthenticated = require('./middlewares/isAuthenticated.js');
var accountRouter = require('./routes/account.js');
var formRouter = require('./routes/form.js');
var app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/final-proj');

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(bodyParser.urlencoded({ extended: false }));

// TODO: configure body parser middleware to also accept json. just do
// app.use(bodyParser.json())

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


app.get('/', function (req, res, next) {
  if (req.session.user && req.session.user.length > 0) {
    res.redirect('/form/create')
  } else {
    res.redirect('/account/login')
  }
});

app.use('/account', accountRouter);

app.use('/form', formRouter);

// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
});
