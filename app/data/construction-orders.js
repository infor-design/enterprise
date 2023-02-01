// Used for Builder Pattern Example
export default function csOrders(req, res) {
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
}
