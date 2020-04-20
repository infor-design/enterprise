import { Message } from '../../../src/components/message/message';

let messageEl;
let messageAPI;
let messageTitleEl;
let messageContentEl;

describe('Message XSS Prevention', () => {
  beforeEach(() => {
    messageEl = document.body;
  });

  afterEach((done) => {
    if (messageAPI) {
      messageAPI.destroy();
      messageAPI = null;
    }

    setTimeout(() => {
      messageEl = null;
      messageTitleEl = null;
      messageContentEl = null;
      done();
    }, 650);
  });

  it('Can strip HTML tags out of user-set content', () => {
    // NOTE: See SOHO-7819
    const dangerousMessageTitle = 'Application Message <script>alert("GOTCHA!");</script>';
    const dangerousMessageContent = 'This is a potentially dangerous Message. <script>alert("GOTCHA!");</script>';

    messageAPI = new Message(messageEl, {
      title: dangerousMessageTitle,
      message: dangerousMessageContent
    });

    setTimeout(() => {
      messageTitleEl = document.querySelector('.modal .modal-title');
      messageContentEl = document.querySelector('.modal .modal-body'); // should only be one

      expect(messageTitleEl.innerText).toEqual('Application Message alert("GOTCHA!");');
      expect(messageContentEl.innerText).toEqual('This is a potentially dangerous Message. alert("GOTCHA!");');
    }, 650);
  });

  it('Can disallow HTML tags based on component setting', () => {
    const messageTitleWithTags = '<a href="#" class="hyperlink hide-focus longpress-target"><b>You</b> </a>have <br>disallowed <br/>any <del>tags</del> <em>from</em> <i>appearing</i> <ins>in</ins> <mark>this</mark> <small>message</small>. <strong>All</strong> <sub>are</sub> <sup>stripped</sup>.';
    const messageContentWithTags = '<a href="#" class="hyperlink hide-focus longpress-target"><b>You</b> </a>have <br>disallowed <br/>any <del>tags</del> <em>from</em> <i>appearing</i> <ins>in</ins> <mark>this</mark> <small>message</small>. <strong>All</strong> <sub>are</sub> <sup>stripped</sup>.';

    messageAPI = new Message(messageEl, {
      title: messageTitleWithTags,
      message: messageContentWithTags,
      allowedTags: ''
    });

    setTimeout(() => {
      messageTitleEl = document.querySelector('.modal .modal-title');
      messageContentEl = document.querySelector('.modal .modal-body');

      expect(messageTitleEl.innerText).toEqual('You have disallowed any tags from appearing in this message. All are stripped.');
      expect(messageContentEl.innerText).toEqual('You have disallowed any tags from appearing in this message. All are stripped.');
    }, 650);
  });
});
