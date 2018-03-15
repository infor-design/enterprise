// Other Shared Imports
import * as debug from '../utils/debug';
import { utils, math } from '../utils/utils';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'bar';

/**
 * A bar chart or bar graph is a chart or graph that presents categorical data with rectangular bars
 * with heights or lengths proportional to the values that they represent. This is adapated from
 * http://jsfiddle.net/datashaman/rBfy5/2/
 * @class Bar
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 * 
 * @param {array} [settings.dataset=[]] The data to use in the line/area/bubble.
 * @param {boolean} [settings.isStacked=true] Default is a single or stacked chart.
 * @param {boolean} [settings.isNormalized=false] If true its a 100% bar chart
 * @param {boolean} [settings.isGrouped=false] If true its a grouped bar chart
 * @param {boolean} [settings.showLegend=true] If false the legend will not be shown.
 * @param {boolean|string} [settings.animate=true] true|false - will do or not do the animation, 'initial' will do only first time the animation.
 * @param {boolean} [settings.redrawOnResize=true] If true, the component will not resize when resizing the page.
 * @param {string} [settings.formatterString] Use d3 format some examples can be found on http://bit.ly/1IKVhHh
 * @param {string} [settings.format=true] The d3 axis format
 * @param {string} [settings.tooltip=null] A tooltip for the whole chart
 * @param {boolean} [settings.useLogScale=false] If true log scale is enabled.
 * @param {object} [settings.ticks=null] Settings for the chart ticks. Can set ticks: {format: d3Format, number: n}
 * @param {boolean} [settings.showLines=true] Show the in the axis lines or not.
 * @param {number} [settings.labelFactor=1.27] How far out than the outer circle should the labels be placed, this may be useful to adjust for some labels.
 * @param {number} [settings.wrapWidth=60] The number of pixels after which a label needs to be given a new line. You may want to change this based on label data.
 * @param {object} [settings.emptyMessage={ title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }] An empty message will be displayed when there is no chart data. This accepts an object of the form emptyMessage: `{title: 'No Data Available',  info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data',  button: {text: 'xxx', click: <function>}  }` Set this to null for no message or will default to 'No Data Found with an icon.'
 */

const BAR_DEFAULTS = {
  dataset: [],
  isStacked: true,
  isNormalized: false,
  isGrouped: false,
  showLegend: true,
  animate: true,
  format: null,
  redrawOnResize: true,
  tooltip: null,
  useLogScale: false,
  ticks: null,
  showLines: true,
  labelFactor: 1.27,
  wrapWidth: 60,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }
};

function Bar(element, settings) {
  this.settings = utils.mergeSettings(element, settings, BAR_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Bar.prototype = {

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

    /**
    * Fires when the chart is complete done rendering, for customization.
    * @event rendered
    * @memberof Bar
    * @param {object} event - The jquery event object
    * @param {array} svg - The svg object.
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
    const self = this;
    const isFormatter = !!this.settings.formatterString;
    const format = function (value) {
      return isFormatter ? d3.format(self.settings.formatterString)(value) : value;
    };

    let maxTextWidth;
    let yMap;
    let isGrouped;
    let legendMap;
    let gindex;
    let totalBarsInGroup;
    let totalGroupArea;
    let totalHeight;
    let gap;
    let barHeight;

    let tooltipInterval;
    const tooltipDataCache = [];
    const tooltipData = self.settings.tooltip;

    let maxBarHeight = 30;
    const legendHeight = 40;
    const gapBetweenGroups = 0.5; // As of one bar height (barHeight * 0.5)
    const isViewSmall = this.element.parent().width() < 450;

    const margins = {
      top: self.settings.isStacked ? 30 : 20,
      left: 30,
      right: 30,
      bottom: 30 // 30px plus size of the bottom axis (20)
    };

    let dataset = this.settings.dataset;
    this.element.addClass('bar-chart');

    // Handle Empty Data Set
    if (dataset.length === 0) {
      self.element.emptymessage(self.settings.emptyMessage);
      return this;
    }

    // const width = parseInt(this.element.parent().width(), 10) - margins.left - margins.right;
    const height = parseInt(this.element.parent().height(), 10) - margins.top - margins.bottom -
      legendHeight; // influences the bar width

    // Get the Legend Series'
    const series = dataset.map(function (d) { //eslint-disable-line
      return { name: d.name, color: d.color, pattern: d.pattern };
    });

    // Map the Data Sets and Stack them.
    const yStack = { y1: [], y2: [] };
    dataset = dataset.map(function (d, i) {  //eslint-disable-line
      return d.data.map(function (o, i2) { //eslint-disable-line
        let y0 = 0;
        if (i === 0) {
          yStack.y1.push(o.value);
          yStack.y2.push(0);
        } else {
          y0 = yStack.y1[i2] + yStack.y2[i2];
          yStack.y1[i2] = o.value;
          yStack.y2[i2] = y0;
        }
        return $.extend({}, o, {  //eslint-disable-line
          y0,
          y: o.value,
          x: o.name,
          color: o.color,
          pattern: o.pattern
        });
      });
    });

    // Calculate max text width
    maxTextWidth = 0;
    dataset = dataset.map(function (group, i) { // eslint-disable-line
      if (!self.settings.isStacked) {
        if (series[i]) {
          maxTextWidth = (series[i].name.length > maxTextWidth ?
            series[i].name.length : maxTextWidth);
        }
      }
      return group.map(function (d) { // eslint-disable-line
        if (self.settings.isStacked) {
          maxTextWidth = (d.x.length > maxTextWidth ? d.x.length : maxTextWidth);
        }

        // Invert the x and y values, and y0 becomes x0
        return $.extend({}, d, {
          x: d.y,
          y: d.x,
          x0: d.y0,
          color: d.color,
          pattern: d.pattern
        });
      });
    });

    const h = parseInt(this.element.parent().height(), 10) - margins.bottom -
      (self.settings.isStacked ? 0 : (legendHeight / 2));
    const w = parseInt(this.element.parent().width(), 10) - margins.left;
    const textWidth = margins.left + (maxTextWidth * 6);

    self.svg = d3.select(this.element[0])
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('class', 'group')
      .attr('transform', `translate(${textWidth},${margins.top})`);

    let xMin = d3.min(dataset, function (group) { //eslint-disable-line
      return d3.min(group, function (d) { //eslint-disable-line
        return self.settings.isStacked ? (d.x + d.x0) : d.x;
      });
    });

    let xMax = d3.max(dataset, function (group) { //eslint-disable-line
      return d3.max(group, function (d) { //eslint-disable-line
        return self.settings.isStacked ? (d.x + d.x0) : d.x;
      });
    });

    if (self.settings.isStacked && self.settings.isNormalized) {
      const gMax = [];
      // get the max for each array group
      dataset.forEach(function (d) {  //eslint-disable-line
        d.forEach(function (d, i) {  //eslint-disable-line
          gMax[i] = (gMax[i] === undefined ? 0 : gMax[i]) + d.x;
        });
      });

      // Normalize Each Group
      dataset.forEach(function (d) {   //eslint-disable-line
        d.forEach(function (d, i) {  //eslint-disable-line
          const xDif = gMax[i] / 100;
          d.x /= xDif;
          d.x0 /= xDif;
        });
      });
      xMax = 100;
    }

    // Width of the bar minus the margin
    const barWith = w - textWidth - margins.left;
    let xScale;

    if (self.settings.useLogScale) {
      xScale = d3.scaleLog()
        .domain([(xMin > 0 ? xMin : 1), xMax])
        .range([1, barWith])
        .nice();
    } else {
      xScale = d3.scaleLinear()
        .domain([(xMin < 0 ? xMin : 0), xMax])
        .range([0, barWith])
        .nice();
    }

    if (self.settings.isStacked) {
      yMap = dataset[0].map(d => d.y);

      barHeight = 0.32;
    } else {
      yMap = series.map(d => d.name);

      (function () {
        let i;
        let l;
        let lm;
        // Loop backwards to catch and override with found first custom info from top
        for (i = dataset.length - 1, l = -1; i > l; i--) {
          lm = dataset[i].map(d => d);
          $.extend(true, legendMap, lm);
          // Convert back to array from object
          legendMap = $.map(legendMap, d => d);
        }
      }());

      gindex = 0;
      totalBarsInGroup = legendMap.length;
      totalGroupArea = height / yMap.length;
      barHeight = totalGroupArea / totalBarsInGroup;
      totalHeight = totalBarsInGroup > 1 ?
        totalGroupArea - (barHeight * gapBetweenGroups) : maxBarHeight;
      gap = totalGroupArea - totalHeight;
      maxBarHeight = totalHeight / totalBarsInGroup;
      barHeight = 0;
    }

    const yScale = d3.scaleBand()
      .domain(yMap)
      .rangeRound([0, height])
      .padding(barHeight, barHeight); // TODO

    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickSize(-height); //  .orient('middle') ??

    if (isViewSmall) {
      xAxis.ticks(textWidth < 100 ? 5 : 3);
    }

    if (self.settings.isStacked && self.settings.isNormalized) {
      xAxis.tickFormat(d => `${d}%`);
    }

    if (self.settings.useLogScale) {
      xAxis.ticks(10, ',.1s');

      if (self.settings.showLines === false) {
        xAxis.tickSize(0);
      }
    }

    if (self.settings.ticks) {
      xAxis.ticks(self.settings.ticks.number, self.settings.ticks.format);
    }

    const yAxis = d3.axisLeft()
      .scale(yScale)
      .tickPadding(15)
      .tickSize(0);

    self.svg.append('g')
      .attr('class', 'axis x')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    self.svg.append('g')
      .attr('class', 'axis y')
      .call(yAxis);

    const groups = self.svg.selectAll('g.group')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'series-group')
      .attr('data-group-id', (d, i) => i);

    self.settings.isGrouped = (self.svg.selectAll('.series-group').nodes().length > 1 && !self.settings.isStacked);
    self.settings.isSingle = (self.svg.selectAll('.series-group').nodes().length === 1 && self.settings.isStacked);

    groups.selectAll('rect')
      .data((d, i) => {
        d.forEach((d3) => {
          d3.index = i;

          if (!self.settings.isStacked) {
            d3.gindex = gindex++;
          }
        });
        return d;
      })
      .enter()
      .append('rect')
      .attr('class', (d, i) => `bar series-${i}`)
      .style('fill', (d, i) => (self.settings.isStacked ? // eslint-disable-line
        (series.length === 1 ? (charts.chartColor(i, 'bar-single', d)) :  // eslint-disable-line
          (charts.chartColor(d.index, 'bar', series[d.index]))) : // eslint-disable-line
        (charts.chartColor(i, 'bar', legendMap[i])))) // eslint-disable-line
      .attr('mask', (d, i) => {
        if (dataset.length === 1 && dataset[0][i].pattern) {
          return `url(#${dataset[0][i].pattern})`;
        } else if (self.settings.isStacked && series[d.index].pattern) {
          return `url(#${series[d.index].pattern})`;
        } else if (!self.settings.isStacked && legendMap[i].pattern) {
          return `url(#${legendMap[i].pattern})`;
        }
        return '';
      })
      .attr('x', (d) => {
        if (self.settings.useLogScale) {
          return 0;
        }
        return (self.settings.isStacked && !self.settings.isSingle) ? xScale(d.x0) : xScale(0);
      })
      .attr('y', d => (self.settings.isStacked ? yScale(d.y) :
        ((((totalGroupArea - totalHeight) / 2) + (d.gindex * maxBarHeight)) + (d.index * gap))))
      .attr('height', () => (self.settings.isStacked ? (yScale.bandwidth()) : maxBarHeight))
      .attr('width', 0) // Animated in later
      .on('mouseenter', function (d, i) {
        let j;
        let l;
        let hexColor;
        let total = 0;
        const totals = [];
        let content = '';
        const data = d3.select(this.parentNode).datum();
        const mid = Math.round(data.length / 2);
        let shape = d3.select(this);
        const setPattern = function (pattern, hexColor2) {
          return !pattern || !hexColor2 ? '' :
            `${'<svg width="12" height="12">' +
            '<rect style="fill: '}${hexColor2}" mask="url(#${pattern})" height="12" width="12" />` +
          '</svg>';
        };

        const show = function (xPosS, yPosS, isTooltipBottom) {
          const size = charts.tooltipSize(content);
          const x = xPosS + (parseFloat(shape.attr('width')) / 2) - (size.width / 2);
          const y = isTooltipBottom ? yPosS : (yPosS - size.height - 13);

          if (content !== '') {
            charts.showTooltip(x, y, content, isTooltipBottom ? 'bottom' : 'top');
          }
        };

        if (dataset.length === 1) {
          content = `<p><b>${d.y} </b>${d.x}</p>`;
        } else {
          content = '<div class="chart-swatch">';

          if (self.settings.isStacked) {
            for (j = 0, l = dataset.length; j < l; j++) {
              total = 0;
              hexColor = charts.chartColor(j, 'bar', series[j]);
              for (let k = 0, kl = dataset.length; k < kl; k++) {
                total += dataset[k][i].x;
                totals[k] = dataset[k][i].x;
              }
              content += `${'' +
                '<div class="swatch-row">' +
                  '<div style="background-color:'}${series[j].pattern ? 'transparent' : hexColor};">${
                setPattern(series[j].pattern, hexColor)
              }</div>` +
                  `<span>${series[j].name}</span><b> ${isFormatter ? format(totals[j]) : (`${Math.round((totals[j] / total) * 100)}%`)} </b>` +
                '</div>';
            }
          } else {
            if (mid > 1) {
              shape = d3.select(this.parentNode).select(`.series-${mid}`);
            }
            for (j = 0, l = data.length; j < l; j++) {
              hexColor = charts.chartColor(j, 'bar', legendMap[j]);
              content += `${'' +
                '<div class="swatch-row">' +
                  '<div style="background-color:'}${legendMap[j].pattern ? 'transparent' : hexColor};">${
                setPattern(legendMap[j].pattern, hexColor)
              }</div>` +
                  `<span>${data[j].name}</span><b>${format(data[j].value)}</b>` +
                '</div>';
            }
          }
          content += '</div>';
        }

        if (total > 0) {
          content = `<span class="chart-tooltip-total"><b>${total}</b> ${Locale.translate('Total')}</span>${content}`;
        }

        const yPosS = shape.nodes()[0].getBoundingClientRect().top + $(window).scrollTop();
        const xPosS = shape.nodes()[0].getBoundingClientRect().left + $(window).scrollLeft();

        const maxBarsForTopTooltip = 6;
        const isTooltipBottom = (!self.settings.isStacked && (data.length > maxBarsForTopTooltip));

        if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[i]) {
          content = '';
          let runInterval = true;
          tooltipInterval = setInterval(() => {
            if (runInterval) {
              runInterval = false;
              tooltipData((data2) => {
                content = data2;
                tooltipDataCache[i] = data2;
              });
            }
            if (content !== '') {
              clearInterval(tooltipInterval);
              show(xPosS, yPosS, isTooltipBottom);
            }
          }, 10);
        } else {
          content = tooltipDataCache[i] || tooltipData || d.tooltip || content || '';
          show(xPosS, yPosS, isTooltipBottom);
        }
      })
      .on('mouseleave', () => {
        clearInterval(tooltipInterval);
        charts.hideTooltip();
      })
      .on('click', function (d, i) {
        const isSelected = this && d3.select(this).classed('is-selected');
        const thisGroupId = parseInt(d3.select(this.parentNode).attr('data-group-id'), 10);

        charts.setSelectedElement({
          task: (isSelected ? 'unselected' : 'selected'),
          container: self.element,
          selector: this,
          isTrigger: !isSelected,
          triggerGroup: self.settings.isGrouped,
          d,
          i,
          type: self.settings.type,
          dataset,
          isSingle: self.isSingular,
          isGrouped: self.settings.isGrouped,
          isStacked: self.settings.isStacked,
          svg: self.svg,
          clickedLegend: self.settings.clickedLegend
        });

        if (isSelected) {
          self.element.triggerHandler('selected', [d3.select(this).nodes(), {}, (isGrouped ? thisGroupId : i)]);
        }
      });

    // Adjust the labels
    self.svg.selectAll('.axis.y text').attr({ x: charts.isRTL ? 15 : -15 });
    self.svg.selectAll('.axis.x text').attr('class', d => (d < 0 ? 'negative-value' : 'positive-value'));

    if (charts.isRTL && charts.isIE) {
      self.svg.selectAll('text').attr('transform', 'scale(-1, 1)');
      self.svg.selectAll('.y.axis text').style('text-anchor', 'start');
    }

    if (isViewSmall && self.settings.useLogScale) {
      const ticks = d3.selectAll('.x .tick text');
      let foundMid = false;

      // At small breakpoint hide the last ones
      ticks.attr('class', function (d, i) {
        let middleTick = Math.round(ticks.size() / 2);

        if (i >= middleTick && !foundMid && d.toString().startsWith('1')) {
          foundMid = true;
          middleTick = d;
        }

        if (i !== 0 && i !== ticks.size() - 1 &&
          (self.settings.useLogScale ? d !== middleTick : i !== middleTick)) {
          d3.select(this).remove();
        }
      });
    }

    // Set x-axix tick css class
    self.svg.selectAll('.x.axis .tick').attr('class', d => `tick${d === 0 ? ' tick0' : ''}`);

    // Animate the Bars In
    self.svg.selectAll('.bar')
      .transition().duration(self.settings.animate ? 600 : 0)
      .attr('width', (d) => {
        let scale = xScale(d.x);
        let scale0 = xScale(0);

        if (isNaN(scale) || !math.isFinite(scale)) {
          scale = 0;
        }

        if (isNaN(scale0) || !math.isFinite(scale0)) {
          scale0 = 0;
        }

        return Math.abs(scale - scale0);
      })
      .attr('x', (d) => {
        if (self.settings.useLogScale) {
          return 0;
        }
        return (self.settings.isStacked && !self.settings.isSingle) ? xScale(d.x0) :  //eslint-disable-line
          (d.x < 0 ? xScale(d.x) : xScale(0));
      });

    self.settings.svg = self.svg;

    // Add Legends
    if (self.settings.showLegend) {
      charts.addLegend(
        (self.settings.isStacked ? series : legendMap),
        self.settings.type,
        self.settings,
        this.element
      );
      // charts.addLegend(self.settings.isStacked ? series : legendMap);
    }
    charts.appendTooltip();

    this.setInitialSelected();
    this.element.trigger('rendered');
    return this;
  },

  /**
   * Set the initially selected elements
   * @private
   */
  setInitialSelected() {
    let selected = 0;
    const self = this;
    const legendsNode = self.svg.node().parentNode.nextSibling;
    const legends = d3.select(legendsNode);
    const isLegends = legends.node() && legends.classed('chart-legend');
    let barIndex;
    let selector;
    let isStackedGroup;

    const setSelectedBar = function (g) {
      g = g ? d3.select(g) : self.svg;
      g.selectAll('.bar').each(function (d, i) {
        if (!d) {
          return;
        }
        if (d.selected && selected < 1) {
          selected++;
          selector = d3.select(this);
          barIndex = i;
        }
      });
    };

    const setSelectedGroup = function () {
      const groups = self.svg.selectAll('.series-group');
      if (groups.nodes().length) { // eslint-disable-line
        groups.each(function () {
          setSelectedBar(this);
        });
      }
    };

    if (self.settings.isGrouped || (self.settings.isStacked && !self.settings.isSingle)) {
      self.settings.dataset.forEach((d, i) => {
        if (d.selected && selected < 1) {
          selected++;
          selector = self.svg.select(`[data-group-id="${i}"]`).select('.bar');
          barIndex = i;
          if (self.settings.isStacked && !self.settings.isGrouped) {
            isStackedGroup = true;
          }
        }
      });
      if (selected < 1) {
        setSelectedGroup();
      }
    } else {
      setSelectedBar();
    }

    if (selected > 0) {
      if (isStackedGroup) {
        if (isLegends) {
          $(legends.selectAll('.chart-legend-item')[0][barIndex]).trigger('click.chart');
        }
      } else {
        selector.on('click').call(selector.node(), selector.datum(), barIndex);
      }
    }
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
      isStacked: this.settingsisStacked,
      isGrouped: this.settings.isGrouped,
      isSingle: this.settings.isSingle
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

    if (settings && settings.dataset) {
      this.settings.dataset = settings.dataset;
    }
    this.element.empty();

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
    this.element.off(`updated.${COMPONENT_NAME}`);
    $(window).off(`resize.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.element.empty().removeClass('bar-chart');
    charts.removeTooltip();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    $.removeData(this.element[0], 'chart');
  }
};

export { Bar, COMPONENT_NAME };
