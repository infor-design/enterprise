const fs = require('fs');
const logger = require('./logger');
const path = require('path');
const commandLineArgs = require('yargs').argv;

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
    if (file && file.size) {
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

utils.hasTrailingSeparator = function (filePath) {
  return filePath && filePath.length && filePath.charAt(filePath.length - 1) === path.sep;
};

// Use for file paths
utils.removeTrailingSeparator = function (filePath) {
  if (utils.hasTrailingSeparator(filePath)) {
    filePath = filePath.slice(0, -1);
  }
  return filePath;
};

utils.hasTrailingSlash = function hasTrailingSlash(filePath) {
  return filePath && filePath.length && filePath.charAt(filePath.length - 1) === '/';
};

// Use for URLs
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

/**
 * Given a specific directory, this method returns the closest "layout.html" file to the current
 * directory tree. This method cascades up the tree to the root views folder.
 * @param {string} directory a string representing the directory path, relative to the `app/views` root folder
 * @param {string} viewsRoot the absolute path to the root views folder
 * @returns {string} the relative path to use for the layout file.
 */
utils.getClosestLayoutFile = function (directory, viewsRoot) {
  const DEFAULT_LAYOUT = 'layout.html';
  let directoryHasLayout = false;
  let filePath;

  while (!directoryHasLayout && directory.length > 0) {
    if (directory === '/') {
      return DEFAULT_LAYOUT;
    }

    filePath = path.join('.', utils.getDirectory(directory, viewsRoot), DEFAULT_LAYOUT);
    directoryHasLayout = utils.hasLayoutFile(path.join(viewsRoot, directory));
    if (directoryHasLayout) {
      // If it ends up being the root layout, return nothing so the default takes place
      if (filePath === `/${DEFAULT_LAYOUT}`) {
        return DEFAULT_LAYOUT;
      }

      if (commandLineArgs.verbose) {
        logger('info', `Using local template "${filePath}" to render this page..."`);
      }
      break;
    }

    if (commandLineArgs.verbose) {
      logger('alert', `No layout found at "${filePath}"...`);
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
  let directory = utils.removeTrailingSeparator(filePath);
  directory = utils.getDirectory(directory.substring(0, directory.lastIndexOf(path.sep === '\\' ? '\\' : '/') + 1));
  return directory;
};

// Returns a true/false value that determines whether or not the layout is allowed to change
// (use this instead of hardcoding settings for layout changes in multiple spots)
utils.canChangeLayout = function (req) {
  return !(req.query.layout && req.query.layout.length > 0);
};

module.exports = utils;
