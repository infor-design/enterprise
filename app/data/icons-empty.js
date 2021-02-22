const fs = require('fs');
const path = require('path');

/**
 * Sets up a data route you can use to get the svg div block. You can call this with:
 * http://localhost:4000/api/icons-empty?theme=classic
 * or
 * http://localhost:4000/api/icons-empty?theme=new
 * @param  {object} req Node request
 * @param  {object} res Node reponse
 */
module.exports = (req, res) => {
  const emptyMessagePath = path.resolve(__dirname, '..', '..', 'src', 'components', 'emptymessage');
  const svgHtmlPartial = fs.readFileSync(`${emptyMessagePath}/theme-${res.opts.theme.name}-svg-empty.html`).toString();

  res.setHeader('Content-Type', 'text/plain');
  res.end(svgHtmlPartial);
};
