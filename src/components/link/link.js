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
    console.log('Build', this.element);
    // Tooltip here
    // If overflow plop a tooltip

    return this;
  }
};

export { Link, COMPONENT_NAME };
