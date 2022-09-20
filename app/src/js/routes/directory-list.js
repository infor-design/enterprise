// Directory List Route
// =============================================
import * as fs from 'fs';
import * as path from 'path';
import logger from '../logger.js';
import setLayout from '../set-layout.js';
import utils from '../utils.js';

// Excluded file names that should never appear in the DemoApp List Pages
const GENERAL_LISTING_EXCLUDES = [
  /(_)?(layout)(\s)?(\.html)/gm, // matches any filename that begins with "layout" (fx: "layout***.html")
  /^_/, // anything beginning with an underscore
  /listing\.html/,
  /footer\.html/,
  /_header\.html/,
  /partial/,
  /\.DS_Store/
];

// Format filenames
function formatPath(filename) {
  return filename.replace(/-/g, ' ').replace(/\.html/, '').toLowerCase();
}

// Returns a directory listing as page content with working links
export default function directoryList(directory, viewsRoot, req, res, next) {
  fs.readdir(directory, (err, paths) => {
    if (err) {
      logger('error', `Directory Listing Error: ${err}`);
      res.status(404);
      next(err);
      return;
    }

    const realPaths = [];

    // Strip out paths that aren't going to ever work
    paths.forEach((val) => {
      let match = false;

      GENERAL_LISTING_EXCLUDES.forEach((exclude) => {
        if (val.match(exclude)) {
          match = true;
        }
      });

      if (match) {
        return;
      }

      realPaths.push(val);
    });

    // Map with links, add to
    function pathMapper(link) {
      let href = `./${link}`;
      let icon = '#icon-document';
      let type = 'file';
      let tempDir = `${directory}`;
      const sep = path.sep;

      function hasNoTrailingSlash(dir) {
        return dir.lastIndexOf(sep) !== (dir.length - 1);
      }
      const hasExplicitList = req.url.lastIndexOf('/list') !== -1 && req.url.length === 5;

      // handle "list"
      if (hasExplicitList) {
        tempDir = tempDir.substr(0, tempDir.lastIndexOf(sep) + 1);
        href = link;
      } else if (hasNoTrailingSlash(tempDir)) {
      // Correct for a missing slash at the end of the URL
        const subDir = tempDir.substring(tempDir.lastIndexOf(sep) + 1);
        tempDir = `${tempDir}${sep}`;
        href = `${subDir}/${link}`;
      }

      if (utils.isType('directory', `${tempDir}${link}`)) {
        icon = '#icon-folder';
        type = 'folder';
        href += '/list';
      }

      if (link.indexOf('example-') === 0) {
        type = 'example';
      } else if (link.indexOf('test-') === 0) {
        type = 'test';
      }

      return {
        icon,
        href,
        text: formatPath(link),
        type
      };
    }

    const relativeDir = directory.replace(viewsRoot, '');

    if (utils.canChangeLayout(req, res)) {
      setLayout(req, res, 'layout.html');
    }

    res.opts.title = `Directory list: ${relativeDir}`;
    res.opts.directory = `${relativeDir}`;
    res.opts.paths = realPaths.map(pathMapper);

    res.render(path.join(viewsRoot, 'listing.html'), res.opts);
  });
}
