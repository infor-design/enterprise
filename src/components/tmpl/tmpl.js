import { utils } from '../../utils/utils';

const Tmpl = {};

/**
 * Recursive compile function for minimal mustache templates.
 * @param  {string} template The template string.
 * @param  {object} self The data / datacontext
 * @param  {object} parent When running recursively this is the parents data when nested.
 * @param  {boolean} invert An inverted expression.
 * @returns {string} The markup
 */
Tmpl.compile = function compile(template, self, parent, invert) {
  const render = compile;
  let output = '';
  let i;

  function get(ctx, path) {
    path = path.pop ? path : path.split('.');
    ctx = ctx[path.shift()] || '';
    return (0 in path) ? get(ctx, path) : ctx;
  }

  self = Array.isArray(self) ? self : (self ? [self] : []); // eslint-disable-line
  self = invert ? (0 in self) ? [] : [1] : self; // eslint-disable-line

  for (i = 0; i < self.length; i++) {
    let childCode = '';
    let depth = 0;
    let inverted;
    let ctx = (typeof self[i] === 'object') ? self[i] : {};
    ctx = utils.extend({}, parent, ctx); // Same as Object.assign({}, parent, ctx); but safe on IE
    ctx[''] = { '': self[i] };

    template.replace(
      /([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,
      (match, code, y, z, close, invert, name) => { //eslint-disable-line
        if (!depth) {
          output += code.replace(
            /{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,
            (match, raw, comment, isRaw, partial, name) => (raw ? get(ctx, raw) //eslint-disable-line
              : isRaw ? get(ctx, name)  //eslint-disable-line
                : partial ? render(get(ctx, name), ctx) : //eslint-disable-line
                  !comment ? new Option(get(ctx, name)).innerHTML :
                    '')
          );
          inverted = invert;
        } else {
          childCode += depth && !close || depth > 1 ? match : code;
        }
        if (close) {
          if (!--depth) {
            name = get(ctx, name);
            if (/^f/.test(typeof name)) {
              output += name.call(ctx, childCode, template => render(template, ctx)); //eslint-disable-line
            } else {
              output += render(childCode, name, ctx, inverted);
            }
            childCode = '';
          }
        } else {
          ++depth;
        }
      }
    );
  }
  return output;
};

export { Tmpl };
