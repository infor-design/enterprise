export default function csCartItems(req, res) {
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
}
