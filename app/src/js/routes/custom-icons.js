// Icons Route
//= ====================================================
import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import hbsRegistrar from 'handlebars-wax';

hbsRegistrar('toUpperCase', str => str.toUowerCase());

const hbsTemplate = `
{{#each categories as |cat catKey|}}
  <div class="row top-padding">
    <div class="twelve columns">
      <h2 class="fieldset-title" style="text-transform: capitalize;">{{cat.name}} ({{cat.icons.length}} icons)</h2>
    </div>
  </div>

  <div class="row top-padding">
    <div class="twelve columns demo">
      {{#each cat.icons as |iconName iconKey|}}
        <div class="demo-svg" title="{{iconName}}">
          <svg class="icon {{../../additionalClass}}" focusable="false" aria-hidden="true" role="presentation">
            <use href="{{iconName}}"></use>
          </svg>
          <span class="audible">{{iconName}}</span>
        </div>
      {{/each}}
    </div>
  </div>
{{/each}}
`;
const template = handlebars.compile(hbsTemplate);

/**
 * Export the html templates for icons.
 * @param {string} url - The page url
 * @param {string} theme - The theme
 * @returns {string} The html
 */
export default (url, theme) => {
  const fileName = path.basename(url, '.html');
  const iconSet = fileName.includes('example-empty-states') ? 'empty' : 'standard';

  let metaPath = `node_modules/ids-identity/dist/theme-${theme}/icons/${iconSet}/metadata.json`;
  if (iconSet === 'standard' && theme === 'new') {
    metaPath = 'node_modules/ids-identity/dist/theme-new/icons/default/metadata.json';
  }
  if (iconSet === 'empty' && theme === 'new') {
    metaPath = 'node_modules/ids-identity/dist/theme-new/icons/old/empty/metadata.json';
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8').toString());

  if (iconSet === 'empty') {
    meta.additionalClass = 'icon-empty-state';
  }

  const html = template(meta);
  return html;
};
