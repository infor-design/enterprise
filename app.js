// set variables for environment
var express = require('express'),
  app = express(),
  path = require('path'),
  layouts = require('express-ejs-layouts');

// views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // replace with whatever template language you desire
app.use(layouts);

// instruct express to server up static assets
app.use(express.static('public'));

// Set up site routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/controls/', function(req, res) {
  res.render('controls/index');
});

app.get('/controls/*', function(req, res) {
  var end = req.url.replace('/controls/','');
  res.render('controls/' + end, { layout: 'controls/layout.ejs' });
});

app.use(express.static(__dirname + '/controls/'), function(req, res) {
  res.render('index');
});

// With the express server and routes defined, we can start to listen
// for requests. Heroku defines the port in an environment variable.
// Our app should use that if defined, otherwise 3000 is a pretty good default.
var port = process.env.PORT || 4000;
app.listen(port);
console.log('The server is now listening on port %s', port);
