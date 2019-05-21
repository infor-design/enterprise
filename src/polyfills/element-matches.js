// Polyfill for `Element.prototype.matches`
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s) {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      let i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {} // eslint-disable-line
      return i > -1;
    };
}
