// Custom Redirects for examples that coexist in two places.
//= ====================================================
const express = require('express');

const router = express.Router();
const redirect = (req, res, item, example, route) => {
  const page = example.replace('.html', '');
  const len = page.length;

  if (req.params.item === item && req.params.example.substr(0, len) === page) {
    res.redirect(`${res.opts.basepath}${route}`);
  }
};

router.get('/:item/:example', (req, res, next) => {
  redirect(req, res, 'searchfield', 'example-header-compact', 'components/header/example-searchfield-full');
  redirect(req, res, 'searchfield', 'example-header-large', 'components/header/example-searchfield-large');
  redirect(req, res, 'tabs-vertical', 'example-responsive', 'components/tabs-vertical/example-index');
  next();
});

module.exports = router;
