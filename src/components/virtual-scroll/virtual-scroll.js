import { utils } from '../../utils/utils';

// Component Name
const COMPONENT_NAME = 'virtual-scroll';

// Default VirtualScroll Options
const VIRTUALSCROLL_DEFAULTS = {
  height: 300,
  itemHeight: 50,
  bufferSize: 20,
  data: [],
  scrollTop: 0,
  itemCount: 0,
  itemTemplate: null,
  startIndex: 0
};

/**
* Add Virtual scrolling to a fixed size container
* @class VirtualScroll
* @param {string} element The component element.
* @param {string} [settings] The component settings.
*/
function VirtualScroll(element, settings) {
  this.settings = utils.mergeSettings(element, settings, VIRTUALSCROLL_DEFAULTS);
  this.element = $(element);
  this.init();
}

// VirtualScroll Methods
VirtualScroll.prototype = {

  init() {
    this.container = this.element.find('.ids-virtual-scroll')[0];
    this.stringTemplate = '<div class="ids-virtual-scroll-item">${productName}</div>'; //eslint-disable-line
    this.itemCount = this.settings.data.length;
    this.itemTemplate = this.settings.itemTemplate || this.itemTemplate;

    this.handleEvents();
    this.applyHeight();
    this.renderItems(false);

    return this;
  },

  /**
   * Attach Events used by the Component
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.timeout = null;
    this.scrollHandler = (e) => {
      this.handleScroll(e);
    };

    this.container.addEventListener('scroll', this.scrollHandler, { passive: true });

    return this;
  },

  /**
   * Handle the scrolling event
   * @private
   * @param {Event} e The scroll event data
   */
  handleScroll(e) {
    if (this.timeout) {
      cancelAnimationFrame(this.timeout);
    }

    const target = e.target;
    this.timeout = requestAnimationFrame(() => {
      this.scrollTop = target.scrollTop;
    });
  },

  /**
    * Render the visible section plus the cached data
    * @private
    * @param {boolean} allowZero Allow a zero length dataset (render empty)
   */
  renderItems(allowZero) {
    if (!this.settings.data || (!allowZero && this.data.length === 0)) {
      return;
    }
    const startIndex = this.startIndex;
    const endIndex = this.startIndex + this.visibleItemCount();

    if (this.lastStart === startIndex && this.lastEnd === endIndex) {
      return;
    }

    this.lastStart = startIndex;
    this.lastEnd = endIndex;

    const data = this.settings.data.slice(
      startIndex,
      endIndex
    );

    let html = '';
    data.map((item, elem) => {
      const node = this.itemTemplate(item, elem);
      html += node;
      return node;
    });

    this.itemContainer.style.transform = `translateY(${this.offsetY}px)`;
    this.itemContainer.innerHTML = html;
    this.element.trigger('afterrendered', this, { elem: this, startIndex, endIndex });
  },

  /**
   * Set the height of the containers
   * @private
   */
  applyHeight() {
    this.container.style.height = `${this.settings.height}px`;
    this.container.querySelector('.ids-virtual-scroll-viewport').style.height = `${this.viewPortHeight}px`;
    /** @type {object} */
    this.itemContainer = this.element.find('.contents')[0];
    this.itemContainer.style.transform = `translateY(${this.offsetY}px)`;

    this.isTable = this.element.find('.ids-data-grid-container').length > 0;
    if (this.isTable) {
      // @ts-ignore
      this.element.find('.ids-virtual-scroll')[0].style.overflow = 'inherit';
    }
  },

  /**
   * Render the visible section plus the cached data
   * @private
   * @returns {number} The array of visible data
   */
  visibleItemCount() {
    // @ts-ignore
    let count = Math.ceil(this.height / this.itemHeight) + (2 * this.bufferSize);
    count = Math.min(Number(this.itemCount) - this.startIndex, count);
    return count;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, VIRTUALSCROLL_DEFAULTS);
    }

    return this
      .unbind()
      .init();
  },

  /**
   * Unbind all open events
   * @returns {void}
   */
  unbind() {
    this.container.removeEventListener('scroll', this.scrollHandler);
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Destroy this component instance and remove the link from its base element.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * The height of the virtual scroll container
   * @param {number|string} value the height in pixels
   */
  set height(value) {
    this.settings.height = value;
  },

  get height() { return this.data.length === 0 ? 0 : this.settings.height; },

  /**
   * The height of each item in the scroller. TODO: support dynamic heights
   * @param {number|string} value the height of each item in pixels
   */
  set itemHeight(value) {
    this.settings.itemHeight = value;
  },

  get itemHeight() { return this.settings.itemHeight; },

  /**
   * Extra padding at the top and bottom so that the data transition smoothly
   * @param {number|string} value The number of extra top and bottom elements
   */
  set bufferSize(value) {
    this.settings.bufferSize = value;
  },

  get bufferSize() { return this.settings.bufferSize || 20; },

  /**
   * Set the scroll top position and scroll down to that location
   * @param {number|string} value The number of pixels from the top
   */
  set scrollTop(value) {
    if (this.container.scrollTop !== value) {
      this.container.scrollTop = value;
      return;
    }
    this.settings.scrollTop = value;
    this.renderItems(false);
  },

  get scrollTop() { return this.settings.scrollTop || 0; },

  /**
   * Scroll to a indexed item bring it into center view.
   * @param {number} value The index to scroll to
   */
  scrollTo(value) {
    this.scrollTop = Number(value) * this.itemHeight;
  },

  /**
   * The height of the inner viewport
   * @returns {number} The calculated viewport height
   */
  get viewPortHeight() { return Number(this.itemCount) * Number(this.itemHeight); },

  /**
   * The (dynamic sometimes) total number of data being rendered
   * @param {number|string} value The number of pixels from the top
   */
  set itemCount(value) {
    this.settings.itemCount = value;
  },

  get itemCount() { return this.settings.itemCount; },

  get offsetY() {
    return Number(this.startIndex) * Number(this.itemHeight);
  },

  get startIndex() {
    let startNode = Math.floor(Number(this.scrollTop) / Number(this.itemHeight)) - Number(this.bufferSize);
    startNode = Math.max(0, startNode);
    return startNode;
  },

  /**
   * Return a item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return this.injectTemplate(this.stringTemplate, item);
  },

  /**
   * Inject template variables in a string
   * @private
   * @param {string} str The string to inject into
   * @param {string} obj The string to inject into
   * @returns {obj} The dataset row / item
   */
  injectTemplate(str, obj) {
    return str.replace(/\${(.*?)}/g, (_x, g) => obj[g]);
  },

  /**
   * Set the data array of the listview
   * @param {Array|undefined} value The array to use
   */
  set data(value) {
    if (value) {
      this.settings.data = value;
      this.itemCount = value.length;
      this.lastStart = null;
      this.lastEnd = null;
      this.scrollTop = 0;
      this.applyHeight();
      this.renderItems(true);
      return;
    }

    this.settings.data = null;
  },

  get data() {
    return this?.settings?.data;
  }
};

export { VirtualScroll, COMPONENT_NAME };
