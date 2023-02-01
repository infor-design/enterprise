/**
 * @jest-environment jsdom
 */
import { EmptyMessage } from '../../../src/components/emptymessage/emptymessage';
import { cleanup } from '../../helpers/func-utils';

const emptymessageHTML = `<div class="row">
  <div class="four columns">
    <div class="card is-empty">
      <div class="card-header">
        <h2 class="widget-title">Projects</h2>
        <button class="btn-actions" type="button">
          <span class="audible">Actions</span>
          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-more"></use>
          </svg>
        </button>
        <ul class="popupmenu actions top">
          <li><a href="#">Action One</a></li>
          <li><a href="#">Action Two</a></li>
        </ul>
      </div>
      <div class="card-content">
        <div id="empty-message">
        </div>
      </div>
    </div>
  </div>
</div>`;

let emptymessageEl;
let emptymessageObj;

const settings = {
  title: 'No Data Available',
  icon: 'icon-empty-no-data-new',
  info: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do siusmod temp.',
  button: {
    id: 'test',
    text: 'Retry'
  }
};

describe('EmptyMessage API', () => { //eslint-disable-line
  beforeEach(() => {
    emptymessageEl = null;
    emptymessageObj = null;
    document.body.insertAdjacentHTML('afterbegin', emptymessageHTML);
    emptymessageEl = document.body.querySelector('#empty-message');

    emptymessageObj = new EmptyMessage(emptymessageEl, settings);
  });

  afterEach(() => {
    emptymessageObj?.destroy();
    cleanup();
  });

  it('should render emptymessage', () => {
    expect(emptymessageObj).toBeTruthy();

    expect(emptymessageEl.classList.contains('empty-message')).toBeTruthy();
    expect(document.body.querySelector('.empty-icon')).toBeTruthy();
    expect(document.body.querySelector('.empty-title')).toBeTruthy();
    expect(document.body.querySelector('.empty-info')).toBeTruthy();
    expect(document.body.querySelector('.empty-actions')).toBeTruthy();
  });

  it('should be able to destroy', () => {
    emptymessageObj.destroy();

    expect(emptymessageEl.classList.contains('empty-message')).toEqual(false);
    expect(document.body.querySelector('.empty-icon')).toBeFalsy();
    expect(document.body.querySelector('.empty-title')).toBeFalsy();
    expect(document.body.querySelector('.empty-info')).toBeFalsy();
    expect(document.body.querySelector('.empty-actions')).toBeFalsy();
    expect($(emptymessageEl).data('.emptymessage')).toBeFalsy();
  });

  it('should fire the click event from settings', (done) => {
    emptymessageObj.destroy();
    emptymessageObj = new EmptyMessage(emptymessageEl, {
      title: 'No Data Available',
      icon: 'icon-empty-no-data-new',
      info: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do siusmod temp.',
      button: {
        id: 'test',
        text: 'Retry',
        click: (e) => {
          expect(e).toBeTruthy();
          done();
        }
      }
    });

    const buttonSelector = '.empty-message button';
    const callback = jest.fn();
    $(buttonSelector).on('click', callback);
    document.body.querySelector(buttonSelector).click();

    expect(callback).toHaveBeenCalled();
  });
});
