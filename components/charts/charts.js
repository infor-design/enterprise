const charts = {};

// Reference to the tooltip
charts.tooltip = {};
charts.isIE = $('html').hasClass('ie');
charts.isIEEdge = $('html').hasClass('ie-edge');

/**
 * Get the current height and widthe of the tooltip.
 * @param  {string} content The tooltip content.
 * @returns {[type]} Object with the height and width.
 */
charts.tooltipSize = function tooltipSize(content) {
  this.tooltip.find('.tooltip-content').html(content);
  return { height: this.tooltip.outerHeight(), width: this.tooltip.outerWidth() };
};

/**
* Add Toolbar to the page.
* @returns {void}
*/
charts.appendTooltip = function appendTooltip() {
  this.tooltip = $('#svg-tooltip');
  if (this.tooltip.length === 0) {
    this.tooltip = $('<div id="svg-tooltip" class="tooltip right is-hidden"><div class="arrow"></div><div class="tooltip-content"><p><b>32</b> Element</p></div></div>').appendTo('body');

    if (this.isTouch) {
      this.tooltip[0].style.pointerEvents = 'auto';
      this.tooltip.on('touchend.svgtooltip', () => {
        this.hideTooltip();
      });
    }
  }
};

/*
 * Hide the visible tooltip.
 * @returns {void}
 */
charts.hideTooltip = function hideTooltip() {
  d3.select('#svg-tooltip').classed('is-hidden', true).style('left', '-999px');

  // Remove scroll events
  $('body, .scrollable').off('scroll.chart-tooltip', () => {
    this.hideTooltip();
  });
};

/*
 * Remove the tooltip from the DOM
 * @returns {void}
 */
charts.removeTooltip = function removeTooltip() {
  if (this.tooltip) {
    this.tooltip.remove();
  }
};

/**
 * The color sequences to use across charts
 * @type {Array}
 */
charts.colorRange = ['#1D5F8A', '#8ED1C6', '#9279A6', '#5C5C5C', '#F2BC41', '#66A140', '#AD4242',
  '#8DC9E6', '#EFA836', '#317C73', '#EB9D9D', '#999999', '#488421', '#C7B4DB',
  '#54A1D3', '#6e5282', '#AFDC91', '#69ADA3', '#DB7726', '#D8D8D8'];

/**
 * The colors as an array for placement
 * @type {Array}
 */
charts.colors = d3.scaleOrdinal().range(charts.colorRange);

/**
 * Calculate and return the correct color to use. Fx
 * error, alert, alertYellow, good, neutral or hex.
 * @param  {number} i The line/bar object index.
 * @param  {string} chartType The type of chart.
 * @param  {object} data The data for this element.
 * @returns {string} The hex code
 */
charts.chartColor = function chartColor(i, chartType, data) {
  const specifiedColor = (data && data.color ? data.color : null);

  // Handle passed in colors.
  if (specifiedColor) {
    if (specifiedColor === 'error') {
      return '#e84f4f';
    }
    if (specifiedColor === 'alert') {
      return '#ff9426';
    }
    if (specifiedColor === 'alertYellow') {
      return '#ffd726';
    }
    if (specifiedColor === 'good') {
      return '#80ce4d';
    }
    if (specifiedColor === 'neutral') {
      return '#bdbdbd';
    }
    if (specifiedColor && specifiedColor.indexOf('#') === 0) {
      return data.color;
    }
  }

  // Some configuration by specific chart types
  if (chartType === 'pie' || chartType === 'donut') {
    return this.colorRange[i];
  }
  if (chartType === 'bar-single' || chartType === 'column-single') {
    return '#1D5F8A';
  }
  if (chartType === 'bar' || chartType === 'line') {
    return this.colors(i);
  }

  return '';
};

/**
 * Show Tooltip
 * @param  {number} x The x position.
 * @param  {number} y The y position.
 * @param  {string} content The tooltip contents.
 * @param  {string} arrow The arrow direction.
 */
charts.showTooltip = function (x, y, content, arrow) {
  // Simple Collision of left side
  if (x < 0) {
    x = 2;
  }

  this.tooltip[0].style.left = `${x}px`;
  this.tooltip[0].style.top = `${y}px`;
  this.tooltip.find('.tooltip-content').html(content);

  this.tooltip.removeClass('bottom top left right').addClass(arrow);
  this.tooltip.removeClass('is-hidden');

  // Hide the tooltip when the page scrolls.
  $('body').off('scroll.chart-tooltip').on('scroll.chart-tooltip', () => {
    this.hideTooltip();
  });

  $('.scrollable').off('scroll.chart-tooltip').on('scroll.chart-tooltip', () => {
    this.hideTooltip();
  });
};

/**
 * Add the legend to the Chart Container.
 * @param  {array} series The groups series object.
 * @param  {string} chartType The type of chart.
 * @param  {object} settings The chart setting
 * @param  {object} container The dom container.
 * @returns {void}
 */
charts.addLegend = function (series, chartType, settings, container) {
  let i;

  if (series.length === 0) {
    return;
  }

  const isTwoColumn = series[0].display && series[0].display === 'twocolumn';
  const legend = isTwoColumn ? $('<div class="chart-legend is-below"></div>') :
    $('<div class="chart-legend"></div>');

  // Legend width
  let width = 0;
  let currentWidth;

  for (i = 0; i < series.length; i++) {
    currentWidth = series[i].name.length * 6;
    width = (series[i].name && currentWidth > width) ? currentWidth : width;
  }

  width += 55;
  const widthPercent = width / $(container).width() * 100;

  for (i = 0; i < series.length; i++) {
    if (!series[i].name) {
      continue; // eslint-disable-line
    }

    let extraClass = '';
    if (isTwoColumn || (series[i].display && series[i].display === 'block')) {
      extraClass += ' lg';
    }
    if (settings.type === 'column-positive-negative' && series[i].option) {
      extraClass += ` ${series[i].option}`;
    }

    let seriesLine = `<span class="chart-legend-item${extraClass}" tabindex="0"></span>`;
    const hexColor = charts.chartColor(i, chartType || (series.length === 1 ? 'bar-single' : 'bar'), series[i]);

    const color = $(`<span class="chart-legend-color" style="background-color: ${series[i].pattern ? 'transparent' : hexColor}"></span>`);
    const textBlock = $(`<span class="chart-legend-item-text">${series[i].name}</span>`);

    if (series[i].pattern) {
      color.append(`<svg width="12" height="12"><rect style="fill: ${hexColor}" mask="url(#${series[i].pattern})" height="12" width="12" /></svg>`);
    }

    if (series[i].percent) {
      const pct = $('<span class="chart-legend-percent"></span>').text(series[i].percent);
      textBlock.append(pct);
    }

    if (series[i].display && series[i].display === 'block') {
      seriesLine = `<span class="chart-legend-item${extraClass}" tabindex="0" style="float: none; display: block; margin: 0 auto; width: ${width}px;"></span>`;
    }

    if (isTwoColumn) {
      if (widthPercent > 45) {
        seriesLine = `<span class="chart-legend-item${extraClass}" tabindex="0" style="float: none; display: block; margin: 0 auto; width: ${width}px;"></span>`;
      } else {
        seriesLine = `<span class="chart-legend-item${extraClass} is-two-column" tabindex="0" ></span>`;
      }
    }
    seriesLine = $(seriesLine);
    seriesLine.append(color, textBlock);

    legend.append(seriesLine);
  }

  if (legend instanceof $) {
    legend.on('click.chart', '.chart-legend-item', function () {
      charts.handleElementClick(this, series, settings);
    }).on('keypress.chart', '.chart-legend-item', function (e) {
      if (e.which === 13 || e.which === 32) {
        charts.handleElementClick(this, series, settings);
      }
    });

    $(container).append(legend);
  }
};

/**
 * Helper Function to Select from legend click
 * @param {object} line The element that was clicked.
 * @param {array} series The data series.
 * @param {object} settings [description]
 */
charts.handleElementClick = function (line, series, settings) {
  const idx = $(line).index();
  const elem = series[idx];
  let selector;

  if (settings.type === 'pie') {
    selector = d3.select(settings.svg.selectAll('.arc')[0][idx]);
  } else if (settings.type === 'column-positive-negative') {
    if (!elem.option || (elem.option && elem.option === 'target')) {
      selector = settings.svg.select('.target-bar');
    } else {
      selector = settings.svg.select(`.bar.${elem.option}`);
    }
  } else if (['column', 'bar'].indexOf(settings.type) !== -1) {
    // Grouped or singlular
    if (settings.isGrouped || settings.isSingular) {
      selector = settings.svg.select(`.series-${idx}`);
    } else if (settings.isStacked && !settings.isSingular) {
      // Stacked
      const thisGroup = d3.select(settings.svg.selectAll(settings.chartType === 'HorizontalBar' ?
        '.series-group' : '.g')[0][idx]);
      selector = thisGroup.select('.bar');
    }
  }

  if (['pie', 'column', 'bar'].indexOf(settings.chartType) !== -1) {
    settings.isByLegends = true;
    selector.on('click').call(selector.node(), selector.datum(), idx);
  }

  if (elem.selectionObj) {
    charts.selectElement(d3.select(elem.selectionObj._groups[0][idx]), elem.selectionInverse, elem.data); // eslint-disable-line
  }
};

// The selected array for this instance.
charts.selected = [];

/**
 * Select the element and fire the event, make the inverse selector opace.
 * @param  {object} element The DOM element
 * @param  {object} inverse The opposite selection.
 * @param  {array} data  The data object
 * @param  {object} container  The DOM object
 */
charts.selectElement = function (element, inverse, data, container) {
  const isSelected = element.node() && element.classed('is-selected');
  const triggerData = [{ elem: element.nodes(), data: (!isSelected ? data : {}) }];

  inverse.classed('is-selected', false)
    .classed('is-not-selected', !isSelected);

  element.classed('is-not-selected', false)
    .classed('is-selected', !isSelected);

  charts.selected = $.isEmptyObject(triggerData[0].data) ? [] : triggerData;

  // Fire Events
  $(container).triggerHandler('selected', [triggerData]);
};

/**
 * Style bars as selected or unselected
 * TODO: Refactor into individual components;
 * @param  {object} o The object to handle.
 * @param  {settings} settings The settings object.
 */
charts.setSelectedElement = function (o, settings) {
  const s = settings;
  let dataset = s.dataset;
  const isPositiveNegative = s.type === 'column-positive-negative';
  const isTypeHorizontalBar = s.chartType === 'HorizontalBar';
  const isTypeColumn = s.chartType === 'Column';
  const isTypePie = s.chartType === 'Pie';

  const svg = s.svg;
  const isSingle = s.isSingle;
  const isGrouped = s.isGrouped;
  const isStacked = s.isStacked;
  const isSingular = s.isSingular;

  const taskSelected = (o.task === 'selected');
  const selector = d3.select(o.selector);
  const isPositive = selector.classed('positive');
  const ticksX = svg.selectAll('.axis.x .tick');
  const ticksY = svg.selectAll('.axis.y .tick');
  const pnPositiveText = svg.selectAll('.bartext.positive, .target-bartext.positive');
  const pnNegativeText = svg.selectAll('.bartext.negative, .target-bartext.negative');
  const pnTargetText = svg.selectAll('.target-bartext.positive, .target-bartext.negative');
  const thisGroup = d3.select(o.selector.parentNode);
  const thisGroupId = parseInt((thisGroup.node() ? thisGroup.attr('data-group-id') : 0), 10);
  let triggerData = [];
  const selectedBars = [];
  let thisData;

  if (isStacked || isTypePie) {
    dataset = dataset || null;
  } else {
    dataset = (dataset && dataset[thisGroupId]) ? dataset[thisGroupId].data : null;
  }

  ticksX.style('font-weight', 'normal');
  ticksY.style('font-weight', 'normal');
  pnPositiveText.style('font-weight', 'normal');
  pnNegativeText.style('font-weight', 'normal');
  svg.selectAll('.is-selected').classed('is-selected', false);

  // Task make selected
  if (taskSelected) {
    svg.selectAll('.bar, .target-bar').style('opacity', 0.6);

    // By legends only
    if (s.isByLegends && !isTypePie) {
      if (isPositiveNegative) {
        if (o.isTargetBar) {
          s.svg.selectAll('.target-bar').classed('is-selected', true).style('opacity', 1);

          pnTargetText.style('font-weight', 'bolder');
        } else {
          s.svg.selectAll(isPositive ?
            '.bar.positive, .target-bar.positive' : '.bar.negative, .target-bar.negative')
            .classed('is-selected', true).style('opacity', 1);

          (isPositive ? pnPositiveText : pnNegativeText).style('font-weight', 'bolder');
        }

        svg.selectAll('.bar').each(function (d, i) {
          const bar = d3.select(this);
          if (bar.classed('is-selected')) {
            selectedBars.push({ elem: bar[0], data: (dataset ? dataset[i] : d) });
          }
        });
        triggerData = selectedBars;
      } else if (isTypeColumn || isTypeHorizontalBar) {
        // Grouped and stacked only -NOT singular-

        if (isGrouped || isSingular) {
          s.svg.selectAll('.series-' + o.i).classed('is-selected', true).style('opacity', 1); //eslint-disable-line
        } else {
          thisGroup.classed('is-selected', true)
            .selectAll('.bar').classed('is-selected', true).style('opacity', 1);
        }

        svg.selectAll('.bar.is-selected').each(function (d, i) {
          const bar = d3.select(this);

          thisData = s.dataset;
          thisData = thisData ? (isStacked ? isSingular ? (thisData[0].data[o.i]) : //eslint-disable-line
            (thisData[o.i].data[i]) : thisData[i].data[o.i]) : d; //eslint-disable-line
          selectedBars.push({ elem: bar[0], data: thisData });
        });
        triggerData = selectedBars;
      }
    } else if (isSingular && isStacked && isTypeColumn) {
      // Single and stacked only -NOT grouped-
      thisData = dataset[0] && dataset[0].data ? dataset[0].data : o.d;
      selector.classed('is-selected', true).style('opacity', 1);
      triggerData.push({ elem: selector[0], data: thisData[o.i] });
    } else if ((isSingle || isGrouped) && !isStacked && (isTypeColumn || isTypeHorizontalBar)) {
      // Single or groups only -NOT stacked-
      svg.selectAll(`${isTypeColumn ? '.axis.x' : '.axis.y'} .tick:nth-child(${(isGrouped ? thisGroupId : o.i) + 1})`)
        .style('font-weight', 'bolder');

      selector.classed('is-selected', true).style('opacity', 1);
      svg.select(`.target-bar.series-${o.i}`).style('opacity', 1);
      d3.select(svg.selectAll('.bartext')[0][o.i]).style('font-weight', 'bolder');
      d3.select(svg.selectAll('.target-bartext')[0][o.i]).style('font-weight', 'bolder');

      if (isGrouped || isPositiveNegative || isTypeColumn) {
        if (!isPositiveNegative && !isTypeColumn || (isTypeColumn && isGrouped)) {
          thisGroup.classed('is-selected', true)
            .selectAll('.bar').classed('is-selected', true).style('opacity', 1);
        }

        thisGroup.selectAll('.bar').each(function (d, i) {
          const bar = d3.select(this);
          if (bar.classed('is-selected')) {
            selectedBars.push({ elem: bar[0], data: (dataset ? dataset[i] : d) });
          }
        });
        if (isGrouped) {
          triggerData.push({
            groupIndex: thisGroupId,
            groupElem: thisGroup[0],
            groupItems: selectedBars
          });
        } else {
          triggerData = selectedBars;
        }
      }
    } else if (isTypeColumn || isTypeHorizontalBar) {
      // Stacked Only
      svg.selectAll(`${isTypeColumn ? '.axis.x' : '.axis.y'} .tick:nth-child(${o.i + 1})`)
        .style('font-weight', 'bolder');

      svg.selectAll(`.bar:nth-child(${o.i + 1})`)
        .classed('is-selected', true).style('opacity', 1);

      svg.selectAll('.bar.is-selected').each(function (d, i) {
        const bar = d3.select(this);
        selectedBars.push({ elem: bar[0], data: (dataset ? dataset[i].data[o.i] : d) });
      });
      triggerData = selectedBars;
    } else if (isTypePie) { // Pie
      // Unselect selected ones
      svg.selectAll('.arc')
        .style({ stroke: '', 'stroke-width': '' })
        .attr('transform', '');

      const color = charts.chartColor(o.i, 'pie', o.d.data);
      const thisArcData = dataset && dataset[0] && dataset[0].data ?  //eslint-disable-line
        dataset[0].data[o.i] : (o.d ? o.d.data : o.d);  //eslint-disable-line

      selector.classed('is-selected', true)
        .style({ stroke: color, 'stroke-width': 0 })
        .attr('transform', 'scale(1.025, 1.025)');
      triggerData.push({ elem: selector[0], data: thisArcData, index: o.i });
    }
  } else {
    // Task make unselected
    svg.selectAll('.bar, .target-bar').style('opacity', 1);
    pnPositiveText.style('font-weight', 'bolder');
    pnNegativeText.style('font-weight', 'bolder');

    if (isTypePie) {
      selector.classed('is-selected', false)
        .style('stroke', '#fff')
        .style('stroke-width', '1px')
        .attr('transform', '');
    }
  }

  if (s.isByLegends) {
    s.isByLegends = false;
  }

  charts.selected = triggerData;

  if (o.isTrigger) {
    $(o.container).triggerHandler((taskSelected ? 'selected' : 'unselected'), [triggerData]);
  }
};

/**
 * Set the select element based on provided options and fire the events.
 * @param {object} o An object with various
 * @param {boolean} isToggle If the select is a toggle of the state
 * @param {object} internals An object passing in chart internals
*/
charts.setSelected = function (o, isToggle, internals) {
  if (!o) {
    return;
  }

  let selected = 0;
  const equals = window.Soho.utils.equals;
  const legendsNode = internals.svg.node().parentNode.nextSibling;
  const legends = d3.select(legendsNode);
  const isLegends = legends.node() && legends.classed('chart-legend');
  let barIndex;
  let selector;
  let isStackedGroup;
  let xGroup;

  const setSelectedBar = function (g) {
    const isGroup = !!g;
    g = isGroup ? d3.select(g) : internals.svg;
    g.selectAll('.bar').each(function (d, i) {
      if (!d) {
        return;
      }
      if (selected < 1) {
        if ((typeof o.fieldName !== 'undefined' &&
              typeof o.fieldValue !== 'undefined' &&
                o.fieldValue === d[o.fieldName]) ||
            (typeof o.index !== 'undefined' && o.index === i) ||
            (o.data && equals(o.data, internals.chartData[d.index].data[i])) ||
            (o.elem && $(this).is(o.elem))) {
          selected++;
          selector = d3.select(this);
          barIndex = i;
          if (isGroup && !internals.isStacked) {
            isStackedGroup = true;
          }
        }
      }
    });
  };

  const setSelectedGroup = function () {
    const groups = internals.svg.selectAll('.series-group');

    if (groups[0].length) {
      groups.each(function () {
        setSelectedBar(this);
      });
    }
  };

  if (internals.isGrouped || (internals.isStacked && !internals.isSingle)) {
    internals.chartData.forEach(function(d, i) {  //eslint-disable-line
      if (selected < 1) {
        xGroup = $(internals.svg.select('[data-group-id="' + i + '"]').node()); //eslint-disable-line
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
            selector = internals.svg.select('[data-group-id="' + i + '"]').select('.bar'); //eslint-disable-line
            barIndex = i;

            if (internals.isStacked && !internals.isGrouped) {
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
      selector.on('click').call(selector.node(), selector.datum(), barIndex);
    }
  }
};

/**
 * Toggle the current selection state.
 * @param {object} o An object with various
 * @param {object} internals An object passing in chart internals
*/
charts.toggleSelected = function (o, internals) {
  charts.setSelected(o, true, internals);
};

export { charts };
