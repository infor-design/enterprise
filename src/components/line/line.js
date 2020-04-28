/* eslint-disable no-nested-ternary, prefer-arrow-callback */

// Other Shared Imports
import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';

import '../emptymessage/emptymessage.jquery';

// Settings and Options
const COMPONENT_NAME = 'line';

/**
 * A line chart or line graph is a type of chart which displays information as a series of data
 * points called 'markers' connected by straight line segments.
 * @class Line
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 *
 * @param {array} [settings.dataset=[]] The data to use in the line/area/bubble.
 * @param {function|string} [settings.tooltip] A custom tooltip or tooltip renderer function
 * for the whole chart.
 * @param {string} [settings.isArea] Render as an area chart.
 * @param {string} [settings.isBubble=false] Render as a bubble chart.
 * @param {string} [settings.isScatterPlot=false] Render as a Scatter Plot Chart.
* @param {string} [settings.showLegend=true] If false the label will not be shown.
 * @param {object} [settings.xAxis] A series of options for the xAxis
 * @param {number} [settings.xAxis.rotate] Rotate the elements on the x axis.
 * Recommend -65 deg but this can be tweaked depending on look.
 * @param {object} [settings.yAxis] A series of options for the yAxis
 * @param {object} [settings.xAxis.ticks] Data to control the number of ticks and y axis format.
 * For example `{number: 5, format: ',.1s'}` would show only 5 yaxis points and format the
 * data to show 1K, 1M, 1G ect.. This uses the d3 formatter.
 * @param {function} [settings.xAxis.formatText] A function that passes the text element and a counter.
 * You can return a formatted svg markup element to replace the current element.
 * For example you could use tspans to wrap the strings or color them.
 * @param {object} [settings.yAxis] A series of options for the yAxis
 * @param {function} [settings.yAxis.formatter] A d3 formatter for the yAxis points.
 * @param {boolean} [settings.hideDots=false] If true no dots are shown
 * @param {array} [settings.axisLabels]  Option to a label to one of the four sides. For Example
 * `{left: 'Left axis label', top: 'Top axis label',
 * right: 'Right axis label', bottom: 'Bottom axis label'}`
 * @param {boolean|string} [settings.animate] true|false - will do or not do the animation.
 * 'initial' will do only first time the animation.
 * @param {boolean} [settings.redrawOnResize=true]  If set to false the component will not redraw when the page or parent is resized.
 * @param {object} [settings.dots] Option to customize the dot behavior. You can set the dot size (radius),
 * the size on hover and stroke or even add a custom class.
 * Example `dots: { radius: 3, radiusOnHover: 4, strokeWidth: 0, class: 'custom-dots'}`
 * @param {string} [settings.formatterString] Use d3 format some examples can be found on http://bit.ly/1IKVhHh
 * @param {object} [settings.emptyMessage] An empty message will be displayed when there is no chart data.
 * This accepts an object of the form emptyMessage:
 * `{title: 'No Data Available',
 *  info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data',
 *  button: {text: 'xxx', click: <function>}
 *  }`
 *  Set this to null for no message or will default to 'No Data Found with an icon.'
 */
const LINE_DEFAULTS = {
  dataset: [],
  isArea: false,
  isBubble: false,
  isScatterPlot: false,
  showLegend: true,
  hideDots: false,
  animate: true,
  redrawOnResize: true,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }
};

function Line(element, settings) {
  this.settings = utils.mergeSettings(element, settings, LINE_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Line.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The component prototype for chaining.
   */
  init() {
    this.namespace = utils.uniqueId({ classList: [this.settings.type, 'chart'] });
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
    * @memberof Line
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
    const isPersonalizable = this.element.closest('.is-personalizable').length > 0;
    const isFormatter = !!s.formatterString;
    const format = value => (isFormatter ? d3.format(s.formatterString)(value) : value);

    // Add css class
    let cssClass = 'line-chart';
    cssClass += s.isBubble ? ' bubble' : '';
    cssClass += s.isScatterPlot ? ' scatterplot' : '';
    this.element.addClass(cssClass);

    // Handle Empty Data Set
    if (s.dataset.length === 0) {
      self.element.emptymessage(s.emptyMessage);
      return this;
    }

    const dots = {
      radius: 5,
      radiusOnHover: 7,
      strokeWidth: 2,
      class: 'dot'
    };

    // Set to zero for animation
    if (s.isBubble) {
      dots.radius = 0;
      dots.radiusOnHover = 0;
      dots.strokeWidth = 0;
    }

    if (s.isScatterPlot) {
      dots.radius = 0;
      dots.strokeWidth = 50;
    }
    $.extend(true, dots, s.dots);
    self.dots = dots;

    this.isRTL = Locale.isRTL();

    let tooltipInterval;
    const tooltipDataCache = [];
    let tooltipData = s.tooltip;

    // Config axis labels
    let i;
    let l;
    const axisLabels = {};
    const isAxisLabels = { atLeastOne: false };
    const axisArray = ['left', 'top', 'right', 'bottom'];

    if (s.axisLabels) {
      $.extend(true, axisLabels, s.axisLabels);
    }

    if (!$.isEmptyObject(axisLabels)) {
      for (i = 0, l = axisArray.length; i < l; i++) {
        const thisAxis = axisLabels[axisArray[i]];
        if (thisAxis && typeof thisAxis === 'string' && $.trim(thisAxis) !== '') {
          isAxisLabels[axisArray[i]] = true;
          isAxisLabels.atLeastOne = true;
        }
      }
    }

    // Append the SVG in the parent area.
    let longestLabel = '';
    let xRotateMarginBot = 0;
    const dataset = s.dataset;
    const hideDots = (s.hideDots);
    const parent = this.element.parent();
    const isCardAction = !!$('.widget-chart-action', parent).length;
    const isViewSmall = parent.width() < 450;

    const getRotateValue = (v) => {
      const defaultAngle = '-45';
      return (typeof v !== 'undefined' && typeof v !== 'function' && v !== null) ?
        (typeof v === 'boolean' ? (v ? defaultAngle : null) : v) : null;
    };
    const xRotate = {
      large: getRotateValue(s.xAxis?.rotate),
      small: getRotateValue(s.xAxis?.rotateOnSmallView)
    };
    let isAxisXRotate = !!xRotate.large;
    if (isAxisXRotate) {
      xRotate.use = xRotate.large;
    }
    if (isViewSmall && !!xRotate.small) {
      isAxisXRotate = true;
      xRotate.use = xRotate.small;
    }

    // Get maxes
    const getMaxes = (d, opt) => d3.max(d.data, d2 => (opt ? d2.value[opt] : d2.value));

    if (isAxisXRotate) {
      // get the longeset label
      dataset[0].data.forEach((d) => {
        if (d.name.length > longestLabel.length) {
          longestLabel = d.name;
        }
      });
      let angle = Math.abs(xRotate.use);
      angle = !isNaN(angle) ? angle : 0;
      xRotateMarginBot = longestLabel.length * (angle > 50 ? 5 : 2);
    }

    const margin = {
      top: (isAxisLabels.top ? (isCardAction ? 15 : 40) : (isCardAction ? 5 : 30)),
      right: (isAxisLabels.right ? 65 : 55),
      bottom: (isAxisLabels.bottom ? (isAxisXRotate ? 60 : 50) : xRotateMarginBot + 35),
      left: (isAxisLabels.left ? 75 : 65)
    };
    const width = parent.width() - margin.left - margin.right;
    let height = parent.height() - margin.top - margin.bottom - 30; // legend

    if (isCardAction) {
      height -= 40;
    }

    self.svg = d3.select(this.element[0]).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const names = dataset[0].data.map(d => d.name);
    const valueFormatterString = {};
    if (dataset[0] && dataset[0].valueFormatterString) {
      $.extend(true, valueFormatterString, dataset[0].valueFormatterString);
    }
    const formatValue = (str, value) => (!$.isEmptyObject(valueFormatterString) && !!str ?
      (d3.format(str)(str === '0.0%' ? value / 100 : value)) : value);

    const labels = {
      name: 'Name',
      value: {
        x: 'Value.x',
        y: 'Value.y',
        z: 'Value.z'
      }
    };

    if (dataset[0] && dataset[0].labels) {
      $.extend(true, labels, dataset[0].labels);
    }

    // Calculate the Domain X and Y Ranges
    let maxes;
    const x = ((!!s.xAxis && !!s.xAxis.scale) ?
      (s.xAxis.scale) : (d3.scaleLinear())).range([0, width]);

    const y = d3.scaleLinear().range([height, 0]);
    const z = d3.scaleLinear().range([1, 25]);

    if (s.isBubble) {
      maxes = {
        x: dataset.map(d => getMaxes(d, 'x')),
        y: dataset.map(d => getMaxes(d, 'y')),
        z: dataset.map(d => getMaxes(d, 'z'))
      };
    } else if (s.isScatterPlot) {
      maxes = {
        x: dataset.map(d => getMaxes(d, 'x')),
        y: dataset.map(d => getMaxes(d, 'y'))
      };
    } else {
      maxes = dataset.map(d => getMaxes(d));
    }

    const maxDataLen = d3.max(dataset.map(d => d.data.length));
    const entries = maxDataLen <= 1 ? maxDataLen : maxDataLen - 1;
    const xScale = x.domain(!!s.xAxis && !!s.xAxis.domain ?
      (s.xAxis.domain) :
      ([0, s.isBubble || s.isScatterPlot ? d3.max(maxes.x) : entries]));

    const yScale = y.domain([0, d3.max(s.isBubble ||
      s.isScatterPlot ? maxes.y : maxes)]).nice();
    const zScale = z.domain([0, d3.max(s.isBubble ? maxes.z : maxes)]).nice();
    let numTicks = entries;
    if (s.xAxis && s.xAxis.ticks) {
      numTicks = s.xAxis.ticks === 'auto' ? Math.max(width / 85, 2) : s.xAxis.ticks;
      if (s.isBubble || s.isScatterPlot && isViewSmall) {
        numTicks = Math.round(entries / 2);
      }
    }

    if (isViewSmall) {
      if (s.xAxis?.numTicksOnSmallView) {
        numTicks = s.xAxis?.numTicksOnSmallView;
      }
    }

    const xAxis = d3.axisBottom(xScale)
      .ticks(numTicks)
      .tickPadding(10)
      .tickSize(s.isBubble || s.isScatterPlot ? -(height + 10) : 0)
      .tickFormat((d, j) => {
        if (typeof s.xAxis?.formatter === 'function') {
          return s.xAxis.formatter(d, j);
        }
        if (s.xAxis?.ticks === 'auto') {
          return names[d];
        }
        return s.isBubble || s.isScatterPlot ? d : names[d];
      });

    const yAxis = d3.axisLeft(yScale)
      .ticks(8)
      .tickSize(-(width + 20))
      .tickPadding(self.isRTL ? -18 : 20);

    if (s.yAxis?.formatter) {
      yAxis.tickFormat((d, k) => ((typeof s.yAxis.formatter === 'function') ? s.yAxis.formatter(d, k) : d));
    }

    if (s.yAxis?.ticks) {
      yAxis.ticks(s.yAxis.ticks.number, s.yAxis.ticks.format);
    }

    // Append The Axis Labels
    if (isAxisLabels.atLeastOne) {
      const axisLabelsGroup = self.svg.append('g').attr('class', 'axis-labels');
      const place = {
        top: `translate(${width / 2},${-10})`,
        right: `translate(${width + 28},${height / 2})rotate(90)`,
        bottom: `translate(${width / 2},${height + 40})`,
        left: `translate(${-40},${height / 2})rotate(-90)`
      };

      const placeStyle = {
        top: `rotate(0deg) scaleX(-1) translate(-${width / 2}px, ${-10}px)`,
        right: `rotate(90deg) scaleX(-1) translate(-${(height / 2) + 5}px, -${width + 28}px)`,
        bottom: `rotate(0deg) scaleX(-1) translate(-${width / 2}px, ${height + 40}px)`,
        left: `rotate(90deg) scaleX(-1) translate(-${(height / 2 - 5)}px, ${55}px)`
      };

      const addAxis = (pos) => {
        if (isAxisLabels[pos]) {
          axisLabelsGroup.append('text')
            .attr('class', `axis-label-${pos}`)
            .attr('text-anchor', 'middle')
            .attr('transform', self.isRTL ? '' : place[pos])
            .style('font-size', '1.25em')
            .style('transform', self.isRTL ? placeStyle[pos] : '')
            .text(axisLabels[pos]);
        }
      };

      for (i = 0, l = axisArray.length; i < l; i++) {
        addAxis(axisArray[i]);
      }
    }

    // Append The Axis to the svg
    self.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    self.svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Offset the tick inside, uses the fact that the yAxis has 20 added.
    self.svg.selectAll('.tick line').attr('x1', '-10');

    if (s.isBubble || s.isScatterPlot) {
      self.svg.selectAll('.x.axis .tick line, .y.axis .tick line').style('opacity', 0);
      const firstLineX = self.svg.select('.x.axis .tick line');
      firstLineX.attr('x2', '-10');
      if (!s.xAxis || (s.xAxis && !s.xAxis.hideLine)) {
        firstLineX.style('opacity', 1);
      }
      if (!s.yAxis || (s.yAxis && !s.yAxis.hideLine)) {
        self.svg.select('.y.axis .tick line').style('opacity', 1);
      }
    }

    if (self.isRTL) {
      self.svg.selectAll('text').attr('transform', 'scale(-1, 1)');
      self.svg.selectAll('.y.axis text').style('text-anchor', 'end');
    }

    if (isAxisXRotate) {
      self.svg.selectAll('.x.axis .tick text') // select all the text for the xaxis
        .attr('y', 0)
        .attr('x', function () {
          return -(this.getBBox().width + 10);
        })
        .attr('dy', '1em')
        .attr('transform', `rotate(${xRotate.use})`)
        .style('text-anchor', 'start');
    }

    if (s.xAxis && s.xAxis.formatText) {
      self.svg.selectAll('.x.axis .tick text').each(function (m) {
        const elem = d3.select(this);
        const text = d3.select(this).text();
        const markup = s.xAxis.formatText(text, m);
        DOM.html(elem.node(), markup, '<tspan><text><glyph>');
      });
    }

    // Create the line generator
    const line = d3.line()
      .x((d, n) => xScale(typeof s.xAxis?.parser === 'function' ? s.xAxis.parser(d, n) : (s.isBubble || s.isScatterPlot ? d.value.x : n)))
      .y(d => yScale(s.isBubble || s.isScatterPlot ? d.value.y : d.value));

    // Append the lines
    dataset.forEach(function (d, lineIdx) {
      const lineGroups = self.svg.append('g')
        .attr('data-group-id', lineIdx)
        .attr('class', 'line-group');

      if (s.isArea) {
        const area = d3.area()
          .x((dc, p) => xScale(p))
          .y0(height)
          .y1(db => yScale(s.isBubble || s.isScatterPlot ? db.value.y : db.value));

        lineGroups.append('path')
          .datum(d.data)
          .attr('fill', () => charts.chartColor(lineIdx, 'line', d))
          .style('opacity', '.2')
          .attr('class', 'area')
          .attr('d', area);
      }

      const path = lineGroups.append('path')
        .datum(d.data)
        .attr('d', line(d.data))
        .attr('stroke', () => (s.isBubble || s.isScatterPlot ? '' : charts.chartColor(lineIdx, 'line', d)))
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('class', 'line')
        .on(`click.${self.namespace}`, function () {
          charts.selectElement(d3.select(this.parentNode), self.svg.selectAll('.line-group'), d, self.element, dataset, self.initialSelectCall);
        })
        .on(`contextmenu.${self.namespace}`, function () {
          charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d);
        });

      // Add animation
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(s.animate ? 600 : 0)
        .ease(d3.easeCubic)
        .attr('stroke-dashoffset', 0);

      const handleMouseEnter = function (elem, mouseEnterData) {
        const rect = elem.getBoundingClientRect();
        let content = `<p><b>${mouseEnterData.name} </b> ${format(mouseEnterData.value)}</p>`;

        const show = function () {
          const size = charts.tooltipSize(content);
          let posX = rect.left - (size.width / 2) + 6;
          const posY = rect.top - size.height - 18;

          posX = s.isBubble || s.isScatterPlot ?
            ((rect.left + (rect.width / 2)) - (size.width / 2)) : posX;

          if (content !== '') {
            if (charts.tooltip && charts.tooltip.length) {
              charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
            }
            charts.showTooltip(posX, posY, content, 'top');
          }
        };

        if (s.isBubble || s.isScatterPlot) {
          content = `<div class="chart-swatch line"><div class="swatch-caption"><span class="indicator-box"></span>
            <b>${mouseEnterData.name}</b></div>`;

          for (const key in mouseEnterData) {  //eslint-disable-line
            if (mouseEnterData.hasOwnProperty(key)) {  //eslint-disable-line
              if (typeof mouseEnterData[key] !== 'object') {
                if (labels[key]) {
                  content += `${'' +
                      '<div class="swatch-row">' +
                        '<span>'}${labels[key]}</span>` +
                        `<b>${d.name}</b>` +
                      '</div>';
                }
              } else {
                const obj2 = mouseEnterData[key];
                for (const key2 in obj2) {  //eslint-disable-line
                  if (obj2.hasOwnProperty(key2)) {  //eslint-disable-line
                    content += `${'' +
                        '<div class="swatch-row">' +
                          '<span class="text-capitalize">'}${labels[key][key2]}</span>` +
                          `<b>${formatValue(valueFormatterString[key2], obj2[key2])}</b>` +
                        '</div>';
                  }
                }
              }
            }
          }
          content += '</div>';
        }

        if (tooltipData && typeof tooltipData === 'function' && !tooltipDataCache[i]) {
          content = '';
          let runInterval = true;
          tooltipInterval = setInterval(function () {
            if (runInterval) {
              runInterval = false;
              tooltipData(function (data) {
                content = data;
                tooltipDataCache[i] = data;
              });
            }
            if (content !== '') {
              clearInterval(tooltipInterval);
              show();
            }
          }, 10);
        } else {
          tooltipData = typeof tooltipData === 'object' ? '' : tooltipData;
          content = tooltipDataCache[i] || tooltipData || mouseEnterData.tooltip || d.tooltip || content || '';
          show();

          // Set the colors
          const spans = document.querySelectorAll('#svg-tooltip .swatch-caption span');
          for (let k = 0; k < spans.length; k++) {
            spans[k].style.backgroundColor = charts.chartColor(s.isBubble || s.isScatterPlot ? mouseEnterData.lineIdx : k, 'line', mouseEnterData);
          }
        }

        // Circle associated with hovered point
        d3.select(this).attr('r', function (df) {
          return s.isBubble ? (2 + zScale(df.value.z)) : dots.radiusOnHover;
        });
      };

      if (!hideDots) {
        if (!s.isScatterPlot) {
          lineGroups.selectAll('circle')
            .data(d.data)
            .enter()
            .append('circle')
            .attr('class', dots.class)
            .attr('cx', function (dd, p) {
              if (!!s.xAxis && !!s.xAxis.parser) {
                return xScale(s.xAxis.parser(dd, p));
              }
              return xScale(s.isBubble || s.isScatterPlot ? dd.value.x : p);
            })
            .attr('cy', function (de) { return yScale(s.isBubble || s.isScatterPlot ? 0 : de.value); })
            .attr('r', dots.radius)
            .style('stroke-width', dots.strokeWidth)
            .style('fill', function () { return charts.chartColor(lineIdx, 'line', d); })
            .style('opacity', (s.isBubble || s.isScatterPlot ? '.7' : '1'))
            .on(`mouseenter.${self.namespace}`, function (mouseEnterData) {
              mouseEnterData.lineIdx = lineIdx;
              handleMouseEnter(this, mouseEnterData);
            })
            .on(`mouseleave.${self.namespace}`, function () {
              clearInterval(tooltipInterval);
              charts.hideTooltip();
              d3.select(this).attr('r', function (dg) {
                return s.isBubble ? zScale(dg.value.z) : dots.radius;
              });
            })
            .on(`click.${self.namespace}`, function (dh) {
              charts.selectElement(d3.select(this.parentNode), self.svg.selectAll('.line-group'), dh, self.element, dataset, self.initialSelectCall);
            })
            .on(`contextmenu.${self.namespace}`, function (di) {
              charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], di);
            });
        }

        if (s.isScatterPlot) {
          lineGroups.selectAll('.symbol')
            .data(d.data)
            .enter()
            .append('path')
            .attr('class', 'symbol')
            .attr('transform', function (ds) {
              return `translate(${xScale(ds.value.x)},${yScale(ds.value.y)})`;
            })
            .attr('d', d3.symbol().size(dots.strokeWidth).type(function () { return d3.symbols[lineIdx]; }))
            .style('opacity', 0)
            .style('fill', function () { return charts.chartColor(lineIdx, 'line', d); })
            .on(`mouseenter.${self.namespace}`, function (mouseEnterData) {
              mouseEnterData.lineIdx = lineIdx;
              handleMouseEnter(this, mouseEnterData);
            })
            .on(`mouseleave.${self.namespace}`, function () {
              clearInterval(tooltipInterval);
              charts.hideTooltip();
              d3.select(this).attr('r', function () {
                return dots.radius;
              });
            })
            .on(`click.${self.namespace}`, function (dh) {
              charts.selectElement(d3.select(this.parentNode), self.svg.selectAll('.line-group'), dh, self.element, dataset, self.initialSelectCall);
            })
            .on(`contextmenu.${self.namespace}`, function (di) {
              charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], di);
            });
        }
        if (s.isBubble) {
          // Add animation
          lineGroups.selectAll('circle')
            .attr('cy', function (di) { return yScale(di.value.y); })
            .transition().duration(s.animate ? 750 : 0)
            .ease(d3.easeCubic)
            .attr('r', function (dj) { return zScale(dj.value.z); });
        }

        if (s.isScatterPlot) {
          // Add animation
          lineGroups.selectAll('.symbol')
            .transition().duration(s.animate ? 750 : 0)
            .ease(d3.easeCubic)
            .style('opacity', 1);
        }
      }
    });

    // Set y-axix tick css class
    self.svg.selectAll('.y.axis .tick').attr('class', function (di) {
      return `tick${di === 0 ? ' tick0' : ''}`;
    });

    const series = dataset.map(function (d) {
      return { color: d.color, name: d.name, selectionObj: self.svg.selectAll('.line-group'), selectionInverse: self.svg.selectAll('.line-group'), data: d };
    });

    if (s.showLegend) {
      charts.addLegend(series, s.isScatterPlot ? 'scatterplot' : 'line', s, this.element);
    }
    charts.appendTooltip();

    charts.setSelected = function (o, isToggle) {
      let selected = 0;
      const equals = utils.equals;
      let selector;
      let selectorData;
      let elem;

      const setSelected = function (d, i1, d2, i2) {
        if (d2) {
          elem = self.svg.select(`[data-group-id="${i1}"]`)
            .select(`.dot:nth-child(${i2 + 2})`);
          if ((typeof o.groupIndex === 'number' &&
                typeof o.fieldName !== 'undefined' &&
                  typeof o.fieldValue !== 'undefined' &&
                    o.groupIndex === i1 &&
                      o.fieldValue === d2[o.fieldName]) ||
              (typeof o.index !== 'undefined' &&
                typeof o.groupIndex === 'number' &&
                  o.groupIndex === i1 && o.index === i2) ||
              (o.elem && $(elem.node()).is(o.elem)) ||
              (o.data && equals(o.data, d2))) {
            selected++;
            selectorData = d2;
            selector = self.svg.select(`[data-group-id="${i1}"]`);
          }
        } else {
          elem = self.svg.select(`[data-group-id="${i1}"]`);
          if ((typeof o.groupName !== 'undefined' &&
                typeof o.groupValue !== 'undefined' &&
                  o.groupValue === d[o.groupName]) ||
              (typeof o.groupIndex !== 'undefined' &&
                o.groupIndex === i1) ||
              (o.elem && $(elem.node()).is(o.elem)) ||
              (o.data && equals(o.data, d))) {
            selected++;
            selectorData = d;
            selector = elem;
          }
        }
      };

      dataset.forEach(function (d, i3) {
        if (selected < 1 && d && d.data) {
          d.data.forEach(function (d2, i2) {
            if (selected < 1 && d2) {
              setSelected(d, i3, d2, i2);
            }
          });
          if (selected < 1) {
            setSelected(d, i3);
          }
        }
      });

      if (selected > 0 && (isToggle || !selector.classed('is-selected'))) {
        charts.selectElement(selector, self.svg.selectAll('.line-group'), selectorData, self.element, dataset, self.initialSelectCall);
      }
    };

    this.setInitialSelected();
    this.setTextValues();
    this.element.trigger('rendered');
    return this;
  },

  /**
   * Set the initially selected elements
   * @private
   */
  setInitialSelected() {
    const self = this;
    let selected = 0;
    let selector;
    let selectorData;

    const setInitialSelected = function (node, d, selectedIdx) {
      if (node.selected && selected < 1) {
        selected++;
        selector = d3.select(self.svg.selectAll('.line-group').nodes()[selectedIdx]);
        selectorData = d;
      }
    };

    this.settings.dataset.forEach(function (d, setIdx) {
      if (d) {
        setInitialSelected(d, d, setIdx);
      }
    });

    this.settings.dataset.forEach(function (d, setIdx) {
      if (d || d.data) {
        d.data.forEach(function (d2) {
          setInitialSelected(d2, d, setIdx);
        });
      }
    });

    if (selected > 0) {
      self.initialSelectCall = true;
      charts.selectElement(selector, self.svg.selectAll('.line-group'), selectorData, self.element, self.settings.dataset, self.initialSelectCall);
    }
    self.initialSelectCall = false;
  },

  /**
   * Sets yaxis labels to not cut off or overlap.
   * @private
   */
  setTextValues() {
    const self = this;
    const yAxis = { el: this.element[0].querySelector('.line-chart .axis.y') };
    const line = { el: yAxis.el.querySelector('.tick line') };
    const ticks = [].slice.call(yAxis.el.querySelectorAll('.tick text'));
    const leftAxis = this.settings?.axisLabels?.left;
    const isLeftAxis = typeof leftAxis === 'string' && leftAxis.trim() !== '';
    const brief = {
      maxWidth: this.element.width(),
      boxWidth: isLeftAxis ? 23 : 43,
      transMatrix: this.svg?.node()?.transform?.baseVal?.consolidate()?.matrix
    };
    brief.transY = brief.transMatrix?.f || 30;
    brief.customCss = () => ({
      tooltip: { maxWidth: `${brief.maxWidth}px` },
      arrow: { left: this.isRTL ? 'calc(100% - 20px)' : '20px' }
    });

    yAxis.width = yAxis.el.getBBox().width;
    line.width = line.el.getBBox().width;
    brief.xDiff = yAxis.width - line.width;

    ticks.forEach((tick, i) => {
      const text = tick.textContent;
      const textWidth = charts.calculateTextRenderWidth(text);
      const parentNode = tick.parentNode;
      if (textWidth >= brief.boxWidth) {
        const calculatePos = (rect) => {
          const numOfLines = Math.ceil(textWidth / brief.maxWidth);
          let x = rect.left;
          let y = rect.top;
          x = x < 0 ? 30 : x;
          y = (y < 0 ? 30 : y) - 36;
          if (numOfLines > 1) {
            y -= (33 * ((numOfLines - 1) * 0.5));
          }
          if (this.isRTL) {
            x = rect.left - textWidth + 5;
          }
          return { x, y };
        };
        brief.elem = tick;

        if (!env.browser.isIE11()) {
          tick.classList.add('hidden');
          d3.select(parentNode).append('foreignObject')
            .attr('overflow', 'visible')
            .attr('width', `${brief.boxWidth}`)
            .attr('height', '16')
            .attr('class', `foreign-object tick-y${i}`)
            .attr('x', `-${(brief.boxWidth + (this.isRTL ? 12 : 16))}`)
            .attr('y', '-1em')
            .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
            .html(`<div class="text ellipsis" resizeable="false" xmlns="http://www.w3.org/1999/xhtml">${text}</div>`);
          brief.elem = parentNode.querySelector('.text');
        } else {
          tick.textContent = charts.trimText(text, 5);
        }

        d3.select(brief.elem)
          .on(`mouseover.${self.namespace}`, function () {
            const pos = calculatePos(this.getBoundingClientRect());
            charts.showTooltip(pos.x, pos.y, text, 'top', brief.customCss());
          })
          .on(`mouseout.${this.namespace}`, () => charts.hideTooltip());
      }
    });

    if (!isLeftAxis) {
      // Reasign values, could be truncation applied
      yAxis.width = yAxis.el.getBBox().width;
      line.width = line.el.getBBox().width;
      brief.xDiff = yAxis.width - line.width;
      const variations = [
        { min: 0, max: 23, val: 62 },
        { min: 23, max: 26, val: 65 },
        { min: 26, max: 30, val: 67 },
        { min: 30, max: 32, val: 69 },
        { min: 32, max: 34, val: 70 },
        { min: 34, max: 38, val: 71 },
        { min: 38, max: 42, val: 73 },
        { min: 42, max: 47, val: 77 },
        { min: 47, max: 55, val: 78 }
      ];
      const altered = variations.filter(n => brief.xDiff >= n.min && brief.xDiff < n.max);

      // Some manually altered variations
      if (altered.length) {
        brief.newX = altered[0].val;
        d3.select(this.svg.node()).attr('transform', `translate(${brief.newX},${brief.transY})`);
        if (env.browser.isIE11() && this.isRTL) {
          d3.selectAll('.line-chart .axis.y .tick text').attr('x', (brief.boxWidth + 3));
        }
      }
    }
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
    this.element.empty();

    if (settings && settings.dataset) {
      this.settings.dataset = settings.dataset;
    }
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
      this.element.find('.line-group .line').off(events(['click', 'contextmenu']));
      this.element.find('.line-group .symbol')
        .off(events(['mouseenter', 'mouseleave', 'click', 'contextmenu']));

      this.element.off(events(['updated', 'resize']));
    }
    $('body').off(`resize.${this.namespace}`);
    $('html').off(`themechanged.${this.namespace}`);

    if (this.dots && this.element) {
      this.element.find(`.line-group .${this.dots.class}`)
        .off(events(['mouseenter', 'mouseleave', 'click', 'contextmenu']));
      delete this.dots;
    }

    delete this.namespace;
    return this;
  },

  /**
   * Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    charts.removeTooltip();
    if (this.element) {
      this.element.empty().removeClass('line-chart');
      $.removeData(this.element[0], COMPONENT_NAME);
      $.removeData(this.element[0], 'chart');
    }
  }
};

export { Line, COMPONENT_NAME };
