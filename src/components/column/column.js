/* eslint-disable no-nested-ternary, prefer-arrow-callback, no-unused-vars, no-underscore-dangle */

// Other Shared Imports
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { charts } from '../charts/charts';
import { theme } from '../theme/theme';
import { Locale } from '../locale/locale';

import '../emptymessage/emptymessage.jquery';

// Settings and Options
const COMPONENT_NAME = 'column';

/**
* A column chart displays a series as a set of vertical bars that are grouped by category.
* Column charts are useful for showing data changes over a period of time or for illustrating
* comparisons among items.
* @class Column
* @param {string} element The plugin element for the constuctor
* @param {string} [settings] The settings element.
*
* @param {array} [settings.dataset = []] The data to use in the line/area/bubble.
* @param {boolean} [settings.isStacked = false] Set to true if its a stacked column chart
* @param {boolean} [settings.showLegend = true] If false the legend will not be shown.
* @param {boolean|string} [settings.animate = true] true|false - will do or not do the animation. 'initial' will do only first time the animation.
* @param {boolean} [settings.redrawOnResize = true]  If set to false the component will not redraw when the page or parent is resized.
* @param {boolean} [settings.useLine = false] The ability to use line chart if set to true. This will need a target value to the dataset.
* @param {boolean} [settings.hideDots=false] If true no dots are shown, along the line chart
* @param {string} [settings.format = null] The d3 axis format
* @param {string} [settings.formatterString] Use d3 format some examples can be found on http://bit.ly/1IKVhHh
* @param {number} [settings.ticks = 9] The number of ticks to show.
* @param {boolean} [settings.selectable = true] Ability to disable selections of the charts.
* @param {boolean} [settings.fitHeight=true] If true chart height will fit in parent available height.
* @param {object} [settings.xAxis] A series of options for the xAxis
* @param {number} [settings.xAxis.rotate] Rotate the elements on the x axis.
* @param {array} [settings.axisLabels] Option to add label to any of the four sides.
* @param {function} [settings.xAxis.formatText] A function that passes the text element and a counter.
* You can return a formatted svg markup element to replace the current element.
* For example you could use tspans to wrap the strings or color them.
* @param {object} [settings.emptyMessage = { title: 'No Data', info: , icon: 'icon-empty-no-data-new' }]
* An empty message will be displayed when there is no chart data. This accepts an object of the form
* `emptyMessage: {
*   title: 'No Data Available',
*   info: 'Make a selection on the list above to see results',
*   icon: 'icon-empty-no-data-new',
*   button: {text: 'xxx', click: <function>
*   }`
* Set this to null for no message or will default to 'No Data Found with an icon.'
* @param {object} [settings.localeInfo] If passed in you can override the default formatting https://github.com/d3/d3-format/blob/master/README.md#formatDefaultLocale
*/

const COLUMN_DEFAULTS = {
  dataset: [],
  isStacked: false,
  showLegend: true,
  animate: true,
  selectable: true,
  format: null,
  redrawOnResize: true,
  useLine: false,
  hideDots: false,
  ticks: 9,
  fitHeight: true,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data-new' }
};

function Column(element, settings) {
  this.settings = utils.mergeSettings(element, settings, COLUMN_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Column.prototype = {

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
    const format = value => d3.format(self.settings.formatterString || ',')(value);

    let datasetStacked;
    const dataset = this.settings.dataset;
    this.dataset = dataset;

    // Handle Empty Data Set
    if (dataset.length === 0) {
      self.element.emptymessage(self.settings.emptyMessage);
      return this;
    }

    // Axis Rotate Feature (Start)
    let longestLabel = '';
    let xRotateMarginBot = 0;
    const parent = this.element.parent();
    const isCardAction = !!$('.widget-chart-action', parent).length;
    const isViewSmall = parent.width() < 450;
    const getRotateValue = (v) => {
      const defaultAngle = '-45';
      return (typeof v !== 'undefined' && typeof v !== 'function' && v !== null) ?
        (typeof v === 'boolean' ? (v ? defaultAngle : null) : v) : null;
    };

    const xRotate = {
      large: getRotateValue(this.settings.xAxis?.rotate),
      small: getRotateValue(this.settings.xAxis?.rotateOnSmallView)
    };

    let isAxisXRotate = !!xRotate.large;
    if (isAxisXRotate) {
      xRotate.use = xRotate.large;
    }
    if (isViewSmall && !!xRotate.small) {
      isAxisXRotate = true;
      xRotate.use = xRotate.small;
    }

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
    // Axis Rotate Feature (End)

    // Config for axis labels
    let idx;
    let axisArr;
    const axisLabels = {};
    const isAxisLabels = { atLeastOne: false };
    const axisArray = ['left', 'top', 'right', 'bottom'];

    if (s.axisLabels) {
      $.extend(true, axisLabels, s.axisLabels);
    }

    if (!$.isEmptyObject(axisLabels)) {
      for (idx = 0, axisArr = axisArray.length; idx < axisArr; idx++) {
        const thisAxis = axisLabels[axisArray[idx]];
        if (thisAxis && typeof thisAxis === 'string' && $.trim(thisAxis) !== '') {
          isAxisLabels[axisArray[idx]] = true;
          isAxisLabels.atLeastOne = true;
        }
      }
    }

    const axisLabelsMargin = {
      top: (isAxisLabels.top ? (isCardAction ? 15 : 40) : (isCardAction ? 5 : 30)),
      right: (isAxisLabels.right ? 65 : 55),
      bottom: (isAxisLabels.bottom ? 50 : 0),
      left: (isAxisLabels.left ? 75 : 65)
    };

    const isRTL = Locale.isRTL();
    const isPositiveNegative = (this.settings.type === 'column-positive-negative' ||
       this.settings.type === 'positive-negative');
    const isSingle = (dataset.length === 1);
    this.isSingle = isSingle;
    const isGrouped = !(isSingle || !isSingle && self.settings.isStacked);
    this.isGrouped = isGrouped;

    const margin = {
      top: 40,
      right: 40,
      bottom: (isSingle && dataset[0].name === undefined ?
        (self.settings.isStacked ? 20 : (isAxisXRotate ? xRotateMarginBot + 35 : 50)) : 35),
      left: 45
    };

    const legendHeight = 40;
    const parentAvailableHeight = utils.getParentAvailableHeight(self.element[0]);
    const useHeight = s.fitHeight ?
      parentAvailableHeight : parseInt(parent.height(), 10);
    const width = parent.width() - margin.left - margin.right - 10;
    const height = useHeight - margin.top - margin.bottom -
        (isSingle && dataset[0].name === undefined ?
          (self.settings.isStacked || isPositiveNegative ? (legendHeight - 10) : 0) : legendHeight);
    let yMinTarget;
    let yMaxTarget;
    let series;
    let seriesStacked;
    let pnAttributes;
    let pnColors;
    let pnPatterns;
    let pnLegends;
    let pnSeries;

    let yMin = d3.min(dataset, function (group) {
      return d3.min(group.data, function (d) {
        return d.value;
      });
    });

    let yMax = d3.max(dataset, function (group) { //eslint-disable-line
      return d3.max(group.data, function (d) {
        return d.value;
      });
    });

    if (isPositiveNegative) {
      yMinTarget = d3.min(dataset, function (group) {
        return d3.min(group.data, function (d) {
          return d.target;
        });
      });

      yMaxTarget = d3.max(dataset, function (group) {
        return d3.max(group.data, function (d) {
          return d.target;
        });
      });

      yMin = d3.min([yMin, yMinTarget]);
      yMax = d3.max([yMax, yMaxTarget]);

      pnAttributes = { target: null, positive: null, negative: null };
      pnLegends = { target: 'Target', positive: 'Positive', negative: 'Negative' };
      pnColors = { target: 'neutral', positive: 'good', negative: 'error' };
      pnPatterns = {};

      if (dataset[0]) {
        if (dataset[0].attributes) {
          $.extend(true, pnAttributes, dataset[0].attributes);
        }
        if (dataset[0].colors) {
          $.extend(true, pnColors, dataset[0].colors);
        }
        if (dataset[0].legends) {
          $.extend(true, pnLegends, dataset[0].legends);
        }
        if (dataset[0].patterns) {
          $.extend(true, pnPatterns, dataset[0].patterns);
        }
      }
      // Converting object into array
      pnSeries = [];
      $.each(pnLegends, function (key, val) {
        const args = {
          name: val,
          color: pnColors[key],
          pattern: pnPatterns[key],
          option: key
        };
        if (pnAttributes[key]) {
          args.data = { attributes: pnAttributes[key] };
        }
        pnSeries.push(args);
      });
    }

    this.element.addClass('column-chart');

    let tooltipInterval;
    const tooltipDataCache = [];
    const tooltipData = self.settings.tooltip;

    const x0 = d3.scaleBand()
      .range([0, width])
      .round(true)
      .padding(this.settings.type === 'column-grouped' ? 0.1 : 0);

    const x1 = d3.scaleBand();

    const y = d3.scaleLinear()
      .range([height, 0]);

    let xScale = null;
    let yScale = null;

    if (self.settings.isStacked) {
      // Map the Data Sets and Stack them.
      const yStack = { y1: [], y2: [] };
      if (isSingle) {
        datasetStacked = dataset[0].data.map(function (d, i) {
          let y0 = 0;
          if (i === 0) {
            yStack.y1.push(d.value);
            yStack.y2.push(0);
          } else {
            y0 = yStack.y1[0] + yStack.y2[0];
            yStack.y1[0] = d.value;
            yStack.y2[0] = y0;
          }
          return [$.extend({}, d, {
            y0,
            y: d.value,
            x: d.name,
            color: d.color,
            pattern: d.pattern,
            parentName: d.name,
            tooltip: d.tooltip
          })];
        });
      } else {
        datasetStacked = dataset.map(function (d, i) {
          return d.data.map(function (o, i2) {
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
              x: o.name,
              color: o.color,
              pattern: o.pattern,
              parentName: d.name,
              tooltip: d.tooltip
            });
          });
        });
      }

      const stack = d3.stack();
      stack(datasetStacked);

      xScale = d3.scaleBand()
        .domain(d3.range(datasetStacked[0].length))
        .rangeRound([0, width], 0.05);

      if (isSingle && self.settings.isStacked) {
        xScale.paddingInner(0.095);
      }

      yScale = d3.scaleLinear()
        .domain([0,
          d3.max(datasetStacked, function (d) {
            return d3.max(d, function (d1) {
              return d1.y0 + d1.y;
            });
          })
        ])
        .range([0, height]);
    }

    // List the values along the x axis
    const xAxisValues = dataset[0].data.map(function (d) { return d.name; });

    const xAxis = d3.axisBottom(x0)
      .tickSize(0)
      .tickPadding(12);

    const yAxis = d3.axisLeft(y)
      .tickSize(-width)
      .tickPadding(isRTL ? -12 : 12)
      .ticks(self.settings.ticks || 9, d3.format(self.settings.format || 's'));

    if (self.settings.yAxis) {
      if (self.settings.yAxis.formatter) {
        yAxis.tickFormat(function (d, k) {
          if (typeof self.settings.yAxis.formatter === 'function') {
            return self.settings.yAxis.formatter(d, k);
          }
          return d;
        });
      }

      if (self.settings.yAxis.ticks &&
          self.settings.yAxis.ticks.number > 1 && self.settings.yAxis.ticks.format) {
        yAxis.ticks(self.settings.yAxis.ticks.number, self.settings.yAxis.ticks.format);
      }
    }

    const svg = d3.select(this.element[0])
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + (isAxisLabels.atLeastOne ? 12 : 0))
      .append('g')
      .attr('transform', `translate(${isRTL ? margin.left + 5 : (isAxisLabels.atLeastOne ? margin.left + 11 : margin.left)}
        ,${margin.top - (isAxisLabels.atLeastOne ? 5 : 0)})`);

    this.svg = svg;

    // Get the Different Names
    let names = dataset.map(function (d) {
      return d.name;
    });

    // Get the Maxes of each series
    let maxesStacked;
    const maxes = dataset.map(function (d) {
      return d3.max(d.data, function (maxD) {
        return isPositiveNegative ? maxD.target : maxD.value;
      });
    });

    if (self.settings.isStacked) {
      maxesStacked = datasetStacked.map(function (maxesD) {
        return d3.max(maxesD, function (d) { return d.y + d.y0; });
      });
    }

    if (isSingle) {
      names = dataset[0].data.map(function (d) {
        return d.name;
      });
    }

    // Extra ticks
    if (isPositiveNegative) {
      yMin += yMin / y.ticks().length;
      maxes[0] += maxes[0] / (y.ticks().length / 2);
    }

    // Set series
    (function () {
      if (self.settings.isStacked && isSingle) {
        series = dataset[0].data;
      } else {
        let lm;
        // Loop backwards to catch and override with found first custom info from top
        for (let i = dataset.length - 1, l = -1; i > l; i--) {
          lm = dataset[i].data.map(function (d) {
            return d;
          });
          $.extend(true, series, lm);
          // Convert back to array from object
          series = $.map(series, function (d) {
            return d;
          });
        }
      }
    }());

    if (self.settings.isStacked && !isSingle) {
      seriesStacked = names.map(function (d, i) {
        return dataset[i];
      });
    }

    x0.domain(self.settings.isStacked ? xAxisValues : names);
    x1.domain(xAxisValues)
      .rangeRound([0, (isSingle || self.settings.isStacked) ? width : x0.bandwidth()]);
    y.domain([(yMin < 0 ? yMin : (self.settings.minValue || 0)), d3.max(self.settings.isStacked ?
      maxesStacked : maxes)]).nice();

    if (!isSingle || (isSingle && !self.settings.isStacked)) {
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height + (isPositiveNegative ? 10 : 0)})`)
        .call(xAxis);
    }

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Adjust extra(x) space for negative values for RTL
    if (isRTL && yMin < 0) {
      let yMaxLength = 0;
      let tempLength;

      svg.selectAll('.axis.y text')
        .attr('class', function (d) {
          tempLength = d3.select(this).text().length;
          yMaxLength = (tempLength > yMaxLength) ? tempLength : yMaxLength;
          return d < 0 ? 'negative-value' : 'positive-value';
        })
        .attr('x', function (d) {
          return (yMaxLength * (d < 0 ? 9 : 5));
        });
    }

    if (isAxisLabels.atLeastOne) {
      const axisLabelGroup = self.svg.append('g').attr('class', 'axis-labels');
      const widthAxisLabel = width - 45;

      const place = {
        top: `translate(${widthAxisLabel / 2},${-10})`,
        right: `translate(${widthAxisLabel + 53},${height / 2})rotate(90)`,
        bottom: `translate(${widthAxisLabel / 2},${height + 47})`,
        left: `translate(${-35},${height / 2})rotate(-90)`
      };

      const placeStyle = {
        top: `rotate(0deg) scaleX(-1) translate(-${widthAxisLabel / 2}px, ${-10}px)`,
        right: `rotate(90deg) scaleX(-1) translate(-${(height / 2) + 5}px, -${widthAxisLabel + (isRTL ? 55 : 28)}px)`,
        bottom: `rotate(0deg) scaleX(-1) translate(-${widthAxisLabel / 2}px, ${height + 47}px)`,
        left: `rotate(90deg) scaleX(-1) translate(-${(height / 2 - 5)}px, ${isRTL ? 35 : 55}px)`
      };

      const addAxis = (pos) => {
        if (isAxisLabels[pos]) {
          axisLabelGroup.append('text')
            .attr('class', `axis-label-${pos}`)
            .attr('text-anchor', 'middle')
            .attr('transform', isRTL ? '' : place[pos])
            .style('font-size', '1.25em')
            .style('transform', isRTL ? placeStyle[pos] : '')
            .text(axisLabels[pos]);
        }
      };

      for (idx = 0, axisArr = axisArray.length; idx < axisArr; idx++) {
        addAxis(axisArray[idx]);
      }
    }

    // Make an Array of objects with name + array of all values
    let dataArray = [];
    dataset.forEach(function (d) {
      dataArray.push($.extend({}, d, { values: d.data }));
    });

    if (isSingle) {
      dataArray = [];
      names = dataset[0].data.forEach(function (d) {
        dataArray.push(d);
      });
    }

    let targetBars;
    let pnBars;
    const barMaxWidth = 35;
    const barsInGroup = dataArray[0] && dataArray[0].values ? dataArray[0].values.length : 0;
    const isGroupSmaller = ((width / dataArray.length) > (barMaxWidth * (barsInGroup + 1)));
    const color = function (colorStr) {
      return charts.chartColor(0, '', { color: colorStr });
    };
    const onEndAllTransition = function (transition, callback) {
      let n;
      if (transition.empty()) {
        callback();
      } else {
        n = transition.size();
        transition.on(`end.${self.namespace}`, function () {
          n--;
          if (n === 0) {
            callback();
          }
        });
      }
    };

    const drawBars = function (isTargetBars) {
      let bars; //eslint-disable-line
      isTargetBars = isPositiveNegative && isTargetBars;

      // Add the bars - done different depending on if grouped or singlular
      if (isSingle || isPositiveNegative) {
        const barsType = isTargetBars ? 'target-bar' : 'bar';
        bars = self.svg.selectAll(`rect.${barsType}`)
          .data(self.settings.isStacked ? datasetStacked : dataArray)
          .enter()
          .append('rect')
          .call((d) => {
            d._groups.forEach((thisBars) => {
              thisBars.forEach((bar) => {
                const dat = bar.__data__;
                utils.addAttributes($(bar), dat, dat.attributes, barsType);
              });
            });
          })
          .attr('class', function (d, i) {
            let classStr = `bar series-${i}`;

            if (isPositiveNegative) {
              classStr = (isTargetBars ? (`target-bar series-${i}`) : classStr) +
                (d.value > 0 ? ' positive' : ' negative');
            }
            return classStr;
          })
          .attr('width', Math.min.apply(null, [x1.bandwidth() - 2, barMaxWidth]))
          .attr('x', function (d) {
            return self.settings.isStacked ? xScale(0) :
              (x1(d.name) + (x1.bandwidth() - barMaxWidth) / 2);
          })
          .attr('y', function () {
            return y(0) > height ? height : y(0);
          })
          .attr('height', function () {
            return 0;
          })
          .attr('mask', function (d) {
            return !isPositiveNegative ? null :
              (isTargetBars ? (pnPatterns.target ? `url(#${pnPatterns.target})` : null) :
                (d.value < 0 ? (pnPatterns.negative ? `url(#${pnPatterns.negative})` : null) :
                  (pnPatterns.positive ? `url(#${pnPatterns.positive})` : null))
              );
          })
          .attr('data-index', function (d, i) {
            return i;
          })
          .style('cursor', !self.settings.selectable ? 'inherit' : 'pointer')
          .style('fill', function (d) {
            return !isPositiveNegative ? null :
              color(isTargetBars ? pnColors.target :
                (d.value < 0 ? pnColors.negative : pnColors.positive));
          });

        if (isPositiveNegative) {
          const yTextPadding = 12;
          svg.selectAll(isTargetBars ? '.target-bartext' : '.bartext')
            .data(dataArray)
            .enter()
            .append('text')
            .attr('class', function (d) {
              return (isTargetBars ? 'target-bartext' : 'bartext') +
                (d.value > 0 ? ' positive' : ' negative');
            })
            .attr('text-anchor', 'middle')
            .attr('x', function (d) {
              return (x1(d.name) + (x1.bandwidth()) / 2) * (isRTL ? -1 : 1);
            })
            .attr('y', function (d) {
              return isTargetBars ?
                (y(d.target) - (yTextPadding / 2)) : (y(d.value > 0 ? 0 : d.value) + yTextPadding);
            })
            .style('opacity', 0)
            .style('fill', function (d) {
              return isTargetBars ? '' /* color(pnColors.target) */ :
                (d.value < 0 ? color(pnColors.negative) : color(pnColors.positive));
            })
            .style('font-weight', 'bold')
            .text(function (d) {
              return format(isTargetBars ? d.target : d.value);
            });
        }

        bars.transition().duration(self.settings.animate ? 1000 : 0)
          .call(onEndAllTransition, function () {
            svg.selectAll('.target-bartext, .bartext')
              .transition().duration(self.settings.animate ? 300 : 0).style('opacity', 1);
          })
          .attr('y', function (d) {
            const r = self.settings.isStacked ? (height - yScale(d[0].y) - yScale(d[0].y0)) :
              (d.value < 0 ? y(0) : y(d.value));
            return (
              isTargetBars ? y(d.target) : d.value < 0 ? r : r > (height - 3) ? height - 2 : r
            );
          })
          .attr('height', function (d) {
            let r;
            if (self.settings.isStacked) {
              r = yScale(d[0].y);
            } else if (d.value < 0) {
              r = (height - y(0)) - (height - y(d.value));
            } else {
              r = (height - y(d.value)) - (height - y(0));
            }
            r = d.value < 0 ? r : (r < 3 ? 2 : (r > height ? (height - y(d.value)) : r));
            return isTargetBars ? (height - y(d.target)) - (height - y(0)) : r;
          });
      } else {
        const xValues = svg.selectAll('.x-value')
          .data(self.settings.isStacked ? datasetStacked : dataArray)
          .enter()
          .append('g')
          .attr('class', 'series-group g')
          .attr('data-group-id', function (d, i) {
            return i;
          })
          .attr('transform', function (d) {
            let x = x0(self.settings.isStacked ? xAxisValues[0] : d.name);
            const bandwidth = x0.bandwidth();
            if (!self.settings.isStacked && isGroupSmaller &&
              bandwidth > ((barMaxWidth * dataArray.length) * 2)) {
              x += (((bandwidth / 2) / dataArray.length) / 2);
            }
            if (self.isGrouped && !self.settings.isStacked) {
              if (d.data.length === 2) {
                if (bandwidth < 120) {
                  x -= (barMaxWidth / 2) - 4;
                } else {
                  x = x0(d.name);
                }
              } else {
                const barDiff = (barMaxWidth / (bandwidth > 150 ? 2 : 4));
                x -= barDiff;
              }
            }
            if (self.settings.isStacked && width < 290 && bandwidth < 40) {
              const len = dataArray[0]?.data?.length || 0;
              x = ((width - (bandwidth * len)) / len) / 2;
            }
            return `translate(${x},0)`;
          });

        bars = xValues.selectAll('rect')
          .data(function (d) { return self.settings.isStacked ? d : d.values; })
          .enter()
          .append('rect')
          .call((d) => {
            d._groups.forEach((thisBars) => {
              thisBars.forEach((bar) => {
                const dat = bar.__data__;
                utils.addAttributes($(bar), dat, dat.attributes, 'bar');
              });
            });
          })
          .attr('class', function (d, i) {
            return `series-${i} bar`;
          })
          .attr('width', Math.min.apply(null, [x1.bandwidth() - 2, barMaxWidth]))
          .attr('x', function (d, i) {
            const width = Math.min.apply(null, [x1.bandwidth() - 2, barMaxWidth]);  //eslint-disable-line
            return self.settings.isStacked ? xScale(i) :
              (x1.bandwidth() / 2 + ((width + 2) * i) - (dataArray[0].values.length === 1 ||
                dataArray[0].values.length === 5 ||
                dataArray[0].values.length === 4 ? (width / 2) : 0
              ));
          })
          .attr('y', function () { return y(0) > height ? height : y(0); })
          .attr('height', function () { return 0; });

        if (self.settings.useLine) {
          if (dataset.length === dataset.map(d => d.line).length) {
            const xScaleLine = d3.scaleBand()
              .rangeRound([0, width])
              .domain(dataset.map(d => d.name));

            const yScaleLine = d3.scaleLinear()
              .range([height, 0])
              .domain([0, d3.max(maxes)]).nice();

            const line = d3.line()
              .x(d => (xScaleLine(d.name) + xScaleLine.bandwidth() / 2))
              .y(d => yScaleLine(d.line.value));

            const lineGroup = svg.append('g')
              .attr('class', 'line-group');

            // getting the attributes of line for automation id
            const lineAttr = dataset.map(d => d.line).filter(i => i?.attributes);

            const lineTooltip = function (elem, lineTooltipData) {
              const rect = elem.getBoundingClientRect();
              const content = `<p><b>${lineTooltipData.name}</b> ${lineTooltipData.value}</p>`;

              const show = function () {
                const size = charts.tooltipSize(content);
                const posX = rect.left - (size.width / 2) + 6;
                const posY = rect.top - size.height - 18;

                if (content !== '') {
                  if (charts.tooltip && charts.tooltip.length) {
                    charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
                  }
                  charts.showTooltip(posX, posY, content, 'top');
                }
              };

              show();
            };

            const newDark = theme.currentTheme.modeId === 'dark' && theme.new;
            const classicDark = theme.currentTheme.modeId === 'dark' && !theme.new;

            lineGroup.append('path')
              .call((d) => {
                d._groups.forEach((thisLine) => {
                  thisLine.forEach((lineEl) => {
                    utils.addAttributes($(lineEl), lineAttr[0], lineAttr[0]?.attributes);
                  });
                });
              })
              .datum(dataset)
              .attr('d', line(dataset))
              .attr('class', 'line')
              .style('opacity', 0)
              .attr('stroke', classicDark ? '#BDBDBD' : newDark ? '#C5C5C9' : theme.new && theme.currentTheme.modeId !== 'dark' ? '#3B3B3F' : '#313236')
              .attr('stroke-width', 2)
              .attr('fill', 'none');

            if (!self.settings.hideDots) {
              lineGroup.selectAll('circle')
                .data(dataset)
                .enter()
                .append('circle')
                .call((d) => {
                  d._groups.forEach((thisDot) => {
                    thisDot.forEach((dot, i) => {
                      utils.addAttributes($(dot), lineAttr[0], lineAttr[0].attributes, `dot-${i + 1}`);
                    });
                  });
                })
                .attr('class', 'dot')
                .style('opacity', 0)
                .attr('cx', d => (xScaleLine(d.name) + xScaleLine.bandwidth() / 2))
                .attr('cy', d => yScaleLine(d.line.value))
                .attr('r', 5)
                .style('fill', classicDark ? '#BDBDBD' : newDark ? '#C5C5C9' : theme.new && theme.currentTheme.modeId !== 'dark' ? '#3B3B3F' : '#313236')
                .style('stroke-width', 2)
                .style('cursor', 'default')
                .on(`mouseenter.${self.namespace}`, function (event, lineTooltipData) {
                  lineTooltip(this, lineTooltipData.line);
                })
                .on(`mouseleave.${self.namespace}`, function () {
                  charts.hideTooltip();
                });
            }
          }
        }

        bars
          .transition().duration(self.settings.animate ? 600 : 0)
          .call(onEndAllTransition, function () {
            // Add animation to line chart
            if (self.settings.useLine) {
              const line = svg.select('.line');
              const totalLength = line.node().getTotalLength();
              line
                .style('opacity', 1)
                .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(self.settings.animate ? 300 : 0)
                .ease(d3.easeCubic)
                .attr('stroke-dashoffset', 0)
                .call(onEndAllTransition, function () {
                  svg.selectAll('.dot')
                    .transition()
                    .duration(self.settings.animate ? 100 : 0)
                    .style('opacity', 1);
                });
            }
          })
          .attr('y', function (d) {
            const r = self.settings.isStacked ?
              (height - yScale(d.y) - yScale(d.y0)) : (d.value < 0 ? y(0) : y(d.value));
            return d.value < 0 ? r : (r > (height - 3) ? height - 2 : r);
          })
          .attr('height', function (d) {
            let r;
            if (self.settings.isStacked) {
              r = yScale(d.y);
            } else if (d.value <= 0) {
              r = (height - y(0)) - (height - y(d.value));
              return r;
            } else {
              r = (height - y(d.value)) - (height - y(0));
            }
            return d.value < 0 ? r : (r < 3 ? 2 : (r > height ? (height - y(d.value)) : r));
          });
      }
      return bars;
    };

    if (isPositiveNegative) {
      targetBars = drawBars(true); // Draw target bars
    }
    const bars = drawBars();

    if (isPositiveNegative) {
      pnBars = d3.selectAll([...targetBars.nodes(), ...bars.nodes()]);
    }

    if (!isPositiveNegative) {
      // Style the bars and add interactivity
      if (!self.settings.isStacked) {
        bars
          .style('fill', function (d, i) {
            return isSingle ?
              charts.chartColor(i, 'column-single', dataset[0].data[i]) :
              charts.chartColor(i, 'bar', series[i]);
          })
          .style('cursor', !self.settings.selectable ? 'inherit' : 'pointer')
          .attr('mask', function (d, i) {
            return isSingle ?
              (dataset[0].data[i].pattern ? `url(#${dataset[0].data[i].pattern})` : null) :
              (series[i].pattern ? `url(#${series[i].pattern})` : null);
          });
      } else if (self.settings.isStacked && !isSingle) {
        bars
          .style('cursor', !self.settings.selectable ? 'inherit' : 'pointer')
          .style('fill', function () {
            const thisGroup = d3.select(this.parentNode).attr('data-group-id');
            return charts.chartColor(thisGroup, 'bar', dataset[thisGroup]);
          })
          .attr('mask', function () {
            const thisGroup = d3.select(this.parentNode).attr('data-group-id');
            return (dataset[thisGroup].pattern ? `url(#${dataset[thisGroup].pattern})` : null);
          });
      } else if (self.settings.isStacked && isSingle) {
        bars
          .style('fill', function (d, i) {
            return charts.chartColor(i, 'bar', d[0]);
          })
          .attr('mask', function (d) {
            return (d[0].pattern ? `url(#${d[0].pattern})` : null);
          });
      }
    }

    $.extend(charts.settings, {
      svg,
      chartType: 'Column',
      isSingle,
      isGrouped,
      isStacked: self.settings.isStacked
    });

    const delay = 200;
    let prevent = false;
    let timer = 0;
    // Make sure the default to get prevent not bubble up.
    self.element
      .off(`dblclick.${self.namespace}`)
      .on(`dblclick.${self.namespace}`, '*', (e) => {
        e.stopImmediatePropagation();
      });

    (isPositiveNegative ? pnBars : bars)
      .on(`mouseenter.${self.namespace}`, function (event, d) {
        const i = $(this).index();
        let x;
        let y;  //eslint-disable-line
        let j;
        let l;
        let hexColor;
        let size;
        let isTooltipBottom;
        const maxBarsForTopTooltip = 6;
        const thisShape = this;
        const shape = $(this);
        let content = '';
        let tooltipTargetEl = null;
        const ePageY = event.pageY;

        const setPattern = function (pattern, hexColor) { //eslint-disable-line
          return !pattern || !hexColor ? '' :
            `${'<svg width="12" height="12">' +
              '<rect style="fill: '}${hexColor}" mask="url(#${pattern})" height="12" width="12" />` +
            '</svg>';
        };

        // Index to stroe tooltip cache data
        let tooltipIdx = i;

        // Set group info
        let thisGroup = null;
        if (self.isGrouped) {
          thisGroup = { elem: d3.select(this.parentNode) };
          thisGroup.data = thisGroup.elem.datum().values;
          thisGroup.items = thisGroup.elem.selectAll('.bar');
          thisGroup.idx = parseInt(thisGroup.elem.attr('data-group-id'), 10);
          tooltipIdx = (thisGroup.idx * thisGroup.data.length) + i;
        }

        const show = function (isTooltipBottom) { //eslint-disable-line
          size = charts.tooltipSize(content);
          const tooltipOuterHeight = charts.tooltip.outerHeight();
          let rect = null;

          if (DOM.isValidElement(tooltipTargetEl)) {
            // If target come from callback, bar or group element
            rect = tooltipTargetEl.getBoundingClientRect();
            x = rect.left - (size.width / 2) + (rect.width / 2);
            if (tooltipTargetEl !== thisGroup.elem.node()) {
              // Bar element
              y = rect.top - size.height - 10;
            } else {
              // Group element
              y = ePageY - tooltipOuterHeight - 25;
              if (isTooltipBottom) {
                y += tooltipOuterHeight + 50;
                if (y > (rect.bottom + 10)) {
                  y = rect.bottom + 10;
                }
              } else {
                y = rect.top - tooltipOuterHeight + 25;
              }
            }
          } else {
            // Default use current shape or current group element
            rect = shape[0].getBoundingClientRect();
            x = rect.left - (size.width / 2) + (shape.attr('width') / 2);
            if (self.settings.isStacked) {
              y = rect.top - size.height - 10;
            } else {
              rect = thisShape.parentNode.getBoundingClientRect();
              y = ePageY - tooltipOuterHeight - 25;
              if (dataset.length > 1) {
                x = rect.left - (size.width / 2) + (rect.width / 2);
                if (isTooltipBottom) {
                  y += tooltipOuterHeight + 50;
                  if (y > (rect.bottom + 10)) {
                    y = rect.bottom + 10;
                  }
                } else {
                  y = rect.top - tooltipOuterHeight + 25;
                }
              }
            }
          }

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
          const args = { elem: thisShape, index: i, data: d };
          if (self.isGrouped) {
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

        // Stacked
        if (self.settings.isStacked) {
          if (isSingle) {
            content = `<p><b>${format(d[0].value)}</b> ${d[0].name}</p>`;
          } else {
            content = `${'' +
              '<div class="chart-swatch">' +
                '<div class="swatch-caption"><b>'}${datasetStacked[0][i].name}</b></div>`;
            for (j = datasetStacked.length - 1, l = 0; j >= l; j--) {
              hexColor = charts.chartColor(j, 'bar', dataset[j]);
              content += `${'' +
                '<div class="swatch-row">' +
                  '<div style="background-color:'}${dataset[j].pattern ? 'transparent' : hexColor};">${
                setPattern(dataset[j].pattern, hexColor)
              }</div>` +
                  `<span>${datasetStacked[j][i].parentName}</span><b>${format(datasetStacked[j][i].value)}</b>` +
                '</div>';
            }
            content += '</div>';
          }
          size = charts.tooltipSize(content);
          x = shape[0].getBoundingClientRect().left - (size.width / 2) + (shape.attr('width') / 2);
          y = shape[0].getBoundingClientRect().top - size.height - 10;
        } else { // Not Stacked
          if (isPositiveNegative) {
            content = `${'' +
              '<div class="chart-swatch">' +
                '<div class="swatch-caption"><b>'}${d.name}</b></div>` +
                '<div class="swatch-row">' +
                  `<div style="background-color:${pnPatterns.target ? 'transparent' : color(pnColors.target)};">${
                    setPattern(pnPatterns.target, color(pnColors.target))
                  }</div>` +
                  `<span>${pnLegends.target}</span><b>${format(d.target)}</b>` +
                '</div>' +
                '<div class="swatch-row">' +
                  `<div style="background-color:${d.value < 0 ?
                    (pnPatterns.negative ? 'transparent' : color(pnColors.negative)) :
                    (pnPatterns.positive ? 'transparent' : color(pnColors.positive))
                  };">${
                    d.value < 0 ?
                      setPattern(pnPatterns.negative, color(pnColors.negative)) :
                      setPattern(pnPatterns.positive, color(pnColors.positive))
                  }</div>` +
                  `<span>${pnLegends[d.value < 0 ? 'negative' : 'positive']}</span><b>${format(d.value)}</b>` +
                '</div>' +
              '</div>';
          } else if (dataset.length === 1) {
            content = `<p><b>${format(d.value)}</b> ${d.name}</p>`;
          } else {
            const data = d3.select(this.parentNode).datum().values;

            content = '<div class="chart-swatch">';
            for (j = 0, l = data.length; j < l; j++) {
              hexColor = charts.chartColor(j, 'bar', series[j]);
              content += `${'' +
                '<div class="swatch-row">' +
                  '<div style="background-color:'}${series[j].pattern ? 'transparent' : hexColor};">${
                setPattern(series[j].pattern, hexColor)
              }</div>` +
                  `<span>${data[j].name}</span><b>${format(data[j].value)}</b>` +
                '</div>';
            }
            content += '</div>';
            isTooltipBottom = data.length > maxBarsForTopTooltip;
          }

          size = charts.tooltipSize(content);
          x = shape[0].getBoundingClientRect().left - (size.width / 2) + (shape.attr('width') / 2);
          y = ePageY - charts.tooltip.outerHeight() - 25;
          if (dataset.length > 1) {
            x = this.parentNode.getBoundingClientRect().left - (size.width / 2) +
              (this.parentNode.getBoundingClientRect().width / 2);
            y = this.parentNode.getBoundingClientRect().top - charts.tooltip.outerHeight() + 25;
          }
        }

        if (tooltipData && typeof tooltipData === 'function' && typeof d.tooltip === 'undefined' && !tooltipDataCache[tooltipIdx]) {
          setCustomTooltip(tooltipData);
        } else {
          content = tooltipDataCache[tooltipIdx] || tooltipData || content || '';
          if (!tooltipDataCache[tooltipIdx] && d.tooltip !== false &&
            typeof d.tooltip !== 'undefined' && d.tooltip !== null) {
            if (typeof d.tooltip === 'function') {
              setCustomTooltip(d.tooltip);
            } else {
              content = d.tooltip.toString();
              replaceMatchAndSetType();
              tooltipDataCache[tooltipIdx] = content;
            }
          }
          if (typeof content === 'string' && content !== '') {
            show(isTooltipBottom);
          }
        }
      })

      // Mouseleave
      .on(`mouseleave.${self.namespace}`, function () {
        clearInterval(tooltipInterval);
        charts.hideTooltip();
      })

      // Contextmenu
      .on(`contextmenu.${self.namespace}`, function (event, d) {
        charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d, event);
      })
      // Click and double click events
      // Use very slight delay to fire off the normal click action
      // It alow to cancel when the double click event happens
      .on(`click.${self.namespace}`, function (event, d, i, clickedLegend) {
        const selector = this;

        if (self.settings.selectable) {
          timer = setTimeout(function () {
            if (!prevent) {
              // Run click action
              i = s.isSingle || s.isPositiveNegative ? $(selector).data('index') : $(selector).index();
              self.doClickAction(event, d, i, selector, clickedLegend);
            }
            prevent = false;
          }, delay);
        }
      })
      .on(`dblclick.${self.namespace}`, function (event, d, i) {
        const selector = this;
        clearTimeout(timer);
        prevent = true;
        // Run double click action
        i = $(selector).index();
        self.doDoubleClickAction(d, i, selector);
      });

    // Add Legend
    self.settings.isGrouped = isGrouped;
    self.settings.isSingle = isSingle;
    self.settings.svg = this.svg;

    if (self.settings.showLegend) {
      let lineLegend;
      const lineData = dataset.map(d => d.line);

      if (isSingle && dataset[0].name) {
        charts.addLegend(dataset, 'column-single', self.settings, self.element);
      } else if (isPositiveNegative) {
        charts.addLegend(pnSeries, self.settings.type, self.settings, self.element);
      } else if (self.settings.isStacked && isSingle) {
        charts.addLegend(series, self.settings.type, self.settings, self.element);
      } else if (!isSingle) {
        let legendSeries = self.settings.isStacked ? seriesStacked : series;

        if (self.settings.useLine) {
          lineLegend = lineData.filter(i => i.name);
          legendSeries.push(lineLegend[0]);
        }

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
        charts.addLegend(legendSeries, self.settings.type, self.settings, self.element);
      }

      if (self.settings.useLine && lineData.length) {
        const chartLegendItemText = $('.chart-legend-item-text');
        if (lineLegend[0].name === chartLegendItemText.last().text()) {
          $('.chart-legend-color').last().addClass(theme.currentTheme.modeId === 'dark' ? 'slate03' : 'slate08');
          self.element.find('.chart-legend-item').last().attr('style', 'pointer-events: none');
        }
      }
    }

    if (isAxisXRotate && self.settings.xAxis && self.settings.xAxis?.rotate) {
      self.svg.selectAll('.x.axis .tick text')
        .attr('y', 0)
        .attr('x', function () {
          return -(this.getBBox().width + 10);
        })
        .attr('dy', '1em')
        .attr('transform', `rotate(${xRotate.use})`)
        .style('text-anchor', 'start');
    }

    if (self.settings.xAxis && self.settings.xAxis.formatText) {
      self.svg.selectAll('.x.axis .tick text').each(function (m) {
        const elem = d3.select(this);
        const text = d3.select(this).text();
        const markup = self.settings.xAxis.formatText(text, m);

        DOM.html(elem.node(), markup, '<tspan>');
      });

      self.element.find('.chart-legend').addClass('m-top-0');
      self.element.find('.chart-legend .chart-legend-color').each((_, elem) => {
        elem.classList.add('m-bottom-0');
      });
    }

    if (self.settings.isStacked) {
      const $tick = $('.tick');
      const $xAxisGroup = $('.x.axis > g');
      const $seriesGroup = $('.series-group.g');
      const hasTwoLines = $('g.x.axis > g text').find('tspan').length > 1;

      // Extract the distance value from the "transform" attribute of the tick element
      const distance = $tick.attr('transform').match(/translate\((\d+),/)[1];
      const textWidth = $xAxisGroup[0].getBBox().width;
      const barWidth = $seriesGroup.find('rect')[0].getBBox().width;
      const textWidthHalf = textWidth / 2;
      const barWidthHalf = barWidth / 2;

      // calculates the desired position for the bars
      const position = Math.round((distance - (hasTwoLines ? 14 : 10)) + textWidthHalf - barWidthHalf);

      $seriesGroup.each(function () {
        const transformValue = this.getAttribute('transform');
        const updatedTransformValue = transformValue.replace(/translate\(\d+/, `translate(${position}`);
        this.setAttribute('transform', updatedTransformValue);
      });
    }

    if (charts.isRTL && charts.isIE) {
      svg.selectAll('text').attr('transform', 'scale(-1, 1)');
      svg.selectAll('.y.axis text').style('text-anchor', 'start');

      if (isPositiveNegative) {
        svg.selectAll('.negative-value').style('text-anchor', 'end');
      }
    }

    // Set y-axix tick css class
    svg.selectAll('.y.axis .tick').attr('class', function (d) {
      return `tick${d === 0 ? ' tick0' : ''}`;
    });

    // Add Tooltips and legend
    charts.appendTooltip();

    // See if any labels overlap and use shorter */
    // [applyAltLabels] - function(svg, dataArray, elem, selector, isNoEclipse)
    if (!isAxisXRotate && !self.settings.xAxis && !self.settings.xAxis?.rotate) {
      if (charts.labelsColide(svg)) {
        charts.applyAltLabels(svg, dataArray, 'shortName');
      }

      if (charts.labelsColide(svg)) {
        charts.applyAltLabels(svg, dataArray, 'abbrName');
      }

      if (charts.labelsColide(svg)) {
        charts.applyAltLabels(svg, dataArray, null, null, true);

        // Adjust extra(x) space with short name for RTL
        if (isPositiveNegative) {
          svg.selectAll('.target-bartext, .bartext').attr('x', function () {
            return +d3.select(this).attr('x') - (isRTL ? -6 : 6);
          });
        }
      }
    }

    charts.setSelected = function (o, isToggle) {
      let selected = 0;
      const equals = utils.equals;
      const legendsNode = svg.node().parentNode.nextSibling;
      const legends = d3.select(legendsNode);
      const isLegends = legends.node() && legends.classed('chart-legend');
      let barIndex;
      let selector;
      let isStackedGroup;
      let xGroup;

      const setSelectedBar = function (g, gIdx) {
        const isGroup = !!g;
        g = isGroup ? d3.select(g) : svg;
        gIdx = typeof gIdx !== 'undefined' ? gIdx : 0;
        g.selectAll('.bar').each(function (d, i) {
          if (!d) {
            return;
          }
          if (selected < 1) {
            if ((typeof o.fieldName !== 'undefined' &&
                  typeof o.fieldValue !== 'undefined' &&
                    o.fieldValue === (isSingle && self.settings.isStacked ? d[0][o.fieldName] :
                      d[o.fieldName])) || //eslint-disable-line
                (typeof o.index !== 'undefined' && o.index === i) ||
                (o.data && equals(o.data, dataset[gIdx].data[i])) ||
                (o.elem && $(this).is(o.elem))) {
              selected++;
              selector = d3.select(this);
              barIndex = i;
              if (isGroup && !self.settings.isStacked) {
                isStackedGroup = true;
              }
            }
          }
        });
      };

      const setSelectedGroup = function () {
        const groups = svg.selectAll('.series-group');
        if (groups.nodes().length) {
          groups.each(function (d, i) {
            setSelectedBar(this, i);
          });
        }
      };

      if (isGrouped || (self.settings.isStacked && !isSingle && !isGrouped)) {
        dataset.forEach(function (d, i) {
          if (selected < 1) {
            xGroup = $(svg.select(`[data-group-id="${i}"]`).node());
            if ((typeof o.groupName !== 'undefined' &&
                  typeof o.groupValue !== 'undefined' &&
                    o.groupValue === d[o.groupName]) ||
                (typeof o.groupIndex !== 'undefined' && o.groupIndex === i) ||
                (o.data && equals(o.data, d)) ||
                (o.elem && (xGroup.is(o.elem)))) {
              if (typeof o.fieldName === 'undefined' &&
                    typeof o.fieldValue === 'undefined' &&
                      typeof o.index === 'undefined') {
                selected++;
                selector = svg.select(`[data-group-id="${i}"]`).select('.bar');
                barIndex = i;
                if (self.settings.isStacked && !isGrouped) {
                  isStackedGroup = true;
                }
              }
            }
          }
        });
        if (selected < 1) {
          setSelectedGroup();
        }
      } else {
        setSelectedBar();
      }

      if (selected > 0 && (isToggle || !selector.classed('is-selected'))) {
        if (isStackedGroup) {
          if (isLegends) {
            $(legends.selectAll('.chart-legend-item')[0][barIndex]).trigger('click.chart');
          }
        } else {
          d3.select(selector.node()).dispatch('click');
        }
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
    const isPositiveNegative = /positive-negative/.test(self.settings.type);
    const legendsNode = self.svg.node().parentNode.nextSibling;
    const legends = d3.select(legendsNode);
    const isLegends = legends.node() && legends.classed('chart-legend');
    let isLegendsCall = false;
    let selected = 0;
    let barIndex;
    let selector;
    let isStacked;
    let isStackedGroup;

    const setSelectedBar = function (g) {
      g = g ? d3.select(g) : self.svg;
      g.selectAll('.bar').each(function (d, i) {
        if (!d) {
          return;
        }
        const data = self.isSingle && self.settings.isStacked ? d[0] : d;
        if (data.selected && selected < 1) {
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
          isStacked = Array.isArray(d);
          if (isStacked || (d?.data && Array.isArray(d?.data))) {
            sel.itemsInGroup = (isStacked ? d : d.data).length;
            if (selected > 0) {
              sel.groups.push({ i, totalSel: getSelected(isStacked ? d : d.data) });
            }
          }
        });
        sel.gLen = sel.groups.length;
        if (!isLegendsCall && ((isStacked && sel.gLen && sel.groups[0].totalSel > 1) ||
          (sel.gLen === groups.size() && !isStacked))) {
          const results = sel.groups.filter(n => n?.totalSel > 1).length;
          isLegendsCall = isStacked ? !!results : !results;
          if (isStacked) {
            barIndex = sel.groups[0].i;
          }
        }
      }
    };

    // Positive Negative and Legends
    if (isPositiveNegative) {
      const setLegendsCall = (idx) => {
        isLegendsCall = true;
        barIndex = idx;
        selected++;
      };
      if (self.dataset[0].targetBarsSelected) {
        setLegendsCall(0);
      } else {
        const sel = { selected: 0, i: -1 };
        self.dataset[0].data.forEach((d, i) => {
          if (d.selected) {
            sel.selected++;
            sel.i = i;
          }
        });
        if (sel.selected > 1) {
          sel.elem = self.svg.select(`.target-bar.series-${sel.i}`);
          setLegendsCall(sel.elem.classed('positive') ? 1 : 2);
        }
      }
    }

    if (!isLegendsCall &&
      (self.isGrouped || (self.settings.isStacked && !self.isSingle && !self.isGrouped))) {
      self.dataset.forEach((d, i) => {
        if (d.selected && selected < 1) {
          selected++;
          selector = self.svg.select(`[data-group-id="${i}"]`).select('.bar');
          barIndex = i;
          if (self.settings.isStacked && !self.isSingle && !self.isGrouped) {
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
        d3.select(selector.node()).dispatch('click');
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
   * Action to happen on click.
   * @private
   * @param {object} event - The event object
   * @param {object} d - The data object
   * @param {number} i - The index
   * @param {object} selector - The selector element
   * @param {boolean} clickedLegend - Is clicked by legend
   * @returns {void}
   */
  doClickAction(event, d, i, selector, clickedLegend) {
    const self = this;
    const isTargetBar = selector && d3.select(selector).classed('target-bar');
    let isSelected = selector && d3.select(selector).classed('is-selected');
    const thisGroupId = parseInt(d3.select(selector.parentNode).attr('data-group-id'), 10);

    // Set isSelected to false if even 1 bar is selected
    if (isTargetBar) {
      const allBars = self.svg.selectAll('.bar').nodes();
      const len = allBars.length;

      for (let j = 0; j < len; j++) {
        const bar = allBars[j];

        if (d3.select(bar).classed('is-selected')) {
          isSelected = false;
          break;
        }
      }
    }

    charts.setSelectedElement({
      task: (isSelected ? 'unselected' : 'selected'),
      container: self.element,
      selector,
      isTrigger: self.initialSelectCall ? false : !isSelected,
      isTargetBar,
      triggerGroup: self.isGrouped,
      d,
      i,
      type: self.settings.type,
      dataset: self.dataset,
      isSingle: self.isSingle,
      isGrouped: self.isGrouped,
      isStacked: self.settings.isStacked,
      svg: self.svg,
      clickedLegend: (clickedLegend === true)
    });

    if (isSelected && !self.initialSelectCall) {
      self.element.triggerHandler('selected', [d3.select(selector).nodes(), {}, (self.isGrouped ? thisGroupId : i)]);
    }
  },

  /**
   * Action to happen on double click.
   * @private
   * @param {object} d - The data object
   * @param {number} i - The index
   * @param {object} selector - The selector element
   * @returns {void}
   */
  doDoubleClickAction(d, i, selector) {
    const self = this;
    const s = this.settings;
    let args;
    if (s.isGrouped) {
      const groupElem = d3.select(selector.parentNode);
      const groupIndex = parseInt(groupElem?.attr('data-group-id'), 10);
      const groupItems = [];
      groupElem.selectAll('.bar').each(function (d2, i2) {
        groupItems.push({ elem: this, data: d2, index: i2 });
      });
      args = [{ groupElem: groupElem.node(), groupIndex, groupItems }];
    } else if (self.isSingle && self.settings.isStacked) {
      const thisData = self.dataset && self.dataset[0]?.data && self.dataset[0].data[i] ? self.dataset[0].data[i] : d;
      args = [{ data: thisData, index: i, elem: [selector] }];
    } else if (self.settings.isStacked) {
      args = [];
      self.svg.selectAll('.series-group').each(function () {
        const bar = d3.select(this).selectAll('.bar').nodes()[i];
        args.push({ elem: bar, data: d3.select(bar).datum(), index: i });
      });
    } else {
      args = [{ data: d, index: i, elem: selector }];
    }
    self.element.triggerHandler('dblclick', [args]);
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
      this.element.find('.target-bartext, .bartext').off(`end.${self.namespace}`);
      this.element.find('.bar, .target-bar')
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
      this.element.empty().removeClass('column-chart');
      $.removeData(this.element[0], COMPONENT_NAME);
      $.removeData(this.element[0], 'chart');
    }
  }
};

export { Column, COMPONENT_NAME };
