// Other Shared Imports
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'completion-chart';

/**
* A completion chart shows completion over a target value. Usually used to show progress as a percentage.
* @class CompletionChart
* @param {string} element The plugin element for the constuctor
* @param {string} [settings] The settings element.
*
* @param {array} [settings.dataset.data] The data to use in the chart (See examples)
* @param {string} [settings.dataset.data.name] - Required object with the title text `{text: 'Available Credit'}`
* @param {number} [settings.dataset.data.completed] - Required data for the complete section `{text: 'Spent', value: 50000, format: '$,.0f'}`
* @param {array} [settings.dataset.data.remaining] - Required data for the remaining section `{text: 'Pending', value: 10000, format: '$,.0f'}`
* @param {array} [settings.dataset.data.total] - Optional data for the total section `{value: 95000, format: '$,.0f'}`
*/

const COMPLETION_CHART_DEFAULTS = {
  dataset: []
};

function CompletionChart(element, settings) {
  this.settings = utils.mergeSettings(element, settings, COMPLETION_CHART_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
CompletionChart.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The completion chart prototype for chaining.
   */
  init() {
    // Do initialization. Build or Events ect
    this
      .build()
      .handleEvents();

    return this;
  },

  /**
   * Build the Completion Chart.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    let chartData = this.settings.dataset[0];

    // Handle Empty Data Set
    if (this.settings.dataset.length === 0) {
      chartData = {};
      chartData.data = [{
        name: { text: Locale ? Locale.translate('NoData') : 'No Data Available' },
        completed: { value: 0 },
      }];
    }

    const dataset = chartData.data[0];
    const isTarget = this.settings.type === 'completion-target';
    const isAchievment = this.settings.type === 'targeted-achievement';

    this.element
      .addClass('completion-chart')
      .addClass(`${this.settings.type === 'targeted-achievement' ? ' chart-targeted-achievement' : ''}`)
      .attr('role', 'image');

    // Set total defaults
    dataset.total = $.extend({}, { value: 100 }, dataset.total);

    // Basic functions
    const isUndefined = function (value) {
      return typeof value === 'undefined';
    };

    const fixUndefined = function (value, isNumber) {
      const defaultValue = (isNumber ? 0 : '');
      return !isUndefined(value) ? value : defaultValue;
    };

    const toValue = function (percent, ds) {
      ds = ds || dataset;
      return percent / 100 * fixUndefined(ds.total.value, true);
    };

    const toPercent = function (value, ds) {
      ds = ds || dataset;
      return Math.round(100 * (value / fixUndefined(ds.total.value, true)));
    };

    const localePercent = function (value) {
      return Locale.formatNumber(value / 100, { style: 'percent', maximumFractionDigits: 0 });
    };

    const format = function (value, formatterString, ds) {
      if (formatterString === '.0%') {
        return localePercent(toPercent(value, ds));
      }
      return d3.format(formatterString || 'm')(value);
    };

    const fixPercent = function (value, ds) {
      const s = value.toString();
      if (s.indexOf('%') !== -1) {
        return toValue(s.replace(/%/g, ''), ds);
      }
      return value;
    };

    const updateWidth = function (elem, value, ds) {
      let percent = toPercent(value, ds);
      percent = (percent < 0 ? 0 : percent);
      const w = percent > 100 ? 100 : percent;
      elem[0].style.width = `${w}%`;

      if (w === 0) {
        elem[0].className += 'is-empty';
      }
    };

    const updateTargetline = function (elem, value) {
      const min = (value < 0 ? 0 : value);
      const w = value > 100 ? 100 : min;
      elem[0].style.left = `${w}%`;
    };

    const setFormat = function (obj, ds, isPrivate) {
      const value = isPrivate ? obj._value : obj.value; //eslint-disable-line
      return (obj && !isUndefined(value) && obj.format) ? //eslint-disable-line
        format(fixPercent(value, ds), obj.format, ds) : //eslint-disable-line
        (obj ? fixPercent(value, ds) : 0);
    };

    const self = this;

    const setOverlap = function () {
      if (isTarget && !isAchievment) {
        setTimeout(() => {
          const remaining = $('.remaining', self.element);
          const total = $('.total', self.element);
          const rect1 = $('.completed .value', self.element)[0].getBoundingClientRect();
          const rect2 = remaining.find('.value')[0].getBoundingClientRect();

          remaining.add(total)[(rect1.right > rect2.left - 20) ? 'addClass' : 'removeClass']('overlap');
        }, 500);
      }
    };

    const getSpecColor = function (ds) {
      const specColor = {};
      ds = ds || dataset;

      if (ds.info && !isUndefined(ds.info.color)) {
        if (dataset.info.color.indexOf('#') === 0) {
          specColor.info = true;
        }
      }
      if (ds.completed && !isUndefined(ds.completed.color)) {
        if (ds.completed.color.indexOf('#') === 0) {
          specColor.completed = true;
        }
      }
      if (ds.remaining && !isUndefined(ds.remaining.color)) {
        if (ds.remaining.color.indexOf('#') === 0) {
          specColor.remaining = true;
        }
      }
      if (ds.targetline && !isUndefined(ds.targetline.color)) {
        if (ds.targetline.color.indexOf('#') === 0) {
          specColor.targetline = true;
        }
      }
      return specColor;
    };

    const getTotalText = function (ds) {
      let totalText = '';
      const difference = {};

      ds = ds || dataset;

      if (ds.total.difference) {
        difference.value = (ds.total.value - ds.completed.value);
        difference.format = dataset.total.format;
      }

      totalText = (!ds.total.textOnly ? setFormat(ds.total.difference ? difference : ds.total) : '') + (ds.total.text || '');

      totalText = isAchievment && ds.remaining ?
        (!ds.remaining.textOnly ? setFormat(ds.remaining) : '') + (ds.remaining.text || '') : totalText;

      return totalText;
    };

    const percentTextDefault = { show: false, color1: '', color2: 'inverse' };
    const percentText = $.extend({}, percentTextDefault, dataset.percentText);
    const setPercentText = function (ds) {
      ds = ds || dataset;
      percentText._value = ds.completed ? ds.completed.value : 0; //eslint-disable-line
      percentText.percent = toPercent(fixUndefined(percentText._value, true), ds); //eslint-disable-line
      percentText.format = '.0%';
      percentText._text = (typeof percentText.text !== 'undefined' ? //eslint-disable-line
        percentText.text : (typeof percentText.value !== 'undefined' ? //eslint-disable-line
          localePercent(percentText.value) : setFormat(percentText, ds, true)));
      percentText.color = percentText[percentText.percent > 55 ? 'color2' : 'color1'];
    };

    let c; // Cache will after created

    const cacheElements = () => {
      c = {
        name: $('.name', this.element),
        info: {
          value: $('.info .value', this.element),
          text: $('.info .text', this.element)
        },
        plainInfo: {
          value: $('>.value', this.element),
          text: $('>.text', this.element)
        },
        completed: {
          bar: $('.completed.bar', this.element),
          value: $('.completed .value', this.element),
          text: $('.completed .text, .completed-label .text', this.element)
        },
        remaining: {
          bar: $('.remaining.bar', this.element),
          value: $('.remaining .value', this.element),
          text: $('.remaining .text', this.element)
        },
        targetline: {
          bar: $('.targetline', this.element),
          value: $('.targetline .value', this.element),
          text: $('.targetline .text', this.element)
        },
        total: {
          bar: $('.total.bar', this.element),
          value: $('.total.value', this.element),
        },
        percentText: $('.chart-percent-text', this.element)
      };
    };

    // Add automation attributes
    const setAutomationAttributes = function () {
      const attr = chartData.attributes;
      if (attr) {
        const addAttributes = (elem, suffix) => utils.addAttributes(elem, chartData, chartData.attributes, suffix);
        addAttributes(c.name, 'name');
        addAttributes(c.info.value, 'info-value');
        addAttributes(c.info.text, 'info-text');
        addAttributes(c.plainInfo.value, 'info-value');
        addAttributes(c.plainInfo.text, 'info-text');
        addAttributes(c.completed.bar, 'completed-bar');
        addAttributes(c.completed.value, 'completed-value');
        addAttributes(c.completed.text, 'completed-text');
        addAttributes(c.remaining.bar, 'remaining-bar');
        addAttributes(c.remaining.value, 'remaining-value');
        addAttributes(c.remaining.text, 'remaining-text');
        addAttributes(c.targetline.bar, 'targetline-bar');
        addAttributes(c.targetline.value, 'targetline-value');
        addAttributes(c.targetline.text, 'targetline-text');
        addAttributes(c.total.bar, 'total-bar');
        addAttributes(c.total.value, 'total-value');
        addAttributes(c.percentText, 'percent-text');
      }
    };

    const setJsonData = function (ds) {
      ds = ds || dataset;
      c.name.data('jsonData', { name: ds.name });
      c.info.value.add(c.info.text).data('jsonData', { info: ds.info });
      c.completed.bar.add(c.completed.value).add(c.completed.text)
        .data('jsonData', { completed: ds.completed });
      c.remaining.bar.add(c.remaining.value).add(c.remaining.text)
        .data('jsonData', { remaining: ds.remaining });
      c.targetline.bar.add(c.targetline.value).add(c.targetline.text)
        .data('jsonData', { targetline: ds.targetline });
      c.total.bar.add(c.total.value).data('jsonData', { total: ds.total });
      c.percentText.data('jsonData', { percentText: ds.percentText });
    };

    const updateBars = function (ds) {
      let w;
      ds = ds || dataset;
      // Update completed bar width
      if (ds.completed) {
        w = fixPercent(ds.completed.value, ds);
        updateWidth(c.completed.bar, w, ds);
      }

      // Update remaining bar width
      if (ds.remaining) {
        w = fixPercent(ds.completed.value, ds) + fixPercent(ds.remaining.value, ds);
        updateWidth(c.remaining.bar, w, ds);
        setOverlap();
      }

      // Update target line bar position
      if (ds.targetline) {
        w = fixPercent(ds.targetline.value, ds);
        updateTargetline(c.targetline.bar, w, ds);
      }
    };

    if (!isUndefined(percentText.color) && percentText.color1 === '') {
      percentText.color1 = percentText.color;
    }

    // Render
    const html = { body: $('<div class="total bar" />') };
    const specColor = getSpecColor();

    if (isTarget || isAchievment) {
      const totalText = getTotalText();

      html.body.addClass(`chart-completion-target${isAchievment ? ' chart-targeted-achievement' : ''}`);

      html.label = `<span class="label">
        <span class="name">${fixUndefined(dataset.name.text)} ${dataset.completed.color && dataset.completed.color === 'error' ? $.createIcon({ icon: 'error', classes: 'icon-error' }) : ''}</span>
        <span class="l-pull-right total value">${totalText}</span>
      </span>`;
    } else {
      html.body.addClass('chart-completion');
      const name = fixUndefined(dataset.name.text);
      const completedColor = fixUndefined(dataset.completed.color);
      const infoColor = fixUndefined(dataset.info.color);
      let bColor = dataset.info.color && !specColor.info ? infoColor : '';
      const infoText = fixUndefined(dataset.info.text);

      if (!specColor.completed) {
        bColor = completedColor;
      }

      let styleColor = '';
      if (dataset.info.color && specColor.info) {
        styleColor = infoColor;
      }

      if (specColor.completed) {
        styleColor = completedColor;
      }

      const styleValue = (dataset.info && !isUndefined(dataset.info.value) ?
        fixUndefined(dataset.info.value) :
        setFormat(dataset.completed));

      html.label = `<b class="label name">${name}</b>
      <b class="label info ${bColor} colored">
      <span class="value ${bColor}" ${styleColor ? `style="color:${styleColor}` : ''}">${styleValue}</span>
      <span class="text ${bColor}" ${styleColor ? `style="color:${styleColor}` : ''}">${infoText}</span>
      </b>`;
    }

    if (dataset.remaining) {
      html.remaining = `${'' +
      '<div class="target remaining bar'}${!specColor.remaining ? ` ${fixUndefined(dataset.remaining.color)}` : ''}"${specColor.remaining ? (` style="color:${dataset.remaining.color};background-color:${dataset.remaining.color};"`) : ''}">${
        isAchievment ? '' : `<span${!isTarget && !isAchievment ? ' class="audible"' : ''}>` +
          `<span class="value${!specColor.remaining ? ` ${fixUndefined(dataset.remaining.color)}` : ''}"${specColor.remaining ? (` style="color:${dataset.remaining.color};"`) : ''}">${
            setFormat(dataset.remaining)
          }</span><br />` +
          `<span class="text${!specColor.remaining ? ` ${fixUndefined(dataset.remaining.color)}` : ''}"${specColor.remaining ? (` style="color:${dataset.remaining.color};"`) : ''}">${
            fixUndefined(dataset.remaining.text)
          }</span>` +
        '</span>'
      }</div>`;
    } else {
      html.remaining = '<div class="target remaining bar" style="opacity: 0"></div>';
    }

    if (dataset.completed && isAchievment) {
      setPercentText();
      specColor.percentText = percentText.color.indexOf('#') === 0;

      html.completed = `${'' +
      '<div class="completed bar'}${!specColor.completed ? ` ${fixUndefined(dataset.completed.color)}` : ''}"${specColor.completed ? (` style="color:${dataset.completed.color};background-color:${dataset.completed.color};"`) : ''}"></div>${
        percentText.show ? `<div class="chart-percent-text${!specColor.percentText && percentText.color !== '' ? ` ${percentText.color}` : ''}"${specColor.percentText ? (` style="color:${percentText.color};"`) : ''}>${percentText._text}</div>` : '' //eslint-disable-line
      }<span class="completed-label"${!isTarget && !isAchievment ? ' class="audible"' : ''}>` +
          `<span class="text">${
            fixUndefined(dataset.completed.text)
          }</span>` +
        '</span>';
    }

    if (dataset.completed.text || (dataset.completed.format && !isAchievment)) {
      this.element.addClass('chart-completion-target-padding');
    }

    if (dataset.completed && !isAchievment) {
      html.completed = `${'' +
      '<div class="completed bar'}${!specColor.completed ? ` ${fixUndefined(dataset.completed.color)}` : ''}"${specColor.completed ? (` style="color:${dataset.completed.color};background-color:${dataset.completed.color};"`) : ''}>` +
        `<span${!isTarget && !isAchievment ? ' class="audible"' : ''}>` +
          `<span class="value${!specColor.completed ? ` ${fixUndefined(dataset.completed.color)}` : ''}"${specColor.completed ? (` style="color:${dataset.completed.color};"`) : ''}">${setFormat(dataset.completed)}</span><br />` +
          `<span class="text${!specColor.completed ? ` ${fixUndefined(dataset.completed.color)}` : ''}"${specColor.completed ? (` style="color:${dataset.completed.color};"`) : ''}">${
            fixUndefined(dataset.completed.text)
          }</span>` +
        '</span></div>';
    }

    if (dataset.targetline) {
      html.targetline = `${'' +
      '<div class="target-line targetline bar'}${!specColor.targetline ? ` ${fixUndefined(dataset.targetline.color)}` : ''}"${specColor.targetline ? (` style="color:${dataset.targetline.color};background-color:${dataset.targetline.color};"`) : ''}">` +
        `<span${!isTarget && !isAchievment ? ' class="audible"' : ''}>` +
          `<span class="value${!specColor.targetline ? ` ${fixUndefined(dataset.targetline.color)}` : ''}"${specColor.targetline ? (` style="color:${dataset.targetline.color};"`) : ''}">${
            setFormat(dataset.targetline)
          }</span><br />` +
            `<span class="text${!specColor.targetline ? ` ${fixUndefined(dataset.targetline.color)}` : ''}"${specColor.targetline ? (` style="color:${dataset.targetline.color};"`) : ''}">${
              fixUndefined(dataset.targetline.text)
            }</span>` +
        '</span>' +
      '</div>';
    }

    DOM.append(html.body, (html.remaining || '') + (html.completed || '') + (html.targetline || ''), '<a><use><svg><div><span><br>');
    DOM.append(this.element, html.label + html.body.prop('outerHTML'), '<a><use><svg><div><span><br>');

    cacheElements();
    setAutomationAttributes();
    setJsonData();
    updateBars();

    return this;
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

    return this;
  },

  /**
   * Handle updated settings and values.
   * @param  {object} settings The new settings object
   * @returns {object} The api for chaining.
   */
  updated(settings) {
    const type = settings.type || this.settings.type;
    this.settings = settings;
    this.settings.type = type;
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
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @returns {void}
   */
  destroy() {
    this.element.empty().removeClass('completion-chart');
    charts.removeTooltip();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    $.removeData(this.element[0], 'chart');
  }
};

export { CompletionChart, COMPONENT_NAME };
