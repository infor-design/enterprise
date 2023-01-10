import { Textarea } from '../../../src/components/textarea/textarea';
import { cleanup } from '../../helpers/func-utils';

const textareaHTML = require('../../../app/views/components/textarea/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let textareaEl;
let textareaObj;

describe('Textarea API', () => {
  beforeEach(() => {
    textareaEl = null;
    textareaObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', textareaHTML);
    textareaEl = document.body.querySelector('#description');
    textareaObj = new Textarea(textareaEl);
  });

  afterEach(() => {
    textareaObj.destroy();
    cleanup();
  });

  it('should set settings', () => {
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

  it('should update set settings via parameter', () => {
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
