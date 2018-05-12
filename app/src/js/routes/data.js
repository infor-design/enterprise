/* eslint-disable */
// =========================================
// Fake 'API' Calls for use with AJAX-ready Controls
// =========================================

// Sample Json call that returns States
// Example Call: http://localhost:4000/api/states?term=al

const path = require('path');
const getJSONFile = require('../get-json-file');
const utils = require('../utils');
const express = require('express');
const generalRoute = require('./general');

const router = express.Router();

const JS_REGEX = /\.js$/i;
const JSON_REGEX = /\.json$/i;

// Handles the sending of an incoming JSON file
function sendJSONFile(filepath, req, res, next) {
  const data = getJSONFile(`${filepath}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.json(data);
  next();
}

// Gets an internally-corrected path to a specified file.
function getDataFilePath(filename) {
  return path.resolve(__dirname, '..', '..', '..', 'data', filename);
}

// Calls out to an external piece of middleware that will pass JS data.
function handleJSFile(jsFilename, req, res, next) {
  const middleware = require(jsFilename);
  return middleware(req, res, next);
}

// ========================================
// API Routes
// ========================================
router.get('/', (req, res, next) => {
  generalRoute(req, res, next);
});

router.get('/:fileName', (req, res, next) => {
  const filename = req.params.fileName;
  let filepath = getDataFilePath(filename);
  let isJSONFile = filename.match(JSON_REGEX);
  let isJSFile = filename.match(JS_REGEX);

  if (isJSONFile) {
    if (utils.hasFile(filepath)) {
      sendJSONFile(filepath.replace(JSON_REGEX, ''), req, res, next);
      return;
    }
    res.status(404);
    next(`No .JSON file named "${filename}" found`);
    return;
  }

  if (isJSFile) {
    if (utils.hasFile(filepath)) {
      handleJSFile(filepath);
      return;
    }
    res.status(404);
    next(`No .JSON file named "${filename}" found`);
    return;
  }

  // Check for JSON file
  const jsonFilename = `${filename}.json`;
  filepath = getDataFilePath(jsonFilename);
  if (utils.hasFile(filepath)) {
    sendJSONFile(filepath.replace(JSON_REGEX, ''), req, res, next);
    return;
  }

  // Check for JS file
  const jsFilename = `${filename}.js`;
  filepath = getDataFilePath(jsFilename);
  if (utils.hasFile(filepath)) {
    handleJSFile(filepath, req, res, next);
    return;
  }

  res.status(500);
  next('Can\'t do anything with the data filename provided...');
});

/*
module.exports = function(router){
  router.get('/states', (req, res, next) => {
    let states = [],
      allStates = getJSONFile(path.resolve('app', 'data', 'states.json'));

    function done() {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(states));
      next();
    }

    if (!req || !req.query || !req.query.term) {
      states = allStates;
      return done();
    }

    for (let i = 0; i < allStates.length; i++) {
      if (allStates[i].label.toLowerCase().indexOf(req.query.term.toLowerCase()) > -1) {
        states.push(allStates[i]);
      }
    }

    done();
  });



  router.get('/fruits', (req, res, next) => {
    let resData,
      fruits = {
        main: '' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Apples</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#" data-category-id="grapes"><span>Grapes</span></a>' +
            '</div>' +
            '<div class="accordion-pane"></div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Oranges</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#" data-category-id="Kiwi"><span>Kiwi</span></a>' +
            '</div>' +
            '<div class="accordion-pane"></div>',

        grapes: '' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Concord</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>John Viola</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Merlot</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Cabernet</span></a>' +
            '</div>',

        Kiwi: '' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Berries</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Blueberries</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Strawberries</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Blackberries</span></a>' +
            '</div>' +
            '<div class="accordion-header">' +
              '<a href="#"><span>Raspberries</span></a>' +
            '</div>'
      };

    resData = req.query.categoryId ? fruits[req.query.categoryId] : fruits.main;
    if (!resData) {
      resData = '' +
          '<div class="accordion-content" style="color: red;">' +
            '<p>Error: Couldn\'t find any fruits...</p>' +
          '</div>';
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resData));
    next();
  });

  // Data Grid Paging Example
  // Example Call: http://localhost:4000/compressors?pageNum=1&sort=productId&pageSize=100
  router.get('/compressors', (req, res, next) => {
    let products = [],
      productsAll = [],
      term,
      start = (req.query.pageNum - 1) * req.query.pageSize,
      end = req.query.pageNum * req.query.pageSize,
      total = 1000,
      i = 0,
      j = 0,
      filteredTotal = 0,
      seed = 1,
      statuses = ['OK', 'On Hold', 'Inactive', 'Active', 'Late', 'Complete'];

    for (j = 0; j < total; j++) {
      let filteredOut = false;

      // Just filter first four cols
      if (req.query.filter) {
        term = req.query.filter.replace('\'', '');
        filteredOut = true;

        if ((214220 + j).toString().indexOf(term) > -1) {
          filteredOut = false;
        }

        if ('Compressor'.toString().toLowerCase().indexOf(term) > -1) {
          filteredOut = false;
        }

        if ('Assemble Paint'.toString().toLowerCase().indexOf(term) > -1) {
          filteredOut = false;
        }

        if ((1 + (j / 2)).toString().indexOf(term) > -1) {
          filteredOut = false;
        }
      }

      // Filter Row simulation
      if (req.query.filterValue) {
        term = req.query.filterValue.replace('\'', '').toLowerCase();
        filteredOut = true;

        if (req.query.filterColumn === 'productId' && req.query.filterOp === 'contains' && (214220 + j).toString().indexOf(term) > -1) {
          filteredOut = false;
        }
        if (req.query.filterColumn === 'productId' && req.query.filterOp === 'equals' && (214220 + j).toString() === term) {
          filteredOut = false;
        }

        if (req.query.filterColumn === 'productName' && req.query.filterOp === 'contains' && 'compressor'.toString().indexOf(term) > -1) {
          filteredOut = false;
        }

        if (req.query.filterColumn === 'activity' && req.query.filterOp === 'contains' && 'assemble paint'.toString().indexOf(term) > -1) {
          filteredOut = false;
        }
        if (req.query.filterColumn === 'activity' && req.query.filterOp === 'equals' && 'assemble paint'.toString() === -1) {
          filteredOut = false;
        }

        if (req.query.filterColumn === 'quantity' && req.query.filterOp === 'contains' && (1 + (j / 2)).toString().indexOf(term) > -1) {
          filteredOut = false;
        }
        if (req.query.filterColumn === 'quantity' && req.query.filterOp === 'equals' && (1 + (j / 2)).toString() === term) {
          filteredOut = false;
        }
      }

      const status = Math.floor(statuses.length / (start + seed)) + 1;

      if (!filteredOut) {
        filteredTotal++;
        productsAll.push({
          id: j, productId: 214220 + j, productName: `Compressor ${j}`, activity: 'Assemble Paint', quantity: 1 + (j / 2), price: 210.99 - j, status: statuses[status], orderDate: new Date(2014, 12, seed), action: 'Action'
        });
      }

      seed++;
    }

    const sortBy = function (field, reverse, primer) {
      const key = function (x) { return primer ? primer(x[field]) : x[field]; };

      return function (a, b) {
        let A = key(a),
          B = key(b);
        return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
      };
    };

    if (req.query.sortId) {
      productsAll.sort(sortBy(req.query.sortId, (req.query.sortAsc === 'true'), a => a.toString().toUpperCase()));
    }

    for (i = start; i < end && i < total; i++) {
      if (productsAll[i]) {
        products.push(productsAll[i]);
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ total: filteredTotal, grandTotal: 1000, data: products }));
    next();
  });

  router.get('/lookupInfo', (req, res, next) => {
    let columns = [],
      data = [];

      // Some Sample Data
    data.push({
      id: 1, productId: 2142201, productName: 'Compressor', activity: 'Assemble Paint', quantity: 1, price: 210.99, status: 'OK', orderDate: new Date(2014, 12, 8), action: 'Action'
    });
    data.push({
      id: 2, productId: 2241202, productName: 'Different Compressor', activity: 'Inspect and Repair', quantity: 2, price: 210.99, status: '', orderDate: new Date(2015, 7, 3), action: 'On Hold'
    });
    data.push({
      id: 3, productId: 2342203, productName: 'Compressor', activity: 'Inspect and Repair', quantity: 1, price: 120.99, status: null, orderDate: new Date(2014, 6, 3), action: 'Action'
    });
    data.push({
      id: 4, productId: 2445204, productName: 'Another Compressor', activity: 'Assemble Paint', quantity: 3, price: 210.99, status: 'OK', orderDate: new Date(2015, 3, 3), action: 'Action'
    });
    data.push({
      id: 5, productId: 2542205, productName: 'I Love Compressors', activity: 'Inspect and Repair', quantity: 4, price: 210.99, status: 'OK', orderDate: new Date(2015, 5, 5), action: 'On Hold'
    });
    data.push({
      id: 5, productId: 2642205, productName: 'Air Compressors', activity: 'Inspect and Repair', quantity: 41, price: 120.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'
    });
    data.push({
      id: 6, productId: 2642206, productName: 'Some Compressor', activity: 'inspect and Repair', quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'
    });

    // Define Columns for the Grid.
    columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, width: 50, formatter: 'SelectionCheckbox', align: 'center' });
    columns.push({ id: 'productId', name: 'Product Id', field: 'productId', width: 140, formatter: 'Readonly' });
    columns.push({ id: 'productName', name: 'Product Name', sortable: false, field: 'productName', width: 250, formatter: 'Hyperlink' });
    columns.push({ id: 'activity', hidden: true, name: 'Activity', field: 'activity', width: 125 });
    columns.push({ id: 'quantity', name: 'Quantity', field: 'quantity', width: 125 });
    columns.push({ id: 'price', name: 'Price', field: 'price', width: 125, formatter: 'Decimal' });
    columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', formatter: 'Date', dateFormat: 'M/d/yyyy' });

    const lookupInfo = [{ columns, dataset: data }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(lookupInfo));
    next();
  });

  // Used for Builder Pattern Example
  router.get('/construction-orders', (req, res, next) => {
    const companies = [
      { id: 1, orderId: '4231212-3', items: 0, companyName: 'John Smith Construction', total: '$0.00' },
      { id: 2, orderId: '1092212-3', items: 4, companyName: 'Top Grade Construction', total: '$10,000.00' },
      { id: 3, orderId: '6721212-3', items: 0, companyName: 'Riverhead Building Supply', total: '$0.00' },
      { id: 4, orderId: '6731212-3', items: 37, companyName: 'united Starwars Construction', total: '$22,509.99' },
      { id: 5, orderId: '5343890-3', items: 8, companyName: 'united Construction', total: '$1,550.00' },
      { id: 6, orderId: '4989943-3', items: 156, companyName: 'Top Grade-A Construction', total: '$800.00' },
      { id: 7, orderId: '8972384-3', items: 10, companyName: 'Top Grade Construction', total: '$1,300.00' },
      { id: 8, orderId: '2903866-3', items: 96, companyName: 'Top Grade-A Construction', total: '$1,900.00' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(companies));
    next();
  });

  router.get('/construction-cart-items', (req, res, next) => {
    const cartItems = [
      { id: 1, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 2, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 3, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 4, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 5, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 6, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' },
      { id: 7, itemId: '#PMS0510', itemName: 'Masonry Bricks, Red Solid 6" Brick', itemPrice: '$12.00', quantifier: 'bag', quantity: '1,000', totalPrice: '$1,700.00' },
      { id: 8, itemId: '#PMS0640', itemName: 'Gravel, Gray Natural Stone', itemPrice: '$86.00', quantifier: 'stone', quantity: '19', totalPrice: '$1,634.00' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cartItems));
    next();
  });

  router.get('/orgstructure', (req, res, next) => {
    let
      menPath = 'https://randomuser.me/api/portraits/med/men/',
      womenPath = 'https://randomuser.me/api/portraits/med/women/',
      orgdata = [{
        id: '1',
        Name: 'Jonathan Cargill',
        Position: 'Director',
        EmploymentType: 'FT',
        Picture: `${menPath}21.jpg`,
        children: [
          { id: '1_1', Name: 'Partricia Clark', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
          { id: '1_2', Name: 'Drew Buchanan', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
          {
            id: '1_3',
            Name: 'Kaylee Edwards',
            Position: 'Records Manager',
            EmploymentType: 'FT',
            Picture: `${womenPath}11.jpg`,
            children: [
              { id: '1_3_1', Name: 'Tony Cleveland', Position: 'Records Clerk', EmploymentType: 'C', Picture: `${menPath}6.jpg`, isLeaf: true },
              { id: '1_3_2', Name: 'Julie Dawes', Position: 'Records Clerk', EmploymentType: 'PT', Picture: `${womenPath}5.jpg`, isLeaf: true },
              { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: `${menPath}7.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_4',
            Name: 'Jason Ayers',
            Position: 'HR Manager',
            EmploymentType: 'FT',
            Picture: `${menPath}12.jpg`,
            children: [
              { id: '1_4_1', Name: 'William Moore', Position: 'Benefits Specialist', EmploymentType: 'FT', Picture: `${menPath}8.jpg`, isLeaf: true },
              { id: '1_4_2', Name: 'Rachel Smith', Position: 'Compliance Specialist', EmploymentType: 'FT', Picture: `${womenPath}6.jpg`, isLeaf: true },
              { id: '1_4_3', Name: 'Jessica Peterson', Position: 'Employment Specialist', EmploymentType: 'FT', Picture: `${womenPath}7.jpg`, isLeaf: true },
              { id: '1_4_4', Name: 'Sarah Lee', Position: 'HR Specialist', EmploymentType: 'FT', Picture: `${womenPath}8.jpg`, isLeaf: true },
              { id: '1_4_5', Name: 'Jacob Williams', Position: 'HR Specialist', EmploymentType: 'FT', Picture: `${menPath}9.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_5',
            Name: 'Daniel Calhoun',
            Position: 'Manager',
            EmploymentType: 'FT',
            Picture: `${menPath}4.jpg`,
            children: [
              { id: '1_5_1', Name: 'Michael Bolton', Position: 'Software Engineer', EmploymentType: 'C', Picture: `${menPath}3.jpg`, isLeaf: true },
              { id: '1_5_2', Name: 'Emily Johnson', Position: 'Senior Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}9.jpg`, isLeaf: true },
              { id: '1_5_3', Name: 'Kari Anderson', Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}10.jpg`, isLeaf: true },
              { id: '1_5_4', Name: 'Michelle Bell', Position: 'Software Engineer', EmploymentType: 'PT', Picture: `${womenPath}11.jpg`, isLeaf: true },
              { id: '1_5_5', Name: 'Dave Davidson', Position: 'Software Engineer', EmploymentType: 'FT', Picture: `${menPath}10.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_6',
            Name: 'Amber Carter',
            Position: 'Library Manager',
            EmploymentType: 'FT',
            Picture: `${womenPath}2.jpg`,
            children: [
              { id: '1_6_1', Name: 'Hank Cruise', Position: 'Law Librarian', EmploymentType: 'C', Picture: `${menPath}11.jpg`, isLeaf: true },
              { id: '1_6_2', Name: 'Peter Craig', Position: 'Law Librarian', EmploymentType: 'FT', Picture: `${menPath}12.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_7',
            Name: 'Mary Butler',
            Position: 'Workers’ Compensation Manager',
            EmploymentType: 'FT',
            Picture: `${womenPath}3.jpg`,
            children: [
              { id: '1_7_1', Name: 'Katie Olland', Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: `${womenPath}12.jpg`, isLeaf: true },
              { id: '1_7_2', Name: 'Tanya Wright', Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: `${womenPath}13.jpg`, isLeaf: true },
              { id: '1_7_3', Name: 'OPEN', Position: 'Workers’ Compensation Specialist', EmploymentType: 'O', isLeaf: true },
              { id: '1_7_4', Name: 'John Johnson', Position: 'Workers’ Compensation Specialist', Initials: 'JJ', EmploymentType: 'FT', isLeaf: true }
            ]
          }
        ]
      }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/orgstructure-large', (req, res, next) => {
    let
      menPath = 'https://randomuser.me/api/portraits/med/men/',
      womenPath = 'https://randomuser.me/api/portraits/med/women/',
      orgdata = [{
        id: '1',
        Name: 'Jonathan Cargill',
        Position: 'Director',
        EmploymentType: 'FT',
        Picture: `${menPath}21.jpg`,
        children: [
          { id: '1_1', Name: 'Partricia Clark', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
          { id: '1_2', Name: 'Drew Buchanan', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },

          { id: '1_1-a', Name: 'One', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
          { id: '1_2-b', Name: 'Two', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
          { id: '1_1-c', Name: 'Three', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
          { id: '1_2-d', Name: 'Four', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
          { id: '1_1-e', Name: 'Five', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
          { id: '1_2-f', Name: 'Six', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },

          {
            id: '1_3',
            Name: 'Kaylee Edwards',
            Position: 'Records Manager',
            EmploymentType: 'FT',
            Picture: `${womenPath}11.jpg`,
            children: [
              { id: '1_3_1', Name: 'Tony Cleveland', Position: 'Records Clerk', EmploymentType: 'C', Picture: `${menPath}6.jpg`, isLeaf: true },
              { id: '1_3_2', Name: 'Julie Dawes', Position: 'Records Clerk', EmploymentType: 'PT', Picture: `${womenPath}5.jpg`, isLeaf: true },
              { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: `${menPath}7.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_4',
            Name: 'Jason Ayers',
            Position: 'HR Manager',
            EmploymentType: 'FT',
            Picture: `${menPath}12.jpg`,
            children: [
              { id: '1_4_1', Name: 'William Moore', Position: 'Benefits Specialist', EmploymentType: 'FT', Picture: `${menPath}8.jpg`, isLeaf: true },
              { id: '1_4_2', Name: 'Rachel Smith', Position: 'Compliance Specialist', EmploymentType: 'FT', Picture: `${womenPath}6.jpg`, isLeaf: true },
              { id: '1_4_3', Name: 'Jessica Peterson', Position: 'Employment Specialist', EmploymentType: 'FT', Picture: `${womenPath}7.jpg`, isLeaf: true },
              { id: '1_4_4', Name: 'Sarah Lee', Position: 'HR Specialist', EmploymentType: 'FT', Picture: `${womenPath}8.jpg`, isLeaf: true },
              { id: '1_4_5', Name: 'Jacob Williams', Position: 'HR Specialist', EmploymentType: 'FT', Picture: `${menPath}9.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_5',
            Name: 'Daniel Calhoun',
            Position: 'Manager',
            EmploymentType: 'FT',
            Picture: `${menPath}4.jpg`,
            children: [
              { id: '1_5_1', Name: 'Michael Bolton', Position: 'Software Engineer', EmploymentType: 'C', Picture: `${menPath}3.jpg`, isLeaf: true },
              { id: '1_5_2', Name: 'Emily Johnson', Position: 'Senior Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}9.jpg`, isLeaf: true },
              { id: '1_5_3', Name: 'Kari Anderson', Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}10.jpg`, isLeaf: true },
              { id: '1_5_4', Name: 'Michelle Bell', Position: 'Software Engineer', EmploymentType: 'PT', Picture: `${womenPath}11.jpg`, isLeaf: true },
              { id: '1_5_5', Name: 'Dave Davidson', Position: 'Software Engineer', EmploymentType: 'FT', Picture: `${menPath}10.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_6',
            Name: 'Amber Carter',
            Position: 'Library Manager',
            EmploymentType: 'FT',
            Picture: `${womenPath}2.jpg`,
            children: [
              { id: '1_6_1', Name: 'Hank Cruise', Position: 'Law Librarian', EmploymentType: 'C', Picture: `${menPath}11.jpg`, isLeaf: true },
              { id: '1_6_2', Name: 'Peter Craig', Position: 'Law Librarian', EmploymentType: 'FT', Picture: `${menPath}12.jpg`, isLeaf: true }
            ]
          },
          {
            id: '1_7',
            Name: 'Mary Butler',
            Position: 'Workers’ Compensation Manager',
            EmploymentType: 'FT',
            Picture: `${womenPath}3.jpg`,
            children: [
              { id: '1_7_1', Name: 'Katie Olland', Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: `${womenPath}12.jpg`, isLeaf: true },
              { id: '1_7_2', Name: 'Tanya Wright', Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: `${womenPath}13.jpg`, isLeaf: true },
              { id: '1_7_3', Name: 'OPEN', Position: 'Workers’ Compensation Specialist', EmploymentType: 'O', isLeaf: true }
            ]
          }
        ]
      }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/orgstructure-lazy', (req, res, next) => {
    let
      menPath = 'https://randomuser.me/api/portraits/med/men/',
      womenPath = 'https://randomuser.me/api/portraits/med/women/',
      orgdata = [{
        id: '1',
        Name: 'Jonathan Cargill',
        Position: 'Director',
        EmploymentType: 'FT',
        Picture: `${menPath}21.jpg`,
        children: [
          {
            id: '1_3',
            Name: 'Kaylee Edwards',
            Position: 'Records Manager',
            EmploymentType: 'FT',
            Picture: `${womenPath}11.jpg`,
            children: [
              { id: '1_3_1', Name: 'Tony Cleveland', Position: 'Records Clerk', EmploymentType: 'C', Picture: `${menPath}6.jpg`, isLeaf: true },
              { id: '1_3_2', Name: 'Julie Dawes', Position: 'Records Clerk', EmploymentType: 'PT', Picture: `${womenPath}5.jpg`, isLeaf: true },
              { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: `${menPath}7.jpg` }
            ]
          },
          {
            id: '1_4',
            Name: 'Jason Ayers',
            Position: 'HR Manager',
            EmploymentType: 'FT',
            Picture: `${menPath}12.jpg`,
            children: [
              { id: '1_4_1', Name: 'William Moore', Position: 'Benefits Specialist', EmploymentType: 'FT', Picture: `${menPath}8.jpg`, isLeaf: true },
              { id: '1_4_2', Name: 'Rachel Smith', Position: 'Compliance Specialist', EmploymentType: 'FT', Picture: `${womenPath}6.jpg`, isLeaf: true },
            ]
          },
          {
            id: '1_5',
            Name: 'Daniel Calhoun',
            Position: 'Manager',
            EmploymentType: 'FT',
            Picture: `${menPath}4.jpg`,
            children: [
              { id: '1_5_1', Name: 'Michael Bolton', Position: 'Software Engineer', EmploymentType: 'C', Picture: `${menPath}3.jpg`, isLeaf: true },
              { id: '1_5_2', Name: 'Emily Johnson', Position: 'Senior Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}9.jpg`, isLeaf: true },
              { id: '1_5_3', Name: 'Kari Anderson', Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}10.jpg`, isLeaf: true },
            ]
          },
          { id: '1_1-e', Name: 'Sarah Smith', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
          { id: '1_2-f', Name: 'Greg Peterson', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
        ]
      }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/orgstructure-paging', (req, res, next) => {
    let
      menPath = 'https://randomuser.me/api/portraits/med/men/',
      womenPath = 'https://randomuser.me/api/portraits/med/women/',
      orgdata = [{
        id: '1',
        Name: 'Jonathan Cargill',
        Position: 'Director',
        EmploymentType: 'FT',
        Picture: `${menPath}21.jpg`,
        children: [
          { id: '1_3', Name: 'Kaylee Edwards', Position: 'Records Manager', EmploymentType: 'FT', Picture: `${womenPath}11.jpg`, children: [] },
          { id: '1_4', Name: 'Jason Ayers', Position: 'HR Manager', EmploymentType: 'FT', Picture: `${menPath}12.jpg`, children: [] },
          { id: '1_5', Name: 'Daniel Calhoun', Position: 'Manager', EmploymentType: 'FT', Picture: `${menPath}4.jpg`, children: [] },
          { id: '1_1-e', Name: 'Sarah Smith', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
          { id: '1_2-f', Name: 'Greg Peterson', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
        ]
      }];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/orgstructure-children', (req, res, next) => {
    let
      womenPath = 'https://randomuser.me/api/portraits/med/women/',
      orgdata = [
        { id: `AA${Math.floor(Math.random() * 1000)}`, Name: 'Kaylee Edwards', Position: 'Records Manager', EmploymentType: 'FT', Picture: `${womenPath}11.jpg` },
        { id: `BB${Math.floor(Math.random() * 1000)}`, Name: 'Emily Johnson', Position: 'Senior Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}9.jpg`, isLeaf: true },
        { id: `CC${Math.floor(Math.random() * 1000)}`, Name: 'Kari Anderson', Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}10.jpg`, isLeaf: true }
      ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(orgdata));
    next();
  });

  router.get('/servicerequests', (req, res, next) => {
    const cartItems = [
      {
        id: 1, type: 'Data Refresh', favorite: true, datetime: new Date(2014, 12, 8), requestor: 'Grant Lindsey', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'
      },
      { id: 2, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Wilson Shelton', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success' },
      {
        id: 3, type: 'Data Refresh', favorite: true, datetime: new Date(2015, 12, 8), requestor: 'Nicholas Wade', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'
      },
      { id: 4, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lila Huff', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued' },
      { id: 5, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Ann Matthews', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
      { id: 6, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lucia Nelson', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success' },
      { id: 7, type: 'Data Refresh', datetime: new Date(2014, 12, 8), requestor: 'Vera Cunningham', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
      { id: 8, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Dale Newman', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued' },
      { id: 9, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jessica Cain', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
      { id: 10, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Jennie Kennedy', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
      { id: 11, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jason Adams', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success' }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(cartItems));
    next();
  });

  router.get('/garbage', (req, res, next) => {
    let amount = 25,
      paragraphs = 1,
      text = '',
      type = 'text',
      types = ['text', 'html', 'json'],
      garbageWords = ['garbage', 'junk', 'nonsense', 'trash', 'rubbish', 'debris', 'detritus', 'filth', 'waste', 'scrap', 'sewage', 'slop', 'sweepings', 'bits and pieces', 'odds and ends', 'rubble', 'clippings', 'muck', 'stuff'];

    function randomSeed() {
      return (Math.random() * (10 - 1) + 1) > 8;
    }

    function getWord() {
      return garbageWords[Math.floor(Math.random() * garbageWords.length)];
    }

    function capitalize(text) {
      return text.charAt(0).toUpperCase() + text.substr(1);
    }

    function done(content) {
      if (type === 'html') {
        res.send(content);
        return next();
      }

      if (type === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(content));
        return next();
      }

      res.setHeader('Content-Type', 'text/plain');
      res.end(JSON.stringify(content));
      next();
    }

    if (req && req.query) {
      if (req.query.size) {
        amount = req.query.size;
      }

      if (req.query.return && types.indexOf(req.query.return) > -1) {
        type = req.query.return;
      }

      if (req.query.paragraphs && !isNaN(req.query.paragraphs)) {
        paragraphs = parseInt(req.query.paragraphs);
      }
    }

    let word = '';

    if (type === 'json') {
      let data = [],
        objCount = 0;

      while (objCount < amount) {
        word = getWord();

        data.push({
          id: objCount,
          label: `${capitalize(word)}`,
          value: `${objCount}-${word.split(' ').join('-')}`,
          selected: false
        });
        objCount += 1;
      }

      return done(data);
    }

    // Get a random word from the GarbageWords array
    let paragraph = '';

    while (paragraphs > 0) {
      if (type === 'html') {
        paragraph += '<p>';
      }

      if (type === 'text' && text.length > 0) {
        paragraph += ' ';
      }

      // if we serve html and the random seed is true, send a picture of garbage.
      if (type === 'html' && randomSeed()) {
        paragraph += '<img src="http://www.newmarket.ca/LivingHere/PublishingImages/Pages/Waste,%20Recycling%20and%20Organics/Garbage-collection-information/Open%20Top%20Garbage%20Can%20with%20Handles.jpg" alt="Picture of Garbage" width="499.5" height="375" />';
      } else {
        // in all other cases, generate the amount of words defined by the query for this paragraph.
        for (let i = 0; i < amount; i++) {
          word = getWord();

          if (!paragraph.length) {
            word = capitalize(word);
          } else {
            paragraph += ' ';
          }
          paragraph += word;
        }
      }

      paragraph += '.';

      if (type === 'html') {
        paragraph += '</p>';
      }

      // Add to text, reset
      text += paragraph;
      paragraph = '';

      paragraphs -= 1;
    }

    done(text);
  });

  function sendJSONFile(filename, req, res, next) {
    const data = getJSONFile(path.resolve('app', 'data', `${filename}.json`));
    res.json(data);
    next();
  }

  router.get('/my-projects', (req, res, next) => {
    sendJSONFile('projects', req, res, next);
  });

  router.get('/colleagues', (req, res, next) => {
    if (req.query.favorites) {
      sendJSONFile('favorite-colleagues', req, res, next);
      return;
    }

    sendJSONFile('colleagues', req, res, next);
  });

  router.get('/dummy-dropdown-data', (req, res, next) => {
    const data = require(path.resolve('app', 'src', 'js', 'get-junk-dropdown-data'));
    res.json(data);
    next();
  });

  router.get('/org-chart', (req, res, next) => {
    sendJSONFile('org-chart', req, res, next);
  });
}
*/

module.exports = router;
