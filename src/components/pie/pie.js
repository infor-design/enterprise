/* eslint-disable no-nested-ternary, prefer-arrow-callback */
// Other Shared Imports
import * as debug from '../../utils/debug';
import { Environment as env } from '../../utils/environment';
import { utils } from '../../utils/utils';
import { charts } from '../charts/charts';
import { theme } from '../theme/theme';
import { Locale } from '../locale/locale';

import '../emptymessage/emptymessage.jquery';

// Settings and Options
const COMPONENT_NAME = 'pie';

/**
 * A pie chart (or a circle chart) is a circular statistical graphic which is divided
  into slices to illustrate numerical proportion. In a pie chart, the arc length of each slice is proportional to the quantity it represents.
 * @class Pie
 * @constructor
 *
 * @param {jquery[]|htmlelement} element The plugin element for the constuctor
 * @param {object} [settings] The component settings.
 * @param {array} [settings.dataset] The data to use in the line/area/bubble.
 * @param {boolean} [settings.isDonut=false] If true it renders as a donut chart.
 * @param {boolean} [settings.redrawOnResize=true]  If set to false the component will not redraw when the page or parent is resized. There is tooltip values provided.
  It will not be shown. If you still want lines at the lower breakpoint you can set this to true
 * @param {boolean} [settings.hideCenterLabel=false] If false the center label will not be shown.
 * @param {boolean} [settings.showLines=true] If false connector lines wont be shown
 * @param {boolean} [settings.showLinesMobile=false] This defaults to false, when false and under 450px the lines
 * @param {object} [settings.lines] A setting that controls the line values and format.
 * @param {string} [settings.line.show='value'] Controls the line value, this can be value, label or percent or custom function.
 * @param {string} [settings.line.formatter='.0f'] The d3.formatter string.
 * @param {boolean} [settings.showLegend=true] If false the legend will not be shown.
 * @param {boolean} [settings.showMobile=false] If true the chart is better formed to fit in a single widget.
 * @param {string} [settings.legendPlacement='right'] Where to locate the legend. This can be bottom or right at the moment.
 * @param {object} [settings.legend] A setting that controls the legend values and format.
 * @param {string} [settings.legend.show='label (percent)'] Controls what is visible
  in the legend, this can be value, value (percent), label or percent or your own custom function.
 * @param {string} [settings.legend.formatter='.0f'] The d3.formatter string.
 * @param {boolean} [settings.showTooltips=true] If false now tooltips will be shown
 * @param {object} [settings.tooltip] A setting that controls the tooltip values and format.
 * @param {string} [settings.tooltip.show='label (value)'] Controls what is visible in
  the tooltip, this can be value, label or percent or custom function.
 * @param {string} [settings.tooltip.formatter='.0f'] The d3.formatter string.
 * @param {object} [settings.emptyMessage] An empty message will be displayed when there is no chart data.
 * This accepts an object of the form emptyMessage:
 * `{title: 'No Data Available',
 *  info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data',
 *  button: {text: 'xxx', click: <function>}
 *  }`
 *  Set this to null for no message or will default to 'No Data Found with an icon.'
 */

const PIE_DEFAULTS = {
  dataset: [],
  isDonut: false,
  redrawOnResize: true,
  hideCenterLabel: false,
  showLines: true,
  showLinesMobile: false,
  lines: {
    show: 'value', // value, label or percent or custom function
    formatter: '.0f'
  },
  showLegend: true,
  legendPlacement: 'right', // Can be bottom or right
  legend: {
    show: 'label (percent)', // value, label, label (percent) or percent or custom function
    formatter: '.0f'
  },
  showTooltips: true,
  tooltip: {
    show: 'label (value)', // value, label, label (value) or percent or custom function
    formatter: '.0f'
  },
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }
};

function Pie(element, settings) {
  this.settings = utils.mergeSettings(element, settings, PIE_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
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
    this.namespace = utils.uniqueId({ classList: [this.settings.type, 'chart'] });
    this.width = 0;
    this.isFirefox = env.browser.name === 'firefox';

    // Handle Empty Data Set
    if (this.settings.dataset.length === 0) {
      this.element.emptymessage(this.settings.emptyMessage);
      return this;
    }

    this.initialSelectCall = false;

    this
      .build()
      .handleEvents();

    /**
     * Fires when the chart is complete done rendering, for customization.
     * @event rendered
     * @memberof Pie
     * @property {object} event - The jquery event object
     * @property {object} svg - The svg object.
     */
    this.element.trigger('rendered', [this.svg]);

    return this;
  },

  /**
   * Build the Component.
   * @private
   * @returns {object} The component prototype for chaining.
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

    if (this.settings.showMobile) {
      this.settings.legendPlacement = 'bottom';
    }

    if (self.settings.legendPlacement) {
      this.element.addClass(`has-${self.settings.legendPlacement}-legend`);
    }

    const w = parseInt(this.element.width(), 10);
    const h = parseInt(this.element.height(), 10);

    const dims = {
      height: h,
      width: w
    };

    if ((this.settings.lines.show === 'label' && this.settings.legendPlacement === 'bottom') ||
      (this.settings.lines.show === 'label' && this.settings.showLegend === 'false')) {
      self.mainGroup
        .attr('transform', `translate(${dims.width * 0.67777}, ${dims.height / 2})`);
    }

    if (self.settings.legendPlacement === 'right') {
      dims.width = w * 0.75;
    }

    if (this.settings.showMobile) {
      dims.height = h * 0.80; // make some more room for the legend
      this.element.addClass('is-mobile');
    }

    let heightAdjusted = 0;
    if (this.settings.legendPlacement === 'bottom' && dims.width < 360 && !this.settings.showMobile) {
      heightAdjusted = 35;
      this.element.closest('.widget-content').css({
        height: 'auto',
        'min-height': 'auto'
      });
      $(this.svg.node()).css({ 'min-height': 195 });
      dims.height = parseInt(this.element.height(), 10) + heightAdjusted;
    }

    dims.radius = Math.min(dims.width, dims.height) / 2;
    self.dims = dims;

    self.pie = d3.pie()
      .sort(null)
      .value(function (d) {
        return d.value;
      });

    self.arc = d3.arc()
      .outerRadius(dims.radius * 0.75)
      .innerRadius(self.settings.isDonut ? dims.radius * 0.5 : 0);

    // Influences the label position
    self.outerArc = d3.arc()
      .innerRadius(dims.radius * 0.75)
      .outerRadius((dims.radius * 0.75 + 20));

    self.svg
      .attr('width', self.settings.legendPlacement === 'right' ? '75%' : '100%')
      .attr('height', self.settings.showMobile ? '80%' : '100%');

    self.mainGroup
      .attr('transform', `translate(${dims.width / 2},${((dims.height - heightAdjusted) / 2)})`);

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
    if (isEmpty || sum === 0 || isNaN(sum)) {
      const palette = theme.themeColors().palette;
      this.chartData.push({ data: {}, color: palette.graphite['30'].value, name: 'Empty-Pie', value: 100, percent: 1, percentRound: 100 });
    }

    self.updateData(self.chartData);
    if (self.settings.showTooltips) {
      charts.appendTooltip('is-pie');
    }

    if (this.settings.showLegend) {
      const series = self.chartData.map(function (d) {
        let name = charts.formatToSettings(d, self.settings.legend);

        if (self.settings.legendFormatter) {
          name = `${d.name} (${d3.format(self.settings.legendFormatter)(d.value)})`;
        }

        if (d.name === 'Empty-Pie') {
          name = '';
        }
        return { name, display: 'twocolumn', placement: self.settings.legendPlacement, color: d.color };
      });

      this.settings.svg = self.svg;
      charts.addLegend(series, 'pie', this.settings, this.element);
      const setClass = heightAdjusted > 0 ? 'addClass' : 'removeClass';
      this.element.find('.chart-legend')[setClass]('adjusted-height');
    }

    this.setInitialSelected();
    this.addCenterLabel();
    this.element.trigger('rendered');
    return this;
  },

  /**
   * Randomize the data for testing.
   * @private
   * @param  {boolean} toZero Set them all to zero value.
   * @returns {void}
   */
  randomize(toZero) {
    const self = this;
    this.chartData = this.chartData.map(function (d) {
      d.value = toZero ? 0 : Math.random();
      return d;
    });

    this.sum = d3.sum(this.chartData, function (d) { return d.value; });
    const values = this.chartData.map(function (d) { return d.value / self.sum * 100; });
    const rounded = this.roundLargestRemainer(values);

    this.chartData = this.chartData.map(function (d, i) {
      d.percent = d.value / self.sum;
      d.percentRound = rounded[i];
      return d;
    });

    return this.chartData;
  },

  /**
   * Add the center label for donut chart.
   * @private
   * @returns {void}
   */
  addCenterLabel() {
    const self = this;

    if (self.settings.isDonut && !self.settings.hideCenterLabel) {
      const centerLabel = self.settings.dataset[0].centerLabel;
      const arcs = self.svg.selectAll('.slices');

      arcs
        .append('text')
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .attr('class', 'chart-donut-text')
        .html(centerLabel);

      // FIX: IE does not render .html
      // http://stackoverflow.com/questions/13962294/dynamic-styling-of-svg-text
      if (charts.isIE && !charts.isIEEdge) {
        if (utils.isHTML(centerLabel)) {
          const text = arcs.select('.chart-donut-text');
          const tmp = document.createElement('text');

          tmp.innerHTML = centerLabel;

          const nodes = Array.prototype.slice.call(tmp.childNodes);
          nodes.forEach(function (node) {
            text.append('tspan')
              .attr('style', node.getAttribute && node.getAttribute('style'))
              .attr('x', node.getAttribute && node.getAttribute('x'))
              .attr('dy', node.getAttribute && node.getAttribute('dy'))
              .text(node.textContent);
          });
        } else {
          arcs.select('.chart-donut-text').text(centerLabel);
        }
      }
    }
  },

  /**
   * Update the chart with a new dataset
   * @param  {object} data The data to use.
   * @returns {void}
   */
  updateData(data) {
    // Pie Slices
    const self = this;
    const isPersonalizable = this.element.closest('.is-personalizable').length > 0;
    let tooltipInterval;
    const isEmpty = !self.settings.dataset || self.settings.dataset.length === 0;
    const slice = self.svg.select('.slices').selectAll('path.slice')
      .data(self.pie(data), self.key);

    const getOffset = (node) => {
      const body = document.body;
      let rect;

      // Fix: With firefox `getBoundingClientRect` not working if node is hidden
      if (self.isFirefox && self.settings.dotSize === 0) {
        const dot = d3.select(node);
        dot.attr('r', 2);
        rect = node.getBoundingClientRect();
        dot.attr('r', self.settings.dotSize);
      } else {
        rect = node.getBoundingClientRect();
      }
      return {
        top: rect.top + body.scrollTop,
        left: rect.left + body.scrollLeft
      };
    };

    self.isRTL = Locale.isRTL();

    slice.enter()
      .insert('path')
      .style('fill', function (d, i) {
        return charts.chartColor(i, 'pie', d.data);
      })
      .attr('class', 'slice')
      .on(`contextmenu.${self.namespace}`, function (d) {
        charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d);
        // charts.triggerContextMenu(self.element, d3.select(this).select('path').nodes()[0], d);
      })
      .on(`click.${self.namespace}`, function (d, i) {
        clearTimeout(tooltipInterval);
        // Handle Click to select
        const isSelected = this && d3.select(this).classed('is-selected');

        // Make unselected
        charts.setSelectedElement({
          task: isSelected ? 'unselected' : 'selected',
          container: self.element,
          selector: isSelected ? '.chart-container .is-selected' : this,
          isTrigger: self.initialSelectCall ? false : !isSelected,
          d: d.data,
          i,
          type: self.settings.type,
          dataset: self.settings.dataset,
          svg: self.svg
        });

        if (isSelected && !self.initialSelectCall) {
          /**
           * Fires when arc/slice is selected.
           * @event selected
           * @memberof Pie
           * @property {object} event - The jquery event object
           * @property {object} selected arc/slice.
           * @property {object} data of selected arc/slice.
           * @property {number} index of selected arc/slice.
           */
          self.element.triggerHandler('selected', [d3.select(this).nodes(), {}, i]);
        }
      })
      .on(`mouseenter.${self.namespace}`, function (d, i) {
        if (!self.settings.showTooltips) {
          return;
        }
        // See where to position
        const dot = self.svg.selectAll('circle').nodes()[i];
        const offset = getOffset(dot);

        // See where we want the arrow
        const rads = self.midAngle(d);

        // https://www.wyzant.com/resources/lessons/math/trigonometry/unit-circle
        const isTop = (rads <= (Math.PI / 4) && rads >= 0) || rads > (7 * Math.PI / 4);
        const isRight = rads <= (3 * Math.PI / 4) && rads >= (Math.PI / 4);
        const isBottom = rads <= (5 * Math.PI / 4) && rads >= (3 * Math.PI / 4);
        const isLeft = rads <= (7 * Math.PI / 4) && rads >= (5 * Math.PI / 4);

        // Build the content
        let content = '';
        const show = function () {
          if (content === '') {
            return;
          }

          const size = charts.tooltipSize(content);
          let x = offset.left;
          let y = offset.top;
          const padding = 5;

          if (charts.tooltip && charts.tooltip.length && (isTop || isRight || isBottom || isLeft)) {
            charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
          }

          if (isTop) {
            x -= size.width / 2;
            y -= size.height - padding;
            charts.showTooltip(x, y, content, 'top');
          }
          if (isRight) {
            y -= size.height / 2;
            charts.showTooltip(x, y, content, 'right');
          }
          if (isBottom) {
            x -= size.width / 2;
            // y -= padding;
            charts.showTooltip(x, y, content, 'bottom');
          }
          if (isLeft) {
            x -= size.width - padding;
            y -= size.height / 2;
            charts.showTooltip(x, y, content, 'left');
          }
        };

        const value = charts.formatToSettings(d, self.settings.tooltip);
        content = d.data.tooltip || value;
        content = content.replace('{{percent}}', `${d.data.percentRound}%`);
        content = content.replace('{{value}}', d.value);
        content = content.replace('%percent%', `${d.data.percentRound}%`);
        content = content.replace('%value%', d.value);

        if (content.indexOf('<b>') === -1) {
          content = content.replace('(', '<b>');
          content = content.replace(')', '</b>');
        }

        // Debounce it a bit
        if (tooltipInterval != null) {
          clearTimeout(tooltipInterval);
        }

        tooltipInterval = setTimeout(function () {
          show();
        }, 300);
      })
      .on(`mouseleave.${self.namespace}`, function () {
        clearTimeout(tooltipInterval);
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

    const isMobile = self.element.parent().width() < 520;
    let shouldShow = self.settings.showLines;

    if (!self.settings.showLinesMobile && shouldShow) {
      shouldShow = !isMobile;
    }

    self.settings.dotSize = shouldShow ? 2 : 0;

    // Text Labels
    if (shouldShow) {
      const padding = 20;
      const text = self.svg.select('.labels').selectAll('text')
        .data(self.pie(data), self.key);

      text.enter()
        .append('text')
        .attr('dy', '.35em')
        .text(function (d) {
          return isMobile ? d.data.shortName : charts.formatToSettings(d, self.settings.lines);
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
            pos[0] -= (self.midAngle(d2) < Math.PI ? padding : -padding);
            return `translate(${pos})`;
          };
        })
        .styleTween('text-anchor', function (d) {
          this.current = this.current || d;
          const interpolate = d3.interpolate(this.current, d);
          this.current = interpolate(0);
          return function (t) {
            const d2 = interpolate(t);

            if (self.isRTL) {
              return self.midAngle(d2) > Math.PI ? 'start' : 'end';
            }

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
            pos[0] = self.dims.radius * 0.85 * (self.midAngle(d2) < Math.PI ? 1 : -1);
            return [self.outerArc.centroid(d2), self.outerArc.centroid(d2), pos];
          };
        });

      polyline.exit()
        .remove();
    }

    const dots = self.svg.select('.lines').selectAll('circle')
      .data(self.pie(data), self.key);

    dots.enter()
      .append('circle')
      .attr('class', 'circles')
      .attr('r', self.settings.dotSize)
      .merge(dots)
      .transition()
      .duration(self.settings.animationSpeed)
      .attrTween('transform', function (d) {
        this.current = this.current || d;
        const interpolate = d3.interpolate(this.current, d);
        this.current = interpolate(0);
        return function (t) {
          const d2 = interpolate(t);
          return `translate(${self.outerArc.centroid(d2)} )`;
        };
      });

    dots.exit()
      .remove();
  },

  /**
   * Set the initially selected elements
   * @private
   * @returns {void}
   */
  setInitialSelected() {
    const self = this;
    let selected = 0;
    let selector;

    this.svg.selectAll('.slice').each(function (d, i) {
      if (!d || !d.data) {
        return;
      }

      if (d.data.selected && selected < 1) {
        selected++;
        self.initialSelectCall = true;
        selector = d3.select(this);
        selector.on(`click.${self.namespace}`).call(selector.node(), selector.datum(), i);
      }
    });
    this.initialSelectCall = false;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
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

  /**
   * Get info on the currently selected lines.
   * @private
   * @returns {object} An object with the matching data and reference to the triggering element.
   */
  getSelected() {
    return charts.selected;
  },

  /**
   * Get info on the currently selected lines.
   * @private
   * @param {object} o The selection data object
   * @param {boolean} isToggle If true toggle the current state.
   */
  setSelected(o, isToggle) {
    const self = this;
    let selector;
    let arcIndex;
    let selected = 0;
    const equals = utils.equals;

    this.svg.selectAll('.slice').each(function (d, i) {
      if (!d || !d.data) {
        return;
      }

      if (selected < 1) {
        if ((typeof o.fieldName !== 'undefined' &&
              typeof o.fieldValue !== 'undefined' &&
                o.fieldValue === d.data[o.fieldName]) ||
            (typeof o.index !== 'undefined' && o.index === i) ||
            (o.data && equals(o.data, self.chartData[i].data)) ||
            (o.elem && $(this).is(o.elem))) {
          selected++;
          selector = d3.select(this);
          arcIndex = i;
        }
      }
    });

    if (selected > 0 && (isToggle || !selector.classed('is-selected'))) {
      selector.on(`click.${self.namespace}`).call(selector.node(), selector.datum(), arcIndex);
    }
  },

  /**
   * Get info on the currently selected lines.
   * @param {object} options The selected info object.
   * @returns {void}
   */
  toggleSelected(options) {
    this.setSelected(options, true);
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

    this.element.empty();

    return this
      .build()
      .element.trigger('rendered', [this.svg]);
  },

  /**
   * Handle updated settings and values.
   * @private
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
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  teardown() {
    const events = arr => `${arr.join(`.${this.namespace} `)}.${this.namespace}`;

    if (this.element) {
      this.element.find('.slice')
        .off(events(['mouseenter', 'mouseleave', 'click', 'contextmenu']));

      this.element.off(events(['updated', 'resize']));
    }
    $('body').off(`resize.${this.namespace}`);
    $('html').off(`themechanged.${this.namespace}`);

    delete this.namespace;
    return this;
  },

  /**
   * Calculate the middle angle.
   * @private
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
    this.teardown();
    charts.removeTooltip();
    if (this.element) {
      this.element.empty().removeClass('pie-chart');
      $.removeData(this.element[0], COMPONENT_NAME);
      $.removeData(this.element[0], 'chart');
    }
  }
};

export { Pie, COMPONENT_NAME };
