/**
 * @jest-environment jsdom
 */
import { ApplicationMenu } from '../../../src/components/applicationmenu/applicationmenu';
import { cleanup } from '../../helpers/func-utils';

const applicationmenuHTML = `
<body class="no-scroll">
  <a href="#maincontent" class="skip-link" data-translate="text">SkipToMain</a>
  {{> includes/svg-inline-refs}}
  <nav id="application-menu" data-automation-id="application-menu" class="application-menu is-personalizable">

    <div class="accordion panel inverse" data-options="{'allowOnePane': true}" >

      <div class="accordion-header is-selected">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-home"></use>
        </svg>
        <a href="#" id="item-one" data-automation-id="appmenu-a-item-one"><span>Item One</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-tools"></use>
        </svg>
        <a href="#" id="item-two" data-automation-id="appmenu-a-item-two"><span>Item Two</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-columns"></use>
        </svg>
        <a href="#" id="item-three" data-automation-id="appmenu-a-item-three"><span>Item Three</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-cascade"></use>
        </svg>
        <a href="#" id="item-four" data-automation-id="appmenu-a-item-four"><span>Item Four</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-insert-image"></use>
        </svg>
        <a href="#" id="item-five" data-automation-id="appmenu-a-item-five"><span>Item Five</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-ledger"></use>
        </svg>
        <a href="#" id="item-six" data-automation-id="appmenu-a-item-six"><span>Item Six</span></a>
      </div>

    </div>
  </nav>

  <div class="page-container scrollable" role="main">
      <header class="header is-personalizable" id="maincontent">
        <a href="#maincontent" class="skip-link" data-translate="text">SkipToMain</a>

        <div class="toolbar">
          <div class="title">
            <button id="header-hamburger" class="btn-icon application-menu-trigger" type="button">
              <span class="audible" data-translate="text">AppMenuTriggerTextAlt</span>
              <span class="icon app-header">
                <span class="one"></span>
                <span class="two"></span>
                <span class="three"></span>
              </span>
            </button>

            <h1>
              <span>App Menu Example</span>
            </h1>
          </div>

          <div class="buttonset">
          </div>
          {{> includes/header-actionbutton}}
        </div>

      </header>

  </div>

  {{> includes/footer}}
`;

let applicationmenuEl;
let applicationmenuObj;

describe('Application Menu API', () => {
  beforeEach(() => {
    applicationmenuEl = null;
    applicationmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', applicationmenuHTML);
    applicationmenuEl = document.body.querySelector('#application-menu');

    applicationmenuObj = new ApplicationMenu(applicationmenuEl, { triggers: $('.application-menu-trigger') });
  });

  afterEach(() => {
    applicationmenuObj.destroy();
    applicationmenuEl.parentNode.removeChild(applicationmenuEl);

    const headerEl = document.body.querySelector('.header');
    headerEl.parentNode.removeChild(headerEl);
    cleanup();
  });

  it('Should show on page', () => {
    document.body.querySelector('#header-hamburger').click();

    expect(document.body.querySelector('#application-menu')).toBeTruthy();
  });

  it('Should not error on updated', () => {
    $(applicationmenuEl).empty();
    applicationmenuObj.updated();

    expect(document.body.querySelectorAll('#application-menu > *').length).toEqual(0);
  });
});
