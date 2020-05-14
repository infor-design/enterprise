const fs = require('fs');
const path = require('path');
const commandLineArgs = require('yargs').argv;
const logger = require('./logger');

const utils = {};

// Returns only the filename from the specified request
utils.getFileName = function getFileName(filePath) {
  filePath = utils.getPathWithoutQuery(filePath);

  // NOTE: `path.sep` is not used on purpose, since this is a URL.
  let sepIndex = filePath.lastIndexOf('/');
  sepIndex = sepIndex === -1 ? 0 : sepIndex + 1;

  return filePath.substring(sepIndex, filePath.length);
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
    file: { methodName: 'isFile', errorCodes: ['ENOENT'] },
    directory: { methodName: 'isDirectory', errorCodes: ['ENOENT', 'ENOTDIR'] }
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
  const errorCodes = mappings[type].errorCodes;

  try {
    const stats = fs.statSync(filePath);
    return stats[methodName]();
  } catch (err) {
    return !(err && errorCodes.includes(err.code));
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

    directory = utils.getParentDirectory(directory, viewsRoot);
  }

  return filePath;
};

// Removes the last part of a file path, including directory, filename, and trailing slash
utils.removeLastPart = function removeLastPart(filePath) {
  return filePath.substring(0, filePath.lastIndexOf(path.sep === '\\' ? '\\' : '/') + 1);
};

// Gets the relative directory path from a file path
utils.getDirectory = function (filePath, webroot) {
  function removeWebroot(thisFilePath, thisWebroot) {
    if (thisWebroot && thisWebroot.length && thisFilePath.includes(thisWebroot)) {
      thisFilePath = thisFilePath.replace(thisWebroot, '');
    }
    return thisFilePath;
  }

  let absFilePath = filePath;
  if (!filePath.includes(webroot)) {
    absFilePath = path.join(webroot, filePath);
  }

  if (utils.isType('directory', absFilePath)) {
    return removeWebroot(absFilePath, webroot);
  }

  return removeWebroot(utils.removeLastPart(absFilePath), webroot);
};

// Gets the path of the parent directory of a file
utils.getParentDirectory = function getParentDirectory(filePath, viewsRoot) {
  let directory = utils.removeTrailingSeparator(filePath);
  directory = utils.getDirectory(utils.removeLastPart(directory), viewsRoot);
  return directory;
};

// Takes a path that may or may not contain valid files/directories, and detects
// the lowest-possible valid directory in the tree.
utils.getClosestValidDirectory = function getClosestValidDirectory(filePath, viewsRoot) {
  let directory = utils.getDirectory(filePath, viewsRoot);
  while (directory.length && !utils.isType('directory', path.join(viewsRoot, directory)) && !utils.isRoot(filePath)) {
    directory = utils.getParentDirectory(directory, viewsRoot);
  }

  return directory.length > 1 ? utils.removeTrailingSlash(directory) : path.sep;
};

// Returns a true/false value that determines whether or not the layout is allowed to change
// (use this instead of hardcoding settings for layout changes in multiple spots)
utils.canChangeLayout = function (req, res) {
  return !res.opts.forceLayout && !(req.query.layout && req.query.layout.length > 0);
};

module.exports = utils;
