// set variables for environment
var express = require('express'),
  app = express(),
  path = require('path'),
  mmm = require('mmm'),
  http = require('http'),
  colors = require('colors'); // jshint ignore:line

  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));
  mmm.setEngine('hogan.js');
  app.engine('html', mmm.__express);

  // instruct express to server up static assets
  app.use(express.static('public'));

  var templateOpts = {
    title: 'SoHo XI',
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
      title: 'SoHo XI',
      subtitle: 'Style',
      layout: 'controls/layout',
      enableLiveReload: true
    };

  app.get('/controls/', function(req, res) {
    controlOptions.subtitle = 'Full Index';
    res.render('controls/index', controlOptions);
  });

  app.get('/controls', function(req, res) {
    controlOptions.subtitle = 'Full Index';
    res.render('controls/index', controlOptions);
  });

  app.get('/controls/*', function(req, res) {
    var end = req.url.replace('/controls/','');
    controlOptions.subtitle = end.charAt(0).toUpperCase() + end.slice(1).replace('-',' ');
    res.render('controls/' + end, controlOptions);
  });

  //Patterns Index Page and controls sub pages
  app.get('/patterns/*', function(req, res) {
    var patternOptions = {
      title: 'SoHo XI',
      subtitle: 'Patterns',
      layout: 'patterns/layout',
      enableLiveReload: true
    };
    var end = req.url.replace('/patterns/','');
    res.render('patterns/' + end, patternOptions);
  });

  app.get('/tests/amd/*', function (req, res) {
    var amdOptions = {
        title: 'SoHo XI',
        subtitle: 'AMD tests',
        layout: 'tests/layout',
        amd: true
      };
    var end = req.url.replace('/tests/amd/','');
    res.render('tests/' + end, amdOptions);
  });

  app.get('/tests/applicationmenu/*', function(req, res) {
    function path() {
      if (req.url.toString().match(/\/site/)) {
        return 'tests/applicationmenu/site/layout';
      }
      return 'tests/applicationmenu/six-levels/layout';
    }

    var appMenuOpts = {
      title: 'SoHo XI',
      subtitle: 'Tests',
      layout: path()
    };
    var end = req.url.replace('/tests/applicationmenu/','');
    res.render('tests/applicationmenu/' + end, appMenuOpts);
  });

  //Tests Index Page and controls sub pages
  app.get('/tests/*', function(req, res) {
    var testOptions = {
      title: 'SoHo XI',
      subtitle: 'Tests',
      layout: 'tests/layout'
    };
    var end = req.url.replace('/tests/','');
    res.render('tests/' + end, testOptions);
  });

  //Doc Page
  var docOpts = {
    title: 'Infor SoHo XI',
    subtitle: '',
    layout: null,
    enableLiveReload: true
  };

  app.get('/docs/', function(req, res) {
    res.render('docs/index', docOpts);
  });

  app.get('/docs', function(req, res) {
    res.render('docs/index', docOpts);
  });

  app.get('/vison', function(req, res) {
    res.render('docs/vison', docOpts);
  });

  app.get('/gallery', function(req, res) {
    res.render('docs/gallery', docOpts);
  });

  app.get('/components', function(req, res) {
    res.render('docs/components', docOpts);
  });

  app.get('/docs*', function(req, res) {
    var end = req.url.replace('/docs/','');
    res.render('docs/' + end, docOpts);
  });

  //Layouts Page
  var layoutOpts = {
    title: 'SoHo XI',
    subtitle: 'Layouts',
    layout: 'layouts/layout',
    enableLiveReload: true
  };

  app.get('/layouts/', function(req, res) {
    res.render('layouts/index', layoutOpts);
  });

  app.get('/layouts', function(req, res) {
    res.render('layouts/index', layoutOpts);
  });

  app.get('/layouts*', function(req, res) {
    var end = req.url.replace('/layouts/','');
    res.render('layouts/' + end, layoutOpts);
  });

  //Examples Apps Pages
  var exampleOpts = {
    title: 'SoHo XI',
    subtitle: 'Examples',
    layout: 'examples/layout',
    enableLiveReload: true
  };

  app.get('/examples/', function(req, res) {
    res.render('examples/index', exampleOpts);
  });

  app.get('/examples/common-nav/*', function(req, res) {
    var commonNavOpts = {
      title: 'Application Title',
      layout: 'examples/common-nav/layout',
      enableLiveReload: true
    },
      end = req.url.replace('/examples/common-nav/', '');

    if (end.match(/\?/)) {
      var param = end.substr(end.indexOf('?'), end.length - 1);
      commonNavOpts.title = decodeURIComponent(param.substr(param.indexOf('=') + 1, param.length - 1)); // 6 = "?title="
      end = end.replace(param, '');
    }

    if (end.match('a1')) {
      commonNavOpts.layout += '-a1';
    } else if (end.match('a2')) {
      commonNavOpts.layout += '-a2';
    } else if (end.match('b1')) {
      commonNavOpts.layout += '-b1';
    } else if (end.match('b2')) {
      commonNavOpts.layout += '-b2';
    }

    res.render('examples/common-nav/' + end, commonNavOpts);
  });

  app.get('/examples', function(req, res) {
    res.render('examples/index', exampleOpts);
  });

  app.get('/examples*', function(req, res) {
    var end = req.url.replace('/examples/','');
    res.render('examples/' + end, exampleOpts);
  });

  // Angular Support
  var angularOpts = {
    title: 'SoHo XI',
    subtitle: 'Angular',
    layout: 'angular/layout',
    enableLiveReload: true
  };

  app.get('/angular/', function(req, res) {
    res.render('angular/index', angularOpts);
  });

  app.get('/angular', function(req, res) {
    res.render('angular/index', angularOpts);
  });

  app.get('/angular*', function(req, res) {
    var end = req.url.replace('/angular/','');
    res.render('angular/' + end, angularOpts);
  });

  // Knockout Support
  var knockoutOpts = {
    title: 'SoHo XI',
    subtitle: 'Knockout',
    layout: 'knockout/layout',
    enableLiveReload: true
  };

  app.get('/knockout/', function(req, res) {
    res.render('knockout/index', knockoutOpts);
  });

  app.get('/knockout', function(req, res) {
    res.render('knockout/index', knockoutOpts);
  });

  app.get('/knockout*', function(req, res) {
    var end = req.url.replace('/knockout/','');
    res.render('knockout/' + end, knockoutOpts);
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
      {value:'MH', label:'Marshall Island Teritory'}, {value:'MD', label:'Maryland'}, {value:'MA', label:'Massachusetts'}, {value:'MI',
      label:'Michigan'}, {value:'MN', label:'Minnesota'}, {value:'MS', label:'Mississippi'}, {value:'MO', label:'Missouri'},
      {value:'MT', label:'Montana'}, {value:'NE', label:'Nebraska'}, {value:'NV', label:'Nevada'}, {value:'NH', label:'New Hampshire'},
      {value:'NJ', label:'New Jersey'}, {value:'NM', label:'New Mexico'}, {value:'NY', label:'New York'}, {value:'NC', label:'North Carolina'},
      {value:'ND', label:'North Dakota'}, {value:'MP', label:'Northern Mariana Island Teritory'}, {value:'OH', label:'Ohio'},
      {value:'OK', label:'Oklahoma'}, {value:'OR', label:'Oregon'}, {value:'PW', label:'Palau'}, {value:'PA', label:'Pennsylvania'},
      {value:'PR', label:'Puerto Rico'}, {value:'RI', label:'Rhode Island Teritory'}, {value:'SC', label:'South Carolina'},
      {value:'SD', label:'South Dakota'}, {value:'TN', label:'Tennessee'}, {value:'TX', label:'Texas'}, {value:'UT', label:'Utah'},
      {value:'VT', label:'Vermont'}, {value:'VI', label:'Virgin Island Teritory'}, {value:'VA', label:'Virginia'}, {value:'WA', label:'Washington'},
      {value:'WV', label:'West Virginia'}, {value:'WI', label:'Wisconsin'}, {value:'WY', label:'Wyoming'}];

    for (var i in allStates) {
      if (allStates[i].label.toLowerCase().indexOf(req.query.term.toLowerCase()) > -1) {
        states.push(allStates[i]);
      }
    }

    if (req.query.term === undefined) {
      states = allStates;
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(states));
  });

  // Sample People
  app.get('/api/people', function(req, res) {
    var people = [{ id: 1, rowHeight: 50, lastName:  'Asper', firstName:  'David',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/men/10.jpg', status: 'Full time employee' , anniversary: '06/02/2012', score: 3, payRate: 90000, budgeted: 1200, budgetedHourly: 0.25, reccomended: '0-0%', percent: '0%', accepted: true},
        { id: 2, lastName:  'Baxter', firstName:  'Michael',  title:  'System Architect', img: 'https://randomuser.me/api/portraits/med/men/11.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 2, payRate: 50000, budgeted: 1300, budgetedHourly: 0.25, reccomended: '10-20%', percent: '4.16%', accepted: false},
        { id: 3, rowHeight: 100, lastName:  'Baxter', firstName:  'Steven',  title:  'Some Very Very Very Long Title That is too long but still should show.', img: 'https://randomuser.me/api/portraits/med/men/12.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 0, payRate: 60000, budgeted: 1100, budgetedHourly: 0.65, reccomended: '30-40%', percent: '10%', accepted: true},
        { id: 4, lastName:  'Baxter', firstName:  'Samual',  title:  'System Architect', img: 'https://randomuser.me/api/portraits/med/men/13.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 5, payRate: 80000, budgeted: 1200, budgetedHourly: 0.15, reccomended: '60-70%', percent: '20%', accepted: false},
        { id: 5, lastName:  'Bronte', firstName:  'Emily',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/women/14.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: false},
        { id: 6, lastName:  'Davendar', firstName:  'Konda',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/women/15.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%'},
        { id: 7, lastName:  'Little', firstName:  'Jeremy',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/men/16.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: false},
        { id: 8, lastName:  'Ayers', firstName:  'Julie',  title:  'Architect', img: 'https://randomuser.me/api/portraits/med/women/17.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%'},
        { id: 9, lastName:  'Ortega', firstName:  'Hector',  title:  'Senior Architect', img: 'https://randomuser.me/api/portraits/med/men/18.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: false},
        { id: 10, lastName:  'McConnel', firstName:  'Mary',  title:  'Engineer', img: 'https://randomuser.me/api/portraits/med/women/19.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%'},
        { id: 11, lastName:  'Smith', firstName:  'John',  title:  'Developer', img: 'https://randomuser.me/api/portraits/med/men/20.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: true},
        { id: 12, lastName:  'Horrocks', firstName:  'Donna',  title:  'Associate Developer', img: 'https://randomuser.me/api/portraits/med/women/21.jpg', status: 'Freelance, 3-6 months', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: true},
        { id: 13, lastName:  'Land', firstName:  'Danielle',  title:  'Developer', img: 'https://randomuser.me/api/portraits/med/women/22.jpg', status: 'Full time employee', anniversary: '06/02/2012', score: 6, payRate: 50000, budgeted: 1400, budgetedHourly: 0.15, reccomended: '70-100%', percent: '30%', accepted: true}];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(people));
  });

  // Sample Product
  app.get('/api/product', function(req, res) {
    var products = [
    { id: 1, productId: 200129, productName: 'A Miscellaneous Gravel, Colored Ston...', inStock:  '22,000',  units: '300 lb.', unitPrice:  '18.00', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 2, productId: 300123, productName: 'B Gravel, Natural Stone', inStock:  '20,000',  units: '300 lb.',  unitPrice:  '10.00', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 3, productId: 200123, productName: 'C Gravel, Natural Stone', inStock:  '12,050',  units: '300 lb.',  unitPrice:  '12.50', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'primary' },
    { id: 4, productId: 200153, productName: 'D Miscellaneous Gravel, Colored Ston...', inStock:  '22,000',  units: '300 lb.',  unitPrice:  '10.22', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 5, productId: 200123, productName: 'E Miscellaneous Gravel, Colored Ston...', inStock:  '22,000',  units: '300 lb.',  unitPrice:  '15.80', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 6, productId: 201123, productName: 'F Gravel, Natural Stone', inStock:  '9,500', units: '300 lb.',  unitPrice:  '21.00', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 7, productId: 100123, productName: 'G Miscellaneous Gravel, Colored Ston...', inStock:  '22,000',  units: '300 lb.',  unitPrice:  '19.10', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 8, productId: 260123, productName: 'H Gravel, Natural Stone', inStock:  '18,000',  units: '300 lb.',  unitPrice:  '16.30', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 9, productId: 202123, productName: 'a Gravel, Natural Stone', inStock:  '42,201',  units: '300 lb.',  unitPrice:  '10.00', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 10, productId: 200120, productName: 'b Miscellaneous Gravel, Colored Ston...', inStock:  '22,100',  units: '300 lb.',  unitPrice:  '11.00', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 11, productId: 408123, productName: 'c Miscellaneous Gravel, Colored Ston...', inStock:  '21,150',  units: '300 lb.',  unitPrice:  '15.06', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' },
    { id: 12, productId: 200123, productName: 'd Gravel, Natural Stone', inStock:  '14,000',  units: '300 lb.',  unitPrice:  '15.90', thumb: 'http://placehold.it/100x100/999999/FFFFFF', 'action': 'secondary' }];

    if (req.query.limit) {
      products = products.slice(0,req.query.limit);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(products));
  });

  // Sample Towns
  app.get('/api/towns', function(req, res) {
    var towns = [
      {
        group: 'Burlington County',
        options: [
          { value: 'Bass River Township' }, { value: 'Beverly' }, { value: 'Bordentown' }, { value: 'Bordentown City' }, { value: 'Browns Mills' },
          { value: 'Burlington City' }, { value: 'Burlington Township' }, { value: 'Chesterfield' }, { value: 'Cinnaminson' }, { value: 'Columbus' },
          { value: 'Delanco' }, { value: 'Delran' }, { value: 'Eastampton' }, { value: 'Edgewater Park' }, { value: 'Evesham' }, { value: 'Fieldsboro' },
          { value: 'Florence' }, { value: 'Fort Dix' }, { value: 'Hainesport' }, { value: 'Lumberton' }, { value: 'Mansfield' }, { value: 'Maple Shade' },
          { value: 'Marlton' }, { value: 'Medford' }, { value: 'Medford Lakes' }, { value: 'Moorestown' }, { value: 'Mount Holly' }, { value: 'Mount Laurel' },
          { value: 'New Hanover' }, { value: 'North Hanover' }, { value: 'Palmyra' }, { value: 'Pemberton' }, { value: 'Roebling' }, { value: 'Riverside' },
          { value: 'Riverton' }, { value: 'Shamong' }, { value: 'Southampton' }, { value: 'Springfield' }, { value: 'Tabernacle' },
          { value: 'Washington Township' }, { value: 'Westampton' }, { value: 'Willingboro' }, { value: 'Woodland' }, { value: 'Wrightstown' }
        ]
      },
      {
        group: 'Camden County',
        options: [
          { value: 'Audubon' }, { value: 'Audubon Park' }, { value: 'Barrington' }, { value: 'Bellmawr' }, { value: 'Berlin Boro' },
          { value: 'Berlin Township' }, { value: 'Brooklawn' }, { value: 'Camden' }, { value: 'Cherry Hill' }, { value: 'Chesilhurst' },
          { value: 'Clementon' }, { value: 'Collingswood' }, { value: 'Erial' }, { value: 'Gibbsboro' }, { value: 'Gloucester City' }, { value: 'Gloucester Township' },
          { value: 'Haddon Heights' }, { value: 'Haddon Township' }, { value: 'Haddonfield' }, { value: 'Hi-Nella' }, { value: 'Laurel Springs' },
          { value: 'Lawnside' }, { value: 'Lindenwold' }, { value: 'Magnolia' }, { value: 'Merchantville' }, { value: 'Mount Ephraim' }, { value: 'Oaklyn' },
          { value: 'Pennsauken' }, { value: 'Pine Hill' }, { value: 'Pine Valley' }, { value: 'Runnemede' }, { value: 'Sicklerville' }, { value: 'Somerdale' },
          { value: 'Stratford' }, { value: 'Tavistock' }, { value: 'Voorhees' }, { value: 'Waterford' }, { value: 'Winslow' }, { value: 'Woodlynne' }
        ]
      },
      {
        group: 'Gloucester County',
        options: [
          { value: 'Bridgeport' }, { value: 'Clayton' }, { value: 'Cross Keys' }, { value: 'Deptford' }, { value: 'East Greenwich' },
          { value: 'Elk Township' }, { value: 'Franklin Township' }, { value: 'Franklinville' }, { value: 'Gibbstown' }, { value: 'Glassboro' },
          { value: 'Greenwich Township' }, { value: 'Harrison' }, { value: 'Malaga' }, { value: 'Mullica Hill' }, { value: 'Logan' }, { value: 'Mantua' },
          { value: 'Monroe' }, { value: 'National Park' }, { value: 'New Brooklyn' }, { value: 'Newfield' }, { value: 'Paulsboro' }, { value: 'Pitman' },
          { value: 'South Harrison' }, { value: 'Swedesboro' }, { value: 'Turnersville' }, { value: 'Washington Township' }, { value: 'Wenonah' },
          { value: 'West Deptford Township' }, { value: 'Westville' }, { value: 'Williamstown' }, { value: 'Woodbury' }, { value: 'Woodbury Heights' }, { value: 'Woolwich' }
        ]
      }
    ];

    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(towns));
  });

  // Sample Tasks
  app.get('/api/tasks', function(req, res) {
    var tasks = [{ id: 1, escalated: 2, taskName: 'Follow up action with HMM Global', desc: 'Contact sales representative with the updated purchase order.', comments: 21, time: '7:04 AM'},
      { id: 2, escalated: 1, taskName: 'Quotes due to expire', desc: 'Update pending quotes and send out again to customers.', comments: 3, time: '12/13/14 7:04 AM'},
      { id: 3, escalated: 0, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/14/14'},
      { id: 4, escalated: 0, taskName: 'Follow up action with Acme Trucking', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/14/14'},
      { id: 5, escalated: 0, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/14/14'},
      { id: 6, escalated: 0, taskName: 'Follow up action with HMM Global', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/15/14'},
      { id: 7, escalated: 0, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 2, time: '12/15/14'},
      { id: 8, escalated: 0, taskName: 'Follow up action with Universal HMM Logistics', desc: 'Contact sales representative.', comments: 2, time: '12/16/14'},
      { id: 9, escalated: 0, taskName: 'Follow up action with Acme Shipping', desc: 'Contact sales representative.', comments: 2, time: '12/16/14'},
      { id: 10, escalated: 0, taskName: 'Follow up action with Residental Shipping Logistics ', desc: 'Contact sales representative.', comments: 2, time: '12/16/14'},
      { id: 11, escalated: 0, taskName: 'Follow up action with Universal Shipping Logistics Customers', desc: 'Contact sales representative.', comments: 2, time: '12/18/14'},
      { id: 12, escalated: 0, taskName: 'Follow up action with Acme Universal Logistics Customers', desc: 'Contact sales representative.', comments: 2, time: '12/18/14'},
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
  });

  //Sample Periods
  app.get('/api/periods', function(req, res) {
    var tasks = [{ id: 1, city: 'London', location: 'Corporate FY15', alert: true, daysLeft: '3', hoursLeft: '23'},
     { id: 1, city: 'New York', location: 'Corporate FY15', alert: false, daysLeft: '25', hoursLeft: '11'},
     { id: 1, city: 'Vancouver', location: 'Corporate FY15', alert: false, daysLeft: '30', hoursLeft: '23'},
     { id: 1, city: 'Tokyo', location: 'Corporate FY15', alert: false, daysLeft: '35', hoursLeft: '13'}
   ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
  });

  app.get('/api/nav-items', function(req, res) {
    res.render('tests/accordion-api-options.html');
  });

  // TODO: Make this work with XSS to return a copy of the SoHo Site Search Results for testing the Modal Search plugin.
  // Calls out to Craft CMS's search results page.
  // NOTE: Doesn't actually get rendered, just passed along.
  app.post('/api/site-search', function(req, res) {
    var opts = {
      host: 'usmvvwdev53',
      port: '80',
      path: '/search/results', // ?q=[SEARCH TERM GOES HERE]
      method: 'POST',
      headers: req.headers
    },
    creq = http.request(opts, function(cres) {
      // set encoding
      cres.setEncoding('utf8');

      // wait
      cres.on('data', function(chunk){
        res.write(chunk);
      });

      cres.on('close', function(){
        // closed, let's end client request as well
        res.writeHead(cres.statusCode);
        res.end();
      });

      cres.on('end', function(){
        // finished, let's finish client request as well
        res.writeHead(cres.statusCode);
        res.end();
      });

    }).on('error', function() {
      // we got an error, return 500 error to client and log error
      res.writeHead(500);
      res.end();
    });

    creq.end();
  });

  //Data Grid Paging Example
  // Example Call: http://localhost:4000/api/compressors?pageNum=1&sort=productId&pageSize=100
  app.get('/api/compressors', function(req, res) {

    var products = [], productsAll = [],
      start = (req.query.pageNum -1) * req.query.pageSize,
      end = req.query.pageNum * req.query.pageSize,
      total = 1000, i = 0, j = 0;

    for (j = 0; j < total; j++) {
      productsAll.push({ id: j, productId: 214220+j, productName: 'Compressor', activity:  'Assemble Paint', quantity: 1+(j/2), price: 210.99-j, status: 'OK', orderDate: new Date(2014, 12, 8), action: 'Action'});
    }

    var sortBy = function(field, reverse, primer){
       var key = function (x) {return primer ? primer(x[field]) : x[field];};

       return function (a,b) {
        var A = key(a), B = key(b);
        return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
       };
    };

    if (req.query.sortField) {
      productsAll.sort(sortBy(req.query.sortField, (req.query.sortAsc ==='true' ? true : false), function(a){return a.toString().toUpperCase();}));
    }

    for (i = start; i < end && i < total; i++) {
      products.push(productsAll[i]);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(products));
  });

  app.get('/api/lookupInfo', function(req, res) {
    var columns = [],
      data = [];

    // Some Sample Data
    data.push({ id: 1, productId: 2142201, productName: 'Compressor', activity:  'Assemble Paint', quantity: 1, price: 210.99, status: 'OK', orderDate: new Date(2014, 12, 8), action: 'Action'});
    data.push({ id: 2, productId: 2241202, productName: 'Different Compressor', activity:  'Inspect and Repair', quantity: 2, price: 210.99, status: '', orderDate: new Date(2015, 7, 3), action: 'On Hold'});
    data.push({ id: 3, productId: 2342203, productName: 'Compressor', activity:  'Inspect and Repair', quantity: 1, price: 120.99, status: null, orderDate: new Date(2014, 6, 3), action: 'Action'});
    data.push({ id: 4, productId: 2445204, productName: 'Another Compressor', activity:  'Assemble Paint', quantity: 3, price: 210.99, status: 'OK', orderDate: new Date(2015, 3, 3), action: 'Action'});
    data.push({ id: 5, productId: 2542205, productName: 'I Love Compressors', activity:  'Inspect and Repair', quantity: 4, price: 210.99, status: 'OK', orderDate: new Date(2015, 5, 5), action: 'On Hold'});
    data.push({ id: 5, productId: 2642205, productName: 'Air Compressors', activity:  'Inspect and Repair', quantity: 41, price: 120.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});
    data.push({ id: 6, productId: 2642206, productName: 'Some Compressor', activity:  'inspect and Repair', quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});

    //Define Columns for the Grid.
    columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, width: 50, formatter: 'SelectionCheckbox', align: 'center'});
    columns.push({ id: 'productId', name: 'Product Id', field: 'productId', width: 140, formatter: 'Readonly'});
    columns.push({ id: 'productName', name: 'Product Name', sortable: false, field: 'productName', width: 250, formatter: 'Hyperlink'});
    columns.push({ id: 'activity', hidden: true, name: 'Activity', field: 'activity', width: 125});
    columns.push({ id: 'quantity', name: 'Quantity', field: 'quantity', width: 125});
    columns.push({ id: 'price', name: 'Price', field: 'price', width: 125, formatter: 'Decimal'});
    columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', formatter: 'Date', dateFormat: 'M/d/yyyy'});

    var lookupInfo = [{ columns: columns, dataset: data}];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(lookupInfo));
  });

module.exports = app;

