// Import all the locales
import { Tmpl } from '../../../src/components/tmpl/tmpl';
import { stringUtils } from '../../../src/utils/string';

describe('Tmpl API', () => {
  it('Should exist', () => {
    expect(Tmpl.compile).toExist();
  });

  it('Should parse if', () => {
    const output = Tmpl.compile('{{#boolValue}}<p>hello<p>{{/boolValue}}', { boolValue: true });

    expect(output).toEqual('<p>hello<p>');
  });

  it('Should parse datasets', () => {
    const testTempl = `
      <ul>
        {{#dataset}}
          {{#disabled}}
            <li class="is-disabled">
          {{/disabled}}
          {{^disabled}}
            <li>
          {{/disabled}}
            <p class="listview-heading">Task #{{task}}</p>
            <p class="listview-subheading">{{desc}} </p>
            <p class="listview-micro">Due: {{date}}</p>
          </li>
        {{/dataset}}
      </ul>`;

    let output = Tmpl.compile(testTempl, {
      dataset: [
        { disabled: true, task: 'Test', desc: 'Test Desc' },
        { disabled: false, task: 'Test 2', desc: 'Test Desc 2', date: 'May 2019' }
      ]
    });
    output = stringUtils.stripWhitespace(output);

    expect(output).toEqual(stringUtils.stripWhitespace(`
      <ul>
        <li class="is-disabled">
          <p class="listview-heading">Task #Test</p>
          <p class="listview-subheading">Test Desc</p>
          <p class="listview-micro">Due:</p>
        </li>
        <li>
          <p class="listview-heading">Task #Test 2</p>
          <p class="listview-subheading">Test Desc 2</p>
          <p class="listview-micro">Due: May 2019</p>
        </li>
      </ul>`));
  });

  it('Should parse autocomplete templates', () => {
    const testTempl = `
      <li id="{{listItemId}}" data-index="{{index}}" {{#hasValue}}data-value="{{value}}"{{/hasValue}} role="listitem">
       <a href="#" tabindex="-1">
         <span>{{{label}}}</span>
       </a>
      </li>`;

    let output = Tmpl.compile(testTempl, {
      index: 1,
      listItemId: 'ac-list-option1',
      hasValue: true,
      value: 'al',
      label: '<i>A</i>labama'
    });

    output = stringUtils.stripWhitespace(output);

    expect(output).toEqual(stringUtils.stripWhitespace(`
      <li id="ac-list-option1" data-index="1" data-value="al" role="listitem">
      <a href="#" tabindex="-1"><span><i>A</i>labama</span></a></li>`));
  });

  it('Should parse templates with html', () => {
    const testTempl = `
      <li id="{{listItemId}}" {{#hasValue}} data-value="{{value}}" {{/hasValue}} role="listitem">
             <a href="#" tabindex="-1">
                <span>{{{label}}}</span>
                <small>{{{email}}}</small>
                <span class="hidden display-value">{{label}} - {{email}}</span>
             </a>
           </li>`;

    let output = Tmpl.compile(testTempl, {
      index: 1,
      listItemId: 'ac-list-option1',
      hasValue: true,
      value: 'al',
      label: '<i>A</i>labama',
      email: 'Alex.Mills@example.com'
    });
    output = stringUtils.stripWhitespace(output);

    expect(output).toEqual(stringUtils.stripWhitespace(`
        <li id="ac-list-option1"  data-value="al"  role="listitem">
        <a href="#" tabindex="-1"><span><i>A</i>labama</span><small>Alex.Mills@example.com</small>
        <span class="hidden display-value">&lt;i&gt;A&lt;/i&gt;labama - Alex.Mills@example.com
        </span></a></li>`));
  });

  it('Should parse expandable row templates', () => {
    const testTempl = `
      <div class="datagrid-cell-layout"><div class="img-placeholder"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-camera"></use></svg></div></div>
      <div class="datagrid-cell-layout"><p class="datagrid-row-heading">Expandable Content Area</p>
      <p class="datagrid-row-micro-text">{{{sku}}}</p>
      <span class="datagrid-wrapped-text">Lorem Ipsum is simply sample text of the printing and typesetting industry. Lorem Ipsum has been the industry standard sample text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only...</span>
      <a class="hyperlink">Read more</a>`;

    let output = Tmpl.compile(testTempl, {
      sku: '<b>SKU #9000001-237</b>',
    });
    output = stringUtils.stripWhitespace(output);

    expect(output).toEqual(stringUtils.stripWhitespace(`
      <div class="datagrid-cell-layout"><div class="img-placeholder"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-camera"></use></svg></div></div><div class="datagrid-cell-layout"><p class="datagrid-row-heading">Expandable Content Area</p><p class="datagrid-row-micro-text"><b>SKU #9000001-237</b></p><span class="datagrid-wrapped-text">Lorem Ipsum is simply sample text of the printing and typesetting industry. Lorem Ipsum has been the industry standard sample text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only...</span><a class="hyperlink">Read more</a>`));
  });
});
