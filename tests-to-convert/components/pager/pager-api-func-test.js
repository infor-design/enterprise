/**
 * @jest-environment jsdom
 */
import { Pager } from '../../../src/components/pager/pager';
import { cleanup } from '../../helpers/func-utils';

const pagerHTML = `<div class="row">
  <div class="six columns">
    <div class="pager-container"></div>
  </div>
  <div class="six columns">
    <div class="field">
      <input type="checkbox" class="checkbox" name="toggle-pagesize" id="toggle-pagesize"/>
      <label for="toggle-pagesize" class="checkbox-label">Show Page Size Selector</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="toggle-small-pagesize" id="toggle-small-pagesize" disabled="true" />
      <label for="toggle-small-pagesize" class="checkbox-label">Use Small Page Size Selector</label>
      </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="toggle-attach-to-body" id="toggle-attach-to-body" disabled="true" />
      <label for="toggle-attach-to-body" class="checkbox-label">Attach Page Size Menu To Body</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="toggle-first-button" id="toggle-first-button"/>
      <label for="toggle-first-button" class="checkbox-label">Hide First Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="disable-first-button" id="disable-first-button"/>
      <label for="disable-first-button" class="checkbox-label">Disable First Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="toggle-previous-button" id="toggle-previous-button"/>
      <label for="toggle-previous-button" class="checkbox-label">Hide Previous Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="disable-previous-button" id="disable-previous-button"/>
      <label for="disable-previous-button" class="checkbox-label">Disable Previous Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="toggle-next-button" id="toggle-next-button"/>
      <label for="toggle-next-button" class="checkbox-label">Hide Next Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="disable-next-button" id="disable-next-button"/>
      <label for="disable-next-button" class="checkbox-label">Disable Next Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="toggle-last-button" id="toggle-last-button"/>
      <label for="toggle-last-button" class="checkbox-label">Hide Last Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="disable-last-button" id="disable-last-button"/>
      <label for="disable-last-button" class="checkbox-label">Disable Last Button</label>
    </div>
    <div class="field">
      <input type="checkbox" class="checkbox" name="show-page-selector-input" id="show-page-selector-input"/>
      <label for="show-page-selector-input" class="checkbox-label">Show Page Selector Input</label>
    </div>

    <div class="field">
      <label for="firstPageButtonTooltip">First Pager Button Tooltip</label>
      <input type="text" id="firstPageButtonTooltip" value="Custom First Tooltip"/>
    </div>
    <div class="field">
      <label for="firstPageButtonTooltip">Previous Pager Button Tooltip</label>
      <input type="text" id="previousPageButtonTooltip" value="Custom Previous Tooltip"/>
    </div>
    <div class="field">
      <label for="firstPageButtonTooltip">Next Pager Button Tooltip</label>
      <input type="text" id="nextPageButtonTooltip" value="Custom Next Tooltip"/>
    </div>
    <div class="field">
      <label for="firstPageButtonTooltip">Last Pager Button Tooltip</label>
      <input type="text" id="lastPageButtonTooltip" value="Custom Last Tooltip"/>
    </div>

    <button class="btn-primary" type="button" id="reset-tooltips">Reset Tooltips</button>
  </div>
</div>

<script id="test-script">
  $('body').one('initialized', function () {
    var api = $('.pager-container').pager({
      type: 'standalone',
      pagesize: 10,
      showPageSizeSelector: false,
      showFirstButton: true,
      enableFirstButton: true,
      showPreviousButton: true,
      enablePreviousButton: true,
      showNextButton: true,
      enableNextButton: true,
      showLastButton: true,
      enableLastButton: true,
      onFirstPage: function (elem, args) {
        $('body').toast({title: 'onFirstPage Callback Fired', message: ''});
      },
      onPreviousPage: function (elem, args) {
        $('body').toast({title: 'onPreviousPage Callback Fired', message: ''});
      },
      onNextPage: function (elem, args) {
        $('body').toast({title: 'onNextPage Callback Fired', message: ''});
      },
      onLastPage: function (elem, args) {
        $('body').toast({title: 'onLastPage Callback Fired', message: ''});
      },
      onPageSizeChange: function (elem, args) {
        $('body').toast({title: 'onPageSizeChange Callback Fired', message: ''});
      },
      firstPageTooltip: 'Custom First Tooltip',
      previousPageTooltip: 'Custom Previous Tooltip',
      nextPageTooltip: 'Custom Next Tooltip',
      lastPageTooltip: 'Custom Last Tooltip',
      attributes: [{ name: 'id', value: 'standalone-pager' }, { name: 'data-automation-id', value: 'standalone-pager-auto-id' } ],
    }).on('page', function (e, args) {
      setButtonsState();
    }).on('firstpage', function (e, args) {
      $('body').toast({title: 'firstpage jQuery Event Fired', message: ''});
    }).on('previouspage', function (e, args) {
      $('body').toast({title: 'previouspage jQuery Event Fired', message: ''});
    }).on('nextpage', function (e, args) {
      $('body').toast({title: 'nextpage jQuery Event Fired', message: ''});
    }).on('lastpage', function (e, args) {
      $('body').toast({title: 'lastpage jQuery Event Fired', message: ''});
    }).data('pager');

    //TODO: Make func tests for these (api.updated calls)
    // Add functionality to toggle the pager items such as hasPageSizeChooser, hasFirstButton
    $('#toggle-pagesize').on('change.test', function() {
      var isChecked = this.checked;
      var opts = {
        showPageSizeSelector: isChecked,
        smallPageSizeSelector: document.querySelector('#toggle-small-pagesize').checked
      };

      if (isChecked) {
        opts.pagesizes = [10, 20, 30, 40];
      }

      $('#toggle-small-pagesize').prop('disabled', !isChecked);
      $('#toggle-attach-to-body').prop('disabled', !isChecked);
      api.updated(opts);
    });

    $('#toggle-attach-to-body').on('change.test', function() {
      var isChecked = this.checked;
      api.updated({pageSizeMenuSettings: {
        attachToBody: isChecked
      }});
    });

    $('#toggle-small-pagesize').on('change.test', function() {
      var isChecked = this.checked;
      api.updated({smallPageSizeSelector: isChecked});
    });

    $('#toggle-first-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({showFirstButton: isChecked});
    });

    $('#disable-first-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({enableFirstButton: isChecked});
    });

    $('#toggle-previous-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({showPreviousButton: isChecked});
    });

    $('#disable-previous-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({enablePreviousButton: isChecked});
    });

    $('#toggle-next-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({showNextButton: isChecked});
    });

    $('#disable-next-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({enableNextButton: isChecked});
    });

    $('#toggle-last-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({showLastButton: isChecked});
    });

    $('#disable-last-button').on('change.test', function() {
      var isChecked = !this.checked;
      api.updated({enableLastButton: isChecked});
    });

    $('#show-page-selector-input').on('change.test', function() {
      var isChecked = this.checked;
      var opts = { showPageSelectorInput: isChecked, dataset: null };
      if (isChecked) {
        opts.dataset = getSomeData(50);
      }
      api.updated(opts);
      setButtonsState();
    });

    function getSomeData(max) {
      max = max || 1000;
      var ds = [];
      for (var i = 0; i < max; i++) {
        ds.push({ someKay: 'test-id-' + i });
      }
      return ds;
    }

    function setButtonsState() {
      var opts = {}
      if (api.settings.showPageSelectorInput) {
        var isEnabled = {
          prevAndFirst: api.state.activePage > 1,
          nextAndLast: api.state.activePage < api.state.pages
        };
        opts.enableFirstButton = isEnabled.prevAndFirst;
        opts.enablePreviousButton = isEnabled.prevAndFirst;
        opts.enableNextButton = isEnabled.nextAndLast;
        opts.enableLastButton = isEnabled.nextAndLast;
      } else {
        var getEnabled = function (btn) {
          return !($('#disable-' + btn + '-button').is(':checked'));
        };
        opts.enableFirstButton = getEnabled('first');
        opts.enablePreviousButton = getEnabled('previous');
        opts.enableNextButton = getEnabled('next');
        opts.enableLastButton = getEnabled('last');
      }
      opts.activePage = api.state.activePage;
      api.updated(opts);
    }

    var startingFirstVal = $('#firstPageButtonTooltip').val();
    var startingPreviousVal = $('#previousPageButtonTooltip').val();
    var startingNextVal = $('#nextPageButtonTooltip').val();
    var startingLastVal = $('#lastPageButtonTooltip').val();
    var doUpdate = true;

    $('#firstPageButtonTooltip').on('change.test', function () {
      var val = Soho.xss.stripTags($(this).val());
      if (!val.length) val = startingFirstVal;
      if (doUpdate) api.updated({ firstPageTooltip: val });
    });

    $('#previousPageButtonTooltip').on('change.test', function () {
      var val = Soho.xss.stripTags($(this).val());
      if (!val.length) val = startingPreviousVal;
      if (doUpdate) api.updated({ previousPageTooltip: val });
    });

    $('#nextPageButtonTooltip').on('change.test', function () {
      var val = Soho.xss.stripTags($(this).val());
      if (!val.length) val = startingNextVal;
      if (doUpdate) api.updated({ nextPageTooltip: val });
    });

    $('#lastPageButtonTooltip').on('change.test', function () {
      var val = Soho.xss.stripTags($(this).val());
      if (!val.length) val = startingLastVal;
      if (doUpdate) api.updated({ lastPageTooltip: val });
    });

    $('#reset-tooltips').on('click', function() {
      doUpdate = false;
      $('#firstPageButtonTooltip').val(startingFirstVal);
      $('#previousPageButtonTooltip').val(startingPreviousVal);
      $('#nextPageButtonTooltip').val(startingNextVal);
      $('#lastPageButtonTooltip').val(startingLastVal);
      api.updated({
        firstPageTooltip: startingFirstVal,
        previousPageTooltip: startingPreviousVal,
        nextPageTooltip: startingNextVal,
        lastPageTooltip: startingLastVal
      });
      doUpdate = true;
    });

    // Add functionality to trigger the pager events of the items
  });
</script>
`;

// Custom tooltip settings
const firstContent = 'In The Beginning...';
const previousContent = 'Before Long...';
const nextContent = 'The Next Day...';
const lastContent = 'In Closing...';

let pagerEl;
let pagerObj;

describe('Pager API (Standalone)', () => {
  beforeEach(() => {
    pagerEl = null;
    pagerObj = null;

    document.body.insertAdjacentHTML('afterbegin', pagerHTML);
    pagerEl = document.body.querySelector('.pager-container');
  });

  afterEach(() => {
    pagerObj.destroy();
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });

    expect(pagerObj).toBeTruthy();
  });

  it('should render', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });

    expect(document.body.querySelector('.pager-toolbar')).toBeTruthy();
    expect(document.body.querySelector('.pager-first')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev')).toBeTruthy();
    expect(document.body.querySelector('.pager-next')).toBeTruthy();
    expect(document.body.querySelector('.pager-last')).toBeTruthy();
  });

  it('should destroy pager', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });
    pagerObj.destroy();

    expect(document.body.querySelector('.pager-toolbar')).toBeFalsy();
  });

  it('should be show page size selector', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showPageSizeSelector: true });

    expect(document.body.querySelector('.pager-pagesize')).toBeTruthy();
  });

  it('should hide first button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showFirstButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-next .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-last .btn-icon')).toBeTruthy();

    pagerObj.updated({ showFirstButton: true });
  });

  it('should disable first button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableFirstButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeFalsy();

    pagerObj.updated({ enableFirstButton: true });
  });

  it('should hide previous button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showPreviousButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev .btn-icon')).toBeFalsy();
    expect(document.body.querySelector('.pager-next .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-last .btn-icon')).toBeTruthy();
  });

  it('should disable previous button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enablePreviousButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeFalsy();
  });

  it('should hide next button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showNextButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-next .btn-icon')).toBeFalsy();
    expect(document.body.querySelector('.pager-last .btn-icon')).toBeTruthy();
  });

  it('should disable next button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableNextButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeFalsy();
  });

  it('should hide last button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', showLastButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-prev .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-next .btn-icon')).toBeTruthy();
    expect(document.body.querySelector('.pager-last .btn-icon')).toBeFalsy();

    pagerObj.updated({ showLastButton: true });
  });

  it('should disable last button', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone', enableLastButton: false });

    expect(document.body.querySelector('.pager-first .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-prev .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-next .btn-icon[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.pager-last .btn-icon[disabled]')).toBeTruthy();

    pagerObj.updated({ enableLastButton: true });
  });

  it('Can have custom tooltips on the first, previous, next, and last buttons', () => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      firstPageTooltip: firstContent,
      previousPageTooltip: previousContent,
      nextPageTooltip: nextContent,
      lastPageTooltip: lastContent
    });

    const firstBtnTooltipAPI = $(document.body.querySelector('.pager-first .btn-icon')).data('tooltip');
    const previousBtnTooltipAPI = $(document.body.querySelector('.pager-prev .btn-icon')).data('tooltip');
    const nextBtnTooltipAPI = $(document.body.querySelector('.pager-next .btn-icon')).data('tooltip');
    const lastBtnTooltipAPI = $(document.body.querySelector('.pager-last .btn-icon')).data('tooltip');

    expect(firstBtnTooltipAPI.settings.content).toEqual(firstContent);
    expect(previousBtnTooltipAPI.settings.content).toEqual(previousContent);
    expect(nextBtnTooltipAPI.settings.content).toEqual(nextContent);
    expect(lastBtnTooltipAPI.settings.content).toEqual(lastContent);
  });

  it('Can be updated with new settings', () => {
    pagerObj = new Pager(pagerEl, { type: 'standalone' });

    function updateJunk() {
    }

    const newSettings = {
      firstPageTooltip: firstContent,
      previousPageTooltip: previousContent,
      nextPageTooltip: nextContent,
      lastPageTooltip: lastContent,
      enableFirstButton: false,
      enablePreviousButton: false,
      enableNextButton: false,
      enableLastButton: false,
      showPageSizeSelector: false,
      smallPageSizeSelector: true,
      showFirstButton: false,
      showPreviousButton: false,
      showNextButton: false,
      showLastButton: false,
      indeterminate: true,
      onFirstPage: updateJunk,
      onPreviousPage: updateJunk,
      onNextPage: updateJunk,
      onLastPage: updateJunk,
      pagesize: 16,
      pagesizes: [16, 32, 64]
    };

    pagerObj.updated(newSettings);

    expect(pagerObj.settings.firstPageTooltip).toEqual(firstContent);
    expect(pagerObj.settings.previousPageTooltip).toEqual(previousContent);
    expect(pagerObj.settings.nextPageTooltip).toEqual(nextContent);
    expect(pagerObj.settings.lastPageTooltip).toEqual(lastContent);
    expect(pagerObj.settings.enableFirstButton).toBeFalsy();
    expect(pagerObj.settings.enablePreviousButton).toBeFalsy();
    expect(pagerObj.settings.enableNextButton).toBeFalsy();
    expect(pagerObj.settings.enableLastButton).toBeFalsy();
    expect(pagerObj.settings.showPageSizeSelector).toBeFalsy();
    expect(pagerObj.settings.smallPageSizeSelector).toBeTruthy();
    expect(pagerObj.settings.showFirstButton).toBeFalsy();
    expect(pagerObj.settings.showPreviousButton).toBeFalsy();
    expect(pagerObj.settings.showNextButton).toBeFalsy();
    expect(pagerObj.settings.showLastButton).toBeFalsy();
    expect(typeof pagerObj.settings.onFirstPage).toEqual('function');
    expect(typeof pagerObj.settings.onPreviousPage).toEqual('function');
    expect(typeof pagerObj.settings.onNextPage).toEqual('function');
    expect(typeof pagerObj.settings.onLastPage).toEqual('function');
    expect(pagerObj.settings.indeterminate).toBeTruthy();
    expect(pagerObj.settings.pagesize).toEqual(16);
    expect(pagerObj.settings.pagesizes.length).toEqual(3);
  });

  it('Can display a small page selector', () => {
    pagerObj = new Pager(pagerEl, {
      type: 'standalone',
      pagesize: 20,
      pagesizes: [5, 10, 15, 20, 25, 30],
      showPageSizeSelector: true,
      smallPageSizeSelector: true
    });

    expect(pagerObj.settings.smallPageSizeSelector).toBeTruthy();

    const button = pagerEl.querySelector('.pager-pagesize > button');
    const recordCountEl = button.querySelector('.record-count');

    expect(recordCountEl).toBeTruthy();
  });
});
