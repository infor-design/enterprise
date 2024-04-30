/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sets up a data route you can use to get the svg div block. You can call this with:
 * http://localhost:4000/api/icons-empty?theme=classic
 * or
 * http://localhost:4000/api/icons-empty?theme=new
 * @param  {object} req Node request
 * @param  {object} res Node reponse
 */
export default function iconData(req, res) {
  const emptyMessagePath = path.resolve(__dirname, '..', '..', 'src', 'components', 'emptymessage');
  let themeName = res.opts.theme.name;
  themeName = themeName.replace('new-default', 'new');
  const svgHtmlPartial = fs.readFileSync(`${emptyMessagePath}/theme-${themeName}-svg-empty.html`).toString();

  res.setHeader('Content-Type', 'text/plain');
  res.end(svgHtmlPartial);
}
