// set variables for environment
var express = require('express'),
  app = express(),
  path = require('path'),
  mmm = require('mmm'),
  colors = require('colors'); // jshint ignore:line

app.configure(function() {

  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));
  mmm.setEngine('hogan.js');
  app.engine('html', mmm.__express);

  // instruct express to server up static assets
  app.use(express.static('public'));

  var templateOpts = {
    title: 'SoHo Controls XI',
    layout: 'layout',
    enableLiveReload: true
  };

  //Setup All Routes

  //Main Index - Kitchen Sink Page
  app.get('/', function(req, res) {
    res.render('index', templateOpts);
  });

  //Controls Index Page and controls sub pages
  var controlOptions = {
      title: 'SoHo Controls XI - Controls Example',
      layout: 'controls/layout',
      enableLiveReload: true
    };

  app.get('/controls/', function(req, res) {
    res.render('controls/index', controlOptions);
  });

  app.get('/controls/*', function(req, res) {
    var end = req.url.replace('/controls/','');
    res.render('controls/' + end, controlOptions);
  });

  //Patterns Index Page and controls sub pages
  app.get('/patterns/*', function(req, res) {
    var patternOptions = {
      title: 'SoHo Controls XI - Pattern Example',
      layout: 'patterns/layout',
      enableLiveReload: true
    };
    var end = req.url.replace('/patterns/','');
    res.render('patterns/' + end, patternOptions);
  });

  //Tests Index Page and controls sub pages
  app.get('/tests/*', function(req, res) {
    var testOptions = {
      title: 'SoHo Controls XI - Tests',
      layout: 'tests/layout',
      enableLiveReload: false
    };
    var end = req.url.replace('/tests/','');
    res.render('tests/' + end, testOptions);
  });

  //Doc Page
  app.get('/docs', function(req, res) {
    res.render('docs', templateOpts);
  });
});

module.exports = app;

