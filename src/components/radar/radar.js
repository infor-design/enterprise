// Shared Imports
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';
import { theme } from '../theme/theme';

import '../emptymessage/emptymessage.jquery';

// Settings and Options
const COMPONENT_NAME = 'radar';

// Default Radar Options
const RADAR_DEFAULTS = {
  dataset: [],
  redrawOnResize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  levels: 4,
  maxValue: 0,
  labelFactor: 1.27,
  wrapWidth: 60,
  opacityArea: 0.2,
  dotRadius: 3,
  opacityCircles: 0,
  strokeWidth: 1,
  roundStrokes: true,
  showCrosslines: true,
  showAxisLabels: true,
  colors: null,
  showTooltips: true,
  tooltip: {
    show: 'value', // value, label, label (value) or percent or custom function
    formatter: '.0%' // or .0% ?
  },
  axisFormatter: '.0%',
  showLegend: true,
  legendPlacement: 'right',
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }
};

/**
 * A radar chart is a graphical method of displaying multivariate data in the form of a
 * two-dimensional chart of three or more quantitative variables represented on axes starting
 * from the same poin
 * @class Radar
 * @param {string} element The plugin element for the constuctor
 * @param {string} settings The settings element.
 * @param {array} settings.dataset The data to use in the radar
 * @param {boolean} [settings.redrawOnResize = true] If false, the component will not resize when resizing the page.
 * @param {object} [settings.margin] The margins of the SVG, you may want to adjust
 * depending on text location.
 * @param {number} [settings.levels = 4] How many levels or inner circles should there be drawn.
 * @param {number} [settings.maxValue = 0] What is the value that the biggest circle will represent
 * @param {number} [settings.labelFactor = 1.27] How far out than the outer circle should the labels be placed,
 * this may be useful to adjust for some charts.
 * @param {number} [settings.wrapWidth = 60] The number of pixels after which a label needs to be
 * given a new line. You may want to change this based on label data.
 * @param {boolean} [settings.showCrosslines = true] Set to false to hide the cross line axes.
 * @param {boolean} [settings.showAxisLabels = true] Set to false to hide percent labels.
 * @param {number} [settings.opacityArea = 0.2] The opacity value of the blobs. This is set to the correct Infor Style.
 * @param {number} [settings.dotRadius = 3] The size of the colored circles of each blog. Set to zero to remove dots.
 * @param {number} [settings.opacityCircles  = 0]The opacity of the circles of each blob 0 or .1 are good values.
 * This is set to the correct Infor Style.
 * @param {number} [settings.strokeWidth = 1] The width of the stroke around each blob.
 * This is set to the correct Infor Style.
 * @param {boolean} [settings.roundStrokes = true] If true the area and stroke will follow a
 * round path (cardinal-closed).
 * @param {boolean} [settings.showCrosslines = true]  If false the axis lines will not be shown in the diagonals.
 * @param {boolean} [settings.showAxisLabels = true]  If false the axis labels will not be shown.
 * @param {string} [settings.axisFormatter = '.0%'] D3 formatter to use on the axis labels
 * @param {array} [settings.colors] An array of colors to use.
 * @param {boolean} [settings.showTooltips = true] If false no tooltips will be shown.
 * @param {object} [settings.tooltip] A setting that controls the tooltip values and format.
 * @param {string} [settings.tooltip.show = 'value'] Controls what is visible in the tooltip, this can be value, label
 * or percent or custom function.
 * @param {object} [settings.tooltip.formatter = '.0%'] The d3.formatter string.
 * @param {boolean} [settings.showLegend = true] If false the legend will not be shown.
 * @param {string} [settings.legendPlacement = 'right'] Where to locate the legend. This can be bottom or right at
 * the moment.
 * @param {object} [settings.emptyMessage] An empty message will be displayed when there is no chart data.
 * This accepts an object of the form emptyMessage:
 * `{title: 'No Data Available',
 *  info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data',
 *  button: {text: 'xxx', click: <function>}
 *  }`
 *  Set this to null for no message or will default to 'No Data Found with an icon.'
 */
function Radar(element, settings) {
  this.settings = utils.mergeSettings(element, settings, RADAR_DEFAULTS);
  if (settings && settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
Radar.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The component prototype for chaining.
   */
  init() {
    this.namespace = utils.uniqueId({ classList: [this.settings.type, 'chart'] });
    this.width = 0;

    this
      .setupColors()
      .build()
      .handleEvents();

    /**
    * Fires when the chart is complete done rendering, for customization.
    * @event rendered
    * @memberof Radar
    * @property {object} event - The jquery event object
    * @property {array} svg - The svg object.
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
    this.updateData(this.settings.dataset);
    this.setInitialSelected();
    return this;
  },

  /**
   * Sets up the internal colors.
   * @returns {object} The component prototype for chaining.
   * @private
   */
  setupColors() {
    if (!this.settings.colors || this.useBuiltInColors) {
      this.settings.colors = charts.colorRange();
      this.useBuiltInColors = true;
    }
    return this;
  },

  /**
   * Update the chart with a new dataset
   * @param  {object} data The data to use.
   */
  updateData(data) {
    const self = this;
    const s = this.settings;
    const isPersonalizable = this.element.closest('.is-personalizable').length > 0;

    // Add css class to container
    this.element.addClass('chart-radar');

    // Handle Empty Data Set
    if (data.length === 0) {
      self.element.emptymessage(s.emptyMessage);
      return;
    }

    // Set dimensions
    const parent = this.element.parent();
    const dims = {
      w: parent.width(),
      h: parent.height(),
      extra: 0.957 // approximate calc
    };
    if (s.legendPlacement === 'right') {
      dims.w *= 0.75;
    }
    // Manually adjust height to fit legend on mobile view
    if (s.showLegend && dims.w < 420 && !s.margin.bottom) {
      let adjust;
      if (dims.w > 405) {
        adjust = 5;
      } else if (dims.w > 390) {
        adjust = 3;
      } else if (dims.w > 350) {
        adjust = 0.9;
      } else {
        adjust = 0.5;
      }
      dims.h -= (420 - dims.w) * adjust;
    }
    dims.transform = {
      x: (dims.w / 2) + ((s.margin.left + s.margin.right) / 2),
      y: ((dims.h / 2) * dims.extra) + ((s.margin.top + s.margin.bottom) / 2)
    };

    // Get the name text from given data
    const getNameText = (d) => {
      const size = { min: 328, max: 469 };
      let text = '';
      if (dims.w <= size.min) {
        text = d.shortName || d.abbrName || d.name || '';
      } else if (dims.w >= (size.min + 1) && dims.w <= size.max) {
        text = d.abbrName || d.name || '';
      } else if (dims.w > size.max) {
        text = d.name || '';
      }
      return text;
    };

    let tooltipInterval;
    const colors = d3.scaleOrdinal(s.colors);

    // If the supplied maxValue is smaller than the actual one, replace by the max in the data
    const maxValue = Math.max(s.maxValue, d3.max(data, i => d3.max(i.data.map(o => o.value))));
    const allAxes = data[0].data.map(d => getNameText(d)); // Map the names to the axes
    const total = allAxes.length; // The number of different axes
    const angleSlice = Math.PI * 2 / total; // The width in radians of each 'slice'
    const radius = Math.min(dims.w / 3, dims.h / 3) * dims.extra; // Radius of the outermost circle

    // Create the Scale for the radius
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    // Create the container SVG and parent g
    // Remove whatever chart with the same id/class was present before
    const elem = this.element[0];
    d3.select(elem).select('svg').remove();

    // Initiate the radar chart SVG
    const svg = d3.select(elem).append('svg')
      .attr('width', dims.w + (s.margin.left + s.margin.right))
      .attr('height', dims.h + (s.margin.top + s.margin.bottom))
      .attr('class', 'chart-radar');

    this.svg = svg; // Pointer for selection states

    // Append a g element
    const g = svg.append('g')
      .attr('transform', `translate(${dims.transform.x},${dims.transform.y})`);

    // Filter for the outside glow effect
    if (s.opacityCircles > 0) {
      const filter = g.append('defs').append('filter').attr('id', 'glow');
      filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    // Draw the Circular grid

    // Wrapper for the grid & axes
    const axisGrid = g.append('g').attr('class', 'chart-radar-axis-wrapper');

    // Draw the background circles
    axisGrid.selectAll('.levels')
      .data(d3.range(1, (s.levels + 1)).reverse())
      .enter()
      .append('circle')
      .attr('class', 'chart-radar-grid-circle')
      .attr('r', d => radius / s.levels * d)
      .style('fill-opacity', s.opacityCircles)
      .style('filter', s.opacityCircles > 0 ? 'url(#glow)' : '');

    // Text indicating at what % each level is
    if (s.showAxisLabels) {
      axisGrid.selectAll('.axis-label')
        .data(d3.range(1, (s.levels + 1)).reverse())
        .enter().append('text')
        .attr('class', 'axis-label')
        .attr('x', 4)
        .attr('y', d => -d * radius / s.levels)
        .attr('dy', '0.4em')
        .style('font-size', theme.uplift ? '12px' : '10px')
        .attr('fill', '#737373')
        .text((d) => {
          let text = '';
          const roundedVal = Math.round(maxValue * 10) / 10;

          if (s.axisFormatter.indexOf('%') > -1) {
            text = d3.format(s.axisFormatter)(roundedVal * d / s.levels);
          } else {
            text = d3.format(s.axisFormatter)(d / s.levels);
          }

          return text;
        });
    }

    // Draw the axes

    // Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll('.axis')
      .data(allAxes)
      .enter()
      .append('g')
      .attr('class', 'axis');

    // Append the cross lines
    if (s.showCrosslines) {
      axis.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', (d, i) => rScale(maxValue * 1.05) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('y2', (d, i) => rScale(maxValue * 1.05) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('class', 'chart-radar-crossline')
        .style('stroke-width', '1px');
    }

    // Append the labels at each axis
    axis.append('text')
      .attr('class', 'legend')
      .style('font-size', theme.uplift ? '14px' : '12px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * s.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * s.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d);

    this.element[dims.w < 420 ? 'addClass' : 'removeClass']('is-small');

    if (dims.w > 456) {
      svg.selectAll('.chart-radar-axis-wrapper .axis .legend').each(function () {
        charts.wrap(d3.select(this), s.wrapWidth, s.labelFactor);
      });
    }

    // Draw the radar chart blobs

    // The radial line function
    const radarLine = d3.lineRadial().curve(d3.curveBasisClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    if (s.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed);
    }

    // Create a wrapper for the blobs
    const blobWrapper = g.selectAll('.radarWrapper')
      .data(data.map(i => i.data))
      .enter().append('g')
      .attr('class', 'chart-radar-wrapper');

    // Append the backgrounds
    blobWrapper
      .append('path')
      .attr('class', 'chart-radar-area')
      .attr('d', d => radarLine(d))
      .style('fill', (d, i) => colors(i))
      .style('fill-opacity', s.opacityArea)
      .on(`click.${self.namespace}`, function (d, i) {
        // Handle Click to select
        clearTimeout(tooltipInterval);

        const selectElem = d3.select(this);
        const isSelected = selectElem.classed('is-selected');
        svg.selectAll('.is-selected').classed('is-selected', false);
        svg.selectAll('.is-not-selected').classed('is-not-selected', false);
        charts.clearSelected(s.dataset);

        if (!isSelected) {
          svg.selectAll('.chart-radar-area').classed('is-not-selected', true);
          selectElem.classed('is-selected', true).classed('is-not-selected', false);
          selectElem.style('fill-opacity', s.opacityArea);
          s.dataset[i].selected = true;
        }

        const triggerData = {
          elem: selectElem.nodes(),
          data: d,
          index: i
        };

        /**
        * Fires when the chart is complete done rendering, for customization.
        * @event selected
        * @memberof Radar
        * @property {object} data - The data element attached
        * @property {HTMLElement} elem - The dom element
        * @property {number} index - The index for this blob.
        */

        /**
        * Fires when the chart is complete done rendering, for customization.
        * @event deselected
        * @memberof Radar
        * @property {object} data - The data element attached
        * @property {HTMLElement} elem - The dom element
        * @property {number} index - The index for this blob.
        */
        self.element.triggerHandler((isSelected ? 'deselected' : 'selected'), triggerData);

        charts.selected = !isSelected ? triggerData : [];
      })
      .on(`contextmenu.${self.namespace}`, function (d) {
        charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d);
      });

    // Create the outlines
    blobWrapper.append('path')
      .attr('class', 'chart-radar-stroke')
      .attr('d', d => radarLine(d))
      .style('stroke-width', `${s.strokeWidth}px`)
      .style('stroke', (d, i) => colors(i))
      .style('fill', 'none')
      .style('filter', s.opacityCircles > 0 ? 'url(#glow)' : '');

    // Append the circles
    blobWrapper.selectAll('.chart-radar-circle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'chart-radar-circle')
      .attr('r', s.dotRadius)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', function () {
        return colors($(this.parentNode).index() - 1);
      })
      .style('fill-opacity', 0.6);

    // Wrapper for the invisible circles on top
    const blobCircleWrapper = g.selectAll('.radar-circle-wrapper')
      .data(data.map(i => i.data))
      .enter().append('g')
      .attr('class', 'radar-circle-wrapper');

    // Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll('.radar-invisible-circle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'radar-invisible-circle')
      .attr('r', s.dotRadius * 1.5)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on(`mouseenter.${self.namespace}`, function (d) {
        if (!s.showTooltips) {
          return;
        }

        const offset = $(this).offset();
        let content = charts.formatToSettings(d, s.tooltip);

        if (content.indexOf('<b>') === -1) {
          content = content.replace('(', '<b>');
          content = content.replace(')', '</b>');
        }

        const size = charts.tooltipSize(content);
        let x = offset.left;
        let y = offset.top;
        const padding = 6;
        x -= (size.width / 2) - padding;
        y -= size.height + padding;

        // Debounce it a bit
        if (tooltipInterval != null) {
          clearTimeout(tooltipInterval);
        }

        tooltipInterval = setTimeout(() => {
          if (charts.tooltip && charts.tooltip.length) {
            charts.tooltip[isPersonalizable ? 'addClass' : 'removeClass']('is-personalizable');
          }
          charts.showTooltip(x, y, content, 'top');
        }, 300);
      })
      .on(`mouseleave.${self.namespace}`, () => {
        clearTimeout(tooltipInterval);
        charts.hideTooltip();
      })
      .on(`contextmenu.${self.namespace}`, function (d) {
        charts.triggerContextMenu(self.element, d3.select(this).nodes()[0], d);
      });

    // Add tooltip object
    if (s.showTooltips) {
      charts.appendTooltip('is-pie');
    }

    if (s.showLegend) {
      if (s.legendPlacement) {
        this.element.addClass(`has-${s.legendPlacement}-legend`);
      }

      const series = s.dataset.map((d, i) => ({
        name: d.name,
        display: 'twocolumn',
        placement: s.legendPlacement,
        color: colors(i)
      }));

      s.svg = self.svg;
      charts.addLegend(series, 'pie', s, this.element);
    }
  },

  /**
   * Set the initially selected elements
   * @private
   */
  setInitialSelected() {
    const s = this.settings;
    if (Array.isArray(s.dataset)) {
      for (let i = 0, l = s.dataset.length; i < l; i++) {
        if (s.dataset[i].selected) {
          const elems = this.svg.selectAll('.chart-radar-area').nodes();
          const selectElem = d3.select(elems[i]);
          this.svg.selectAll('.is-selected').classed('is-selected', false);
          this.svg.selectAll('.is-not-selected').classed('is-not-selected', false);
          this.svg.selectAll('.chart-radar-area').classed('is-not-selected', true);
          selectElem.classed('is-selected', true).classed('is-not-selected', false);
          selectElem.style('fill-opacity', s.opacityArea);
          break;
        }
      }
    }
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
   * @returns {object} An object with the matching data and reference to the triggering element.
   */
  getSelected() {
    return charts.selected;
  },

  /**
   * Get info on the currently selected lines.
   * @param {object} o The selection data object
   * @param {boolean} isToggle If true toggle the current state.
   */
  setSelected(o, isToggle) {
    let selector;
    let arcIndex;
    let selected = 0;
    const self = this;

    this.svg.selectAll('.chart-radar-area').each(function (d, i) {
      const set = self.settings.dataset[i];
      if (!set || !set.data) {
        return;
      }

      if (selected < 1) {
        if ((typeof o.fieldName !== 'undefined' &&
              typeof o.fieldValue !== 'undefined' &&
                o.fieldValue === set[o.fieldName]) ||
            (typeof o.index !== 'undefined' && o.index === i) ||
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
      this.element.find('.chart-legend').remove();
      this.settings.dataset = settings.dataset;
      this.updateData(this.settings.dataset);
      return this;
    }

    this.element.empty();
    return this
      .setupColors()
      .build();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  teardown() {
    const events = arr => `${arr.join(`.${this.namespace} `)}.${this.namespace}`;

    if (this.element) {
      this.element.find('.chart-radar-area').off(events(['click', 'contextmenu']));
      this.element.find('.radar-invisible-circle')
        .off(events(['mouseenter', 'mouseleave', 'contextmenu']));

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
      this.element.empty().removeClass('radar-chart');
      $.removeData(this.element[0], COMPONENT_NAME);
      $.removeData(this.element[0], 'radar');
    }
  }
};

export { Radar, COMPONENT_NAME };
