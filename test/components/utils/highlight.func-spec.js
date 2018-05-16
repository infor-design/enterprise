import '../../../src/utils/highlight';

const ipsum = require('../../../app/views/tests/highlight/lorem-ipsum.html');

let ipsumEl;

describe('Text Highlighter', () => {
  beforeEach(() => {
    ipsumEl = null;

    document.body.insertAdjacentHTML('afterbegin', ipsum);
    ipsumEl = document.querySelector('#main');
  });

  afterEach(() => {
    ipsumEl.parentNode.removeChild(ipsumEl);
  });

  it('can highlight parts of a text string', () => {
    $(ipsumEl).highlight('ipsum');
    const marks = ipsumEl.querySelectorAll('mark');

    expect(marks).toBeDefined();
    expect(marks.length).toEqual(5);
  });

  it('can reset highlighted text to normal', () => {
    const $ipsumEl = $(ipsumEl);
    $ipsumEl.highlight('ipsum');
    $ipsumEl.unhighlight('ipsum');
    const marks = ipsumEl.querySelectorAll('mark');

    expect(marks).toBeDefined();
    expect(marks.length).toEqual(0);
  });
});
