const charts = {};

// Reference to the tooltip
charts.tooltip = {};

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

export { charts };
