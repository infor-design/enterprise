/**
 * @jest-environment jsdom
 */
import { triggerContextmenu, cleanup } from '../../helpers/func-utils';
import { Line } from '../../../src/components/line/line';

const lineHTML = `<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Line Chart Title</h2>
        </div>
        <div class="widget-content">
          <div id="line-example" class="chart-container">
          </div>
        </div>
      </div>
  </div>
</div>

<script id="line-script">
$('body').on('initialized', function () {

  var dataset = [{
    data: [{
        name: 'Jan',
        value: 3211,
        depth: 4,
        attributes: [
         { name: 'id', value: 'line-a-jan' },
         { name: 'data-automation-id', value: 'automation-id-line-a-jan' }
       ]
    }, {
        name: 'Feb',
        value: 3111,
        attributes: [
         { name: 'id', value: 'line-a-feb' },
         { name: 'data-automation-id', value: 'automation-id-line-a-feb' }
       ]
    }, {
        name: 'Mar',
        value: 3411,
        attributes: [
         { name: 'id', value: 'line-a-mar' },
         { name: 'data-automation-id', value: 'automation-id-line-a-mar' }
       ]
    }, {
        name: 'Apr',
        value: 3011,
        attributes: [
         { name: 'id', value: 'line-a-apr' },
         { name: 'data-automation-id', value: 'automation-id-line-a-apr' }
       ]
    }, {
        name: 'May',
        value: 3411,
        attributes: [
         { name: 'id', value: 'line-a-may' },
         { name: 'data-automation-id', value: 'automation-id-line-a-may' }
       ]
    }, {
        name: 'Jun',
        value: 3111,
        attributes: [
         { name: 'id', value: 'line-a-jun' },
         { name: 'data-automation-id', value: 'automation-id-line-a-jun' }
       ]
    }],
    name: 'Component A',
    legendShortName: 'Comp A',
    legendAbbrName: 'A',
    attributes: [
     { name: 'id', value: 'line-comp-a' },
     { name: 'data-automation-id', value: 'automation-id-line-comp-a' }
   ]
  }, {
    data: [{
        name: 'Jan',
        value: 2211,
        attributes: [
         { name: 'id', value: 'line-b-jan' },
         { name: 'data-automation-id', value: 'automation-id-line-b-jan' }
       ]
    }, {
        name: 'Feb',
        value: 2111,
        attributes: [
         { name: 'id', value: 'line-b-feb' },
         { name: 'data-automation-id', value: 'automation-id-line-b-feb' }
       ]
    }, {
        name: 'Mar',
        value: 2411,
        attributes: [
         { name: 'id', value: 'line-b-mar' },
         { name: 'data-automation-id', value: 'automation-id-line-b-mar' }
       ]
    }, {
        name: 'Apr',
        value: 2011,
        attributes: [
         { name: 'id', value: 'line-b-apr' },
         { name: 'data-automation-id', value: 'automation-id-line-b-apr' }
       ]
    }, {
        name: 'May',
        value: 2411,
        attributes: [
         { name: 'id', value: 'line-b-may' },
         { name: 'data-automation-id', value: 'automation-id-line-b-may' }
       ]
    }, {
        name: 'Jun',
        value: 2811,
        attributes: [
         { name: 'id', value: 'line-b-jun' },
         { name: 'data-automation-id', value: 'automation-id-line-b-jun' }
       ]
    }],
    name: 'Component B',
    legendShortName: 'Comp B',
    legendAbbrName: 'B',
    attributes: [
     { name: 'id', value: 'line-comp-b' },
     { name: 'data-automation-id', value: 'automation-id-line-comp-b' }
   ]
  }, {
    data: [{
        name: 'Jan',
        value: 1211,
        attributes: [
         { name: 'id', value: 'line-c-jan' },
         { name: 'data-automation-id', value: 'automation-id-line-c-jan' }
       ]
    }, {
        name: 'Feb',
        value: 1111,
        attributes: [
         { name: 'id', value: 'line-c-feb' },
         { name: 'data-automation-id', value: 'automation-id-line-c-feb' }
       ]
    }, {
        name: 'Mar',
        value: 1411,
        attributes: [
         { name: 'id', value: 'line-c-mar' },
         { name: 'data-automation-id', value: 'automation-id-line-c-mar' }
       ]
    }, {
        name: 'Apr',
        value: 1011,
        attributes: [
         { name: 'id', value: 'line-c-apr' },
         { name: 'data-automation-id', value: 'automation-id-line-c-apr' }
       ]
    }, {
        name: 'May',
        value: 1411,
        attributes: [
         { name: 'id', value: 'line-c-may' },
         { name: 'data-automation-id', value: 'automation-id-line-c-may' }
       ]
    }, {
        name: 'Jun',
        value: 1811,
        attributes: [
         { name: 'id', value: 'line-c-jun' },
         { name: 'data-automation-id', value: 'automation-id-line-c-jun' }
       ]
    }],
    name: 'Component C',
    legendShortName: 'Comp C',
    legendAbbrName: 'C',
    attributes: [
     { name: 'id', value: 'line-comp-c' },
     { name: 'data-automation-id', value: 'automation-id-line-comp-c' }
   ]
  }];

  $('#line-example').chart({type: 'line', dataset: dataset, yAxis: {ticks: {number: 10, format: 's'} } });

});
</script>`;

let lineEl;
let lineObj;

const dataset = [{
  data: [{
    name: 'Jan',
    value: 1211,
    depth: 4
  }, {
    name: 'Feb',
    value: 1111
  }, {
    name: 'Mar',
    value: 1411
  }, {
    name: 'Apr',
    value: 1011
  }, {
    name: 'May',
    value: 1411
  }, {
    name: 'Jun',
    value: 8111
  }],
  name: 'Component A',
  legendShortName: 'Comp A',
  legendAbbrName: 'A'
}, {
  data: [{
    name: 'Jan',
    value: 2211
  }, {
    name: 'Feb',
    value: 2111
  }, {
    name: 'Mar',
    value: 2411
  }, {
    name: 'Apr',
    value: 2011
  }, {
    name: 'May',
    value: 2411
  }, {
    name: 'Jun',
    value: 2811
  }],
  name: 'Component B',
  legendShortName: 'Comp B',
  legendAbbrName: 'A'
}, {
  data: [{
    name: 'Jan',
    value: 3211
  }, {
    name: 'Feb',
    value: 3111
  }, {
    name: 'Mar',
    value: 3411
  }, {
    name: 'Apr',
    value: 3011
  }, {
    name: 'May',
    value: 3411
  }, {
    name: 'Jun',
    value: 3811
  }],
  name: 'Component C',
  legendShortName: 'Comp C',
  legendAbbrName: 'C'
}];

describe('Line Chart API', () => {
  beforeEach(() => {
    lineEl = null;
    lineObj = null;
    document.body.insertAdjacentHTML('afterbegin', lineHTML);
    lineEl = document.body.querySelector('#line-example');

    lineObj = new Line(lineEl, { type: 'line', dataset });
  });

  afterEach(() => {
    lineObj?.destroy();
    cleanup();
  });

  it('should fire contextmenu event', () => {
    const callback = jest.fn();
    $(lineEl).on('contextmenu', callback);

    $(lineEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('[data-group-id="0"] .dot'));

    expect(callback).toHaveBeenCalled();
  });
});
