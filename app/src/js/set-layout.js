import * as path from 'path';
import logger from './logger.js';
import utils from './utils.js';

const DEFAULT_LAYOUT = 'layout.html';

export default function setLayout(req, res, layoutPath) {
  // All file paths are based off of `<project root>/app/views/`.
  const viewsRoot = req.app.get('views');
  const directoryURL = utils.getDirectory(path.join(viewsRoot, req.originalUrl), viewsRoot);

  let targetLayoutPath = DEFAULT_LAYOUT;

  // If possible, try to use an incoming layout string,
  // OR try to use one previously set on the options.
  if (typeof layoutPath === 'string' && layoutPath.length > 0) {
    targetLayoutPath = layoutPath;
  } else if (res.opts.layout && res.opts.layout.length) {
    targetLayoutPath = res.opts.layout;
  }

  // Sanitize out root filesystem folders
  if (targetLayoutPath.indexOf(viewsRoot) < 0) {
    targetLayoutPath = path.join(viewsRoot, targetLayoutPath);
  }

  if (!targetLayoutPath.endsWith('.html')) {
    targetLayoutPath += '.html';
  }

  // Check for file existence.
  if (!utils.hasFile(targetLayoutPath)) {
    logger('alert', `Layout "${targetLayoutPath}" did not exist, using default layout instead.`);
    targetLayoutPath = utils.getClosestLayoutFile(directoryURL, viewsRoot);
  } else {
    logger('info', `Setting layout path to "${targetLayoutPath}".`);
  }

  // Reset everything back to the response options
  // We render the view with a `layout` setting containing the path to the layout
  // See https://github.com/techhead/mmm#layout
  if (res.opts.layout !== targetLayoutPath) {
    res.opts.layout = targetLayoutPath;
  }
}
