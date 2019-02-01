// Data Grid Paging Example
// Example Call:
// http://localhost:4000/api/compressors?pageNum=1&pageSize=10&sortField=productId&sortAsc=false
module.exports = (req, res, next) => {
  const products = [];
  const productsAll = [];
  let term;
  const start = (req.query.pageNum - 1) * req.query.pageSize;
  const end = req.query.pageNum * req.query.pageSize;
  const total = 1000;
  let i = 0;
  let j = 0;
  let filteredTotal = 0;
  let seed = 1;
  const statuses = ['OK', 'On Hold', 'Inactive', 'Active', 'Late', 'Complete'];

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

      if (req.query.filterColumn === 'id' && req.query.filterOp === 'contains' && j.toString().indexOf(term) > -1) {
        filteredOut = false;
      }

      if (req.query.filterColumn === 'productId' && req.query.filterOp === 'contains' && (214220 + j).toString().indexOf(term) > -1) {
        filteredOut = false;
      }
      if (req.query.filterColumn === 'productId' && req.query.filterOp === 'equals' && (214220 + j).toString() === term) {
        filteredOut = false;
      }

      if (req.query.filterColumn === 'productName' && req.query.filterOp === 'contains' && `compressor ${j}`.toString().indexOf(term) > -1) {
        filteredOut = false;
      }

      if (req.query.filterColumn === 'productName' && req.query.filterOp === 'equals' && `compressor ${j}`.toString() === term) {
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

      if (req.query.filterColumn === 'price' && req.query.filterOp === 'equals' && (210.99 - j).toString() === term) {
        filteredOut = false;
      }

      const seedDate = `${(new Date(2014, 12, seed)).getMonth() + 1}/${((new Date(2014, 12, seed)).getDate())}/${(new Date(2014, 12, seed)).getFullYear()}`;
      if (req.query.filterColumn === 'orderDate' && req.query.filterOp === 'equals' && seedDate === term) {
        filteredOut = false;
      }
    }

    const status = Math.floor(statuses.length / (start + seed));

    if (!filteredOut) {
      filteredTotal++;
      productsAll.push({
        id: j, productId: 214220 + j, productSku: 999101 + j, weight: '68 lb.', maxPressure: '125 psi', rpm: 1750, capacity: 10 + j, ratedTemp: '-25', productName: `Compressor ${j}`, activity: 'Induction', pumpLife: '2,000 hr', quantity: 1 + (j / 2), price: 210.99 - j, status: statuses[status] || 'None', orderDate: new Date(2014, 12, seed), action: 'Action'
      });
    }

    seed++;
  }

  const sortBy = function (field, reverse, primer) {
    const key = function (x) { return primer ? primer(x[field]) : x[field]; };

    return function (a, b) {
      const A = key(a);
      const B = key(b);
      /* eslint-disable no-nested-ternary */
      return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
      /* eslint-enable no-nested-ternary */
    };
  };

  if (req.query.sortField) {
    productsAll.sort(sortBy(req.query.sortField, (req.query.sortAsc === 'true'), a => a.toString().toUpperCase()));
  }

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
};
