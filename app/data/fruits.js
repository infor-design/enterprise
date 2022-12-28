
export default function fruitData(req, res) {
  let resData;
  const fruits = {
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
        '<div class="accordion-content" class="alert01">' +
          '<p>Error: Couldn\'t find any fruits...</p>' +
        '</div>';
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(resData));
}
