/**
 * Page Bootstrapper
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

  var environment = {

    // Setup a global resize event trigger for controls to listen to
    addGlobalResize: function() {
      $(window).on('resize', function() {
        $('body').triggerHandler('resize', [window]);
      });

      return this;
    },

    set: function () {
      this
        .makeSohoObject()
        .addBrowserClasses()
        .addPolyfills()
        .addGlobalResize();
    },

    addPolyfills: function() {
      var html = $('html');

      if (html.hasClass('ie') || html.hasClass('edge')) {
        this.polyfillSVG();
      }

      return this;
    },

    polyfillSVG: function () {
      /* jshint ignore:start */
      var polyfill, newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
      polyfill = newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537;

      // create xhr requests object
      var requests = {},
        requestAnimationFrame = window.requestAnimationFrame || setTimeout,
        uses = document.getElementsByTagName('use');

      function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                    // embed the target into the svg
                    embed(item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
      }

      function embed(svg, target) {
        // if the target exists
        if (target) {
          // create a document fragment to hold the contents of the target
          var fragment = document.createDocumentFragment(), viewBox = !svg.getAttribute('viewBox') && target.getAttribute('viewBox');
          // conditionally set the viewBox on the svg
          if (viewBox) {
            svg.setAttribute('viewBox', viewBox);
          }

          // copy the contents of the clone into the fragment
          for (// clone the target
          var clone = target.cloneNode(!0); clone.childNodes.length; ) {
            fragment.appendChild(clone.firstChild);
          }
          // append the fragment into the svg
          svg.appendChild(fragment);
        }
      }

      function oninterval() {
        // while the index exists in the live <use> collection
        for (// get the cached <use> index
        var index = 0; index < uses.length; ) {
          // get the current <use>
          var use = uses[index], svg = use.parentNode;
          if (svg && /svg/i.test(svg.nodeName)) {
              var src = use.getAttribute('xlink:href');

              if (polyfill) {
                  // remove the <use> element
                  svg.removeChild(use);

                  // parse the src and get the url and id
                  var srcSplit = src.split('#'), url = srcSplit.shift(), id = srcSplit.join('#');

                  // if the link is external
                  if (url.length) {
                    // get the cached xhr request
                    var xhr = requests[url];
                    // ensure the xhr request exists
                    xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open('GET', url), xhr.send(),
                    xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                    xhr._embeds.push({
                        svg: svg,
                        id: id
                    }), // prepare the xhr ready state change event
                    loadreadystatechange(xhr);

                  } else {
                    // embed the local id into the svg
                    embed(svg, document.getElementById(id));
                  }
                }
            } else {
              // increase the index when the previous value was not "valid"
              ++index;
            }
          }
          // continue the interval
          requestAnimationFrame(oninterval, 67);
      }

      // conditionally start the interval if the polyfill is active
      if (polyfill) {
        oninterval();
      }
      /* jshint ignore:end */

    },

    // Global Classes for browser, version and device as needed.
    addBrowserClasses: function() {
      var ua = navigator.userAgent || navigator.vendor || window.opera,
        html = $('html'); // User-agent string

      if (ua.indexOf('Safari')  !== -1 &&
          ua.indexOf('Chrome')  === -1 &&
          ua.indexOf('Android') === -1) {
        html.addClass('is-safari');
      }

      if (ua.indexOf('Mac OS X') !== -1) {
        html.addClass('is-mac');
      }

      if (ua.indexOf('Firefox') > 0) {
        html.addClass('is-firefox');
      }

      //Class-based detection for IE
      if (ua.match(/Edge\//)) {
        html.addClass('ie ie-edge');
      }
      if (ua.match(/Trident/)) {
        html.addClass('ie');
      }
      if (navigator.appVersion.indexOf('MSIE 8.0') > -1 ||
        ua.indexOf('MSIE 8.0') > -1 ||
        document.documentMode === 8) {
        html.addClass('ie8');
      }
      if (navigator.appVersion.indexOf('MSIE 9.0') > -1) {
        html.addClass('ie9');
      }
      if (navigator.appVersion.indexOf('MSIE 10.0') > -1) {
        html.addClass('ie10');
      } else {
        if (ua.match(/Trident\/7\./)) {
          html.addClass('ie11');
        }
      }

      // Class-based detection for iOS
      // /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/
      if ((/iPhone|iPod|iPad/).test(ua)) {
        html.addClass('ios');

        var iDevices = ['iPod', 'iPad', 'iPhone'];
        for (var i = 0; i < iDevices.length; i++) {
          if (new RegExp(iDevices[i]).test(ua)) {
            html.addClass(iDevices[i].toLowerCase());
          }
        }
      }

      if ((/Android/.test(ua))) {
        html.addClass('android');
      }

      return this;
    },

    makeSohoObject: function() {
      window.Soho = window.Soho || {};

      if (!window.Soho.base) {
        $.detectBaseTag();
      }

      if (window.Soho.svgPath === undefined) {
        window.Soho.svgPath = '/svg/';
      }

      var attr = $('[data-svg-path]').attr('data-svg-path');
      console.log('1', attr);

      if (attr) {
        window.Soho.svgPath = attr;
      }
      return this;
    }

  };

  environment.set();
  /* start-amd-strip-block */
}));
/* end-amd-strip-block */
