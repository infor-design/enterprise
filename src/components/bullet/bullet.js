/* eslint-disable no-loop-func, no-underscore-dangle */

// Other Shared Imports
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { charts } from '../charts/charts';

// Settings and Options
const COMPONENT_NAME = 'bullet';

/**
 * A bullet graph is a variation of a bar graph developed by Stephen Few.
 * Seemingly inspired by the traditional thermometer charts and progress bars found in many
 * dashboards, the bullet graph serves as a replacement for dashboard gauges and meters.
 * @class Bullet
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {array} [settings.dataset.data] The data to use in the chart.
 * @param {array} [settings.dataset.data.tooltip] Tooltip contents for each point.
 * @param {boolean|string} [settings.animate=true] true|false - will do or not do the animation, 'initial' will do only first time the animation.
 * @param {boolean} [settings.redrawOnResize=true] If set to false the component will not redraw when the page or parent is resized.
 * @param {object} [settings.format] The format element.
 * @param {string|function} [settings.format.ranges] The `d3` formatter string or callback function.
 * @param {string|function} [settings.format.difference] The `d3` formatter string or callback function.
 */
const BULLET_DEFAULTS = {
  dataset: [],
  animate: false,
  redrawOnResize: true,
  format: {
    ranges: null,
    difference: null
  }
};

function Bullet(element, settings) {
  this.settings = utils.mergeSettings(element, settings, BULLET_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Bullet.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The bullet chart prototype for chaining.
   */
  init() {
    this.namespace = utils.uniqueId({ classList: [this.settings.type, 'chart'] });
    this.width = 0;

    // Do initialization. Build or Events ect
    this
      .build()
      .handleEvents();

    // Handle initial option
    if (this.settings.animate === 'initial') {
      this.settings.animate = false;
    }

    return this;
  },

  /**
   * Build the Bullet Chart.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    const chartData = this.settings.dataset[0];
    const isPersonalizable = this.element.closest('.is-personalizable').length > 0;

    this.element.addClass('bullet-chart');

    let tooltipInterval = 0;
    const tooltipDataCache = [];
    let tooltipData = chartData.data[0] ? chartData.data[0].tooltip : [];

    // Append the SVG into its parent area.
    let noMarkers = false;
    const parent = this.element.parent();
    const margin = { top: 30, right: 35, bottom: 35, left: 40 };
    const width = parent.width() - margin.left - margin.right;
    let height = parent.height() - margin.top - margin.bottom - 30; // 30 for legend

    height = height < 0 ? 50 : height; // default minimum height

    const svg = d3.select(this.element[0]).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    function bulletWidth(x) {
      const x0 = x(0);
      return function (d) {
        return Math.abs(x(d) - x0);
      };
    }

    // Prepare the format callback function
    const formatCallback = (type, d, i) => {
      function callback(func, d2, i2) {
        const results = func(d2, i2);
        return typeof results !== 'undefined' ? results : d2;
      }
      if (chartData.format && typeof chartData.format[type] === 'function') {
        return callback(chartData.format[type], d, i);
      } if (chartData.format && typeof chartData.format[type] === 'string') {
        return d3.format(chartData.format[type])(d);
      } if (this.settings.format && typeof this.settings.format[type] === 'function') {
        return callback(this.settings.format[type], d, i);
      } if (this.settings.format && typeof this.settings.format[type] === 'string') {
        return d3.format(this.settings.format[type])(d);
      }
      return d;
    };

    // Set format functions
    const format = {
      ranges: (d, i) => formatCallback('ranges', d, i),
      difference: d => formatCallback('difference', d),
    };

    const isSingle = chartData.data.length === 1;
    for (let i = 0; i < chartData.data.length; i++) {
      const duration = this.settings.animate ? 400 : 0;
      const barHeight = 20;
      const self = this;
      const rowData = chartData.data[i];
      const ranges = rowData.ranges.slice().sort(d3.descending);
      let markers = (rowData.markers ? rowData.markers.slice().sort(d3.descending) : []);
      const measures = (rowData.measures ? rowData.measures.slice().sort(d3.descending) : []);
      const rangesAsc = rowData.ranges.slice().sort(d3.ascending);
      let markersAsc = (rowData.markers ? rowData.markers.slice().sort(d3.ascending) : []);
      const measuresAsc = (rowData.measures ? rowData.measures.slice().sort(d3.ascending) : []);
      const groupSuffix = isSingle ? '' : `-group${i}`;

      if (markers.length === 0) {
        markers = measures;
        markersAsc = measuresAsc;
        noMarkers = true;
      }

      const g = svg.append('g')
        .attr('class', 'bullet')
        .attr('transform', `translate(0, ${i * (barHeight * 3.5)})`);

      // Add Title and Subtitle
      const title = g.append('g');

      const text = title.append('text')
        .attr('class', 'title')
        .attr('dy', '-10px')
        .text(() => rowData.title)
        .call((d) => {
          const node = d._groups[0][0];
          utils.addAttributes($(node), chartData, chartData.attributes, `title${groupSuffix}`);
        });

      text.append('tspan')
        .attr('class', 'subtitle')
        .attr('dx', '15px')
        .text(() => rowData.subtitle)
        .call((d) => {
          const node = d._groups[0][0];
          utils.addAttributes($(node), chartData, chartData.attributes, `subtitle${groupSuffix}`);
        });

      const maxAll = Math.max(ranges[0], markers[0], measures[0]);
      let minAll = Math.min(rangesAsc[0], markersAsc[0], measuresAsc[0]);

      minAll = minAll < 0 ? minAll : 0;

      // Compute the new x-scale.
      const x1 = d3.scaleLinear()
        .domain([minAll, maxAll])
        .range([0, width])
        .nice();

      // Derive width-scales from the x-scales.
      const w1 = bulletWidth(x1);

      // Update the range rects.
      const range = g.selectAll('rect.range')
        .data(ranges);

      const delay = 200;
      let prevent = false;
      let timer = 0;
      // Make sure the default to get prevent not bubble up.
      self.element
        .off(`dblclick.${self.namespace}`)
        .on(`dblclick.${self.namespace}`, '*', (e) => {
          e.stopImmediatePropagation();
        });

      range.enter().append('rect')
        .call((d) => {
          d._groups.forEach((thisRanges) => {
            thisRanges.forEach((thisRange, idx) => {
              utils.addAttributes($(thisRange), chartData, chartData.attributes, `range${idx}${groupSuffix}`);
            });
          });
        })
        .attr('class', (d, a) => `range s${a}`)
        .attr('data-idx', i)
        .attr('width', 0)
        .attr('x', d => x1(d < 0 ? d : 0))
        .style('fill', (d, b) => {
          if (chartData.barColors) {
            return chartData.barColors[b];
          }
          return '';
        })
        .attr('height', barHeight)
        // Click and double click events
        // Use very slight delay to fire off the normal click action
        // It alow to cancel when the double click event happens
        .on(`click.${self.namespace}`, function () {
          const bar = d3.select(this);
          timer = setTimeout(() => {
            if (!prevent) {
              // Run click action
              self.element.trigger('selected', [bar, chartData.data[bar.attr('data-idx')]]);
            }
            prevent = false;
          }, delay);
        })
        .on(`dblclick.${self.namespace}`, function () {
          const bar = d3.select(this);
          clearTimeout(timer);
          prevent = true;
          // Run double click action
          self.element.trigger('dblclick', [bar, chartData.data[bar.attr('data-idx')]]);
        })
        .on(`mouseenter.${self.namespace}`, function (event, d, mouseEnterIdx) {
          const bar = d3.select(this);
          const data = chartData.data[bar.attr('data-idx')];
          const rect = this.getBoundingClientRect();
          let content = `<p>${format.ranges(d, mouseEnterIdx)}</p>`;

          const show = function () {
            const size = charts.tooltipSize(content);
            const x = rect.left + rect.width - (size.width / 2);
            const y = rect.top - size.height + $(window).scrollTop() - 5;

            if (content !== '') {
              if (charts.tooltip && charts.tooltip.length) {
                charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
              }
              charts.showTooltip(x, y, content, 'top');
            }
          };

          if (data.tooltip && data.tooltip[mouseEnterIdx]) {
            content = data.tooltip[data.tooltip.length - mouseEnterIdx - 1];
          }

          if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[mouseEnterIdx]) {
            content = '';
            let runInterval = true;
            tooltipInterval = setInterval(() => {
              if (runInterval) {
                runInterval = false;
                tooltipData((da) => {
                  content = da;
                  tooltipDataCache[i] = da;
                });
              }
              if (content !== '') {
                clearInterval(tooltipInterval);
                show();
              }
            }, 10);
          } else {
            tooltipData = typeof tooltipData === 'object' ? '' : tooltipData;
            content = tooltipDataCache[i] || tooltipData || content || '';
            show();
          }
        })
        .on(`mouseleave.${self.namespace}`, () => {
          clearInterval(tooltipInterval);
          charts.hideTooltip();
        })
        .on(`contextmenu.${self.namespace}`, function (event, d) {
          charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d, event);
        })
        .merge(range)
        .transition()
        .duration(duration)
        .attr('width', w1);

      // Update the measure rects.
      const measure = g.selectAll('rect.measure')
        .data(measures);

      measure.enter().append('rect')
        .call((d) => {
          d._groups.forEach((thisMeasures) => {
            thisMeasures.forEach((thisMeasure, idx) => {
              utils.addAttributes($(thisMeasure), chartData, chartData.attributes, `measure${idx}${groupSuffix}`);
            });
          });
        })
        .attr('class', (d, k) => `measure s${k}`)
        .attr('width', 0)
        .attr('height', 3)
        .attr('x', d => x1(d < 0 ? d : 0))
        .style('fill', (d, j) => {
          if (chartData.lineColors) {
            return chartData.lineColors[j];
          }
          return '';
        })
        .attr('y', 8.5)
        .merge(measure)
        .transition()
        .duration(duration)
        .attr('width', w1);

      // Update the marker lines.
      const isSingleMarker = markers.length === 1;
      const marker = g.selectAll('line.marker')
        .data(markers);

      marker.enter().append('line')
        .call((d) => {
          d._groups.forEach((thisMarkers) => {
            thisMarkers.forEach((thisMarker, idx) => {
              const suffix = isSingleMarker ? `marker${groupSuffix}` : `marker${idx}${groupSuffix}`;
              utils.addAttributes($(thisMarker), chartData, chartData.attributes, suffix);
            });
          });
        })
        .attr('class', (noMarkers ? 'hidden' : 'marker'))
        .attr('x1', 0)
        .attr('x2', 0)
        .style('stroke', (d, l) => {
          if (chartData.markerColors) {
            return chartData.markerColors[l];
          }
          return '';
        })
        .attr('y1', barHeight / 6)
        .attr('y2', barHeight * 5 / 6)
        .merge(marker)
        .transition()
        .duration(duration)
        .attr('x1', x1)
        .attr('x2', x1)
        .attr('y1', barHeight / 6)
        .attr('y2', barHeight * 5 / 6);

      // Difference
      const diff = (markers[0] > measures[0] ? '-' : '+') + Math.abs(markers[0] - measures[0]);

      if (Math.abs(markers[0] - measures[0]) !== 0) {
        marker.enter().append('text')
          .call((d) => {
            const node = d._groups[0][0];
            utils.addAttributes($(node), chartData, chartData.attributes, `difference${groupSuffix}`);
          })
          .attr('class', 'inverse')
          .attr('text-anchor', 'middle')
          .attr('y', barHeight / 2 + 4)
          .attr('dx', charts.isRTL ? '-20px' : '20px')
          .attr('x', 0)
          .text(format.difference(diff))
          .merge(marker)
          .transition()
          .duration(duration)
          .attr('x', () => {
            let total = 0;

            g.selectAll('.measure').each((d) => {
              const w = w1(d);
              const x = x1(d);

              if (w > total) {
                total = w;
              }

              if (x > total) {
                total = x;
              }
            });

            return charts.isRTL ? -total : total;
          })
          .style('opacity', 1);
      }

      // Update the tick groups.
      const tick = g.selectAll('g.tick')
        .data(x1.ticks(8));

      // Initialize the ticks with the old scale, x0.
      const tickEnter = tick.enter().append('g')
        .attr('class', 'tick')
        .attr('transform', 'translate(0,0)')
        .style('opacity', 0);

      tickEnter.append('line')
        .attr('y1', barHeight)
        .attr('y2', Math.round((barHeight * 7) / 4.7));

      tickEnter.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.1em')
        .attr('y', Math.round((barHeight * 7) / 4.7))
        .attr('class', d => (d < 0 ? 'negative-value' : 'positive-value'))
        .text((d, k) => format.ranges(d, k));

      // Transition the entering ticks to the new scale, x1
      tickEnter.transition()
        .duration(duration)
        .attr('transform', d => `translate(${x1(d)},0)`)
        .style('opacity', 1);

      if (charts.isRTL && charts.isIE) {
        svg.selectAll('text').attr('transform', 'scale(-1, 1)');
      }
    }

    charts.appendTooltip();
    this.element.trigger('rendered');

    return this;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    this.element.on(`updated.${this.namespace}`, () => {
      this.updated();
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
   * @param  {object} settings The new settings to use.
   * @returns {object} The api for chaining.
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
    if (settings && settings.dataset) {
      this.settings.dataset = settings.dataset;
    }
    this.element.empty();

    return this
      .build();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    const events = arr => `${arr.join(`.${this.namespace} `)}.${this.namespace}`;

    if (this.element) {
      this.element.find('.range')
        .off(events(['mouseenter', 'mouseleave', 'click', 'contextmenu']));

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
      this.element.empty().removeClass('bullet-chart');
      $.removeData(this.element[0], COMPONENT_NAME);
      $.removeData(this.element[0], 'chart');
    }
  }
};

export { Bullet, COMPONENT_NAME };
