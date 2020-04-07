// Other Shared Imports
import * as debug from '../../utils/debug';
import { utils, math } from '../../utils/utils';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';

import '../emptymessage/emptymessage.jquery';

// Settings and Options
const COMPONENT_NAME = 'bar';

/**
 * A bar chart or bar graph is a chart or graph that presents categorical data with rectangular bars
 * with heights or lengths proportional to the values that they represent. This is adapated from
 * http://jsfiddle.net/datashaman/rBfy5/2/
 * @class Bar
 * @param {string} element The plugin element for the constuctor.
 * @param {string} [settings] The settings element.
 * @param {array} [settings.dataset=[]] The data to use in the line/area/bubble.
 * @param {boolean} [settings.isStacked=true] Default is a single or stacked chart.
 * @param {boolean} [settings.isNormalized=false] If true its a 100% bar chart
 * @param {boolean} [settings.isGrouped=false] If true its a grouped bar chart
 * @param {boolean} [settings.showLegend=true] If false the legend will not be shown.
 * @param {boolean|string} [settings.animate=true] true|false - will do or not do the animation, 'initial' will do only first time the animation.
 * @param {boolean} [settings.redrawOnResize=true]  If set to false the component will not redraw when the page or parent is resized.
 * @param {string} [settings.formatterString] Use d3 format some examples can be found on http://bit.ly/1IKVhHh
 * @param {string} [settings.format=true] The d3 axis format
 * @param {string} [settings.tooltip=null] A tooltip for the whole chart
 * @param {boolean} [settings.useLogScale=false] If true log scale is enabled.
 * @param {object} [settings.ticks=null] Settings for the chart ticks. Can set ticks: {format: d3Format, number: n}
 * @param {boolean} [settings.showLines=true] Show the in the axis lines or not.
 * @param {number} [settings.labelFactor=1.27] How far out than the outer circle should the labels be placed, this
 * may be useful to adjust for some labels.
 * @param {number} [settings.wrapWidth=60] The number of pixels after which a label needs to be given a new line.
 * You may want to change this based on label data.
 * @param {object} [settings.emptyMessage={
 *  title: (Locale ? Locale.translate('NoData') : 'No Data Available'),
 *   info: '',
 *  icon: 'icon-empty-no-data' }]
 * An empty message will be displayed when there is no chart data. This accepts an object of the form emptyMessage:
 * `{title: 'No Data Available',
 *  info: 'Make a selection on the list above to see results'
 *  icon: 'icon-empty-no-data',
 *  button: {text: 'xxx', click: <function>}  }`
 * Set this to null for no message or will default to 'No Data Found with an icon.'
 */
const BAR_DEFAULTS = {
  dataset: [],
  isStacked: true,
  isNormalized: false,
  isGrouped: false,
  showLegend: true,
  animate: true,
  longText: false,
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
    this.namespace = utils.uniqueId({ classList: [this.settings.type, 'chart'] });
    this.width = 0;
    this.initialSelectCall = false;
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
    const isRTL = Locale.isRTL();
    const isPersonalizable = this.element.closest('.is-personalizable').length > 0;
    const isFormatter = !!this.settings.formatterString;
    const format = function (value) {
      return isFormatter ? d3.format(self.settings.formatterString)(value) : value;
    };

    let maxTextWidth;
    let yMap;
    let isGrouped;
    let legendMap = [];
    let gindex;
    let totalBarsInGroup;
    let totalGroupArea;
    let totalHeight;
    let gap;
    let barHeight;

    let tooltipInterval;
    const tooltipDataCache = [];
    const tooltipData = self.settings.tooltip;

    let barSpace = 0;
    let maxBarHeight = 30;
    const legendHeight = 30;
    const gapBetweenGroups = 0.6; // Makes it one bar in height (barHeight * 0.5)
    const isViewSmall = this.element.parent().width() < 450;
    const smallViewport = innerWidth <= 480;
    const mediumViewport = innerWidth >= 481 && innerWidth <= 992;
    const largeViewport = innerWidth > 992;
    let dataset = this.settings.dataset;
    this.dataset = dataset;

    const margins = {
      top: 20,
      left: 30,
      right: 30,
      bottom: dataset.length === 1 ? 5 : 30
    };
    if (self.settings.isGrouped && dataset.length === 1) {
      margins.bottom = 30;
      barSpace = 2;
    }

    this.element.addClass('bar-chart');
    if (this.settings.isGrouped) {
      this.element.addClass('bar-chart-grouped');
    }

    if (this.settings.isStacked) {
      this.element.addClass('bar-chart-stacked');
    }

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

    const isLongText = this.settings.longText;
    const h = parseInt(this.element.parent().height(), 10) - margins.bottom -
      (self.settings.isStacked ? 0 : (legendHeight / 2));
    const w = parseInt(this.element.parent().width(), 10) - margins.left;
    let textWidth;

    if (smallViewport) {
      textWidth = margins.left + maxTextWidth * 1;
    } else if (mediumViewport) {
      textWidth = margins.left + maxTextWidth * 4;
    } else if (largeViewport) {
      textWidth = margins.left + maxTextWidth * 6;
    }

    if (!isLongText) {
      textWidth = margins.left + maxTextWidth * 6;
    }

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

    if (self.settings.ticks && !self.settings.useLogScale) {
      if (smallViewport) {
        xAxis.ticks(self.settings.ticks.smallNumber, self.settings.ticks.format);
      } else if (mediumViewport) {
        xAxis.ticks(self.settings.ticks.mediumNumber, self.settings.ticks.format);
      } else if (largeViewport) {
        xAxis.ticks(self.settings.ticks.largeNumber, self.settings.ticks.format);
      }
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

    self.settings.isGrouped = (self.svg.selectAll('.series-group').nodes().length > 1 && !self.settings.isStacked) || (self.settings.isGrouped && dataset.length === 1);
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
        } else if (!self.settings.isStacked && legendMap[i] && legendMap[i].pattern) {
          return `url(#${legendMap[i].pattern})`;
        }
        return '';
      })
      .attr('x', (d) => {
        if (self.settings.useLogScale) {
          return 0;
        }
        return (self.settings.isStacked && !self.settings.isSingle) ?
          xScale(d.x0) + 1 : xScale(0) + 1;
      })
      .attr('y', d => (self.settings.isStacked ? yScale(d.y) :
        ((((totalGroupArea - totalHeight) / 2) + ((d.gindex * maxBarHeight) + (d.gindex * barSpace))) + (d.index * gap)))) // eslint-disable-line
      .attr('height', () => (self.settings.isStacked ? (yScale.bandwidth()) : maxBarHeight))
      .attr('width', 0) // Animated in later
      .on(`mouseenter.${self.namespace}`, function (d, i) {
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
            `<svg width="12" height="12"><rect mask="url(#${pattern})" height="12" width="12" /></svg>`;
        };

        const show = function (xPosS, yPosS, isTooltipBottom) {
          const size = charts.tooltipSize(content);
          const x = xPosS + (parseFloat(shape.attr('width')) / 2) - (size.width / 2);
          const y = isTooltipBottom ? yPosS : (yPosS - size.height - 13);

          if (content !== '') {
            if (charts.tooltip && charts.tooltip.length) {
              charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
            }
            charts.showTooltip(x, y, content, isTooltipBottom ? 'bottom' : 'top');
          }
        };

        // Replace matched pattern in given string
        const replaceMatch = (str, callback, expr) => {
          if (typeof expr === 'undefined' || expr === null) {
            expr = /{{(\w+)}}/g;
          } else if (typeof expr === 'string') {
            expr = new RegExp(expr, 'g');
          }
          if (typeof str === 'string' && typeof callback === 'function' && expr instanceof RegExp) {
            let max = 9999;
            while (expr.test(str) && max > 0) {
              str = str.replace(expr, (match, key) => callback(match, key));
              max--;
            }
          }
          return str;
        };

        // Replace key/value and set type as string
        const replaceMatchAndSetType = () => {
          if (typeof content === 'string') {
            content = replaceMatch(content, (match, key) => format(d[key]));
          } else if (typeof content === 'number') {
            content = content.toString();
          }
        };

        // Set custom tooltip callback method
        const setCustomTooltip = (method) => {
          content = '';
          const args = { index: i, data: d };
          const req = (res) => {
            if (typeof res === 'string' || typeof res === 'number') {
              content = res;
              replaceMatchAndSetType();
              tooltipDataCache[i] = content;
            }
          };
          let runInterval = true;
          tooltipInterval = setInterval(() => {
            if (runInterval) {
              runInterval = false;
              method(req, args);
            }

            if (content !== '') {
              clearInterval(tooltipInterval);
              show();
            }
          }, 10);
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
              content += `<div class="swatch-row">
                  <div class="swatch-color">${setPattern(series[j].pattern, hexColor)}</div>
                  <span>${series[j].name}</span>
                  <b> ${isFormatter ? format(totals[j]) : (`${Math.round((totals[j] / total) * 100)}%`)} </b>
                </div>`;
            }
          } else {
            if (mid > 1) {
              shape = d3.select(this.parentNode).select(`.series-${mid}`);
            }
            for (j = 0, l = data.length; j < l; j++) {
              hexColor = charts.chartColor(j, 'bar', legendMap[j]);
              content += `<div class="swatch-row">
                    <div class="swatch-color">${setPattern(legendMap[j].pattern, hexColor)}</div>
                  <span>${data[j].name}</span><b>${format(data[j].value)}</b>
                </div>`;
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
          content = tooltipDataCache[i] || tooltipData || content || '';
          if (!tooltipDataCache[i] && d.tooltip !== false &&
            typeof d.tooltip !== 'undefined' && d.tooltip !== null) {
            if (typeof d.tooltip === 'function') {
              setCustomTooltip(d.tooltip);
            } else {
              content = d.tooltip.toString();
              replaceMatchAndSetType();
              tooltipDataCache[i] = content;
            }
          }
          if (typeof content === 'string' && content !== '') {
            show(xPosS, yPosS, isTooltipBottom);
          }

          // set inline colors
          if (self.settings.isStacked) {
            for (j = 0, l = dataset.length; j < l; j++) {
              hexColor = charts.chartColor(j, 'bar', series[j]);

              const row = $('#svg-tooltip').find('.swatch-row').eq(j);
              if (!series[j].pattern) {
                row.find('div').css('background-color', hexColor);
              }
              row.find('rect').css('fill', hexColor);
            }
          } else {
            for (j = 0, l = data.length; j < l; j++) {
              hexColor = charts.chartColor(j, 'bar', legendMap[j]);

              const row = $('#svg-tooltip').find('.swatch-row').eq(j);
              if (!legendMap[j].pattern) {
                row.find('div').css('background-color', hexColor);
              }
              row.find('rect').css('fill', hexColor);
            }
          }
        }
      })
      .on(`mouseleave.${self.namespace}`, () => {
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
          isTrigger: self.initialSelectCall ? false : !isSelected,
          triggerGroup: self.settings.isGrouped,
          d,
          i,
          type: self.settings.type,
          dataset: self.settings.dataset,
          isSingle: self.isSingular,
          isGrouped: self.settings.isGrouped,
          isStacked: self.settings.isStacked,
          svg: self.svg,
          clickedLegend: self.settings.clickedLegend
        });

        if (isSelected && !self.initialSelectCall) {
          self.element.triggerHandler('selected', [d3.select(this).nodes(), {}, (isGrouped ? thisGroupId : i)]);
        }
      })
      .on(`contextmenu.${self.namespace}`, function (d) {
        charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d);
      });

    // Adjust the labels
    self.svg.selectAll('.axis.y text').attr('x', () => (isRTL ? 15 : -15));
    self.svg.selectAll('.axis.x text').attr('class', d => (d < 0 ? 'negative-value' : 'positive-value'));

    if (isRTL && (charts.isIE || charts.isIEEdge)) {
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
        return (self.settings.isStacked && !self.settings.isSingle) ? xScale(d.x0) + 1 :  //eslint-disable-line
          (d.x < 0 ? xScale(d.x) + 1 : xScale(0) + 1);
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
    this.setTextValues();
    this.element.trigger('rendered');
    return this;
  },

  /**
   * Set the text value in three viewport of bar chart
   * @private
   */
  setTextValues() {
    if (this.settings.isGrouped) {
      // These are TODO, as you need a different structure since its using the group name
      return;
    }

    const elems = this.element[0].querySelectorAll('.bar-chart .axis.y .tick text');
    const dataset = this.settings.dataset;
    for (let i = 0; i < dataset.length; i++) {
      const values = Object.keys(dataset[i]).map(e => dataset[i][e]);
      values.forEach((key) => {
        if (key && key.constructor === Array) {
          for (let j = 0; j < key.length; j++) {
            if (innerWidth <= 480) {
              elems[j].textContent = key[j].shortName || key[j].name;
            } else if (innerWidth >= 481 && innerWidth <= 992) {
              elems[j].textContent = key[j].abbrName || key[j].name;
            } else if (innerWidth > 992) {
              elems[j].textContent = key[j].name;
            }
          }
        }
      });
    }
  },

  /**
   * Set the initially selected elements
   * @private
   */
  setInitialSelected() {
    const self = this;
    const legendsNode = self.svg.node().parentNode.nextSibling;
    const legends = d3.select(legendsNode);
    const isLegends = legends.node() && legends.classed('chart-legend');
    let isLegendsCall = false;
    let selected = 0;
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
      if (groups.nodes().length) {
        const getSelected = arr => arr.reduce((acc, n) => (n.selected ? acc + 1 : acc), 0);
        const sel = { groups: [], itemsInGroup: 0 };
        groups.each(function (d, i) {
          setSelectedBar(this);
          if (Array.isArray(d)) {
            sel.itemsInGroup = d.length;
            if (selected > 0) {
              sel.groups.push({ i, d, totalSel: getSelected(d) });
            }
          }
        });
        sel.gLen = sel.groups.length;
        if (!isLegendsCall && self.settings.isGrouped
          && sel.gLen === groups.size() && sel.groups[0]?.totalSel === 1) {
          isLegendsCall = true;
          for (let i = 0, l = sel.groups[0].d; i < l; i++) {
            if (sel.groups[0].d[i].selected) {
              barIndex = i;
              break;
            }
          }
        }
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
      if (isStackedGroup || isLegendsCall) {
        if (isLegends) {
          this.initialSelectCall = true;
          $(legends.node()).find('.chart-legend-item').eq(barIndex).trigger('click.chart');
        }
      } else {
        this.initialSelectCall = true;
        selector.on('click').call(selector.node(), selector.datum(), barIndex);
      }
    }
    this.initialSelectCall = false;
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
    const resize = () => {
      if (this.width === this.element.width()) {
        return;
      }
      this.width = this.element.width();
      if (!this.element.is(':visible')) {
        return;
      }
      this.updated();
    };
    // Waiting to complete the animatin on widget
    if (this.element.closest('.homepage').length) {
      setTimeout(() => resize(), 300);
    } else {
      resize();
    }
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
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    const events = arr => `${arr.join(`.${this.namespace} `)}.${this.namespace}`;

    if (this.element) {
      this.element.find('.group .series-group .bar')
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
      this.element.empty().removeClass('bar-chart');
      $.removeData(this.element[0], COMPONENT_NAME);
      $.removeData(this.element[0], 'chart');
    }
  }
};

export { Bar, COMPONENT_NAME };
