import { Icon, COMPONENT_NAME } from './icons';
import { stringUtils } from '../../utils/string';

/**
 * jQuery component wrappers
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on.
 */
$.fn.icon = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Icon(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};

/**
 * Factory Function for instantly building icons.
 * Use this for building icons that don't exist yet.
 * Scoped Privately on purpose...
 */
(function () {
  function normalizeIconOptions(options) {
    const defaults = {
      icon: 'user-profile', // omit the "icon-" if you want; this code strips it out.
      classes: ['icon']
    };
    options = options || $.extend({}, defaults);

    if (typeof options === 'string') {
      options = $.extend({}, defaults, {
        icon: options.replace('icon-', '')
      });
    }

    // reroute "options.class" if that exists
    if (!options.classes && options.class) {
      options.classes = options.class;
      delete options.class;
    }

    if (!options.classes) {
      options.classes = [].concat(defaults.classes);
    }

    if (typeof options.classes === 'string') {
      options.classes = options.classes.split(' ');
    }

    if (options.classes.indexOf('icon') === -1) {
      options.classes.push('icon');
    }

    if (!options.icon) {
      options.icon = '';
    }
    return options;
  }

  // Returns the RAW HTML for creating a new icon in string form
  $.createIcon = function createIcon(options) {
    options = normalizeIconOptions(options);

    // Use external URL to create an `<img>` based icon
    if (stringUtils.isValidURL(options.icon)) {
      return `<img
        src="${options.icon}"
        alt="Icon"
        class="icon custom-icon ${options.classes.join(' ')}"
        aria-hidden="true"
        role="presentation"/>`;
    }

    // Use SVG with an official IDS Icon
    return [
      `<svg class="${options.classes.join(' ')}" focusable="false" aria-hidden="true" role="presentation">` +
        `<use href="#icon-${options.icon}"></use>` +
      '</svg>'
    ].join('');
  };

  // Returns a jQuery-wrapped element containing a new icon
  $.createIconElement = function createIconElement(options) {
    return $($.createIcon(options));
  };

  // Returns just the path part
  $.createIconPath = function createIconElement(options) {
    options = normalizeIconOptions(options);
    return $.getBaseURL(`#icon-${options.icon.replace('icon-', '')}`);
  };

  // Toggle the use or entire svg icon in the case of the polyfill
  $.fn.changeIcon = function (icon) {
    if (!icon) {
      return;
    }
    $(this).find('use').attr('href', $.createIconPath({ icon }));
  };

  $.fn.getIconName = function () {
    const svg = $(this);
    const use = svg.find('use');

    if (use.length === 1 && use.attr('href')) {
      return use.attr('href').substr(use.attr('href').indexOf('#icon-') + 6);
    }
    if (use.length === 1 && use.attr('xlink:href')) {
      return use.attr('xlink:href').substr(use.attr('xlink:href').indexOf('#icon-') + 6);
    }
    return svg.attr('data-icon');
  };
}());
