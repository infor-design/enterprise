
import { Message } from '../message';

let messageEl;
let messageAPI;
let messageTitleEl;
let messageContentEl;

describe('Message XSS Prevention', () => {
  beforeEach(() => {
    messageEl = document.body;
  });

  afterEach(() => {
    messageEl = null;

    messageAPI.destroy();
    messageAPI = null;

    messageTitleEl = null;
    messageContentEl = null;
  });

  it('Can strip HTML tags out of user-set content', () => {
    // NOTE: See SOHO-7819
    const dangerousMessageTitle = 'Application Message <script>alert("GOTCHA!");</script>';
    const dangerousMessageContent = 'This is a potentially dangerous Message. <script>alert("GOTCHA!");</script>';

    messageAPI = new Message(messageEl, {
      title: dangerousMessageTitle,
      message: dangerousMessageContent
    });

    messageTitleEl = document.querySelector('.modal .modal-title');
    messageContentEl = document.querySelector('.modal .modal-body'); // should only be one

    expect(messageTitleEl.innerText).toEqual('Application Message alert("GOTCHA!");');
    expect(messageContentEl.innerText).toEqual('This is a potentially dangerous Message. alert("GOTCHA!");');
  });
});
