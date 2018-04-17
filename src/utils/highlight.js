// Text Highlight/Unhighlight Control
// Originally called "highlight v5" by Johann Burkard
// http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
//
// Modified for SoHo Xi (TODO: bit.ly link to docs)

function innerHighlight(node, pat) {
  let skip = 0;
  let pos;
  let spannode;
  let middlebit;
  let middleclone;

  if (node.nodeType === 3) {
    pos = node.data.toUpperCase().indexOf(pat);
    pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);

    if (pos >= 0) {
      spannode = document.createElement('mark');
      spannode.className = 'highlight';
      middlebit = node.splitText(pos);
      middleclone = middlebit.cloneNode(true);
      spannode.appendChild(middleclone);
      middlebit.parentNode.replaceChild(spannode, middlebit);
      skip = 1;
    }
  } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
    for (let i = 0; i < node.childNodes.length; ++i) {
      i += innerHighlight(node.childNodes[i], pat);
    }
  }

  return skip;
}

/**
 * Highlight a portion of text inside an element
 * @param {string} pat portion of text that's being highlighted
 * @returns {this} this
 */
$.fn.highlight = function (pat) {
  if (this.length && pat && pat.length) {
    return this.each(() => {
      innerHighlight(this, pat.toUpperCase());
    });
  }
  return this;
};

/**
 * Removes highlighting from portions of text inside an element
 * @returns {this} this
 */
$.fn.unhighlight = function () {
  return this.find('mark.highlight').each(() => {
    const node = this.parentNode;
    node.replaceChild(this.firstChild, this);
    node.normalize();
  }).end();
};
