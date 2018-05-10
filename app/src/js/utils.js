const fs = require('fs');
const logger = require('../../../scripts/logger');
const path = require('path');

const utils = {};
const FILENAME_REGEX = /[\w-]+\.html/;

//
utils.getFileName = function getFileName(filePath) {
  filePath = utils.getPathWithoutQuery(filePath);

  const match = FILENAME_REGEX.exec(filePath);
  if (!match || !match.length) {
    return '';
  }
  return match[0];
};

//
utils.getPathWithoutQuery = function (filePath) {
  const queryIndex = filePath.indexOf('?');
  if (queryIndex > -1) {
    filePath = filePath.substring(0, queryIndex);
  }
  return filePath;
};

//
utils.hasFile = function (filePath) {
  filePath = utils.getPathWithoutQuery(filePath);

  try {
    const file = fs.statSync(filePath);
    if (file && file.blocks) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// Checks the target file path for its type (is it a file, a directory, etc)
// http://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
utils.isType = function (type, filePath) {
  const types = ['file', 'folder'];
  const defaultType = types[0];
  const mappings = {
    file: { methodName: 'isFile' },
    directory: { methodName: 'isDirectory' }
    // TODO: Add More (symbolic link, etc)
  };

  if (!type) {
    logger('alert', `No type defined. Using the default type of "${defaultType}".`);
    type = defaultType;
  }

  if (!mappings[type]) {
    logger('alert', `Provided type "${type}" is not in the list of valid types.`);
    return false;
  }

  const methodName = mappings[type].methodName;

  try {
    const stats = fs.statSync(filePath);
    return stats[methodName]();
  } catch (err) {
    return !(err && err.code === 'ENOENT');
  }
};

utils.hasTrailingSlash = function hasTrailingSlash(filePath) {
  return filePath && filePath.length && filePath.charAt(filePath.length - 1) === '/';
};

utils.removeTrailingSlash = function removeTrailingSlash(filePath) {
  if (utils.hasTrailingSlash(filePath)) {
    filePath = filePath.slice(0, -1);
  }
  return filePath;
};

utils.hasLeadingSlash = function hasLeadingSlash(filePath) {
  return filePath.indexOf(path.sep) === 0;
};

utils.removeLeadingSlash = function removeLeadingSlash(filePath) {
  if (utils.hasLeadingSlash(filePath)) {
    filePath = filePath.substring(1);
  }
  return filePath;
};

utils.hasLayoutFile = function (directory) {
  return utils.hasFile(path.join(directory, 'layout.html'));
};

utils.hasIndexFile = function (directory) {
  return utils.hasFile(path.join(directory, 'index.html'));
};

// Determines if a file path represents the root path
utils.isRoot = function (filePath) {
  return filePath && filePath.length === 1 && filePath.charAt(0) === '/';
};

// Removes the views root folder from a path representing a layout template.
utils.getTemplateUrl = function (filePath, viewsRoot) {
  filePath = utils.removeLeadingSlash(filePath);
  if (viewsRoot) {
    filePath = filePath.replace(viewsRoot, '');
  }
  return filePath;
};

utils.getLayout = function (directory, webroot) {
  let directoryHasLayout = false;
  let filePath;

  while (!directoryHasLayout && directory.length > 1) {
    directoryHasLayout = utils.hasLayoutFile(directory);
    if (directoryHasLayout) {
      filePath = path.join('.', utils.getDirectory(directory, webroot), 'layout.html');

      // If it ends up being the root layout, return nothing so the default takes place
      if (filePath === '/layout.html') {
        return '';
      }

      logger('options', `Using local template "${filePath}" to render this page..."`, 'warn');
      break;
    }

    directory = utils.getParentDirectory(directory);
  }

  return filePath;
};

// Gets the directory path from a file path
utils.getDirectory = function (filePath, webroot) {
  function removeWebroot(thisFilePath, thisWebroot) {
    if (thisWebroot && thisWebroot.length) {
      thisFilePath = thisFilePath.replace(thisWebroot, '');
    }
    return thisFilePath;
  }

  if (utils.isType('directory', filePath)) {
    filePath = removeWebroot(filePath, webroot);
    return filePath;
  }

  filePath = filePath.substring(0, filePath.lastIndexOf(path.sep === '\\' ? '\\' : '/') + 1);
  filePath = removeWebroot(filePath, webroot);
  return filePath;
};

// Gets the path of the parent directory of a file
utils.getParentDirectory = function getParentDirectory(filePath) {
  let directory = utils.removeTrailingSlash(filePath);
  directory = utils.getDirectory(directory.substring(0, directory.lastIndexOf(path.sep === '\\' ? '\\' : '/') + 1));
  return directory;
};

// Returns a true/false value that determines whether or not the layout is allowed to change
// (use this instead of hardcoding settings for layout changes in multiple spots)
utils.canChangeLayout = function (req, res) {
  if (res.opts.nofrillslayout) {
    return false;
  }
  return true;
};

module.exports = utils;
