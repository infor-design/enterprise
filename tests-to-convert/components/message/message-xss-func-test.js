/**
 * @jest-environment jsdom
 */
import { Message } from '../../../src/components/message/message';
import { cleanup } from '../../helpers/func-utils';

let messageEl;
let messageAPI;
let messageTitleEl;
let messageContentEl;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

require('../../../src/components/modal/modal.jquery');
require('../../../src/components/message/message.jquery');
require('../../../src/utils/xss.js');

describe('Message XSS Prevention', () => {
  beforeEach(() => {
    messageEl = document.body;
  });

  afterEach(() => {
    if (messageAPI) {
      messageAPI.destroy();
      messageAPI = null;
    }
    cleanup();
  });

  it('Can strip HTML tags out of user-set content', (done) => {
    // NOTE: See SOHO-7819
    const dangerousMessageTitle = 'Application Message <script>alert("GOTCHA!");</script>';
    const dangerousMessageContent = 'This is a potentially dangerous Message. <script>alert("GOTCHA!");</script>';

    messageAPI = new Message(messageEl, {
      title: dangerousMessageTitle,
      message: dangerousMessageContent
    });

    messageTitleEl = messageEl.querySelector('.modal .modal-title');
    messageContentEl = messageEl.querySelector('.modal .modal-body'); // should only be one

    setTimeout(() => {
      expect(messageTitleEl.textContent.trim()).toEqual('Application Message alert("GOTCHA!");');
      expect(messageContentEl.textContent.trim()).toEqual('This is a potentially dangerous Message. alert("GOTCHA!");');
      messageTitleEl.textNode = '';
      messageContentEl.textNode = '';
      done();
    }, 500);
  });

  it('Can disallow HTML tags based on component setting', (done) => {
    const messageTitleWithTags = '<a href="#" class="hyperlink hide-focus longpress-target"><b>You</b> </a>have <br>disallowed <br/>any <del>tags</del> <em>from</em> <i>appearing</i> <ins>in</ins> <mark>this</mark> <small>message</small>. <strong>All</strong> <sub>are</sub> <sup>stripped</sup>.';
    const messageContentWithTags = '<a href="#" class="hyperlink hide-focus longpress-target"><b>You</b> </a>have <br>disallowed <br/>any <del>tags</del> <em>from</em> <i>appearing</i> <ins>in</ins> <mark>this</mark> <small>message</small>. <strong>All</strong> <sub>are</sub> <sup>stripped</sup>.';

    messageAPI = new Message(messageEl, {
      title: messageTitleWithTags,
      message: messageContentWithTags,
      allowedTags: ''
    });
    messageTitleEl = messageEl.querySelector('.modal .modal-title');
    messageContentEl = messageEl.querySelector('.modal .modal-body'); // should only be one

    setTimeout(() => {
      expect(messageTitleEl.textContent.trim()).toEqual('You have disallowed any tags from appearing in this message. All are stripped.');
      expect(messageContentEl.textContent.trim()).toEqual('You have disallowed any tags from appearing in this message. All are stripped.');
      done();
    }, 650);
  });
});
