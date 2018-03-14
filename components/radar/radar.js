// Shared Imports
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { charts } from '../charts/charts';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'radar';

/**
* @namespace
* @property {array} dataset The data to use in the radar
* @property {boolean} redrawOnResize If false, the component will not resize when resizing the page.
* @property {object} margin The margins of the SVG, you may want to adjust
* depending on text location.
* @property {number} levels How many levels or inner circles should there be drawn.
* @property {number} maxValue What is the value that the biggest circle will represent
* @property {number} labelFactor How far out than the outer circle should the labels be placed,
* this may be useful to adjust for some charts.
* @property {number} wrapWidth The number of pixels after which a label needs to be
* given a new line. You may want to change this based on label data.
* * @property {boolean} showCrosslines Set to false to hide the cross line axes.
* @property {boolean} showAxisLabels Set to false to hide percent labels.
* @property {number} opacityArea The opacity value of the blobs.
* This is set to the correct Infor Style.
* @property {number} dotRadius The size of the colored circles of each blog.
* Set to zero to remove dots.
* @property {number} opacityCircles The opacity of the circles of each blob 0 or .1 are good values.
* This is set to the correct Infor Style.
* @property {number} strokeWidth The width of the stroke around each blob.
* This is set to the correct Infor Style.
* @property {boolean} roundStrokes If true the area and stroke will follow a
* round path (cardinal-closed).
* @property {boolean} showCrosslines If false the axis lines will not be shown in the diagonals.
* @property {boolean} showAxisLabels If false the axis labels will not be shown.
* @property {string} axisFormatter D3 formatter to use on the axis labels
* @property {array} colors An array of colors to use.
* @property {boolean} showTooltips If false no tooltips will be shown.
* @property {object} tooltip A setting that controls the tooltip values and format.
* @property {string} tooltip.show Controls what is visible in the tooltip, this can be value, label
* or percent or custom function.
* @property {object} tooltip.formatter The d3.formatter string.
* @property {boolean} showLegend If false the legend will not be shown.
* @property {string} legendPlacement Where to locate the legend. This can be bottom or right at
* the moment.
* @property {object} emptyMessage An empty message will be displayed when there is no chart data.
* This accepts an object of the form emptyMessage:
* `{title: 'No Data Available',
*  info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data',
*  button: {text: 'xxx', click: <function>}
*  }`
*  Set this to null for no message or will default to 'No Data Found with an icon.'
*/
const RADAR_DEFAULTS = {
  dataset: [],
  redrawOnResize: true,
  margin: { top: 50, right: 0, bottom: 50, left: 0 },
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
  colors: charts.colorRange,
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
    this
      .build()
      .handleEvents();

    /**
    * Fires when the chart is complete done rendering, for customization.
    * @event rendered
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
   * Update the chart with a new dataset
   * @param  {object} data The data to use.
   */
  updateData(data) {
    const self = this;
    const settings = self.settings;
    const dims = {
      // Width of the circle
      w: parseInt(this.element.parent().width(), 10),
      // Height of the circle && 60px on top and bottom for labels
      h: parseInt(this.element.parent().height() - 115, 10),
    };

    if (settings.legendPlacement === 'right') {
      dims.w *= 0.75;
    }
    this.element.addClass('chart-radar');

    // Handle Empty Data Set
    if (data.length === 0) {
      self.element.emptymessage(self.settings.emptyMessage);
      return;
    }

    let tooltipInterval;
    const colors = d3.scaleOrdinal(self.settings.colors);

    // If the supplied maxValue is smaller than the actual one, replace by the max in the data
    const maxValue = Math.max(settings.maxValue, d3.max(data, i => d3.max(i.data.map(o => o.value))));  //eslint-disable-line

    const allAxis = data[0].data.map(i => i.name); // Map the names to the axis
    const total = allAxis.length; // The number of different axes
    const radius = Math.min(dims.w / 2, dims.h / 2); // Radius of the outermost circle
    const angleSlice = Math.PI * 2 / total; // The width in radians of each 'slice'

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
      .attr('width', dims.w + settings.margin.left + settings.margin.right)
      .attr('height', dims.h + settings.margin.top + settings.margin.bottom)
      .attr('class', 'chart-radar');

    this.svg = svg; // Pointer for selection states

    // Append a g element
    const g = svg.append('g')
      .attr('transform', `translate(${dims.w / 2 + settings.margin.left},${dims.h / 2 + settings.margin.top})`);

    // Filter for the outside glow effect
    if (settings.opacityCircles > 0) {
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
      .data(d3.range(1, (settings.levels + 1)).reverse())
      .enter()
      .append('circle')
      .attr('class', 'chart-radar-grid-circle')
      .attr('r', d => radius / settings.levels * d)
      .style('fill-opacity', settings.opacityCircles)
      .style('filter', settings.opacityCircles > 0 ? 'url(#glow)' : '');

    // Text indicating at what % each level is
    if (this.settings.showAxisLabels) {
      axisGrid.selectAll('.axis-label')
        .data(d3.range(1, (settings.levels + 1)).reverse())
        .enter().append('text')
        .attr('class', 'axis-label')
        .attr('x', 4)
        .attr('y', d => -d * radius / settings.levels)
        .attr('dy', '0.4em')
        .style('font-size', '10px')
        .attr('fill', '#737373')
        .text((d) => {
          let text = '';
          const roundedVal = Math.round(maxValue * 10) / 10;

          if (settings.axisFormatter.indexOf('%') > -1) {
            text = d3.format(settings.axisFormatter)(roundedVal * d / settings.levels);
          } else {
            text = d3.format(settings.axisFormatter)(d / settings.levels);
          }

          return text;
        });
    }

    // Draw the axes

    // Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');

    // Append the cross lines
    if (this.settings.showCrosslines) {
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
      .style('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * settings.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * settings.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .call(charts.wrap, settings.wrapWidth, settings.labelFactor);

    // Draw the radar chart blobs

    // The radial line function
    const radarLine = d3.lineRadial().curve(d3.curveBasisClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    if (settings.roundStrokes) {
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
      .style('fill-opacity', settings.opacityArea)
      .on('click', function (d, i) {
        // Handle Click to select
        clearTimeout(tooltipInterval);

        const selectElem = d3.select(this);
        const isSelected = selectElem.classed('is-selected');
        svg.selectAll('.is-selected').classed('is-selected', false);
        svg.selectAll('.is-not-selected').classed('is-not-selected', false);

        if (!isSelected) {
          svg.selectAll('.chart-radar-area').classed('is-not-selected', true);
          selectElem.classed('is-selected', true).classed('is-not-selected', false);
          selectElem.style('fill-opacity', self.settings.opacityArea);
        }

        const triggerData = {
          elem: selectElem.nodes(),
          data: d,
          index: i
        };
        self.element.triggerHandler((isSelected ? 'unselected' : 'selected'), triggerData);

        charts.selected = !isSelected ? triggerData : [];
      });

    // Create the outlines
    blobWrapper.append('path')
      .attr('class', 'chart-radar-stroke')
      .attr('d', d => radarLine(d))
      .style('stroke-width', `${settings.strokeWidth}px`)
      .style('stroke', (d, i) => colors(i))
      .style('fill', 'none')
      .style('filter', settings.opacityCircles > 0 ? 'url(#glow)' : '');

    // Append the circles
    blobWrapper.selectAll('.chart-radar-circle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'chart-radar-circle')
      .attr('r', settings.dotRadius)
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
      .attr('r', settings.dotRadius * 1.5)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseenter', function (d) {
        if (!settings.showTooltips) {
          return;
        }

        const offset = $(this).offset();
        let content = charts.formatToSettings(d, self.settings.tooltip);

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
          charts.showTooltip(x, y, content, 'top');
        }, 300);
      })
      .on('mouseleave', () => {
        clearTimeout(tooltipInterval);
        charts.hideTooltip();
      });

    // Add tooltip object
    if (settings.showTooltips) {
      charts.appendTooltip('is-pie');
    }

    if (settings.showLegend) {
      if (settings.legendPlacement) {
        this.element.addClass(`has-${settings.legendPlacement}-legend`);
      }

      const series = self.settings.dataset.map((d, i) => ({
        name: d.name,
        display: 'twocolumn',
        placement: self.settings.legendPlacement,
        color: colors(i)
      }));

      this.settings.svg = self.svg;
      charts.addLegend(series, 'pie', this.settings, this.element);
    }
  },

  /**
   * Set the initially selected elements
   * @private
   */
  setInitialSelected() {

  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
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
      selector.on('click').call(selector.node(), selector.datum(), arcIndex);
    }
  },

  /**
   * Get info on the currently selected lines.
   * @param {object} options The selected info object.
   */
  toggleSelected(options) {
    this.setSelected(options, true);
  },

  width: 0,

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
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
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
    this.element.empty().removeClass('radar-chart');
    charts.removeTooltip();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    $.removeData(this.element[0], 'radar');
  }
};

export { Radar, COMPONENT_NAME };
