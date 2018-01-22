/* eslint-disable no-loop-func */
/* jshint esversion:6 */

// Other Shared Imports
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { charts } from '../charts/charts';

// Settings and Options
const COMPONENT_NAME = 'bullet';

/**
* @namespace
* @property {array} dataset The data to use in the chart.
* @property {boolean|string} animate true|false - will do or not do the animation.
* 'initial' will do only first time the animation.
* @property {string} tooltip Tooltip conetnts
*/
const BULLET_DEFAULTS = {
  dataset: []
};

/**
 * A bullet graph is a variation of a bar graph developed by Stephen Few.
 * Seemingly inspired by the traditional thermometer charts and progress bars found in many
 * dashboards, the bullet graph serves as a replacement for dashboard gauges and meters.
 * @class Bullet
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 */
function Bullet(element, settings) {
  this.settings = utils.mergeSettings(element, settings, BULLET_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Bullet.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @returns {object} The bullet chart prototype for chaining.
   */
  init() {
    // Do initialization. Build or Events ect
    return this
      .build()
      .handleEvents();
  },

  /**
   * Build the Bullet Chart.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    const chartData = this.settings.dataset[0];
    this.element.addClass('bullet-chart');

    let tooltipInterval = 0;
    const tooltipDataCache = [];
    let tooltipData = chartData.data[0] ? chartData.data[0].tooltip : [];

    // Append the SVG into its parent area.
    let noMarkers = false;
    const parent = this.element.parent();
    const margin = { top: 30, right: 55, bottom: 35, left: 55 };
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

    for (let i = 0; i < chartData.data.length; i++) {
      const duration = this.settings.animate ? 600 : 0;
      const barHeight = 20;
      const rowData = chartData.data[i];
      const ranges = rowData.ranges.slice().sort(d3.descending);
      let markers = (rowData.markers ? rowData.markers.slice().sort(d3.descending) : []);
      const measures = (rowData.measures ? rowData.measures.slice().sort(d3.descending) : []);
      const rangesAsc = rowData.ranges.slice().sort(d3.ascending);
      let markersAsc = (rowData.markers ? rowData.markers.slice().sort(d3.ascending) : []);
      const measuresAsc = (rowData.measures ? rowData.measures.slice().sort(d3.ascending) : []);

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
        .text(() => rowData.title);

      text.append('tspan')
        .attr('class', 'subtitle')
        .attr('dx', '15px')
        .text(() => rowData.subtitle);

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

      range.enter().append('rect')
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
        .on('click', () => {
          const bar = d3.select(this);
          this.element.trigger('selected', [bar, chartData.data[bar.attr('data-idx')]]);
        })
        .on('mouseenter', (d) => {
          const bar = d3.select(this);
          const data = chartData.data[bar.attr('data-idx')];
          const rect = this.getBoundingClientRect();
          let content = `<p>${d}</p>`;

          const show = function () {
            const size = charts.getTooltipSize(content);
            const x = rect.left + rect.width - (size.width / 2);
            const y = rect.top - size.height + $(window).scrollTop() - 5;

            if (content !== '') {
              charts.showTooltip(x, y, content, 'top');
            }
          };

          if (data.tooltip && data.tooltip[i]) {
            content = data.tooltip[data.tooltip.length - i - 1];
          }

          if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[i]) {
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
        .on('mouseleave', () => {
          clearInterval(tooltipInterval);
          charts.hideTooltip();
        });

      range.transition()
        .duration(duration)
        .attr('width', w1);

      // Update the measure rects.
      const measure = g.selectAll('rect.measure')
        .data(measures);

      measure.enter().append('rect')
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
        .attr('y', 8.5);

      measure.transition()
        .duration(duration)
        .attr('width', w1);

      // Update the marker lines.
      const marker = g.selectAll('line.marker')
        .data(markers);

      marker.enter().append('line')
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
        .attr('y2', barHeight * 5 / 6);

      marker.transition()
        .duration(duration)
        .attr('x1', x1)
        .attr('x2', x1)
        .attr('y1', barHeight / 6)
        .attr('y2', barHeight * 5 / 6);

      // Difference
      const diff = (markers[0] > measures[0] ? '-' : '+') + Math.abs(markers[0] - measures[0]);

      if (Math.abs(markers[0] - measures[0]) !== 0) {
        marker.enter().append('text')
          .attr('class', 'inverse')
          .attr('text-anchor', 'middle')
          .attr('y', barHeight / 2 + 4)
          .attr('dx', charts.isRTL ? '-20px' : '20px')
          .attr('x', 0)
          .text(diff);

        marker.transition()
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
        .text(d => d);

      // Transition the entering ticks to the new scale, x1.
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
    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      this.updated();
    });

    return this;
  },

  /**
   * Handle updated settings and values.
   * @returns {[type]} [description]
   */
  updated() {
    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off(`updated.${BULLET_DEFAULTS}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], BULLET_DEFAULTS);
  }
};

export { Bullet, COMPONENT_NAME };
