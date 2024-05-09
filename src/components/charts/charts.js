import { Environment as env } from '../../utils/environment';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';
import { DOM } from '../../utils/dom';
import { theme } from '../theme/theme';
import { Locale } from '../locale/locale';

import '../popover/popover.jquery';
import '../popupmenu/popupmenu.jquery';

const charts = {};

charts.destroy = function destroy(el) {
  const chartClasses = ['line-chart', 'bar-chart', 'bar-chart-stacked', 'bar-chart-grouped', 'bubble', 'column-chart', 'completion-chart', 'chart-completion-target-padding', 'chart-pie', 'has-right-legend'];
  el[0]?.classList.remove(...chartClasses);
};

// Reference to the tooltip
charts.tooltip = {};
charts.isIE = env.browser.name === 'ie';
charts.isIEEdge = env.browser.name === 'edge';

/**
 * Get the current height and width of the tooltip.
 * @private
 * @param  {string} content The tooltip content.
 * @returns {object} Object with the height and width.
 */
charts.tooltipSize = function tooltipSize(content) {
  if (!this.tooltip?.find) this.appendTooltip();
  DOM.html(this.tooltip.find('.tooltip-content'), content, '*');
  return { height: this.tooltip.outerHeight(), width: this.tooltip.outerWidth() };
};

/**
 * Format the value based on settings.
 * @private
 * @param  {object} data The data object.
 * @param  {object} settings The sttings to use
 * @returns {string} the formatted string.
 */
charts.formatToSettings = function formatToSettings(data, settings) {
  const d = data.data ? data.data : data;
  const percentValue = (settings.formatter && settings.formatter !== '.0f' ? d3.format(settings.formatter)(d.percent) : `${isNaN(d.percentRound) ? 0 : d.percentRound}%`);

  if (settings.show === 'value') {
    return settings.formatter ? d3.format(settings.formatter)(d.value) : d.value;
  }

  if (settings.show === 'label') {
    return d.name;
  }

  if (settings.show === 'label (percent)') {
    return `${d.name} (${percentValue})`;
  }

  if (settings.show === 'label (value)') {
    return `${d.name} (${settings.formatter ? d3.format(settings.formatter)(d.value) : d.value})`;
  }

  if (settings.show === 'percent') {
    return percentValue;
  }

  if (typeof settings.show === 'function') {
    return settings.show(d);
  }

  return d.value;
};

/**
* Add Toolbar to the page.
* @private
* @param {string} extraClass class to add (needed for pie)
* @returns {void}
*/
charts.appendTooltip = function appendTooltip(extraClass) {
  this.tooltip = $('#svg-tooltip');
  if (this.tooltip.length === 0) {
    extraClass = extraClass ? ` ${extraClass}` : '';
    this.tooltip = $(`<div id="svg-tooltip" class="tooltip right is-hidden${extraClass}">
      <div class="arrow"></div>
        <div class="tooltip-content">
          <p><b>32</b> Element</p>
        </div>
      </div>`).appendTo('body');

    if (this.isTouch) {
      this.tooltip[0].style.pointerEvents = 'auto';
      this.tooltip.on('touchend.svgtooltip', () => {
        this.hideTooltip();
      });
    }
  }
};

/**
 * Hide the visible tooltip.
 * @private
 * @returns {void}
 */
charts.hideTooltip = function hideTooltip() {
  d3.select('#svg-tooltip')
    .classed('is-personalizable', false)
    .classed('is-hidden', true).style('left', '-999px');

  // Remove scroll events
  $('body, .scrollable').off('scroll.chart-tooltip', () => {
    this.hideTooltip();
  });
};

/**
 * Remove the tooltip from the DOM
 * @private
 * @returns {void}
 */
charts.removeTooltip = function removeTooltip() {
  if (this.tooltip && this.tooltip.remove) {
    this.tooltip.remove();
  }
};

/**
 * The color sequences to use across charts
 * @private
 * @returns {array} The list of colors in the current theme in a range for charts.
 */
charts.colorRange = () => {
  const palette = theme.themeColors().palette;
  if (theme.new) {
    return [
      palette.azure['80'].value,
      palette.turquoise['40'].value,
      palette.amethyst['60'].value,
      palette.graphite['40'].value,
      palette.amber['40'].value,
      palette.emerald['70'].value,
      palette.ruby['60'].value,
      palette.azure['30'].value,
      palette.amber['70'].value,
      palette.graphite['60'].value,
      palette.turquoise['60'].value,
      palette.emerald['90'].value,
      palette.amethyst['30'].value,
      palette.azure['50'].value,
      palette.ruby['30'].value,
      palette.amethyst['80'].value,
      palette.emerald['30'].value,
      palette.turquoise['80'].value,
      palette.graphite['20'].value,
      palette.amber['90'].value
    ];
  }

  return [
    palette.azure['70'].value,
    palette.turquoise['30'].value,
    palette.amethyst['30'].value,
    palette.graphite['60'].value,
    palette.amber['50'].value,
    palette.emerald['60'].value,
    palette.ruby['60'].value,
    palette.azure['30'].value,
    palette.amber['90'].value,
    palette.turquoise['80'].value,
    palette.ruby['20'].value,
    palette.graphite['50'].value,
    palette.emerald['50'].value,
    palette.azure['50'].value,
    palette.amethyst['80'].value,
    palette.emerald['30'].value,
    palette.turquoise['50'].value,
    palette.amber['70'].value,
    palette.graphite['20'].value,
    palette.azure['20'].value
  ];
};

charts.colorNameRange = () => {
  if (theme.new) {
    return ['azure08', 'turquoise04', 'amethyst06', 'graphite04', 'amber04', 'emerald07', 'ruby06',
      'azure03', 'amber07', 'graphite06', 'turquoise06', 'emerald09', 'amethyst03',
      'azure05', 'ruby03', 'amethyst08', 'emerald03', 'turquoise08', 'graphite02', 'amber09'];
  }
  return ['azure07', 'turquoise03', 'amethyst03', 'graphite06', 'amber05', 'emerald06', 'ruby06',
    'azure03', 'amber09', 'turquoise08', 'ruby02', 'graphite05', 'emerald05', 'amethyst03',
    'azure05', 'amethyst08', 'emerald03', 'turquoise06', 'amber07', 'graphite02'];
};

/**
 * Calculate and return the correct color to use. Fx
 * error, alert, alertYellow, good, neutral or hex.
 * @private
 * @param  {number} i The line/bar object index.
 * @param  {string} chartType The type of chart.
 * @param  {object} data The data for this element.
 * @returns {string} The hex code
 */
charts.chartColor = function chartColor(i, chartType, data) {
  const themeColors = charts.colorRange();
  const specifiedColor = (data && data.color ? data.color : null);

  // Handle passed in colors.
  if (specifiedColor) {
    if (specifiedColor === 'error') {
      return theme.themeColors().status.danger.value;
    }
    if (specifiedColor === 'alert') {
      return theme.themeColors().status.warning.value;
    }
    if (specifiedColor === 'alertYellow') {
      return theme.themeColors().status.caution.value;
    }
    if (specifiedColor === 'good') {
      return theme.themeColors().status.success.value;
    }
    if (specifiedColor === 'neutral') {
      return theme.themeColors().palette.graphite['30'].value;
    }
    if (specifiedColor === 'info') {
      return theme.themeColors().palette.azure['70'].value;
    }
    if (specifiedColor) {
      if (specifiedColor.indexOf('#') === 0) {
        return data.color;
      }

      const num = specifiedColor.slice(-2);
      if (/\d/.test(num)) {
        const color = specifiedColor.slice(0, specifiedColor.length - 2);
        return theme.themeColors().palette[color][parseInt(num, 10) * 10].value;
      }
    }
  }

  function getColorIndex() {
    let tempSelector = i;

    if (i >= themeColors.length) { // Checks for more than the array length of the color sets
      tempSelector = i - themeColors.length;
    }

    return tempSelector;
  }

  // Some configuration by specific chart types
  if (/^(pie|donut)$/.test(chartType)) {
    return themeColors[getColorIndex()];
  }
  if (/^(bar-single|column-single)$/.test(chartType)) {
    return themeColors[0];
  }
  if (/^(bar|bar-stacked|bar-grouped|bar-normalized|line|scatterplot|column-stacked|column-grouped|column-positive-negative)$/.test(chartType)) {
    return themeColors[getColorIndex()];
  }

  return '';
};

charts.chartColorName = function chartColor(i, chartType, data) {
  const self = this;
  const specifiedColor = (data && data.color ? data.color : null);

  // Handle passed in colors.
  if (specifiedColor) {
    if (specifiedColor === 'error') {
      return 'alert01';
    }
    if (specifiedColor === 'alert') {
      return 'alert02';
    }
    if (specifiedColor === 'alertYellow') {
      return 'alert03';
    }
    if (specifiedColor === 'good') {
      return 'alert04';
    }
    if (specifiedColor === 'neutral') {
      return 'graphite03';
    }
    if (specifiedColor === 'info') {
      return 'azure07';
    }
    return data.color;
  }

  function getColorIndex() {
    let tempSelector = i;

    if (i >= self.colorNameRange().length) { // Checks for more than the array length of the color sets
      tempSelector = i - self.colorNameRange().length;
    }

    return tempSelector;
  }
  
  // Some configuration by specific chart types
  if (/^(pie|donut)$/.test(chartType)) {
    return this.colorNameRange()[getColorIndex()];
  }
  if (/^(bar-single|column-single)$/.test(chartType)) {
    return this.colorNameRange()[0];
  }
  if (/^(bar|bar-stacked|bar-grouped|bar-normalized|line|scatterplot|column-stacked|column-grouped|column-positive-negative)$/.test(chartType)) {
    return this.colorNameRange()[getColorIndex()];
  }

  return '';
};

/**
 * Show Tooltip
 * @private
 * @param  {number} x The x position.
 * @param  {number} y The y position.
 * @param  {string} content The tooltip contents.
 * @param  {string} arrow The arrow direction.
 * @param  {object} customCss Some custom tooltip css settings.
 */
charts.showTooltip = function (x, y, content, arrow, customCss) {
  // Simple Collision of left side
  if (x < 0) {
    x = 2;
  }

  this.tooltip[0].style.left = `${x}px`;
  this.tooltip[0].style.top = `${y}px`;
  DOM.html(this.tooltip.find('.tooltip-content'), content, '*');

  this.tooltip.removeClass('bottom top left right').addClass(arrow);
  this.tooltip.css('max-width', (customCss?.tooltip?.maxWidth || ''));
  this.tooltip.find('.arrow').css('left', (customCss?.arrow?.left || ''));

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
 * @private
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

  // Legend width
  let width = 0;
  let currentWidth;
  let totalWidth = 0;
  let maxLength;
  this.hasLegendPopup = false;

  let currentTotalWidthPercent;
  for (i = 0; i < series.length; i++) {
    currentWidth = series[i].name ? series[i].name.length * 6 : 6;
    width = (series[i].name && currentWidth > width) ? currentWidth : width;

    totalWidth += currentWidth;
    currentTotalWidthPercent = totalWidth / $(container).width() * 100;
    if (currentTotalWidthPercent <= 45) {
      maxLength = i + 1;
    }
  }

  width += 55;
  const widthPercent = width / $(container).width() * 100;
  const exceedsMaxWidth = widthPercent > 45;
  const isBottom = series[0].placement && series[0].placement === 'bottom' || settings.forceLegendPopup === true;

  if (!(isBottom && exceedsMaxWidth)) {
    maxLength = series.length;
  }

  if (isBottom && $(container).hasClass('has-right-legend')) {
    $(container).removeClass('has-right-legend');
  }

  const isTwoColumn = series[0].display && series[0].display === 'twocolumn';
  let legend = isTwoColumn ? $(`<div class="chart-legend ${
    series[0].placement && !isBottom ? `is-${series[0].placement}` : 'is-bottom'}"></div>`) :
    $('<div class="chart-legend"></div>');

  if ((chartType === 'pie' || chartType === 'donut') && settings.showMobile) {
    legend = $('<div class="chart-legend"><div class="container"></div></div>');
  }

  for (i = 0; i < maxLength; i++) {
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

    let seriesLine = `<span index-id="chart-legend-${i}" class="chart-legend-item${extraClass}" tabindex="${settings?.selectable ? 0 : -1}" role="button"></span>`;
    const hexColor = charts.chartColor(i, chartType || (series.length === 1 ? 'bar-single' : 'bar'), series[i]);
    const colorName = charts.chartColorName(i, chartType || (series.length === 1 ? 'bar-single' : 'bar'), series[i]);

    let color = '';
    if (colorName.substr(0, 1) === '#') {
      color = $('<span class="chart-legend-color"></span>');
      if (!series[i].pattern) {
        color.css('background-color', hexColor);
      }
    } else {
      color = $(`<span class="chart-legend-color ${series[i].pattern ? '' : colorName}"></span>`);
    }

    if (chartType === 'scatterplot') {
      color = $('<span class="chart-legend-color"></span>');
    }
    const textBlock = $(`<span class="chart-legend-item-text">${xssUtils.stripTags(series[i].name)}</span>`);

    if (series[i].pattern) {
      color.append(`<svg width="12" height="12"><rect height="12" width="12" mask="url(#${series[i].pattern})"/></svg>`);
      color.find('rect').css('fill', hexColor);
    }

    if (series[i].percent) {
      const pct = $('<span class="chart-legend-percent"></span>').text(series[i].percent);
      textBlock.append(pct);
    }

    if (series[i].display && series[i].display === 'block') {
      seriesLine = `<span class="chart-legend-item${extraClass}" tabindex="${settings.selectable ? 0 : -1}" role="button"></span>`;
    }

    if (isTwoColumn) {
      if (exceedsMaxWidth && isBottom) {
        seriesLine = `<span index-id="chart-legend-${i}" class="chart-legend-item${extraClass} is-one-line" tabindex="${settings.selectable ? 0 : -1}" role="button"></span>`;
      } else {
        seriesLine = `<span index-id="chart-legend-${i}" class="chart-legend-item${extraClass} is-two-column" tabindex="${settings.selectable ? 0 : -1}" role="button"></span>`;
      }
    }
    seriesLine = $(seriesLine);
    seriesLine.append(color, `<span class="audible">${Locale.translate('Highlight')}</span>`, textBlock);

    const suffix = `legend-${i}`;
    if (settings.attributes) {
      utils.addAttributes(seriesLine, series[i], settings.attributes, suffix, true);
    } else {
      utils.addAttributes(seriesLine, series[i], series[i]?.data?.attributes, suffix, true);
    }

    if ((chartType === 'pie' || chartType === 'donut') && settings.showMobile) {
      legend.find('.container').append(seriesLine);
    } else {
      legend.append(seriesLine);
    }

    if ((series[i].display && series[i].display === 'block') || (isTwoColumn && exceedsMaxWidth && isBottom)) {
      seriesLine.css({
        float: 'none',
        display: 'block',
        margin: '0 auto',
        width: `${width + 15}px`,
      });
    }

    // Add shapes
    if (chartType === 'scatterplot') {
      self.svg = d3.select(color[0]).append('svg')
        .attr('width', '24')
        .attr('height', '24')
        .append('path')
        .attr('class', 'symbol')
        .attr('transform', 'translate(10, 10)')
        .attr('d', d3.symbol().size('80').type( () => { return d3.symbols[i]; })) //eslint-disable-line
        .style('fill', hexColor);
    }

    // Change text of legend depends of the width
    if (innerWidth <= 480 && series[i].data && series[i].data.legendAbbrName) {
      textBlock.replaceWith(`<span class="chart-legend-item-text">${series[i].data.legendAbbrName}</span>`);
    }
    if (innerWidth >= 481 && innerWidth <= 768 && series[i].data &&
      series[i].data.legendShortName) {
      textBlock.replaceWith(`<span class="chart-legend-item-text">${series[i].data.legendShortName}</span>`);
    }
  }

  // Retrieve the legend title
  const legendTitle = settings.dataset[0]?.legendTitle;

  // Check if the chart type is either pie or donut,
  // legend title exists, and legend placement is 'right'
  if ((chartType === 'pie' || chartType === 'donut') && legendTitle && settings.legendPlacement === 'right') {
    const legendTitleElem = `<span class="chart-legend-title">${legendTitle}</span>`;

    // Prepend the legend title to the legend container
    legend.prepend(legendTitleElem);
  }

  if (legend instanceof $) {
    const regex = /^chart-legend-(.+)/;

    legend.on('click.chart', '.chart-legend-item', function () {
      const idx = $(this).attr('index-id').match(regex)[1];
      charts.handleElementClick(idx, this, series, settings, container);
    }).on('keypress.chart', '.chart-legend-item', function (e) {
      if (e.which === 13 || e.which === 32) {
        const idx = $(this).attr('index-id').match(regex)[1];
        charts.handleElementClick(idx, this, series, settings, container);
      }
    });

    if (isBottom && exceedsMaxWidth && series.length > maxLength || settings?.forceLegendPopup) {
      const listButton = $(`
      <button class="btn-actions list-button" type="button">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation" style="min-height: 0">
          <use href="#icon-bullet-steps"></use>
        </svg>
      </button>
      `);

      this.hasLegendPopup = true;

      const popupList = $('<ul class="popupmenu"></ul>');

      for (let j = 0; j < series.length; j++) {
        const listItem = $(`<li ${j === 0 ? 'class="is-hidden"' : ''}><a index-id="chart-legend-${j}" href="#"><div class="chart-popup-menu"></div></a></li>`);
        const textBlock = $(`<span class="chart-popup-menu-text">${xssUtils.stripTags(series[j].name)}</span>`);

        const hexColor = charts.chartColor(j, chartType || (series.length === 1 ? 'bar-single' : 'bar'), series[j]);
        const colorName = charts.chartColorName(j, chartType || (series.length === 1 ? 'bar-single' : 'bar'), series[j]);
        let seriesColor;
        let color = '';
        if (colorName.substr(0, 1) === '#') {
          color = $('<span class="chart-popup-menu-color"></span>');
          seriesColor = series[i].pattern;
          if (!series[i].pattern) {
            color.css('background-color', hexColor);
            seriesColor = hexColor;
          }
        } else {
          color = $(`<span class="chart-popup-menu-color ${series[i].pattern ? '' : colorName}"></span>`);
          seriesColor = colorName;
        }

        series[j].color = seriesColor;

        listItem.find('div').append(color, textBlock);
        popupList.append(listItem);
      }

      legend.css({
        'min-height': '40px',
        'max-height': '50px',
        display: 'flex'
      });

      $(container).addClass('auto-height');

      legend.append(listButton);
      $(container).append(legend);

      popupList.insertAfter(listButton);

      listButton.popupmenu({
        menu: popupList
      });

      const widgetHeight = $(container).parents('.widget').height();
      const widgetHeader = $($(container).parents('.widget').children().get(0)).height();
      const widgetContent = $($(container).parents('.widget').children().get(1)).height();
      const additionalPadding = (widgetHeight - (widgetHeader + widgetContent)) / 2;
      legend.css('padding-top', `${additionalPadding}px`);

      listButton.on('selected', (e, args) => {
        const idx = $(args[0]).attr('index-id').match(regex)[1];
        charts.handleElementClick(idx, this, series, settings, container);
      });
    } else {
      $(container).append(legend);
    }
  }
};

/**
 * Helper Function to Select from legend click
 * @private
 * @param {number} idx Index of clicked element.
 * @param {object} line The element that was clicked.
 * @param {array} series The data series.
 * @param {object} settings The chart setting
 * @param  {object} container The dom container.
 */
charts.handleElementClick = function (idx, line, series, settings, container) {
  if (!settings.selectable) {
    return;
  }

  const api = $(settings?.svg?.node()).closest('.chart-container').data('chart');
  const noTrigger = api?.initialSelectCall;
  const elem = series[idx];
  const isTwoColumn = series[0].display && series[0].display === 'twocolumn';
  let selector;

  if (settings.type === 'radar') {
    selector = d3.select(settings.svg.selectAll('.chart-radar-area').nodes()[idx]);
  }

  if (settings.type === 'pie' || settings.type === 'donut') {
    selector = d3.select(settings.svg.selectAll('.slice').nodes()[idx]);
  } else if (/positive-negative/.test(settings.type)) {
    if (!elem.option || (elem.option && elem.option === 'target')) {
      selector = settings.svg.select('.target-bar');
    } else {
      selector = settings.svg.select(`.bar.${elem.option}`);
    }
  } else if (['column', 'bar', 'bar-stacked', 'bar-grouped', 'bar-normalized', 'column-grouped', 'column-stacked', 'column-positive-negative', 'positive-negative'].indexOf(settings.type) !== -1) {
    // Grouped or singlular
    if (settings.isGrouped || settings.isSingle) {
      selector = settings.svg.select(`.series-${idx}`);
    } else if (settings.isStacked && !settings.isSingle) {
      // Stacked
      const thisGroup = d3.select(settings.svg.selectAll(settings.type === 'bar' || settings.type === 'bar-stacked' || settings.type === 'bar-normalized' ? '.series-group' : '.g').nodes()[idx]); // eslint-disable-line
      selector = thisGroup.select('.bar');
    }
  }

  if (['radar', 'pie', 'donut', 'column', 'bar', 'bar-stacked', 'bar-grouped', 'bar-normalized',
    'column-grouped', 'column-stacked', 'column-positive-negative', 'positive-negative'].indexOf(settings.type) !== -1 && settings?.selectable) {
    const lineElem = $(line);
    const isPressed = lineElem.attr('aria-pressed') === 'true';

    charts.clickedLegend = true;
    selector.dispatch('click');
    lineElem.parent().find('[aria-pressed]').removeAttr('aria-pressed');
    if (!isPressed) {
      lineElem.attr('aria-pressed', 'true');
    }
  }

  if (elem.selectionObj && settings?.selectable) {
    charts.selectElement(d3.select(elem.selectionObj.nodes()[idx]), elem.selectionInverse, elem.data, undefined, settings.dataset, noTrigger); // eslint-disable-line
  }

  if (isTwoColumn && this.hasLegendPopup) {
    const chartType = settings.type === 'donut' ? 'pie' : settings.type;
    const hexColor = charts.chartColor(idx, chartType || (series.length === 1 ? 'bar-single' : 'bar'), series[idx]);
    const colorName = charts.chartColorName(idx, chartType || (series.length === 1 ? 'bar-single' : 'bar'), series[idx]);
    let color = '';
    if (colorName.substr(0, 1) === '#') {
      color = $('<span class="chart-legend-color"></span>');
      if (!elem.pattern) {
        color.css('background-color', hexColor);
      }
    } else {
      color = $(`<span class="chart-legend-color ${elem.pattern ? '' : colorName}"></span>`);
    }

    const textBlock = $(`<span class="chart-legend-item-text">${xssUtils.stripTags(elem.name)}</span>`);
    const chartLegendItem = container.find('.chart-legend-item');

    chartLegendItem.empty();
    chartLegendItem.append(color, `<span class="audible">${Locale.translate('Highlight')}</span>`, textBlock);
    chartLegendItem.attr('index-id', `chart-legend-${idx}`);
    container.find('.list-button').data('popupmenu').menu.children().removeClass('is-hidden');
    $(container.find('.list-button').data('popupmenu').menu.children().get(idx)).addClass('is-hidden');
  }
};

// The selected array for this instance.
charts.selected = [];

/**
 * Delete all `selected` keys/value from given dataset.
 * @private
 * @param  {array} dataset  The data object
 * @returns  {void}
 */
charts.clearSelected = function (dataset) {
  if (dataset) {
    const deleteSelected = (obj) => {
      if (Object.prototype.hasOwnProperty.call(obj, 'selected')) {
        delete obj.selected;
      }
    };
    const clear = (ds) => {
      if (Array.isArray(ds)) {
        ds.forEach((node) => {
          deleteSelected(node);
          if (node.data) {
            clear(node.data);
          }
        });
      }
      deleteSelected(ds);
    };
    clear(dataset);
  }
};

/**
 * Select the element and fire the event, make the inverse selector opace.
 * @private
 * @param  {object} element The DOM element
 * @param  {object} inverse The opposite selection.
 * @param  {array} data  The data object
 * @param  {object} container  The DOM object
 * @param  {array} dataset  The dataset object
 * @param  {boolean} noTrigger  if true will not trigger
 */
charts.selectElement = function (element, inverse, data, container, dataset, noTrigger) {
  const isSelected = element.node() && element.classed('is-selected');
  charts.clearSelected(dataset);
  if (!isSelected) {
    data.selected = true;
  }
  const triggerData = [{ elem: element.nodes(), data: (!isSelected ? data : {}) }];

  inverse.classed('is-selected', false)
    .classed('is-not-selected', !isSelected);

  element.classed('is-not-selected', false)
    .classed('is-selected', !isSelected);

  charts.selected = $.isEmptyObject(triggerData[0].data) ? [] : triggerData;

  // Fire Events
  if (!noTrigger) {
    $(container).triggerHandler('selected', [triggerData]);
  }
};

/**
 * Style bars as selected or unselected
 * TODO: Refactor into individual components;
 * @private
 * @param  {object} o The object to handle.
 */
charts.setSelectedElement = function (o) {
  let dataset = o.dataset;
  const isPositiveNegative = /positive-negative/.test(o.type);
  const isBar = /^(bar|bar-stacked|bar-grouped|bar-normalized)$/.test(o.type);
  const isTypePie = o.type === 'pie' || o.type === 'donut';
  const isTypeColumn = /^(column|column-grouped|column-stacked|column-positive-negative|positive-negative)$/.test(o.type);

  const svg = o.svg;
  const isSingle = o.isSingle;
  const isGrouped = o.isGrouped;
  const isStacked = o.isStacked;

  const taskSelected = (o.task === 'selected');
  const selector = d3.select(o.selector);
  const isPositive = selector.classed('positive');
  const ticksX = o.svg.selectAll('.axis.x .tick');
  const ticksY = o.svg.selectAll('.axis.y .tick');
  const pnPositiveText = o.svg.selectAll('.bartext.positive, .target-bartext.positive');
  const pnNegativeText = o.svg.selectAll('.bartext.negative, .target-bartext.negative');
  const pnTargetText = o.svg.selectAll('.target-bartext.positive, .target-bartext.negative');
  const thisGroup = d3.select(o.selector.parentNode);
  const thisGroupId = parseInt((thisGroup.node() ? thisGroup.attr('data-group-id') : 0), 10);
  let triggerData = [];
  const selectedBars = [];
  let thisData;

  if (isStacked || isTypePie) {
    dataset = dataset || null;
  } else {
    dataset = (dataset && dataset[thisGroupId]) ?
      (dataset[thisGroupId].data || dataset[thisGroupId]) : null;
  }

  ticksX.style('font-weight', 'normal');
  ticksY.style('font-weight', 'normal');
  pnPositiveText.style('font-weight', 'normal');
  pnNegativeText.style('font-weight', 'normal');
  svg.selectAll('.is-selected').classed('is-selected', false);
  charts.clearSelected(o.dataset);

  if (isTypePie) {
    svg.selectAll('.is-not-selected').classed('is-not-selected', false);
  }
  if (isPositiveNegative) {
    if (Object.prototype.hasOwnProperty.call(o.dataset[0], 'targetBarsSelected')) {
      delete o.dataset[0].targetBarsSelected;
    }
  }

  // Task make selected
  if (taskSelected) {
    svg.selectAll('.bar, .target-bar').style('opacity', 0.6);

    // By legends only
    if (charts.clickedLegend && !isTypePie) {
      if (isPositiveNegative) {
        if (o.isTargetBar) {
          o.svg.selectAll('.target-bar').classed('is-selected', true).style('opacity', 1);
          pnTargetText.style('font-weight', 'bolder');
          o.dataset[0].targetBarsSelected = true;
        } else {
          o.svg.selectAll(isPositive ?
            '.bar.positive, .target-bar.positive' : '.bar.negative, .target-bar.negative')
            .classed('is-selected', true).style('opacity', 1);

          (isPositive ? pnPositiveText : pnNegativeText).style('font-weight', 'bolder');
        }

        svg.selectAll('.bar').each(function (d, i) {
          const bar = d3.select(this);
          if (bar.classed('is-selected')) {
            const bardata = dataset ? dataset[i] : d;
            bardata.selected = true;
            selectedBars.push({ elem: bar.node(), bardata });
          }
        });
        triggerData = selectedBars;
      } else if (isTypeColumn || isBar) {
        // Grouped and stacked only -NOT singular-

        if (isGrouped || isSingle) {
          o.svg.selectAll('.series-' + o.i).classed('is-selected', true).style('opacity', 1); //eslint-disable-line
        } else {
          thisGroup.classed('is-selected', true)
            .selectAll('.bar').classed('is-selected', true).style('opacity', 1);
        }

        svg.selectAll('.bar.is-selected').each(function (d, i) {
          const bar = d3.select(this);

          thisData = o.dataset;
          if (!thisData) {
            thisData = d;
          }

          if (isBar && !isStacked) {
            if (isGrouped) {
              thisData = o.dataset[i].data[o.i];
            } else {
              if (thisData[i][o.i]) {
                thisData = thisData[i][o.i];
              }

              if (thisData[o.i] && thisData[o.i][i]) {
                thisData = thisData[o.i][i];
              }

              if (thisData[i] && thisData[i][o.i]) {
                thisData = thisData[i][o.i];
              }
            }
          } else if (isStacked && !isSingle) {
            if (thisData[thisGroupId] && thisData[thisGroupId].data[i]) {
              thisData = thisData[thisGroupId].data[i];
            }
            if (isBar) {
              o.dataset[thisGroupId].selected = true;
            }
          } else {
            if (thisData[i].data[o.i]) {
              thisData = thisData[i].data[o.i];
            }

            if (thisData[o.i] && thisData[o.i].data[i]) {
              thisData = thisData[o.i].data[i];
            }

            if (thisData[i] && thisData[i].data[o.i]) {
              thisData = thisData[i].data[o.i];
            }
          }

          thisData.selected = true;
          selectedBars.push({ elem: bar.node(), data: thisData });
        });
        triggerData = selectedBars;
      }
    } else if (isSingle && isStacked && isTypeColumn) {
      // Single and stacked only -NOT grouped-
      thisData = dataset[0] && dataset[0].data ? dataset[0].data : o.d;
      selector.classed('is-selected', true).style('opacity', 1);
      triggerData.push({ elem: selector.nodes(), data: thisData[o.i] });
    } else if ((isSingle || isGrouped) && !isStacked && (isTypeColumn || isBar)) {
      // Single or groups only -NOT stacked-
      svg.selectAll(`${isTypeColumn ? '.axis.x' : '.axis.y'} .tick:nth-child(${(isGrouped ? thisGroupId : o.i) + 2})`)
        .style('font-weight', 'bolder');

      selector.classed('is-selected', true).style('opacity', 1);

      if (isPositiveNegative) {
        const thisIndex = o.isTargetBar ? o.i : o.i - o.dataset[0].data.length;
        svg.select(`.target-bar.series-${thisIndex}`).classed('is-selected', true).style('opacity', 1);
        svg.select(`.bar.series-${thisIndex}`).classed('is-selected', true).style('opacity', 1);

        d3.select(svg.selectAll('.bartext').nodes()[thisIndex]).style('font-weight', 'bolder');
        d3.select(svg.selectAll('.target-bartext').nodes()[thisIndex]).style('font-weight', 'bolder');
      }

      if (isGrouped || isPositiveNegative || isTypeColumn) {
        if (!isPositiveNegative && !isTypeColumn || (isTypeColumn && isGrouped)) {
          thisGroup.classed('is-selected', true)
            .selectAll('.bar').classed('is-selected', true).style('opacity', 1);
        }

        thisGroup.selectAll('.bar').each(function (d, i) {
          const bar = d3.select(this);
          if (bar.classed('is-selected')) {
            const data = dataset ? dataset[i] : d;
            data.selected = true;
            selectedBars.push({ elem: bar.nodes(), data, index: i });
          }
        });
        if (isGrouped) {
          triggerData.push({
            groupIndex: thisGroupId,
            groupElem: thisGroup.nodes()[0],//eslint-disable-line
            groupItems: selectedBars
          });
        } else {
          triggerData = selectedBars;
        }
      }
    } else if (isTypeColumn || isBar) {
      const barSelected = o.type === 'bar' ? `g[role=listitem]:nth-child(${o.i + 1}) .bar` : `.bar:nth-child(${o.i + 1})`;

      // Stacked Only
      svg.selectAll(`${isTypeColumn ? '.axis.x' : '.axis.y'} .tick:nth-child(${o.i + 2})`)
        .style('font-weight', 'bolder');

      svg.selectAll(`${barSelected}`)
        .classed('is-selected', true).style('opacity', 1);

      svg.selectAll('.bar.is-selected').each(function (d, i) {
        const bar = d3.select(this);
        let data = d;
        if (dataset) {
          data = isBar && isStacked && typeof dataset[i][o.i] !== 'undefined' ?
            dataset[i][o.i] : dataset[i].data[o.i];
        }
        data.selected = true;
        selectedBars.push({ elem: bar.nodes(), data, index: o.i });
      });
      triggerData = selectedBars;
    } else if (isTypePie) { // Pie
      // Unselect selected ones
      svg.selectAll('.slice')
        .classed('is-selected', false)
        .classed('is-not-selected', true)
        .attr('transform', '');

      let thisArcData = dataset && dataset[0] && dataset[0].data ?  //eslint-disable-line
        dataset[0].data[o.i] : (o.d ? o.d.data : o.d);  //eslint-disable-line
      thisArcData = thisArcData || {};
      thisArcData.selected = true;
      selector.classed('is-selected', true)
        .classed('is-not-selected', false)
        .attr('transform', 'scale(1.025, 1.025)');
      triggerData.push({ elem: selector.nodes(), data: thisArcData, index: o.i });

      if (o.i === undefined) {
        const nodeList = svg.selectAll('.slice')._groups[0];
        o.i = 0;

        for (let i = 0; i < nodeList.length; i++) {
          if ($(nodeList[i]).attr('class').includes('is-selected')) {
            o.i = i;
            break;
          }
        }
      }

      const isTwoColumn = o.series[0].display && o.series[0].display === 'twocolumn';
      if (isTwoColumn && this.hasLegendPopup) {
        const elem = o.series[o.i];
        const chartType = o.settings.type === 'donut' ? 'pie' : o.settings.type;
        const hexColor = charts.chartColor(o.i, chartType || (o.series.length === 1 ? 'bar-single' : 'bar'), o.series[o.i]);
        const colorName = charts.chartColorName(o.i, chartType || (o.series.length === 1 ? 'bar-single' : 'bar'), o.series[o.i]);
        let color = '';
        if (colorName.substr(0, 1) === '#') {
          color = $('<span class="chart-legend-color"></span>');
          if (!elem.pattern) {
            color.css('background-color', hexColor);
          }
        } else {
          color = $(`<span class="chart-legend-color ${elem.pattern ? '' : colorName}"></span>`);
        }

        const textBlock = $(`<span class="chart-legend-item-text">${xssUtils.stripTags(elem.name)}</span>`);
        const chartLegendItem = o.container.find('.chart-legend-item');

        chartLegendItem.empty();
        chartLegendItem.append(color, `<span class="audible">${Locale.translate('Highlight')}</span>`, textBlock);
        chartLegendItem.attr('index-id', `chart-legend-${o.i}`);
        o.container.find('.list-button').data('popupmenu').menu.children().removeClass('is-hidden');
        $(o.container.find('.list-button').data('popupmenu').menu.children().get(o.i)).addClass('is-hidden');
      }
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

  if (charts.clickedLegend) {
    charts.clickedLegend = false;
  }

  charts.selected = triggerData;

  if (o.isTrigger) {
    $(o.container).triggerHandler((taskSelected ? 'selected' : 'unselected'), [triggerData]);
  }
};

/**
 * Set the select element based on provided options and fire the events.
 * @private
 * @param {object} o An object with various
 * @param {boolean} isToggle If the select is a toggle of the state
 * @param {object} internals An object passing in chart internals
*/
charts.setSelected = function (o, isToggle, internals) {
  if (!o) {
    return;
  }

  let selected = 0;
  const equals = utils.equals;
  const legendsNode = internals.isPie ? internals.svg.node().nextSibling :
    internals.svg.node().parentNode.nextSibling;
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

    if (groups.nodes().length) {
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
        $(legends.selectAll('.chart-legend-item').nodes()[barIndex]).trigger('click.chart');
      }
    } else {
      selector.dispatch('click');
    }
  }
};

/**
 * Check if the labels collide.
 * @private
 * @param {object} svg The svg dom element.
 * @returns {boolean} True if the labels collide.
*/
charts.labelsColide = function (svg) {
  const ticks = svg.selectAll('.x text');
  let collides = false;

  ticks.each(function (d1, i) {
    const rect1 = this.getBoundingClientRect();
    let rect2;

    ticks.each(function (d2, j) {
      if (i !== j) {
        rect2 = this.getBoundingClientRect();

        const overlaps = !(rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom);

        if (overlaps) {
          collides = true;
        }
      }
    });
  });

  return collides;
};

/**
 * Apply a different length label
 * @private
 * @param  {object}  svg  The svg element.
 * @param  {array}  dataArray The data.
 * @param  {object}  elem The dom element
 * @param  {object}  selector The d3 selection
 * @param  {boolean} isNoEclipse True if its an eclipse.
 */
charts.applyAltLabels = function (svg, dataArray, elem, selector, isNoEclipse) {
  const ticks = selector ? svg.selectAll(selector) : svg.selectAll('.x text');

  ticks.each(function (d1, i) {
    let text = dataArray[i] ? dataArray[i][elem] : '';

    text = text || (isNoEclipse ?
      ((d3.select(this).text().substring(0, 1))) :
      (`${d3.select(this).text().substring(0, 6)}...`));

    d3.select(this).text(text);
  });
};

/**
 * Trigger the right click event.
 * @private
 * @param  {object} container  The svg container.
 * @param  {object} elem The element that was right clicked.
 * @param  {object} d The data object
 * @param  {object} event The event object
 */
charts.triggerContextMenu = function (container, elem, d, event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const e = $.Event('contextmenu');
  e.target = elem;
  e.pageX = event.pageX;
  e.pageY = event.pageY;
  $(container).trigger(e, [elem, d]);
};

/**
 * Calculates the width to render given text string.
 * @private
 * @param  {string} textStr The text to render.
 * @param  {object} fonts Optional for each theme.
 * @returns {number} The calculated text width in pixels.
 */
charts.calculateTextRenderWidth = function (textStr, fonts) {
  const defaultFonts = {
    soho: '700 12px arial',
    uplift: '600 14px arial',
    classic: '700 12px arial',
    new: '600 14px arial'
  };
  fonts = utils.mergeSettings(undefined, fonts, defaultFonts);
  let themeId = (theme?.currentTheme?.id || '').match(/soho|uplift|new|classic/);
  themeId = themeId ? themeId[0] : 'new';
  this.canvas = this.canvas || (this.canvas = document.createElement('canvas'));
  if (!this.canvas) return 0;
  const context = this.canvas?.getContext('2d');
  if (!context?.font) return 0;
  context.font = fonts[themeId];
  return context.measureText(textStr).width;
};

/**
 * Calculate the percentage for given partial and total value.
 * @private
 * @param  {number} value The partial value.
 * @param  {number} total The total value.
 * @returns {number} The calculated percentage.
 */
charts.calculatePercentage = function (value, total) {
  return (100 * value) / total;
};

/**
 * Get the percent value for given total value and percentage amount.
 * @private
 * @param  {number} total The total value.
 * @param  {number} amount The percentage amount.
 * @returns {number} The percent value.
 */
charts.getPercentage = function (total, amount) {
  return total * amount / 100;
};

/**
 * Trim given text to threshold and add `...` at the end.
 * @private
 * @param  {string} text The text to be trimed.
 * @param  {number} threshold The number of characters.
 * @returns {number} The calculated percent value.
 */
charts.trimText = function (text, threshold) {
  return text.length <= threshold ? text : `${text.substr(0, threshold)}...`;
};

/**
 * Get the label to use for given data and viewport area.
 * @private
 * @param  {object} d The data.
 * @param  {number} viewport The viewport area.
 * @returns {string} The label to use.
 */
charts.getLabel = function (d, viewport) {
  let r = d.name;
  if (viewport.xxsmall || viewport.xsmall || viewport.small) {
    r = d.shortName || d.abbrName || d.name;
  } else if (viewport.medium) {
    r = d.abbrName || d.name;
  }
  return r;
};

/**
 * Wraps SVG text http://bl.ocks.org/mbostock/7555321
 * @private
 * @param {object} node  The svg element.
 * @param {number}  width The width at which to wrap
 * @param {object} labelFactor The dom element
 */
charts.wrap = function (node, width, labelFactor) {
  if (!labelFactor) {
    labelFactor = 1.27;
  }

  if (!width) {
    labelFactor = 60;
  }

  node.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word = '';
    let line = [];
    let lineNumber = 0;

    if (words.length <= 1) {
      return;
    }

    const lineHeight = labelFactor; // ems
    const y = text.attr('y');
    const x = text.attr('x');
    const dy = parseFloat(text.attr('dy'));
    let tspan = text.text(null).append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', `${dy}em`);

    while (word = words.pop()) {    //eslint-disable-line
      line.push(word);
      tspan.text(line.join(' '));

      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
};

export { charts };
