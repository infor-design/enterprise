// Ajax Accordion Contents
import * as path from 'path';

export default function navItems(req, res) {
  const viewsRoot = req.app.get('views');
  req.app.set('layout', '');
  res.render(path.join(viewsRoot, 'components', 'accordion', '_example-ajax-results.html'));
}
