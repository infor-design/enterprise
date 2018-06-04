// Ajax Accordion Contents
const path = require('path');

module.exports = (req, res, next) => {
  const viewsRoot = req.app.get('views');
  req.app.set('layout', '');
  res.render(path.join(viewsRoot, 'components', 'accordion', '_example-ajax-results.html'));
  next();
};
