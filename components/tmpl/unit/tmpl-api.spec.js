// Import all the locales
import { Tmpl } from '../tmpl';
import { stringUtils } from '../../utils/string';

describe('Tmpl API', () => {
  it('Should exist', () => {
    expect(Tmpl.compile).toExist();
  });

  it('Should parse if', () => {
    const output = Tmpl.compile('{{#boolValue}}<p>hello<p>{{/boolValue}}', { boolValue: true });

    expect(output).toEqual('<p>hello<p>');
  });

  it('Should parse nested', () => {
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
        { disabled: false, task: 'Test 2', desc: 'Test Desc 2', date: new Date(2018, 10, 10) }
      ]
    });
    output = stringUtils.stripWhitespace(output);

    expect(output).toEqual(stringUtils.stripWhitespace(`
      <ul>
          <li class="is-disabled"><p class="listview-heading">Task #Test</p>
            <p class="listview-subheading">Test Desc </p>
            <p class="listview-micro">Due: </p>
          </li>
          <li>
            <p class="listview-heading">Task #Test 2</p>
            <p class="listview-subheading">Test Desc 2 </p>
            <p class="listview-micro">Due: Sat Nov 10 2018 00:00:00 GMT-0500 (EST)</p>
          </li>
      </ul>`));
  });
});
