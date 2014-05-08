// set variables for environment
var express = require('express'),
  app = express(),
  path = require('path'),
  /* jshint ignore:start */
  colors = require('colors'),
  /* jshint ignore:end  */
  layouts = require('express-ejs-layouts');

app.configure(function() {
  // views as directory for all template files
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs'); // replace with whatever template language you desire
  app.use(layouts);

  // instruct express to server up static assets
  app.use(express.static('public'));

  // Set up site routes
  app.get('/', function(req, res) {
    res.render('index', {enableLiveReload: app.locals.enableLiveReload});
  });

  app.get('/docs', function(req, res) {
    res.render('docs.ejs');
  });

  app.get('/controls/', function(req, res) {
    res.render('controls/index');
  });

  app.get('/controls/*', function(req, res) {
    var end = req.url.replace('/controls/','');
    res.render('controls/' + end, { layout: 'controls/layout.ejs' });
  });

  app.get('/tests/*', function(req, res) {
    var end = req.url.replace('/tests/','');
    res.render('tests/' + end, { layout: 'tests/layout.ejs' });
  });

  app.use(express.static(__dirname + '/controls/'), function(req, res) {
    res.render('index');
  });
});

module.exports = app;

