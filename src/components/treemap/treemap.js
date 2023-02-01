/* eslint-disable no-underscore-dangle */
// Shared Imports
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';
import { theme } from '../theme/theme';

import '../emptymessage/emptymessage.jquery';

// Settings and Options
const COMPONENT_NAME = 'treemap';

// Default Radar Options
const TREEMAP_DEFAULTS = {
  dataset: [],
  redrawOnResize: true,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  colors: null,
  showLabel: true,
  labelFormatter: '.0%',
  showTitle: true,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data-new' }
};

/**
 * A treemap chart is a diagram representing hierarchical data in the form of nested rectangles,
 * the area of each corresponding to its numerical value.
 * @class Treemap
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 * @param {array} settings.dataset The data to use in the radar
 * @param {boolean} [settings.redrawOnResize = true] If false, the component will not resize when resizing the page.
 * @param {object} [settings.margin] The margins of the SVG, which you may want to adjust depending on text location.
 * @param {array} [settings.colors] An array of colors used in sequence from front to end of the array.
 * @param {boolean} [settings.showLabel] If false then the percentage wont be shown in the blocks.
 * @param {string} [settings.labelFormatter] The d3 formatter function for the value label.
 * @param {boolean} [settings.showTitle] If true then the first name will be used for the title area.
 * @param {object} [settings.emptyMessage] An empty message will be displayed when there is no chart data.
 * This accepts an object of the form emptyMessage:
 * `{title: 'No Data Available',
 *  info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data-new',
 *  button: {text: 'xxx', click: <function>}
 *  }`
 * Set this to null for no message or will default to 'No Data Found with an icon.'
 * @param {string} [settings.attributes] Add extra attributes like id's to the chart elements. For example `attributes: { name: 'id', value: 'my-unique-id' }`
*/
function Treemap(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TREEMAP_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Treemap.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The component prototype for chaining.
   */
  init() {
    this
      .build()
      .handleEvents();

    /**
    * Fires when the chart is complete done rendering, for customization.
    * @event rendered
    * @memberof Treemap
    * @property {object} event - The jquery event object
    * @property {array} svg - The svg object.
    */
    this.element.trigger('rendered', [this.svg]);

    return this;
  },

  /**
   * Build the Component.
   * @returns {object} The component prototype for chaining.
   * @private
   */
  build() {
    this.setupColors();
    this.updateData(this.settings.dataset);
    return this;
  },

  /**
   * Generate internal color variables.
   * @private
   */
  setupColors() {
    if (!this.settings.colors || this.useBuiltInColors) {
      const palette = theme.themeColors().palette;
      this.settings.colors = [
        palette.azure['100'].value,
        palette.azure['90'].value,
        palette.azure['80'].value,
        palette.azure['70'].value,
        palette.azure['60'].value,
        palette.azure['40'].value,
        palette.azure['30'].value,
        palette.azure['20'].value,
        palette.amethyst['100'].value,
        palette.amethyst['90'].value,
        palette.amethyst['80'].value,
        palette.amethyst['70'].value,
        palette.amethyst['60'].value,
        palette.amethyst['50'].value,
        palette.amethyst['40'].value,
        palette.amethyst['40'].value,
        palette.amethyst['30'].value,
        palette.amethyst['20'].value,
        palette.turquoise['100'].value,
        palette.turquoise['90'].value,
        palette.turquoise['80'].value,
        palette.turquoise['70'].value,
        palette.turquoise['60'].value,
        palette.turquoise['50'].value,
        palette.turquoise['40'].value,
        palette.turquoise['40'].value,
        palette.turquoise['30'].value,
        palette.turquoise['20'].value
      ];
      this.useBuiltInColors = true;
    }
  },

  /**
   * Update the chart with a new dataset
   * @param  {object} data The data to use.
   */
  updateData(data) {
    const margin = Object.create(this.settings.margin);
    const width = this.element.parent().width() - margin.left - margin.right;
    let height = this.element.parent().height() - margin.top - margin.bottom;
    // Define the colors
    const color = d3.scaleOrdinal().range(this.settings.colors);

    // Handle Empty Data Set
    if (data.length === 0) {
      this.element.emptymessage(this.settings.emptyMessage);
      return;
    }

    utils.addAttributes(this.element, data, this.settings.attributes, '', true);

    // Show the title area
    if (this.settings.showTitle && data.name) {
      d3.select(this.element[0])
        .append('div')
        .attr('class', 'chart-treemap-title')
        .text(data.name);

      height -= 35;
      margin.top -= 19;
    }

    // Run the d3 tree map algorithm
    const treemap = d3.treemap().size([width, height]);

    // Set the height / width and class
    this.root = d3.select(this.element[0]).classed('chart-treemap', true)
      .append('div')
      .style('position', 'relative')
      .style('width', `${width + margin.left + margin.right}px`)
      .style('height', `${height + margin.top + margin.bottom}px`)
      .style('left', `${margin.left}px`)
      .style('top', `${margin.top}px`);

    // Format the data into a hierarchy tree
    const root = d3.hierarchy(data, d => d.children)
      .sum(d => d.value);
    const tree = treemap(root);

    this.total = d3.sum(tree.leaves(), d => d.value);
    let tooltipInterval;
    charts.appendTooltip();

    // Add the tree map nodes
    this.root.datum(root).selectAll('.chart-treemap-node')
      .data(tree.leaves())
      .enter()
      .append('div')
      .attr('class', 'chart-treemap-node')
      .style('left', d => `${d.x0}px`)
      .style('top', d => `${d.y0}px`)
      .style('width', d => `${Math.max(0, d.x1 - d.x0 - 1)}px`)
      .style('height', d => `${Math.max(0, d.y1 - d.y0 - 1)}px`)
      .style('background', (d) => {
        if (!d || !d.parent || !d.parent.data) {
          return '';
        }
        return color(d.parent.data.name);
      })
      .call((d) => {
        // Add id's to each slice
        d._groups.forEach((sections) => {
          sections.forEach((section) => {
            const dat = section.__data__;
            utils.addAttributes($(section), dat, this.settings.attributes, dat.data.name?.toLowerCase(), true);
          });
        });
      })
      .on('mouseenter.treemap', function (event, d) {
        const rect = this.getBoundingClientRect();
        const percentText = this.querySelector('.chart-treemap-percent').innerText;
        let content = d.parent.data.tooltip;

        // Only show if small
        if (!content && rect.width > 60 && rect.height > 50) {
          return;
        }

        if (!content) {
          content = `<p><b>${d.data.name} </b> ${percentText}</p>`;
        } else {
          content = content.replace('%percent%', percentText);
          content = content.replace('{{percent}}', percentText);
        }

        const size = charts.tooltipSize(content);
        const posX = rect.left - (size.width / 2) + 12;
        const posY = rect.top - size.height - 6;

        charts.showTooltip(posX, posY, content, 'top');
      })
      .on('mouseleave.treemap', () => {
        clearInterval(tooltipInterval);
        charts.hideTooltip();
      });

    this.root.selectAll('.chart-treemap-node')
      .append('span')
      .attr('class', 'chart-treemap-text')
      .text(d => d.data.name);

    if (this.settings.showLabel) {
      this.root.selectAll('.chart-treemap-node')
        .append('span')
        .attr('class', 'chart-treemap-percent')
        .text(d => d3.format(this.settings.labelFormatter)(d.value / this.total));
    }
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  handleEvents() {
    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      this.updated();
    });

    if (this.settings.redrawOnResize) {
      $('body').on(`resize.${COMPONENT_NAME}`, () => {
        this.handleResize();
      });

      this.element.on(`resize.${COMPONENT_NAME}`, () => {
        this.handleResize();
      });
    }

    $('html').on(`themechanged.${COMPONENT_NAME}`, () => {
      this.updated();
    });
    return this;
  },

  /**
   * Handles resizing a chart.
   * @private
   * @returns {void}
   */
  handleResize() {
    if (this.width === this.element.width()) {
      return;
    }

    this.width = this.element.width();

    if (!this.element.is(':visible')) {
      return;
    }

    this.updated();
  },

  /**
   * Handle updated settings and values.
   * @param  {object} settings The new settings to use.
   * @returns {object} The api for chaining.
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);

    if (settings && settings.dataset) {
      this.settings.dataset = settings.dataset;
    }

    this.setupColors();
    this.element.empty();
    return this
      .build();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    $('body').off(`resize.${COMPONENT_NAME}`);
    $('html').off(`themechanged.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.element.empty().removeClass('chart-treemap');
    charts.removeTooltip();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Treemap, COMPONENT_NAME };
