/**
 * @jest-environment jsdom
 */
import { Personalize } from '../../../src/components/personalize/personalize';
import { cleanup } from '../../helpers/func-utils';

const personalizeHTML = `<div class="page-container no-scroll">

  <header class="header is-personalizable">
    <div class="toolbar">
      <div class="title">
        <h1>Example: Reinitialize</h1>
      </div>

      <div class="buttonset">
      </div>

      {{> includes/header-actionbutton}}
    </div>
  </header>

  <div id="maincontent" class="page-container scrollable" role="main">

    <div class="row">
      <div class="six columns">
        <p>This example tests state maintenance for personalization of colors and theme. Personalizations should maintain upon reinitialization of elements after having chosen a theme or color from the "..." button in the header.</p>
        <p>Personalization button will set all colors to defaults as declared in HTML <em>script</em> tag, regardless of theme.</p><br/><br/>
      </div>
    </div>

    <div class="row">
      <div class="one columns">
        <button id="reinitialize" class="btn-secondary">Reinitialize</button>
        <br/><br/>
        <button id="personalize" class="btn-secondary">Personalize Colors to Defaults</button>
      </div>
    </div>

  </div>

</div>

<script>
  // component defaults
  var colors = '2578A9';

  $('html').personalize({colors: colors});

  $('#reinitialize').on('click', function() {
    $('body').initialize();
  });

  $('#personalize').on('click', function() {
    $('html').personalize({colors: colors});
  });
</script>
`;

let personalizeEl;
let personalizeObj;
const personalizeId = '#personalize';

describe('Personalize settings', () => {
  beforeEach(() => {
    personalizeEl = null;
    personalizeObj = null;

    document.body.insertAdjacentHTML('afterbegin', personalizeHTML);

    personalizeEl = document.body.querySelector(personalizeId);
    personalizeObj = new Personalize(personalizeEl);
  });

  afterEach(() => {
    personalizeObj.destroy();
    cleanup();
  });

  it('should set colors', () => {
    const colors = {
      header: '#F2F2F2',
      subheader: '#700000',
      text: '#000000',
      verticalBorder: '#D3D3D3',
      horizontalBorder: '#D3D3D3',
      inactive: '#CCCCCC',
      hover: '#CCCCCC'
    };

    personalizeObj.settings.colors = {
      header: '#F2F2F2',
      subheader: '#700000',
      text: '#000000',
      verticalBorder: '#D3D3D3',
      horizontalBorder: '#D3D3D3',
      inactive: '#CCCCCC',
      hover: '#CCCCCC'
    };

    expect(personalizeObj.settings.colors).toEqual(colors);
  });
});
