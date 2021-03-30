import { triggerContextmenu, cleanup } from '../../helpers/func-utils';
import { Line } from '../../../src/components/line/line';

const areaHTML = require('../../../app/views/components/bubble/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let bubbleEl;
let bubbleObj;

const dataset = [{
  data: [{
    name: 'January',
    value: {
      x: 5,
      y: 3,
      z: 3
    },
    selected: true
  }, {
    name: 'February',
    value: {
      x: 37,
      y: 5,
      z: 9
    }
  }, {
    name: 'March',
    value: {
      x: 10,
      y: 5.3,
      z: 4
    }
  }, {
    name: 'April',
    value: {
      x: 80,
      y: 6,
      z: 10
    }
  }, {
    name: 'May',
    value: {
      x: 21,
      y: 4.8,
      z: 4
    }
  }, {
    name: 'June',
    value: {
      x: 72,
      y: 5.2,
      z: 4
    }
  }, {
    name: 'July',
    value: {
      x: 26,
      y: 8,
      z: 6
    }
  }, {
    name: 'August',
    value: {
      x: 71,
      y: 3.9,
      z: 8
    }
  }, {
    name: 'September',
    value: {
      x: 85,
      y: 8,
      z: 2
    }
  }, {
    name: 'October',
    value: {
      x: 52,
      y: 3,
      z: 2
    }
  }, {
    name: 'November',
    value: {
      x: 44,
      y: 5.9,
      z: 3
    }
  }, {
    name: 'December',
    value: {
      x: 110,
      y: 7,
      z: 4
    }
  }],
  name: 'Series 01',
  labels: {
    name: 'Series',
    value: {
      x: 'Revenue',
      y: 'Sold',
      z: 'Market Share'
    }
  },
  // Use d3 Format - only value will be formated
  valueFormatterString: {
    z: '0.0%'
  }
},
{
  data: [{
    name: 'January',
    value: {
      x: 9,
      y: 3.2,
      z: 3
    }
  }, {
    name: 'February',
    value: {
      x: 12,
      y: 6.3,
      z: 10
    }
  }, {
    name: 'March',
    value: {
      x: 65,
      y: 4,
      z: 10
    }
  }, {
    name: 'April',
    value: {
      x: 27,
      y: 7,
      z: 2
    }
  }, {
    name: 'May',
    value: {
      x: 29,
      y: 8.5,
      z: 4
    }
  }, {
    name: 'June',
    value: {
      x: 81,
      y: 3.9,
      z: 8
    }
  }, {
    name: 'July',
    value: {
      x: 33,
      y: 4.1,
      z: 7
    }
  }, {
    name: 'August',
    value: {
      x: 75,
      y: 4,
      z: 3
    }
  }, {
    name: 'September',
    value: {
      x: 39,
      y: 7,
      z: 4
    }
  }, {
    name: 'October',
    value: {
      x: 80,
      y: 2,
      z: 3
    }
  }, {
    name: 'November',
    value: {
      x: 48,
      y: 6.2,
      z: 2
    }
  }, {
    name: 'December',
    value: {
      x: 99,
      y: 4,
      z: 2
    }
  }],
  name: 'Series 02'
}];

describe('Bubble Chart API', () => {
  beforeEach(() => {
    bubbleEl = null;
    bubbleObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', areaHTML);
    bubbleEl = document.body.querySelector('#bubble-example');

    bubbleObj = new Line(bubbleEl, { isBubble: true, type: 'bubble', dataset, animate: true });
  });

  afterEach(() => {
    bubbleObj.destroy();
    cleanup();
  });

  it('Should show on page', () => {
    expect(document.body.querySelectorAll('.dot').length).toEqual(24);
    expect(document.body.querySelectorAll('.line-group').length).toEqual(2);
    expect(document.body.querySelectorAll('.chart-legend')[0].innerText.replace(/[\r\n]+/g, '')).toEqual('[Highlight]Series 01[Highlight]Series 02');
  });

  it('Should be able to get the get and set the selected bubble', () => {
    // Use group "name" to select
    let options = {
      groupName: 'name',
      groupValue: 'Series 01'
    };
    bubbleObj.setSelected(options);

    expect(bubbleObj.getSelected()[0].data.data.length).toEqual(12);
    expect(bubbleObj.getSelected()[0].data.name).toEqual('Series 01');

    bubbleObj.toggleSelected(options);

    expect(bubbleObj.getSelected().length).toEqual(0);

    // Use groupIndex to select
    options = {
      groupIndex: 0,
      fieldName: 'name',
      fieldValue: 'February'
    };
    bubbleObj.setSelected(options);

    expect(bubbleObj.getSelected()[0].data.value.x).toEqual(37);
    expect(bubbleObj.getSelected()[0].data.name).toEqual('February');

    bubbleObj.toggleSelected(options);

    expect(bubbleObj.getSelected().length).toEqual(0);

    // Use group index to select
    options = { groupIndex: 0 };
    bubbleObj.setSelected(options);

    expect(bubbleObj.getSelected()[0].data.data.length).toEqual(12);
    expect(bubbleObj.getSelected()[0].data.name).toEqual('Series 01');

    // Use point index to select
    options = {
      groupIndex: 1,
      index: 0
    };
    bubbleObj.setSelected(options);

    expect(bubbleObj.getSelected()[0].data.value.x).toEqual(9);
    expect(bubbleObj.getSelected()[0].data.name).toEqual('January');

    // Use jQuery object to select
    options = { elem: $('#area-example').find('[data-group-id="1"]') };
    bubbleObj.setSelected(options);

    expect(bubbleObj.getSelected()[0].data.value.x).toEqual(9);
    expect(bubbleObj.getSelected()[0].data.name).toEqual('January');

    options = { elem: $('#area-example').find('[data-group-id="1"] .dot:eq(0)') };
    bubbleObj.setSelected(options);

    expect(bubbleObj.getSelected()[0].data.value.x).toEqual(9);
    expect(bubbleObj.getSelected()[0].data.name).toEqual('January');
  });

  it('Should fire contextmenu event', () => {
    const spyEvent = spyOnEvent(bubbleEl, 'contextmenu');
    const result = { name: 'January', value: { x: 5, y: 3, z: 3 } };
    $(bubbleEl).on('contextmenu', (e, el, d) => {
      expect(d).toEqual(jasmine.objectContaining(result));
    });
    triggerContextmenu(document.body.querySelector('[data-group-id="0"] .dot'));

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should hide xAxis line', () => {
    bubbleObj.destroy();
    bubbleObj = new Line(bubbleEl, {
      dataset,
      type: 'bubble',
      isBubble: true,
      animate: false,
      xAxis: { hideLine: true }
    });

    expect(document.body.querySelectorAll('.dot').length).toEqual(24);
    expect(document.body.querySelectorAll('.line-group').length).toEqual(2);
    expect(document.body.querySelector('.x.axis .tick line').style.opacity).toEqual('0');
  });

  it('Should hide yAxis line', () => {
    bubbleObj.destroy();
    bubbleObj = new Line(bubbleEl, {
      dataset,
      type: 'bubble',
      isBubble: true,
      animate: false,
      yAxis: { hideLine: true }
    });

    expect(document.body.querySelectorAll('.dot').length).toEqual(24);
    expect(document.body.querySelectorAll('.line-group').length).toEqual(2);
    expect(document.body.querySelector('.y.axis .tick line').style.opacity).toEqual('0');
  });
});
