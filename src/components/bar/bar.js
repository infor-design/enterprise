/* eslint-disable no-nested-ternary, prefer-arrow-callback, no-underscore-dangle */
// Other Shared Imports
import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { DOM } from '../../utils/dom';
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
 * @param {boolean} [settings.fitHeight=true] If true chart height will fit in parent available height.
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
 * @param {object} [settings.localeInfo] If passed in you can override the default formatting https://github.com/d3/d3-format/blob/master/README.md#formatDefaultLocale
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
  fitHeight: true,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }
};

function Bar(element, settings) {
  this.settings = utils.mergeSettings(element, settings, BAR_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  charts.destroy(element, settings)
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

    if (this.settings.localeInfo) {
      d3.formatDefaultLocale(this.settings.localeInfo);
    }

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
    const s = this.settings;
    const parent = this.element.parent();
    const isPersonalizable = this.element.closest('.is-personalizable').length > 0;
    const isFormatter = !!s.formatterString;
    const format = value => d3.format(self.settings.formatterString || ',')(value);

    let maxTextWidth;
    let largestText;
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
    const tooltipData = s.tooltip;

    let barSpace = 0;
    let maxBarHeight = 30;
    const legendHeight = 30;
    const gapBetweenGroups = 0.6; // Makes it one bar in height (barHeight * 0.5)
    const isViewSmall = parent.width() < 450;
    let dataset = s.dataset;

    this.isRTL = Locale.isRTL();
    this.dataset = dataset;

    const innerWidth = window.innerWidth;
    this.viewport = {
      xxsmall: innerWidth <= 380,
      xsmall: innerWidth >= 381 && innerWidth <= 450,
      small: innerWidth >= 451 && innerWidth <= 480,
      medium: innerWidth >= 481 && innerWidth <= 992,
      large: innerWidth > 992
    };

    const margins = {
      top: 20,
      left: 30,
      right: 30,
      bottom: dataset.length === 1 ? 5 : 30
    };
    if (s.isGrouped && dataset.length === 1) {
      margins.bottom = 30;
      barSpace = 2;
    }

    this.element.addClass('bar-chart');
    if (s.isGrouped) {
      this.element.addClass('bar-chart-grouped');
    }

    if (s.isStacked) {
      this.element.addClass('bar-chart-stacked');
    }

    // Handle Empty Data Set
    if (dataset.length === 0) {
      self.element.emptymessage(s.emptyMessage);
      return this;
    }

    // Get the Legend Series
    const series = dataset.map(d => ({ name: d.name, color: d.color, pattern: d.pattern, attributes: d.attributes }));

    // Ellipsis
    this.ellipsis = { use: false, percentageWidth: 25, threshold: 12 };
    if (this.viewport.xxsmall) {
      this.ellipsis.percentageWidth = 37;
      this.ellipsis.threshold = 10;
    } else if (this.viewport.xsmall) {
      this.ellipsis.percentageWidth = 28;
      this.ellipsis.threshold = 10;
    } else if (this.viewport.small) {
      this.ellipsis.percentageWidth = 35;
    }

    // Map the Data Sets and Stack them.
    const yStack = { y1: [], y2: [] };
    dataset = dataset.map((d, i) => d.data.map((o, i2) => {
      let y0 = 0;
      if (i === 0) {
        yStack.y1.push(o.value);
        yStack.y2.push(0);
      } else {
        y0 = yStack.y1[i2] + yStack.y2[i2];
        yStack.y1[i2] = o.value;
        yStack.y2[i2] = y0;
      }
      return $.extend({}, o, {
        y0,
        y: o.value,
        x: charts.getLabel(o, self.viewport),
        color: o.color,
        pattern: o.pattern
      });
    }));

    // Calculate max text width
    maxTextWidth = 0;
    largestText = '';
    dataset = dataset.map(function (group, i) { // eslint-disable-line
      if (!s.isStacked) {
        if (series[i]) {
          const label = charts.getLabel(series[i], self.viewport);
          const len = label.length;
          largestText = (len > maxTextWidth ? label : largestText);
          maxTextWidth = (len > maxTextWidth ? len : maxTextWidth);
        }
      }
      return group.map(function (d) { // eslint-disable-line
        if (s.isStacked) {
          const len = d.x.length;
          largestText = (len > maxTextWidth ? d.x : largestText);
          maxTextWidth = (len > maxTextWidth ? len : maxTextWidth);
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

    // influences the bar width
    const parentAvailableHeight = utils.getParentAvailableHeight(self.element[0]);
    const useHeight = s.fitHeight ? parentAvailableHeight : parseInt(parent.height(), 10);
    const height = useHeight - margins.top - margins.bottom - legendHeight;
    const h = useHeight - margins.bottom - (s.isStacked ? 0 : (legendHeight / 2));
    const w = parseInt(parent.width(), 10) - margins.left;
    let textWidth = charts.calculateTextRenderWidth(largestText);
    if (textWidth < 200) {
      textWidth += 26;
    }
    if (charts.calculatePercentage(textWidth, w) > 55) {
      textWidth = charts.getPercentage(w, this.ellipsis.percentageWidth);
      this.ellipsis.use = true;
    }

    self.svg = d3.select(this.element[0])
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('class', 'group')
      .attr('transform', `translate(${textWidth},${margins.top})`);

    const xMin = d3.min(dataset, g => (d3.min(g, d => (s.isStacked ? (d.x + d.x0) : d.x))));
    let xMax = d3.max(dataset, g => (d3.max(g, d => (s.isStacked ? (d.x + d.x0) : d.x))));

    if (s.isStacked && s.isNormalized) {
      const gMax = [];
      // get the max for each array group
      dataset.forEach((d) => {
        d.forEach((d2, i) => {
          gMax[i] = (gMax[i] === undefined ? 0 : gMax[i]) + d2.x;
        });
      });

      // Normalize Each Group
      dataset.forEach((d) => {
        d.forEach((d2, i) => {
          const xDif = gMax[i] / 100;
          d2.x /= xDif;
          d2.x0 /= xDif;
        });
      });
      xMax = 100;
    }

    // Width of the bar minus the margin
    const barWith = w - textWidth - margins.left;
    let xScale;

    if (s.useLogScale) {
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

    if (s.isStacked) {
      yMap = dataset[0].map(d => d.y);

      barHeight = 0.32;
    } else {
      yMap = series.map(d => d.name);

      (function () {
        // Loop backwards to catch and override with found first custom info from top
        for (let lm, i = dataset.length - 1, l = -1; i > l; i--) {
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

    if (s.isStacked && s.isNormalized) {
      xAxis.tickFormat(d => `${d}%`);
    }

    if (s.useLogScale) {
      xAxis.ticks(10, ',.1s');

      if (s.showLines === false) {
        xAxis.tickSize(0);
      }
    }

    if (s.ticks && !s.useLogScale) {
      if (self.viewport.small) {
        xAxis.ticks(s.ticks.smallNumber, s.ticks.format);
      } else if (self.viewport.medium) {
        xAxis.ticks(s.ticks.mediumNumber, s.ticks.format);
      } else if (self.viewport.large) {
        xAxis.ticks(s.ticks.largeNumber, s.ticks.format);
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

    s.isGrouped = (self.svg.selectAll('.series-group').nodes().length > 1 && !s.isStacked) || (s.isGrouped && dataset.length === 1);
    s.isSingle = (self.svg.selectAll('.series-group').nodes().length === 1 && s.isStacked);

    groups.selectAll('rect')
      .data((d, i) => {
        d.forEach((rectData) => {
          rectData.index = i;

          if (!s.isStacked) {
            rectData.gindex = gindex++;
          }
        });
        return d;
      })
      .enter()
      .append('rect')
      .call((d) => {
        d._groups.forEach((bars) => {
          bars.forEach((bar) => {
            const dat = bar.__data__;
            utils.addAttributes($(bar), dat, dat.attributes, 'bar');
          });
        });
      })
      .attr('class', (d, i) => `bar series-${i}`)
      .style('fill', (d, i) => (s.isStacked ? // eslint-disable-line
        (series.length === 1 ? (charts.chartColor(i, 'bar-single', d)) :  // eslint-disable-line
          (charts.chartColor(d.index, 'bar', series[d.index]))) : // eslint-disable-line
        (charts.chartColor(i, 'bar', legendMap[i])))) // eslint-disable-line
      .attr('mask', (d, i) => {
        if (dataset.length === 1 && dataset[0][i].pattern) {
          return `url(#${dataset[0][i].pattern})`;
        } if (s.isStacked && series[d.index].pattern) {
          return `url(#${series[d.index].pattern})`;
        } if (!s.isStacked && legendMap[i] && legendMap[i].pattern) {
          return `url(#${legendMap[i].pattern})`;
        }
        return '';
      })
      .attr('x', (d) => {
        if (s.useLogScale) {
          return 0;
        }
        return (s.isStacked && !s.isSingle) ?
          xScale(d.x0) + 1 : xScale(0) + 1;
      })
      .attr('y', d => (s.isStacked ? yScale(d.y) :
        ((((totalGroupArea - totalHeight) / 2) + ((d.gindex * maxBarHeight) + (d.gindex * barSpace))) + (d.index * gap)))) // eslint-disable-line
      .attr('height', () => (s.isStacked ? (yScale.bandwidth()) : maxBarHeight))
      .attr('width', 0) // Animated in later
      .on(`mouseenter.${self.namespace}`, function (d, i) {
        let j;
        let l;
        let hexColor;
        let total = 0;
        const totals = [];
        let content = '';
        let tooltipTargetEl = null;
        const maxBarsForTopTooltip = 6;
        const shape = d3.select(this);
        const parentNode = this.parentNode;
        const data = d3.select(parentNode).datum();
        const mid = Math.round(data.length / 2);
        const setPattern = function (pattern, hexColor2) {
          return !pattern || !hexColor2 ? '' :
            `<svg width="12" height="12"><rect mask="url(#${pattern})" height="12" width="12" /></svg>`;
        };

        // Set group info
        let thisGroup = null;
        if (s.isGrouped) {
          thisGroup = { elem: d3.select(parentNode) };
          thisGroup.data = data;
          thisGroup.items = thisGroup.elem.selectAll('.bar');
          thisGroup.idx = parseInt(parentNode.getAttribute('data-group-id'), 10);
        }

        const show = function () {
          const isTooltipBottom = (!s.isStacked && (data.length > maxBarsForTopTooltip));
          let el;
          const midNode = $(`.series-${mid}`, parentNode)[0];
          if (DOM.isValidElement(tooltipTargetEl)) {
            // If target come from callback, bar or group element
            el = tooltipTargetEl === thisGroup.elem.node() ? midNode : tooltipTargetEl;
          } else {
            // Default use current shape or current group element
            el = s.isGrouped ? midNode : shape.node();
          }
          const rect = el.getBoundingClientRect();
          const winJq = $(window);

          const yPosS = rect.top + winJq.scrollTop();
          const xPosS = rect.left + winJq.scrollLeft();

          const size = charts.tooltipSize(content);
          const x = xPosS + (rect.width / 2) - (size.width / 2);
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
            content = replaceMatch(content, (match, key) => {
              const r = format(d[key]);
              return isNaN(r) ? d[key] : r;
            });
          } else if (typeof content === 'number') {
            content = content.toString();
          }
        };

        // Set custom tooltip callback method
        const setCustomTooltip = (method) => {
          content = '';
          const args = { elem: this, index: i, data: d };
          if (s.isGrouped) {
            args.groupElem = thisGroup.elem.node();
            args.groupItems = thisGroup.items.nodes();
            args.groupIndex = thisGroup.idx;
            args.groupData = thisGroup.data;
          }
          const req = (res, target) => {
            if (typeof res === 'string' || typeof res === 'number') {
              content = res;
              tooltipTargetEl = target;
              replaceMatchAndSetType();
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

          if (s.isStacked) {
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

        if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[i]) {
          setCustomTooltip(tooltipData);
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
            show();
          }

          // set inline colors
          if (s.isStacked) {
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
          triggerGroup: s.isGrouped,
          d,
          i,
          type: s.type,
          dataset: s.dataset,
          isSingle: self.isSingular,
          isGrouped: s.isGrouped,
          isStacked: s.isStacked,
          svg: self.svg,
          clickedLegend: s.clickedLegend
        });

        if (isSelected && !self.initialSelectCall) {
          self.element.triggerHandler('selected', [d3.select(this).nodes(), {}, (isGrouped ? thisGroupId : i)]);
        }
      })
      .on(`contextmenu.${self.namespace}`, function (d) {
        charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d);
      });

    // Adjust the labels
    self.svg.selectAll('.axis.y text').attr('x', () => (self.isRTL ? 15 : -15));
    self.svg.selectAll('.axis.x text').attr('class', d => (d < 0 ? 'negative-value' : 'positive-value'));

    if (self.isRTL && (charts.isIE || charts.isIEEdge)) {
      self.svg.selectAll('text').attr('transform', 'scale(-1, 1)');
      self.svg.selectAll('.y.axis text').style('text-anchor', 'start');
    }

    if (isViewSmall && s.useLogScale) {
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
          (s.useLogScale ? d !== middleTick : i !== middleTick)) {
          d3.select(this).remove();
        }
      });
    }

    // Set x-axix tick css class
    self.svg.selectAll('.x.axis .tick').attr('class', d => `tick${d === 0 ? ' tick0' : ''}`);

    // Animate the Bars In
    self.svg.selectAll('.bar')
      .transition().duration(s.animate ? 600 : 0)
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
        if (s.useLogScale) {
          return 0;
        }
        return (s.isStacked && !s.isSingle) ? xScale(d.x0) + 1 :  //eslint-disable-line
          (d.x < 0 ? xScale(d.x) + 1 : xScale(0) + 1);
      });

    s.svg = self.svg;

    // Add Legends
    if (s.showLegend) {
      let legendSeries = s.isStacked ? series : legendMap;
      legendSeries = legendSeries.map((d) => {
        if (d.attributes && !d.data?.attributes) {
          if (d.data) {
            d.data.attributes = d.attributes;
          } else {
            d.data = { attributes: d.attributes };
          }
        }
        return d;
      });
      charts.addLegend(legendSeries, s.type, s, this.element);
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
    const dataset = this.settings?.dataset;
    if (!dataset || (dataset && dataset.constructor !== Array)) {
      return;
    }
    const elems = this.element[0].querySelectorAll('.bar-chart .axis.y .tick text');
    const brief = {};
    if (this.ellipsis.use) {
      brief.maxWidth = this.element.width();
      brief.transX = this.svg?.node()?.transform?.baseVal?.consolidate()?.matrix?.e || 1;
      brief.customCss = () => ({
        tooltip: { maxWidth: `${brief.maxWidth}px` },
        arrow: { left: this.isRTL ? 'calc(100% - 20px)' : '20px' }
      });
    }
    const getText = (d, i) => {
      let r;
      if (this.ellipsis.use) {
        r = charts.trimText(d.name, this.ellipsis.threshold);
        if (r.substr(-3) === '...') {
          const textWidth = charts.calculateTextRenderWidth(d.name);
          const truncatedWidth = charts.calculateTextRenderWidth(r);
          const parentNode = elems[i].parentNode;
          const calculatePos = (rect) => {
            const numOfLines = Math.ceil(textWidth / brief.maxWidth);
            let x = brief.transX - truncatedWidth;
            let y = rect.top;
            x = (x < 0 ? 30 : x) + 20;
            y = (y < 0 ? 30 : y) - 36;
            if (numOfLines > 1) {
              y -= (33 * ((numOfLines - 1) * 0.5));
            }
            if (this.isRTL) {
              x = rect.left - textWidth + brief.transX;
            }
            return { x, y };
          };

          if (!env.browser.isIE11()) {
            r = d.name;
            elems[i].classList.add('hidden');
            d3.select(parentNode).append('foreignObject')
              .attr('overflow', 'visible')
              .attr('width', `${brief.transX}`)
              .attr('height', '16')
              .attr('class', `foreign-object tick-y${i}`)
              .attr('x', `-${brief.transX}`)
              .attr('y', '-1em')
              .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
              .html(`<div class="text ellipsis" resizeable="false" xmlns="http://www.w3.org/1999/xhtml">${d.name}</div>`);
          }

          d3.select(parentNode)
            .on(`mouseover.${this.namespace}`, () => {
              const pos = calculatePos(parentNode.getBoundingClientRect());
              charts.showTooltip(pos.x, pos.y, d.name, 'top', brief.customCss());
            })
            .on(`mouseout.${this.namespace}`, () => charts.hideTooltip());
        }
      } else {
        r = charts.getLabel(d, this.viewport);
      }
      return r;
    };

    if (this.settings.isGrouped) {
      dataset.forEach((d, i) => {
        elems[i].textContent = getText(d, i);
      });
    } else {
      dataset.forEach((d) => {
        const keys = Object.keys(d).map(key => key);
        const values = Object.keys(d).map(key => d[key]);
        values.forEach((key, i) => {
          if (key && key.constructor === Array) {
            key.forEach((k, i2) => {
              if (keys[i] !== 'attributes') {
                elems[i2].textContent = getText(k, i2);
              }
            });
          }
        });
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
        if (!isLegendsCall && self.settings.isGrouped &&
          sel.gLen === groups.size() && sel.groups[0]?.totalSel === 1) {
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
