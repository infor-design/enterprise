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
 * Show Tooltip
 * @param  {[type]} x       [description]
 * @param  {[type]} y       [description]
 * @param  {[type]} content [description]
 * @param  {[type]} arrow   [description]
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

export { charts };
