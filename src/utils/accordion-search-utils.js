/**
 * This util provides methods required to bridge the APIs/events of the Searchfield
 * and Accordion components to create a nested filtering system.  This structure is
 * used by both the Application Menu and Module Nav components.
 */
const accordionSearchUtils = {};

// Settings
const ACCORDION_SEARCH_SETTINGS = {
  filterable: true,
  filterMode: 'contains',
};

/**
 * Detects the presence of a searchfield and attaches the filtering system
 * to the Application Menu Accordion.
 * @param {string} componentName camelCase name of the component to associate events with
 * @param {HTMLElement} cssClassTargetEl parent element that receives CSS classes for styling this one
 */
accordionSearchUtils.attachFilter = function (componentName, cssClassTargetEl) {
  if (!this.element.length) return;
  const self = this;
  const inputId = componentName === 'applicationmenu' ? 'application-menu-searchfield' : 'module-nav-search';

  // Build Searchfield in App Menu only (allow composition in Module Nav)
  if (componentName === 'applicationmenu') {
    this.searchfield = this.element.find('.searchfield, .searchfield-wrapper');
    if (this.searchfield.is('.searchfield-wrapper')) {
      this.searchfield = this.searchfield.find('.searchfield');
    }
    if (!this.searchfield.length) {
      this.searchfield =
        $(`<input id="${inputId}" class="searchfield" placeholder="Search" />`)
          .prependTo(this.element);
    }
  }

  // Setup filtering, if applicable.
  // Detect element
  let searchEl = $(self.searchEl);
  if (searchEl.is('.searchfield-wrapper')) searchEl = searchEl.find('.searchfield');

  if (searchEl && typeof $.fn.searchfield === 'function') {
    if (cssClassTargetEl instanceof HTMLElement) cssClassTargetEl.classList.add('has-searchfield');

    // Build component
    $(searchEl).searchfield({
      clearable: true,
      filterMode: self.settings.filterMode,
      source(term, done, args) {
        done(term, self.accordionAPI?.toData(true, true), args);
      },
      searchableTextCallback(item) {
        return item.text || item.contentText || '';
      },
      resultIteratorCallback(item) {
        item.highlightTarget = 'text';
        return item;
      },
      clearResultsCallback() {
        const searchAPI = $(self.searchEl.querySelector('.searchfield') || self.searchEl).data('searchfield');
        let canUnfilter = true;
        if (componentName === 'applicationmenu' && !searchAPI.isFocused) canUnfilter = false;
        if (searchAPI && canUnfilter) {
          self.accordionAPI?.unfilter();
        }
      },
      displayResultsCallback(results, done) {
        return accordionSearchUtils.filterResultsCallback.apply(self, [searchEl, self.accordionAPI, results, done]);
      }
    });
  }
};

/**
 * @param {string} componentName camelCase name of the component to associate events with
 */
accordionSearchUtils.attachFilterEvents = function (componentName) {
  if (this.settings.filterable === true && this.searchEl) {
    // Fires on IDS Autocomplete's "complete" event (catches empty)
    $(this.searchEl).on(`complete.${componentName}`, (e) => {
      this.handleSearchfieldInputEvent(e);
    });

    // Listens for events from IDS Clearable behavior
    $(this.searchEl).on(`cleared.${componentName}`, () => {
      this.accordionAPI?.unfilter(null, true);
    });
  }
};

/**
 * @param {HTMLElement} targetEl base element
 * @param {Accordion} accordionAPI accordion API to use
 * @param {array} results list of items that passed the filtering process.
 * @param {function} done method to be called when the display of filtered items completes.
 * @returns {void}
 */
accordionSearchUtils.filterResultsCallback = function (targetEl, accordionAPI, results, done) {
  if (!results) {
    accordionAPI?.unfilter();
    done();
    return;
  }

  const targets = $(results.map(item => item.element));
  accordionAPI?.filter(targets, true);

  $(targetEl).triggerHandler('filtered', [results]);
  done();
};

/**
 * @param {string} componentName camelCase name of the component to associate events with
 * @returns {void}
 */
accordionSearchUtils.handleSearchfieldInputEvent = function () {
  if (!this.searchEl) {
    return;
  }

  const val = $(this.searchEl).val();
  if (!val || val === '') this.accordionAPI?.unfilter(null, true);
};

/**
 * @param {string} componentName camelCase name of the component to associate events with
 */
accordionSearchUtils.teardownFilter = function (componentName) {
  if (this.searchEl) {
    $(this.searchEl).off([
      `cleared.${componentName}`,
      `complete.${componentName}`
    ].join(' '));

    this.searchAPI?.destroy();
  }
};

export { accordionSearchUtils, ACCORDION_SEARCH_SETTINGS };
