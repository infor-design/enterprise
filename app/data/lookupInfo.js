export default function lookupInfoData(req, res) {
  const columns = [];
  const data = [];

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
  columns.push({ id: 'productId', name: 'Product Id', field: 'productId', width: 140, formatter: 'Readonly' });
  columns.push({ id: 'productName', name: 'Product Name', sortable: false, field: 'productName', width: 250, formatter: 'Hyperlink' });
  columns.push({ id: 'activity', hidden: true, name: 'Activity', field: 'activity', width: 125 });
  columns.push({ id: 'quantity', name: 'Quantity', field: 'quantity', width: 125 });
  columns.push({ id: 'price', name: 'Price', field: 'price', width: 125, formatter: 'Decimal' });
  columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', formatter: 'Date', dateFormat: 'M/d/yyyy' });

  const lookupInfo = [{ columns, dataset: data }];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(lookupInfo));
}
