/* eslint-disable no-nested-ternary, prefer-arrow-callback */

// Other Shared Imports
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'line';

/**
 * A line chart or line graph is a type of chart which displays information as a series of data
 * points called 'markers' connected by straight line segments.
 * @class Line
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 *
 * @param {array} [settings.dataset=[]] The data to use in the line/area/bubble.
 * @param {function|string} [settings.tooltip] A custom tooltip or tooltip renderer function
 * for the whole chart.
 * @param {string} [settings.isArea] Render as an area chart.
 * @param {string} [settings.isBubble=false] Render as a bubble chart.
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
 * @param {boolean} [settings.redrawOnResize=true] If true, the component will not resize when resizing the page.
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
    const isFormatter = !!this.settings.formatterString;
    const format = function (value) {
      return isFormatter ? d3.format(self.settings.formatterString)(value) : value;
    };

    this.element.addClass(`line-chart${self.settings.isBubble ? ' bubble' : ''}`);

    // Handle Empty Data Set
    if (self.settings.dataset.length === 0) {
      self.element.emptymessage(self.settings.emptyMessage);
      return this;
    }

    const dots = {
      radius: 5,
      radiusOnHover: 7,
      strokeWidth: 2,
      class: 'dot'
    };

    if (self.settings.isBubble) {
      dots.radius = 0;
      dots.radiusOnHover = 0;
      dots.strokeWidth = 0;
    }
    $.extend(true, dots, this.settings.dots);

    const isRTL = Locale.isRTL();

    let tooltipInterval;
    const tooltipDataCache = [];
    let tooltipData = self.settings.tooltip;

    // Config axis labels
    let i;
    let l;
    const axisLabels = {};
    const isAxisLabels = { atLeastOne: false };
    const axisArray = ['left', 'top', 'right', 'bottom'];

    if (self.settings.axisLabels) {
      $.extend(true, axisLabels, self.settings.axisLabels);
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
    let longestLabelLength = 0;
    const dataset = this.settings.dataset;

    const isAxisXRotate = (self.settings.xAxis && self.settings.xAxis.rotate !== undefined); // TODO
    const getMaxes = function (d, option) {
      return d3.max(d.data, function (maxData) {
        return option ? maxData.value[option] : maxData.value;
      });
    };

    if (isAxisXRotate) {
      // get the longeset label
      dataset[0].data.map(function (d) {  //eslint-disable-line
        if (d.name.length > longestLabel.length) {
          longestLabel = d.name;
        }
      });
      longestLabelLength = longestLabel.length;
    }

    const hideDots = (this.settings.hideDots);
    const parent = this.element.parent();
    const isCardAction = !!$('.widget-chart-action', parent).length;
    const isViewSmall = parent.width() < 450;
    const margin = {
      top: (isAxisLabels.top ? (isCardAction ? 15 : 40) : (isCardAction ? 5 : 30)),
      right: (isAxisLabels.right ? (isViewSmall ? 45 : 65) : (isViewSmall ? 45 : 55)),
      bottom: (isAxisLabels.bottom ? (isAxisXRotate ? 60 : 50) :
        (isAxisXRotate ? (longestLabelLength * 5) + 35 : 35)),
      left: (isAxisLabels.right ? (isViewSmall ? 55 : 75) : (isViewSmall ? 45 : 65))
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

    const names = dataset[0].data.map(function (d) {
      return d.name;
    });

    const valueFormatterString = {};

    if (dataset[0] && dataset[0].valueFormatterString) {
      $.extend(true, valueFormatterString, dataset[0].valueFormatterString);
    }

    const formatValue = function (s, value) {
      return !$.isEmptyObject(valueFormatterString) && !!s ?
        (d3.format(s)(s === '0.0%' ? value / 100 : value)) : value;
    };

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
    const x = ((!!self.settings.xAxis && !!self.settings.xAxis.scale) ?
      (self.settings.xAxis.scale) : (d3.scaleLinear())).range([0, width]);

    const y = d3.scaleLinear().range([height, 0]);
    const z = d3.scaleLinear().range([1, 25]);

    if (this.settings.isBubble) {
      maxes = {
        x: dataset.map(function (d) { return getMaxes(d, 'x'); }),
        y: dataset.map(function (d) { return getMaxes(d, 'y'); }),
        z: dataset.map(function (d) { return getMaxes(d, 'z'); })
      };
    } else {
      maxes = dataset.map(function (d) { return getMaxes(d); });
    }

    const entries = d3.max(dataset.map(function (d) { return d.data.length; })) - 1;
    const xScale = x.domain(!!self.settings.xAxis && !!self.settings.xAxis.domain ?
      (self.settings.xAxis.domain) :
      ([0, self.settings.isBubble ? d3.max(maxes.x) : entries]));

    const yScale = y.domain([0, d3.max(self.settings.isBubble ? maxes.y : maxes)]).nice();
    const zScale = z.domain([0, d3.max(self.settings.isBubble ? maxes.z : maxes)]).nice();
    let numTicks = entries;
    if (self.settings.xAxis && self.settings.xAxis.ticks) {
      numTicks = self.settings.xAxis.ticks === 'auto' ? Math.max(width / 85, 2) : self.settings.xAxis.ticks;
      if (self.settings.isBubble && isViewSmall) {
        numTicks = Math.round(entries / 2);
      }
    }

    const xAxis = d3.axisBottom(xScale)
      .ticks(numTicks)
      .tickPadding(10)
      .tickSize(self.settings.isBubble ? -(height + 10) : 0)
      .tickFormat(function (d, j) {
        if (self.settings.xAxis) {
          if (self.settings.xAxis.formatter) {
            return self.settings.xAxis.formatter(d, j);
          }
          if (self.settings.xAxis.ticks === 'auto') {
            return names[d];
          }
        }
        return self.settings.isBubble ? d : names[j];
      });

    const yAxis = d3.axisLeft(yScale)
      .ticks(8)
      .tickSize(-(width + 20))
      .tickPadding(isRTL ? -18 : 20);

    if (self.settings.yAxis && self.settings.yAxis.formatter) {
      yAxis.tickFormat(function (d, k) {
        if (typeof self.settings.yAxis.formatter === 'function') {
          return self.settings.yAxis.formatter(d, k);
        }
        return d;
      });
    }

    if (self.settings.yAxis && self.settings.yAxis.ticks) {
      yAxis.ticks(self.settings.yAxis.ticks.number, self.settings.yAxis.ticks.format);
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

      const addAxis = function (pos) {
        if (isAxisLabels[pos]) {
          axisLabelsGroup.append('text')
            .attr('class', `axis-label-${pos}`)
            .attr('text-anchor', 'middle')
            .attr('transform', isRTL ? '' : place[pos])
            .style('font-size', '1.25em')
            .style('transform', isRTL ? placeStyle[pos] : '')
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

    if (self.settings.isBubble) {
      self.svg.selectAll('.x.axis .tick line, .y.axis .tick line').style('opacity', 0);
      self.svg.select('.x.axis .tick line').attr('x2', '-10').style('opacity', 1);
      self.svg.select('.y.axis .tick line').style('opacity', 1);
    }

    if (isRTL) {
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
        .attr('transform', `rotate(${self.settings.xAxis.rotate})`)
        .style('text-anchor', 'start');
    }

    if (self.settings.xAxis && self.settings.xAxis.formatText) {
      self.svg.selectAll('.x.axis .tick text').each(function (m) {
        const elem = d3.select(this);
        const text = d3.select(this).text();
        const markup = self.settings.xAxis.formatText(text, m);

        elem.html(markup);
      });
    }

    // Create the line generator
    const line = d3.line()
      .x(function (d, n) {
        if (!!self.settings.xAxis && !!self.settings.xAxis.parser) {
          return xScale(self.settings.xAxis.parser(d, n));
        }
        return xScale(self.settings.isBubble ? d.value.x : n);
      })
      .y(function (d) {
        return yScale(self.settings.isBubble ? d.value.y : d.value);
      });

    // Append the lines
    dataset.forEach(function (d, lineIdx) {
      const lineGroups = self.svg.append('g')
        .attr('data-group-id', lineIdx)
        .attr('class', 'line-group');

      if (self.settings.isArea) {
        const area = d3.area()
          .x(function (dc, p) {
            return xScale(p);
          })
          .y0(height)
          .y1(function (db) {
            return yScale(self.settings.isBubble ? db.value.y : db.value);
          });

        lineGroups.append('path')
          .datum(d.data)
          .attr('fill', function () { return charts.chartColor(lineIdx, 'line', d); })
          .style('opacity', '.2')
          .attr('class', 'area')
          .attr('d', area);
      }

      const path = lineGroups.append('path')
        .datum(d.data)
        .attr('d', line(d.data))
        .attr('stroke', function () {
          return self.settings.isBubble ? '' : charts.chartColor(lineIdx, 'line', d);
        })
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('class', 'line')
        .on('click.chart', function () {
          charts.selectElement(d3.select(this.parentNode), self.svg.selectAll('.line-group'), d, self.element);
        });

      // Add animation
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(self.settings.animate ? 600 : 0)
        .ease(d3.easeCubic)
        .attr('stroke-dashoffset', 0);

      if (!hideDots) {
        lineGroups.selectAll('circle')
          .data(d.data)
          .enter()
          .append('circle')
          .attr('class', dots.class)
          .attr('cx', function (dd, p) {
            if (!!self.settings.xAxis && !!self.settings.xAxis.parser) {
              return xScale(self.settings.xAxis.parser(dd, p));
            }
            return xScale(self.settings.isBubble ? dd.value.x : p);
          })
          .attr('cy', function (de) { return yScale(self.settings.isBubble ? 0 : de.value); })
          .attr('r', dots.radius)
          .style('stroke-width', dots.strokeWidth)
          .style('fill', function () { return charts.chartColor(lineIdx, 'line', d); })
          .style('opacity', (self.settings.isBubble ? '.7' : '1'))
          .on('mouseenter.chart', function (mouseEnterData) {
            const rect = this.getBoundingClientRect();
            let content = `<p><b>${mouseEnterData.name} </b> ${format(mouseEnterData.value)}</p>`;

            const show = function () {
              const size = charts.tooltipSize(content);
              let posX = rect.left - (size.width / 2) + 6;
              const posY = rect.top - size.height - 18;

              posX = self.settings.isBubble ?
                ((rect.left + (rect.width / 2)) - (size.width / 2)) : posX;

              if (content !== '') {
                charts.showTooltip(posX, posY, content, 'top');
              }
            };

            if (self.settings.isBubble) {
              content = `${'' +
                '<div class="chart-swatch" style="min-width: 95px;">' +
                  '<div class="swatch-caption">' +
                    '<span style="background-color:'}${charts.chartColor(lineIdx, 'line', mouseEnterData)};" class="indicator-box"></span>` +
                    `<b>${mouseEnterData.name}</b>` +
                  '</div>';

              for (const key in mouseEnterData) {  //eslint-disable-line
                if (mouseEnterData.hasOwnProperty(key)) {  //eslint-disable-line
                  if (typeof mouseEnterData[key] !== 'object') {
                    content += `${'' +
                        '<div class="swatch-row">' +
                          '<span>'}${labels[key]}</span>` +
                          `<b>${d.name}</b>` +
                        '</div>';
                  } else {
                    const obj2 = mouseEnterData[key];
                    for (const key2 in obj2) {  //eslint-disable-line
                      if (obj2.hasOwnProperty(key2)) {  //eslint-disable-line
                        content += `${'' +
                            '<div class="swatch-row">' +
                              '<span style="text-transform: capitalize;">'}${labels[key][key2]}</span>` +
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
            }

            // Circle associated with hovered point
            d3.select(this).attr('r', function (df) {
              return self.settings.isBubble ? (2 + zScale(df.value.z)) : dots.radiusOnHover;
            });
          })
          .on('mouseleave.chart', function () {
            clearInterval(tooltipInterval);
            charts.hideTooltip();
            d3.select(this).attr('r', function (dg) {
              return self.settings.isBubble ? zScale(dg.value.z) : dots.radius;
            });
          })
          .on('click.chart', function (dh) {
            charts.selectElement(d3.select(this.parentNode), self.svg.selectAll('.line-group'), dh, self.element);
          });

        if (self.settings.isBubble) {
          // Add animation
          lineGroups.selectAll('circle')
            .attr('cy', function (di) { return yScale(di.value.y); })
            .transition().duration(self.settings.animate ? 750 : 0)
            .ease(d3.easeCubic)
            .attr('r', function (dj) { return zScale(dj.value.z); });
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

    if (this.settings.showLegend) {
      charts.addLegend(series, 'line', this.settings, this.element);
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
        charts.selectElement(selector, self.svg.selectAll('.line-group'), selectorData, self.element);
      }
    };

    this.setInitialSelected();
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
      charts.selectElement(selector, self.svg.selectAll('.line-group'), selectorData, self.element);
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

    if (settings && settings.dataset) {
      this.settings.dataset = settings.dataset;
    }
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
   * Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.element.empty().removeClass('line-chart');
    charts.removeTooltip();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    $.removeData(this.element[0], 'chart');
  }
};

export { Line, COMPONENT_NAME };
