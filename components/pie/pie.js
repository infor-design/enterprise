/* eslint-disable no-nested-ternary, prefer-arrow-callback */
/* jshint esversion:6 */

// Other Shared Imports
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { charts } from '../charts/charts';

// Settings and Options
const COMPONENT_NAME = 'pie';

/**
* @namespace
* @property {array} dataset The data to use in the line/area/bubble.
* @property {boolean} isDonut If true it renders as a donut chart.
* @property {number} animationSpeed Controls the animation speed
* @property {boolean|string} animate true|false - will do or not do the animation.
* 'initial' will do only first time the animation.
* @property {boolean} showLegend If false the legend will be hidden.
* @property {boolean} redrawOnResize If true, the component will not resize when resizing the page.
*/
const PIE_DEFAULTS = {
  dataset: [],
  isDonut: false,
  animationSpeed: 600,
  animate: true,
  redrawOnResize: true,
  showLegend: true,
  colors: []
};

/**
 * A pie chart (or a circle chart) is a circular statistical graphic which is divided into slices
 * to illustrate numerical proportion. In a pie chart, the arc length of each slice is proportional
 * to the quantity it represents.
 * @class Pie
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 */
function Pie(element, settings) {
  this.settings = utils.mergeSettings(element, settings, PIE_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Pie.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The component prototype for chaining.
   */
  init() {
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
   * Build the Component.
   * @returns {object} The component prototype for chaining.
   * @private
   */
  build() {
    const self = this;

    self.svg = d3.select(this.element[0])
      .append('svg');

    self.mainGroup = self.svg.append('g');

    self.mainGroup.append('g').attr('class', 'slices');
    self.mainGroup.append('g').attr('class', 'labels');
    self.mainGroup.append('g').attr('class', 'lines');
    this.element.addClass('chart-pie');

    const dims = {
      height: parseInt(this.element.height(), 10),
      width: parseInt(this.element.width(), 10)
    };
    dims.radius = Math.min(dims.width, dims.height) / 2;
    self.dims = dims;

    self.pie = d3.pie()
      .sort(null)
      .value(function (d) {
        return d.value;
      });

    self.arc = d3.arc()
      .outerRadius(dims.radius * 0.75)
      .innerRadius(self.settings.isDonut ? dims.radius * 0.4 : 0);

    // Influences the label position
    self.outerArc = d3.arc()
      .innerRadius(dims.radius * 0.75)
      .outerRadius((dims.radius * 0.75 + 20));  // was 75 and 75 + 20

    self.svg
      .attr('width', '100%')
      .attr('height', '100%');

    self.mainGroup
      .attr('transform', `translate(${dims.width / 2},${dims.height / 2})`);

    // move the origin of the group's coordinate space to the center of the SVG element
    dims.center = { x: (dims.width / 2), y: dims.height / 2 };

    self.key = function (d) { return d.data.name; };
    const isEmpty = !self.settings.dataset || self.settings.dataset.length === 0;
    this.chartData = !isEmpty ? self.settings.dataset[0].data : [];
    this.sum = d3.sum(this.chartData, function (d) { return d.value; });

    // Calculate the percentages
    const values = this.chartData.map(function (d) { return d.value / self.sum * 100; });
    const rounded = this.roundLargestRemainer(values);

    this.chartData = this.chartData.map(function (d, i) {
      d.percent = d.value / self.sum;
      d.percentRound = rounded[i];
      return d;
    });

    let sum = 0;
    this.chartData.map(function (d) { // eslint-disable-line
      sum += d.percentRound;
    });

    // Handle zero sum or empty pies
    if (isEmpty || sum === 0) {
      this.chartData.push({ data: {}, color: '#BDBDBD', name: 'Empty-Pie', value: 100, percent: 1, percentRound: 100 });
    }

    self.update(this.chartData);
    charts.appendTooltip();

    if (this.settings.showLegend) {
      charts.addLegend([], 'pie', this.settings, this.element);
    }

    this.setInitialSelected();
    this.element.trigger('rendered');
    return this;
  },

  randomData() {
    const labels = this.colors.domain();
    return labels.map(function (label) {
      return { label, value: Math.random() };
    });
  },

  update(data) {
    // Pie Slices
    const self = this;
    const isEmpty = !self.settings.dataset || self.settings.dataset.length === 0;
    const slice = self.svg.select('.slices').selectAll('path.slice')
      .data(self.pie(data), self.key);

    slice.enter()
      .insert('path')
      .style('fill', function (d, i) {
        return charts.chartColor(self.isRTL ? self.chartData.length - (i - 1) : i, 'pie', d.data);
      })
      .attr('class', 'slice')
      .on('contextmenu', function (d) {
        // Handle Right Click Menu
        charts.triggerContextMenu(self.element, d3.select(this).select('path').nodes()[0], d);
      })
      .on('click', function (d, i) {
        // Handle Click to select
        const isSelected = this && d3.select(this).classed('is-selected');

        // Make unselected
        charts.setSelectedElement({
          task: isSelected ? 'unselected' : 'selected',
          container: self.element,
          selector: isSelected ? '.chart-container .is-selected' : this,
          isTrigger: !isSelected,
          d: d.data,
          i,
          type: self.settings.type,
          dataset: self.settings.dataset,
          svg: self.svg
        });

        if (isSelected) {
          self.element.triggerHandler('selected', [d3.select(this).nodes(), {}, i]);
        }
      })
      .on('mouseenter', function (d) {
        let x;
        let y;
        const offset = $(this).offset();
        let content = '';
        const show = function () {
          const size = charts.tooltipSize(content);
          const direction = (self.midAngle(d) < Math.PI ? 1 : -1);

          if (self.midAngle(d) < Math.PI) {
            x = x - (size.width / 2); //eslint-disable-line
            y = y - (size.height / 2); //eslint-disable-line
          } else {
            x = x + (size.width / 2); //eslint-disable-line
            y = y + (size.height / 2); //eslint-disable-line
          }
          console.log(direction, x, y, size);
          if (content !== '') {
            charts.showTooltip(x, y, content, 'top');
          }
        };

        const centerOutside = self.arc.centroid(d);
        x = offset.left + centerOutside[0];
        y = offset.top + centerOutside[1];

        content = d.data.tooltip || '';
        content = content.replace('{{percent}}', `${d.data.percentRound}%`);
        content = content.replace('{{value}}', d.value);
        content = content.replace('%percent%', `${d.data.percentRound}%`);
        content = content.replace('%value%', d.value);
        show();
      })
      .on('mouseleave', function () {
        charts.hideTooltip();
      })
      .merge(slice)
      .transition()
      .duration(self.settings.animationSpeed)
      .attrTween('d', function (d) {
        this.current = this.current || d;
        const interpolate = d3.interpolate(this.current, d);
        this.current = interpolate(0);
        return function (t) {
          return self.arc(interpolate(t));
        };
      });

    slice.exit()
      .remove();

    if (isEmpty) {
      return;
    }

    // Text Labels
    const text = self.svg.select('.labels').selectAll('text')
      .data(self.pie(data), self.key);

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .text(function (d) {
        const showValue = true;
        return showValue ? d3.format('.3f')(d.data.value) : d.data.label;
      })
      .merge(text)
      .transition()
      .duration(self.settings.animationSpeed)
      .attrTween('transform', function (d) {
        this.current = this.current || d;
        const interpolate = d3.interpolate(this.current, d);
        this.current = interpolate(0);
        return function (t) {
          const d2 = interpolate(t);
          const pos = self.outerArc.centroid(d2);
          pos[0] = self.dims.radius * (self.midAngle(d2) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        };
      })
      .styleTween('text-anchor', function (d) {
        this.current = this.current || d;
        const interpolate = d3.interpolate(this.current, d);
        this.current = interpolate(0);
        return function (t) {
          const d2 = interpolate(t);
          return self.midAngle(d2) < Math.PI ? 'start' : 'end';
        };
      });

    text.exit()
      .remove();

    // Slice to text poly lines
    const polyline = self.svg.select('.lines').selectAll('polyline')
      .data(self.pie(data), self.key);

    polyline.enter()
      .append('polyline')
      .merge(polyline)
      .transition()
      .duration(self.settings.animationSpeed)
      .attrTween('points', function (d) {
        this.current = this.current || d;
        const interpolate = d3.interpolate(this.current, d);
        this.current = interpolate(0);
        return function (t) {
          const d2 = interpolate(t);
          const pos = self.outerArc.centroid(d2);
          pos[0] = self.dims.radius * 0.95 * (self.midAngle(d2) < Math.PI ? 1 : -1);
          return [self.outerArc.centroid(d2), self.outerArc.centroid(d2), pos];
        };
      });

    polyline.exit()
      .remove();

    // Dot at the end of the polyline
    /* const dots = self.svg.select('.lines').selectAll('polyline')
      .data(self.pie(data), self.key);

    dots.enter()
      .append('circle')
      .merge(dots)
      .transition()
      .duration(self.settings.animationSpeed)
      .attr('r', '4')
      .attr('cx', function (d) {
        return 10;
      })
      .attr('cy', function (d) {
        return 10;
      });

    dots.exit()
      .remove(); */
  },

  /**
   * Set the initially selected elements
   * @private
   */
  setInitialSelected() {

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

    if (this.settings.redrawOnResize) {
      $('body').on(`resize.${COMPONENT_NAME}`, () => {
        this.handleResize();
      });

      this.element.on(`resize.${COMPONENT_NAME}`, () => {
        this.handleResize();
      });
    }

    return this;
  },

  width: 0,

  /*
   * Get info on the currently selected lines.
   * @returns {object} An object with the matching data and reference to the triggering element.
   */
  getSelected() {
    return charts.selected;
  },

  /*
   * Get info on the currently selected lines.
   */
  setSelected(options, isToggle) {
    const internals = {
      svg: this.svg,
      chartData: this.settings.dataset,
      isStacked: false,
      isGrouped: false,
      isSingle: false
    };
    charts.setSelected(options, isToggle, internals);
  },

  /*
   * Get info on the currently selected lines.
   */
  toggleSelected(options) {
    this.setSelected(options, true);
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
    this.element.empty();

    return this
      .teardown()
      .init();
  },

  /**
   * Handle updated settings and values.
   * @param  {array} values A list of values
   * @returns {array} The values rounded to 100
   */
  roundLargestRemainer(values) {
    let sum = 0;
    let count = 0;
    let dVala = 0;
    let dValb = 0;
    const order = [];

    // Round everything down
    for (let i = 0; i < values.length; i++) {
      sum += parseInt(values[i], 10);
      order[i] = i;
    }

    // Getting the difference in sum and 100
    const diff = 100 - sum;

    // Distributing the difference by adding 1 to items in decreasing order of their decimal parts
    order.sort(function (a, b) {
      dVala = values[a] - parseInt(values[a], 10);
      dValb = values[b] - parseInt(values[b], 10);
      return dValb - dVala;
    });

    values.sort(function (a, b) {
      dVala = a - parseInt(a, 10);
      dValb = b - parseInt(b, 10);
      return dValb - dVala;
    });

    for (let j = 0; j < values.length; j++) {
      count = j;
      if (count < diff) {
        values[j] = parseInt(values[j], 10) + 1;
      } else {
        values[j] = parseInt(values[j], 10);
      }
    }

    // Set back the order
    const unsorted = [];
    for (let i = 0; i < values.length; i++) {
      unsorted[order[i]] = values[i];
    }
    return unsorted;
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    $(window).off(`resize.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Calculate the middle angle.
   * @param  {object} d The d3 data.
   * @returns {boolean} The mid angule
   */
  midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  },

  /**
   * Teardown - Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.element.empty().removeClass('pie-chart');
    charts.removeTooltip();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    $.removeData(this.element[0], 'chart');
  }
};

export { Pie, COMPONENT_NAME };
