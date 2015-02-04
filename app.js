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
  // leverage body parsing middleware (to be deprecated in subsequent versions)
  app.use(express.bodyParser());

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
      layout: 'tests/layout'
    };
    var end = req.url.replace('/tests/','');
    res.render('tests/' + end, testOptions);
  });

  //Doc Page
  app.get('/docs*', function(req, res) {
    var docOpts = {
      title: 'SoHo XI',
      layout: null,
      enableLiveReload: true
    };
    res.render('docs/index', docOpts);
  });

  //Sample Json call that returns States
  //Example Call: http://localhost:4000/api/states?term=al
  app.get('/api/states', function(req, res) {
    var states = [],
      allStates = [{value: 'AL', label:'Alabama'}, {value: 'AK', label: 'Alaska'}, {value:'AS', label:'American Samoa'},
      {value:'AZ', label:'Arizona'}, {value:'AR', label:'Arkansas'}, {value:'CA', label:'California'},
      {value:'CO', label:'Colorado'}, {value:'CT', label:'Connecticut'}, {value:'DE', label:'Delaware'},
      {value:'DC', label:'District Of Columbia'}, {value:'FM', label:'Federated States Of Micronesia'},
      {value:'FL', label:'Florida'}, {value:'GA', label:'Georgia'}, {value:'GU', label:'Guam'}, {value:'HI', label:'Hawaii'},
      {value:'ID', label:'Idaho'}, {value:'IL', label:'Illinois'}, {value:'IN', label:'Indiana'}, {value:'IA', label:'Iowa'},
      {value:'KS', label:'Kansas'}, {value:'KY', label:'Kentucky'}, {value:'LA', label:'Louisiana'}, {value:'ME', label:'Maine'},
      {value:'MH', label:'Marshall Islands'}, {value:'MD', label:'Maryland'}, {value:'MA', label:'Massachusetts'}, {value:'MI',
      label:'Michigan'}, {value:'MN', label:'Minnesota'}, {value:'MS', label:'Mississippi'}, {value:'MO', label:'Missouri'},
      {value:'MT', label:'Montana'}, {value:'NE', label:'Nebraska'}, {value:'NV', label:'Nevada'}, {value:'NH', label:'New Hampshire'},
      {value:'NJ', label:'New Jersey'}, {value:'NM', label:'New Mexico'}, {value:'NY', label:'New York'}, {value:'NC', label:'North Carolina'},
      {value:'ND', label:'North Dakota'}, {value:'MP', label:'Northern Mariana Islands'}, {value:'OH', label:'Ohio'},
      {value:'OK', label:'Oklahoma'}, {value:'OR', label:'Oregon'}, {value:'PW', label:'Palau'}, {value:'PA', label:'Pennsylvania'},
      {value:'PR', label:'Puerto Rico'}, {value:'RI', label:'Rhode Island'}, {value:'SC', label:'South Carolina'},
      {value:'SD', label:'South Dakota'}, {value:'TN', label:'Tennessee'}, {value:'TX', label:'Texas'}, {value:'UT', label:'Utah'},
      {value:'VT', label:'Vermont'}, {value:'VI', label:'Virgin Islands'}, {value:'VA', label:'Virginia'}, {value:'WA', label:'Washington'},
      {value:'WV', label:'West Virginia'}, {value:'WI', label:'Wisconsin'}, {value:'WY', label:'Wyoming'}];

    for (var i in allStates) {
      if (allStates[i].label.toLowerCase().indexOf(req.query.term) > -1) {
        states.push(allStates[i]);
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(states));
  });

  // RESTful routes
  var restRouter = require('./src/routers/rest-router')(app);

});

module.exports = app;

