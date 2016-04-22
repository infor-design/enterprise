/**
 * Global Destroy Method
 * Automatically calls destroy on a range of elements that have a destroy method.
 */

/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  /* end-amd-strip-block */

  $.fn.destroy = function() {
    var self = $(this);

    function canCallDestroy(cb) {
      if (!cb) {
        return false;
      }
      if (cb instanceof jQuery) {
        return false;
      }

      if (!cb.destroy || typeof cb.destroy !== 'function') {
        return false;
      }
      return true;
    }

    function destroyControls(elems) {
      var destroyedControls = [];

      $.each(elems, function iterator(index, elem) {
        $.each($(elem).data(), function(index, control) {
          var isCb = canCallDestroy(control);
          if (isCb) {
            control.destroy();
            destroyedControls.push({ elem: $(elem), control: control });
          }
        });
      });

      self.trigger('destroyed', [destroyedControls]);
    }

    var DOMelements = self.find('*').add(self);

    destroyControls(DOMelements);

    return this;
  };

  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
