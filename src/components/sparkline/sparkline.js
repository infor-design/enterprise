/* eslint-disable no-nested-ternary, prefer-arrow-callback, no-underscore-dangle */

// Other Shared Imports
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { theme } from '../theme/theme';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'sparkline';

// The Component Defaults
const SPARKLINE_DEFAULTS = {
  dataset: [],
  colors: null,
  isDots: false,
  isPeakDot: false,
  isMinMax: false,
  isMedianRange: false
};

/**
 * Sparklines are a compact way to show trends.
 * @class Sparkline
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 * @param {array} [settings.dataset] The data to use in the sparklines.
 * @param {array} [settings.colors = ['#1D5F8A', '#999999', '#bdbdbd', '#d8d8d8']] An array of color sequences in hex format fx #1D5F8A,
 * defaulting to the correct standard colors.
 * @param {boolean} [settings.isDots = false] Shows dots on the data points.
 * @param {boolean} [settings.isPeakDot = false] Highlights the top value as peak with a special dot.
 * @param {boolean} [settings.isMinMax  = false] Shows a continuous shading to highlight the min and max values.
 * @param {boolean} [settings.isMedianRange  = false] Adds a median range display.
 */
function Sparkline(element, settings) {
  this.settings = utils.mergeSettings(element, settings, SPARKLINE_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Sparkline.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The sparkline prototype for chaining.
   */
  init() {
    if (!this.settings.colors) {
      const palette = theme.themeColors().palette;
      this.settings.colors = [];
      this.settings.colors[0] = palette.azure[theme.uplift ? '80' : '70'].value;
      this.settings.colors[1] = palette.slate['40'].value;
      this.settings.colors[2] = palette.slate['30'].value;
      this.settings.colors[3] = palette.slate['20'].value;
    }
    this.namespace = utils.uniqueId({ classList: [this.settings.type, 'chart'] });
    this.sparklineColors = d3.scaleOrdinal().range(this.settings.colors);

    return this
      .build()
      .handleEvents();
  },

  /**
   * Build the Sparkline Chart.
   * @private
   * @returns {object} The sparkline prototype for chaining.
   */
  build() {
    // chartData, options
    // Sparkline Chart
    const self = this;
    const isPersonalizable = this.element.closest('.is-personalizable').length > 0;
    let tooltipIntervalMedianRange;
    let tooltipIntervalDots;
    const tooltipDataCacheMedianRange = [];
    const tooltipDataCacheDots = [];
    let tooltipData = self.settings.tooltip;

    // calculate max and min values in the NLWest data
    let max = 0;
    let min = 0;
    let len = 0;
    let i;
    const dimensions = this.calculateAspectRatioFit({
      srcWidth: 385,
      srcHeight: 65,
      maxWidth: this.element.width(),
      maxHeight: 600 // container min-height
    });
    const dotsize = dimensions.width > 300 ? 4 : 3;

    const chartData = self.settings.dataset;
    for (i = 0; i < chartData.length; i++) {
      min = d3.min([d3.min(chartData[i].data), min]);
      max = d3.max([d3.max(chartData[i].data), max]);
      len = d3.max([chartData[i].data.length, len]);
    }

    // Make the lines based on the range of values and width
    const p = 10;
    const w = dimensions.width;
    const h = dimensions.height;
    const x = d3.scaleLinear().domain([0, len]).range([p, w - p]);
    const y = d3.scaleLinear().domain([min, max]).range([h - p, p]);
    const line = d3.line()
      .x((d, j) => x(j))
      .y(d => y(d));

    // Add the tooltip dom element
    charts.appendTooltip();

    // Append to the main dom element
    const svg = d3.select(this.element[0])
      .append('svg')
      .attr('height', h)
      .attr('width', w);

    // Add Median Range
    // https://www.purplemath.com/modules/meanmode.htm
    if (self.settings.isMedianRange) {
      max = d3.max(chartData[0].data);
      min = d3.min(chartData[0].data);

      const minWidth = 10;
      const maxWidth = w - 45;
      const median = d3.median(chartData[0].data);
      const range = max - min;
      const scaleMedianRange = d3.scaleLinear().domain([min, max]).range([0, h]);
      const top = h - scaleMedianRange(median > range ? median : range);
      const bot = h - scaleMedianRange(median < range ? median : range);

      svg.append('g')
        .attr('class', 'medianrange')
        .attr('transform', () => `translate(${minWidth},${top})`)
        .append('rect')
        .attr('width', maxWidth)
        .attr('height', bot)
        .style('opacity', '0.06')
        .call((d) => {
          d._groups.forEach((medianranges) => {
            medianranges.forEach((medianrange) => {
              const dat = chartData[0];
              utils.addAttributes($(medianrange), dat, dat.attributes, 'medianrange');
            });
          });
        })
        .on(`mouseenter.${self.namespace}`, function () {
          const rect = this.getBoundingClientRect();
          let content = '<p class="sparkline-tooltip">' + // eslint-disable-line
            Locale.translate('Median') + ': <b>' + median + '</b><br>' +
            Locale.translate('Range') + ': <b>' + range + '</b>' +
            (self.settings.isPeakDot ? '<br>' + Locale.translate('Peak') + ': <b>'+ max +'</b>' : '') + '</p>'; // eslint-disable-line

          const show = function () {
            const size = charts.tooltipSize(content);
            const posX = rect.left + ((rect.width - size.width) / 2);
            const posY = rect.top - size.height - 5; // 5 is extra padding

            if (content !== '') {
              if (charts.tooltip && charts.tooltip.length) {
                charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
              }
              charts.showTooltip(posX, posY, content, 'top');
            }
          };

          if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCacheMedianRange[i]) {
            content = '';
            let runInterval = true;
            tooltipIntervalMedianRange = setInterval(() => {
              if (runInterval) {
                runInterval = false;
                tooltipData((data) => {
                  content = data;
                  tooltipDataCacheMedianRange[i] = data;
                });
              }
              if (content !== '') {
                clearInterval(tooltipIntervalMedianRange);
                show();
              }
            }, 10);
          } else {
            tooltipData = typeof tooltipData === 'object' ? '' : tooltipData;
            content = tooltipDataCacheMedianRange[i] || tooltipData || chartData[0].tooltip || content || '';
            show();
          }
        })
        .on(`mouseleave.${self.namespace}`, () => {
          clearInterval(tooltipIntervalMedianRange);
          charts.hideTooltip();
        });
    }

    for (i = 0; i < chartData.length; i++) {
      const set = chartData[i];
      const g = svg.append('g');

      g.append('path')
        .attr('d', line(set.data))
        .attr('stroke', self.settings.isMinMax ? '#999999' : this.sparklineColors(i))
        .attr('class', 'team connected-line')
        .call((d) => {
          d._groups.forEach((lines) => {
            lines.forEach((connectedLine) => {
              utils.addAttributes($(connectedLine), set, set.attributes, 'connected-line');
            });
          });
        });
    }

    // Add Dots (Dots/Peak/MinMAx)
    min = d3.min(chartData[0].data);
    svg.selectAll('.point')
      .data(chartData[0].data)
      .enter()
      .append('circle')
      .attr('r', function (d) {
        return (self.settings.isMinMax && max === d || self.settings.isMinMax && min === d) ?
          (dotsize + 1) :
          (self.settings.isDots || (self.settings.isPeakDot && max === d)) ? dotsize : 0;
      })
      .attr('class', function (d) {
        return (self.settings.isPeakDot && max === d && !self.settings.isMinMax) ? 'point peak' :
          (self.settings.isMinMax && max === d) ? 'point max' :
            (self.settings.isMinMax && min === d) ? 'point min' : 'point';
      })
      .style('fill', function (d) {
        return (self.settings.isPeakDot && max === d && !self.settings.isMinMax) ? '#ffffff' :
          (self.settings.isMinMax && max === d) ? '#56932E' :
            (self.settings.isMinMax && min === d) ? '#941E1E' : self.sparklineColors(0);
      })
      .style('stroke', function (d) {
        return (self.settings.isPeakDot && max === d && !self.settings.isMinMax) ?
          self.sparklineColors(0) :
          (self.settings.isMinMax && max === d) ? 'none' :
            (self.settings.isMinMax && min === d) ? 'none' : '#ffffff';
      })
      .style('cursor', 'pointer')
      .attr('cx', (d, m) => x(m))
      .attr('cy', d => y(d))
      .call((d) => {
        d._groups.forEach((points) => {
          points.forEach((point, idx) => {
            const dat = chartData[0];
            utils.addAttributes($(point), dat, dat.attributes, `point-${idx}`);
          });
        });
      })
      .on(`mouseenter.${self.namespace}`, function (d) {
        const rect = this.getBoundingClientRect();
        let content = `<p>${chartData[0].name ? `${chartData[0].name}<br> ${
          (self.settings.isMinMax && max === d) ? `${Locale.translate('Highest')}: ` :
            (self.settings.isMinMax && min === d) ? `${Locale.translate('Lowest')}: ` :
              (self.settings.isPeakDot && max === d) ? `${Locale.translate('Peak')}: ` : ''}` : ''}<b>${d}</b></p>`;

        const show = function () {
          const size = charts.tooltipSize(content);
          const posX = rect.left - (size.width / 2) + 6;
          const posY = rect.top - size.height - 8;

          if (content !== '') {
            if (charts.tooltip && charts.tooltip.length) {
              charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
            }
            charts.showTooltip(posX, posY, content, 'top');
          }
        };

        if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCacheDots[i]) {
          content = '';
          let runInterval = true;
          tooltipIntervalDots = setInterval(() => {
            if (runInterval) {
              runInterval = false;
              tooltipData((data) => {
                content = data;
                tooltipDataCacheDots[i] = data;
              });
            }
            if (content !== '') {
              clearInterval(tooltipIntervalDots);
              show();
            }
          }, 10);
        } else {
          tooltipData = typeof tooltipData === 'object' ? '' : tooltipData;
          content = tooltipDataCacheDots[i] || tooltipData || chartData[0].tooltip || content || '';
          show();
        }

        d3.select(this).attr('r', (self.settings.isMinMax && max === d ||
            self.settings.isMinMax && min === d) ? (dotsize + 2) : (dotsize + 1));
      })
      .on(`mouseleave.${self.namespace}`, function (d) {
        clearInterval(tooltipIntervalDots);
        charts.hideTooltip();
        d3.select(this).attr('r', (self.settings.isMinMax && max === d ||
            self.settings.isMinMax && min === d) ? (dotsize + 1) : dotsize);
      })
      .on(`contextmenu.${self.namespace}`, function (d) {
        const data = { value: d, name: (chartData[0].name || '') };
        if (self.settings.isMinMax && max === d) {
          data.highest = true;
        }
        if (self.settings.isMinMax && min === d) {
          data.lowest = true;
        }
        if (self.settings.isPeakDot && max === d) {
          data.peak = true;
        }
        charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], data);
      });

    /**
    * Fires when the sparkline is fully renders.
    *
    * @event close
    * @memberof About
    * @property {object} event - The jquery event object
    * @property {object} ui - The svg element.
    */
    this.element.trigger('rendered', svg);
    return this;
  },

  /**
   * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
   * @private
   * @param  {object} d the data element with the properties
   * @returns {object} Object with the calculated width and height
   */
  calculateAspectRatioFit(d) {
    const ratio = Math.min(d.maxWidth / d.srcWidth, d.maxHeight / d.srcHeight);
    return { width: d.srcWidth * ratio, height: d.srcHeight * ratio };
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    this.element.on(`updated.${COMPONENT_NAME}`, (e, settings) => {
      this.updated(settings);
    });

    if (this.settings.redrawOnResize) {
      $('body').on(`resize.${this.namespace}`, () => {
        this.handleResize();
      });

      this.element.on(`resize.${this.namespace}`, () => {
        this.handleResize();
      });
    }

    $('html').on(`themechanged.${this.namespace}`, () => {
      this.updated();
    });

    return this;
  },

  /*
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
   * @param  {object} settings The new settings object
   * @returns {object} The api for chaining.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    this.element.empty();

    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  teardown() {
    const events = arr => `${arr.join(`.${this.namespace} `)}.${this.namespace}`;

    if (this.element) {
      this.element.find('.medianrange').off(events(['mouseenter', 'mouseleave']));
      this.element.find('.point')
        .off(events(['mouseenter', 'mouseleave', 'contextmenu']));

      this.element.off(events(['updated', 'resize']));
    }
    $('body').off(`resize.${this.namespace}`);
    $('html').off(`themechanged.${this.namespace}`);

    delete this.namespace;
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    charts.removeTooltip();
    if (this.element) {
      this.element.empty().removeClass('sparkline');
      $.removeData(this.element[0], COMPONENT_NAME);
      $.removeData(this.element[0], 'chart');
    }
  }
};

export { Sparkline, COMPONENT_NAME };
