// Import styles
const importStyles = ['default', 'min', 'esm'];

// Wrapper function for setting the import style of the IDS library
// If the style isn't included
module.exports = function setImportStyle(req, res, style) {
  if (!importStyles.includes(style)) {
    return;
  }
  if (style !== 'default') {
    res.opts.importStyle = style;
  }
};
