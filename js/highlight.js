/*
 * Text Highlight/Unhighlight Control
 * Originally called "highlight v5" by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Modified for SoHo Xi (TODO: bit.ly link to docs)
**/

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
}(function() {
/* end-amd-strip-block */

  $.fn.highlight = function(pat) {

    function innerHighlight(node, pat) {
      var skip = 0,
        pos, spannode, middlebit, middleclone, endbit;

      if (node.nodeType === 3) {
        pos = node.data.toUpperCase().indexOf(pat);
        pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);

        if (pos >= 0) {
          spannode = document.createElement('mark');
          spannode.className = 'highlight';
          middlebit = node.splitText(pos);
          endbit = middlebit.splitText(pat.length);
          middleclone = middlebit.cloneNode(true);
          spannode.appendChild(middleclone);
          middlebit.parentNode.replaceChild(spannode, middlebit);
          skip = 1;
        }

      } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
        for (var i = 0; i < node.childNodes.length; ++i) {
          i += innerHighlight(node.childNodes[i], pat);
        }
      }

      return skip;
    }

    return this.length && pat && pat.length ? this.each(function() {
      innerHighlight(this, pat.toUpperCase());
    }) : this;
  };

  $.fn.unhighlight = function() {
    return this.find('mark.highlight').each(function() {
      var node = this.parentNode;
      node.replaceChild(this.firstChild, this);
      node.normalize();
    }).end();
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
