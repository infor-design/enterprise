// Shared Imports
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { charts } from '../charts/charts';

// Settings and Options
const COMPONENT_NAME = 'radar';

/**
* @namespace
* @property {array} dataset The data to use in the radar
* @property {boolean} redrawOnResize If true, the component will not resize when resizing the page.
* @property {boolean} margin The margins of the SVG, you may want to adjust
* depending on text location.
*/
const RADAR_DEFAULTS = {
  dataset: [],
  redrawOnResize: true,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  levels: 5, // How many levels or inner circles should there be drawn
  maxValue: 0, // What is the value that the biggest circle will represent
  labelFactor: 1.25, // How far out than the outer circle should the labels be placed
  wrapWidth: 60, // The number of pixels after which a label needs to be given a new line
  opacityArea: 0.2, // The opacity of the area of the blob
  dotRadius: 4, // The size of the colored circles of each blog
  opacityCircles: 0, // The opacity of the circles of each blob 0 or .1 are good values
  strokeWidth: 1, // The width of the stroke around each blob
  roundStrokes: true, // If true the area and stroke will follow a round path (cardinal-closed)
  color: d3.scaleOrdinal(charts.colorRange) // Color function
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
    return this;
  },

  /**
   * Build the Component.
   * @returns {object} The component prototype for chaining.
   * @private
   */
  build() {
    this.updateData(this.settings.dataset[0].data);
    this.setInitialSelected();
    this.element.trigger('rendered');
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
      w: parseInt(this.element.parent().width(), 10), // Width of the circle
      h: parseInt(this.element.parent().height() - 40, 10), // Height of the circle
    };

    // If the supplied maxValue is smaller than the actual one, replace by the max in the data
    const maxValue = Math.max(settings.maxValue, d3.max(data, i => d3.max(i.map(o => o.value))));

    const allAxis = data[0].map(i => i.name); // Map the names to the axis
    const total = allAxis.length; // The number of different axes
    const radius = Math.min(dims.w / 2, dims.h / 2); // Radius of the outermost circle
    const Format = d3.format('.0%'); // Percentage formatting
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
    axisGrid.selectAll('.axis-label')
      .data(d3.range(1, (settings.levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'axis-label')
      .attr('x', 4)
      .attr('y', d => -d * radius / settings.levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('fill', '#737373')
      .text(d => Format(maxValue * d / settings.levels));

    // Draw the axes

    // Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');

    // Append the lines
    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'line')
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    // Wraps SVG text http://bl.ocks.org/mbostock/7555321
    function wrap(node, width) {
      node.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word = '';
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.4; // ems
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
    }

    // Append the labels at each axis
    axis.append('text')
      .attr('class', 'legend')
      .style('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * settings.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * settings.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .call(wrap, settings.wrapWidth);

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
      .data(data)
      .enter().append('g')
      .attr('class', 'chart-radar-wrapper');

    // Append the backgrounds
    blobWrapper
      .append('path')
      .attr('class', 'chart-radar-area')
      .attr('d', d => radarLine(d))
      .style('fill', (d, i) => settings.color(i))
      .style('fill-opacity', settings.opacityArea)
      .on('mouseover', function () {
        // Dim all blobs
        d3.selectAll('.chart-radar-area')
          .transition().duration(200)
          .style('fill-opacity', 0.1);
        // Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style('fill-opacity', 0.2);
      })
      .on('mouseout', () => {
        // Bring back all blobs
        d3.selectAll('.chart-radar-area')
          .transition().duration(200)
          .style('fill-opacity', settings.opacityArea);
      });

    // Create the outlines
    blobWrapper.append('path')
      .attr('class', 'chart-radar-stroke')
      .attr('d', d => radarLine(d))
      .style('stroke-width', `${settings.strokeWidth}px`)
      .style('stroke', (d, i) => settings.color(i))
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
        return settings.color($(this.parentNode).index() - 1);
      })
      .style('fill-opacity', 0.7);

    // Append invisible circles for tooltip

    // Wrapper for the invisible circles on top
    const blobCircleWrapper = g.selectAll('.chart-radar-circle-wrapper')
      .data(data)
      .enter().append('g')
      .attr('class', 'chart-radar-circle-wrapper');

    // Set up the small tooltip for when you hover over a circle
    const tooltip = g.append('text')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll('.chart-radar-invisible-circle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'chart-radar-invisible-circle')
      .attr('r', settings.dotRadius * 1.5)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function (d) {
        const newX = parseFloat(d3.select(this).attr('cx')) - 10;
        const newY = parseFloat(d3.select(this).attr('cy')) - 10;

        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(Format(d.value))
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(200)
          .style('opacity', 0);
      });
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
   * @private
   * @returns {object} An object with the matching data and reference to the triggering element.
   */
  getSelected() {
    return charts.selected;
  },

  /**
   * Get info on the currently selected lines.
   * @private
   * @param {object} o The selection data object
   * @param {boolean} isToggle If true toggle the current state.
   */
  setSelected() {

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
