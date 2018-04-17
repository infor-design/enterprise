import '../tooltip/tooltip.jquery';

// The Tooltip Component and Popover Component use the same prototype with different settings.
// Simply setup the Popover to be the same thing as the Tooltip.
$.fn.popover = $.fn.tooltip;
