import * as debug from '../../utils/debug';

// Settings and Options
const COMPONENT_NAME = 'link';

function Link(element) {
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

Link.prototype = {
  init() {
    this.build();
  },
  build() {
    // Add a tooltip if link text overflows
    const linkText = this.element.find('.text .title');
    if (linkText[0].offsetHeight < linkText[0].scrollHeight || linkText[0].offsetWidth < linkText[0].scrollWidth) {
      linkText.tooltip({ title: linkText.text() });
    }

    return this;
  }
};

export { Link, COMPONENT_NAME };
