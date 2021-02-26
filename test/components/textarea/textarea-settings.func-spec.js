import { Textarea } from '../../../src/components/textarea/textarea';

const textareaHTML = require('../../../app/views/components/textarea/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let textareaEl;
let svgEl;
let textareaObj;

describe('Textarea API', () => {
  beforeEach(() => {
    textareaEl = null;
    svgEl = null;
    textareaObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', textareaHTML);
    textareaEl = document.body.querySelector('#description');
    svgEl = document.body.querySelector('.svg-icons');
    textareaObj = new Textarea(textareaEl);
  });

  afterEach(() => {
    textareaObj.destroy();
    const row = document.body.querySelector('.row');
    row.parentNode.removeChild(row);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should set settings', () => {
    const settings = {
      autoGrow: false,
      autoGrowMaxHeight: null,
      characterCounter: true,
      maxLength: null,
      printable: true,
      charRemainingText: null,
      charMaxText: null,
      attributes: null
    };

    expect(textareaObj.settings).toEqual(settings);
  });

  it('Should update set settings via parameter', () => {
    const settings = {
      autoGrow: false,
      autoGrowMaxHeight: null,
      characterCounter: true,
      maxLength: null,
      printable: true,
      charRemainingText: null,
      charMaxText: null,
      attributes: null
    };

    textareaObj.updated(settings);

    expect(textareaObj.settings).toEqual(settings);
  });
});
