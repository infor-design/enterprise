// Icons Route
//= ====================================================
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const hbsRegistrar = require('handlebars-registrar');

hbsRegistrar('toUpperCase', str => {
  return str.toUowerCase();
});


const pageMap = {
  'example-index'   : 'standard',
  'example-extended': 'extended',
  'example-empty-widgets' : 'empty'
}

const hbsTemplate = `
{{#each categories as |cat catKey|}}
  <div class="row top-padding">
    <div class="twelve columns">
      <h2 class="fieldset-title" style="text-transform: capitalize;">{{cat.name}}({{cat.icons.length}} icons)</h2>
    </div>
  </div>

  <div class="row top-padding">
    <div class="twelve columns demo">
      {{#each cat.icons as |iconName iconKey|}}
      <button type="button" class="btn-icon" title="{{iconName}}">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="{{iconName}}"></use>
        </svg>
        <span class="audible">{{iconName}}</span>
      </button>
      {{/each}}
    </div>
  </div>
{{/each}}
`;
const template = handlebars.compile(hbsTemplate);

/**
 * @param {String} url - The route request
 */
module.exports = url => {
  const fileName = path.basename(url, '.html');
  const iconSet  = pageMap[fileName];
  const meta = JSON.parse(fs.readFileSync(`node_modules/ids-identity/dist/theme-soho/icons/${iconSet}/metadata.json`, 'utf-8').toString());
  const html = template(meta);
  return html;
};
