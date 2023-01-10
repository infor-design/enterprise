/**
 * @jest-environment jsdom
 */
import { Lookup } from '../../../src/components/lookup/lookup';
import { cleanup } from '../../helpers/func-utils';

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

const lookupHTML = `<div class="row">
  <div class="twelve columns">

    <div class="field">
      <label for="product-lookup" class="label required">Products</label>
      <input id="product-lookup" data-init="false" data-validate="required" class="lookup" name="product-lookup" type="text"/>
    </div>

    <div class="field">
      <label for="product-mask" class="label required">Products (mask)</label>
      <input id="product-mask" data-init="false" data-validate="required" class="lookup" name="product-mask" type="text"/>
    </div>

    <div class="field">
      <label for="lookup-field-small" class="label">Customers (small)</label>
      <input id="lookup-field-small" class="input-xs lookup" name="lookup-field-small" type="text" value="DA"/>
      <span class="data-description">Danonics 123 Group</span>
    </div>

    <div class="field">
      <label for="lookup-field-disabled" class="label">Products (disabled)</label>
      <input id="lookup-field-disabled" class="lookup" disabled="true" name="lookup-field-disabled" type="text" value="2241202"/>
    </div>

  </div>
</div>

<script>
  var grid,
    columns = [],
    data = [];

  // Some Sample Data
  data.push({ id: 1, productId: 2142201, productName: 'Compressor', activity:  'Assemble Paint', quantity: 1, price: 210.99, status: 'OK', orderDate: new Date(2014, 12, 8), action: 'Action'});
  data.push({ id: 2, productId: 2241202, productName: 'Different Compressor', activity:  'Inspect and Repair', quantity: 2, price: 210.99, status: '', orderDate: new Date(2015, 7, 3), action: 'On Hold'});
  data.push({ id: 3, productId: 2342203, productName: 'Compressor', activity:  'Inspect and Repair', quantity: 1, price: 120.99, status: null, orderDate: new Date(2014, 6, 3), action: 'Action'});
  data.push({ id: 4, productId: 2445204, productName: 'Another Compressor', activity:  'Assemble Paint', quantity: 3, price: 210.99, status: 'OK', orderDate: new Date(2015, 3, 3), action: 'Action'});
  data.push({ id: 5, productId: 2542205, productName: 'I Love Compressors', activity:  'Inspect and Repair', quantity: 4, price: 210.99, status: 'OK', orderDate: new Date(2015, 5, 5), action: 'On Hold'});
  data.push({ id: 5, productId: 2642205, productName: 'Air Compressors', activity:  'Inspect and Repair', quantity: 41, price: 120.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});
  data.push({ id: 6, productId: 2642206, productName: 'Some Compressor', activity:  'inspect and Repair', quantity: 41, price: 123.99, status: 'OK', orderDate: new Date(2014, 6, 9), action: 'On Hold'});

  //Define Columns for the Grid.
  columns.push({ id: 'productId', name: 'Product Id', field: 'productId'});
  columns.push({ id: 'productName', name: 'Product Name', field: 'productName', formatter: Soho.Formatters.Hyperlink});
  columns.push({ id: 'activity', hidden: true, name: 'Activity', field: 'activity'});
  columns.push({ id: 'quantity', filterType: 'text', name: 'Quantity', field: 'quantity'});
  columns.push({ id: 'price', name: 'Price', field: 'price', formatter: Soho.Formatters.Decimal});

  $('body').on('initialized', function () {
    //Init and get the api for the grid
    $('#product-lookup, #product-mask').lookup({
      field: 'productId',
      autoApply: true,
      autoFocus: false,
      modalSettings: {
        fullsize: 'responsive',
        breakpoint: 'phone-to-tablet'
      },
      options: {
        columns: columns,
        dataset: data,
        selectable: 'single',
        rowNavigation: true,
        toolbar: {
          results: true,
          keywordFilter: true,
          advancedFilter: false,
          actions: false,
          selectable: 'single',
          filterable: true,
          views: true,
          rowHeight: false,
          collapsibleFilter: false,
          fullWidth: true
        }
      },
      attributes: [
        {
          name: 'data-automation-id',
          value: 'my-lookup'
        }
      ]
    });

    $('#product-mask').mask({
      patternOptions: {
        allowDecimal: false,
        allowNegative: false,
        allowThousandsSeparator: false,
        decimalLimit: 0,
        integerLimit: 7,
        symbols: {
          decimal: '.',
          negative: '-',
          thousands: ','
        }
      },
      process: "number"
    });
  });
</script>`;

let lookupEl;
let lookupObj;

const columns = [];
const data = [];

// Some Sample Data
data.push({
  id: 1,
  productId: 2142201,
  productName: 'Compressor',
  activity: 'Assemble Paint'
});
data.push({
  id: 2,
  productId: 2142202,
  productName: 'Compressor',
  activity: 'Assemble Paint'
});
data.push({
  id: 3,
  productId: 2142204,
  productName: 'Compressor',
  activity: 'Assemble Paint'
});

columns.push({ id: 'productId', name: 'Product Id', field: 'productId' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName' });
columns.push({ id: 'activity', hidden: true, name: 'Activity', field: 'activity' });

const settings = {
  field: 'productId',
  autoApply: true,
  options: {
    columns,
    dataset: data,
    selectable: 'single',
    rowNavigation: true,
    toolbar: {
      results: true,
      keywordFilter: true,
      advancedFilter: false,
      actions: false,
      selectable: 'single',
      filterable: true,
      views: true,
      rowHeight: false,
      collapsibleFilter: false,
      fullWidth: true
    }
  }
};

describe('Lookup API', () => {
  beforeEach((done) => {
    lookupEl = null;
    lookupObj = null;
    document.body.insertAdjacentHTML('afterbegin', lookupHTML);
    lookupEl = document.body.querySelector('.lookup');
    lookupObj = new Lookup(lookupEl, settings);
    done();
  });

  afterEach((done) => {
    lookupObj?.destroy();
    cleanup();
    done();
  });

  it('should be defined', () => {
    expect(lookupObj).toBeTruthy();
  });

  it('should be visible', () => {
    expect(document.body.querySelector('.lookup')).toBeTruthy();
  });

  it('should have accessible text', () => {
    // Label
    expect(lookupObj.label.length).toBeTruthy();

    // Trigger button audible span
    expect(lookupObj.icon[0].querySelector('.audible').textContent.length).toBeTruthy();
  });

  it('should be able to disable it', () => {
    lookupObj.disable();

    expect(lookupEl.disabled).toBeTruthy();
    expect(lookupObj.isDisabled()).toBeTruthy();
  });

  it('should be able to enable it', () => {
    lookupObj.enable();

    expect(lookupEl.readOnly).toBeFalsy();
    expect(lookupObj.isReadonly()).toBeFalsy();
    expect(lookupEl.disabled).toBeFalsy();
    expect(lookupObj.isDisabled()).toBeFalsy();
  });

  it('should be able to make it readonly', () => {
    lookupObj.readonly();

    expect(lookupEl.readOnly).toBeTruthy();
    expect(lookupObj.isReadonly()).toBeTruthy();
  });

  it.skip('should hide icon if input is hidden', () => {
    lookupObj.destroy();

    lookupEl.classList.add('hidden');
    lookupObj = new Lookup(lookupEl);

    expect($(lookupEl).siblings('button.trigger').css('visibility')).toEqual('hidden');
  });

  it('should be able to destroy it', (done) => {
    lookupObj.destroy();

    setTimeout(() => {
      expect(document.body.querySelector('.trigger')).toBeFalsy();
      done();
    }, 300);
  });

  it.skip('should be able to open the dialog and select', (done) => {
    lookupObj.openDialog();

    setTimeout(() => {
      const modalEl = lookupObj.modal.element[0];

      expect(modalEl.classList.contains('is-visible')).toBeTruthy();
      modalEl.querySelector('tbody td:nth-child(1)').click();

      expect(lookupEl.value).toEqual('2142201');
      done();
    }, 600);
  });

  it.skip('should be able to update the dataset when closed', (done) => {
    const newData = [];
    newData.push({
      id: 77,
      productId: 777777,
      productName: 'Compressor',
      activity: 'Assemble Paint'
    });
    newData.push({
      id: 88,
      productId: 888888,
      productName: 'Compressor',
      activity: 'Assemble Paint'
    });
    newData.push({
      id: 99,
      productId: 999999,
      productName: 'Compressor',
      activity: 'Assemble Paint'
    });

    lookupObj.updateDataset(newData);
    lookupObj.openDialog();

    setTimeout(() => {
      const modalEl = lookupObj.modal.element[0];

      expect(modalEl.classList.contains('is-visible')).toBeTruthy();
      expect(modalEl.querySelector('tbody tr:nth-child(1) td:nth-child(1)').innerText.trim()).toEqual('777777');
      expect(modalEl.querySelector('tbody tr:nth-child(2) td:nth-child(1)').innerText.trim()).toEqual('888888');
      expect(modalEl.querySelector('tbody tr:nth-child(3) td:nth-child(1)').innerText.trim()).toEqual('999999');
      modalEl.querySelector('tbody tr:nth-child(1) td:nth-child(1)').click();

      expect(lookupEl.value).toEqual('777777');
      done();
    }, 600);
  });

  it.skip('should be able to update the dataset when open', (done) => {
    const newData = [];
    newData.push({
      id: 77,
      productId: 777777,
      productName: 'Compressor',
      activity: 'Assemble Paint'
    });
    newData.push({
      id: 88,
      productId: 888888,
      productName: 'Compressor',
      activity: 'Assemble Paint'
    });
    newData.push({
      id: 99,
      productId: 999999,
      productName: 'Compressor',
      activity: 'Assemble Paint'
    });

    lookupObj.openDialog();

    setTimeout(() => {
      const modalEl = lookupObj.modal.element[0];

      expect(modalEl.classList.contains('is-visible')).toBeTruthy();
      lookupObj.updateDataset(newData);

      expect(modalEl.querySelector('tbody tr:nth-child(1) td:nth-child(1)').innerText.trim()).toEqual('777777');
      expect(modalEl.querySelector('tbody tr:nth-child(2) td:nth-child(1)').innerText.trim()).toEqual('888888');
      expect(modalEl.querySelector('tbody tr:nth-child(3) td:nth-child(1)').innerText.trim()).toEqual('999999');
      modalEl.querySelector('tbody tr:nth-child(1) td:nth-child(1)').click();

      expect(lookupEl.value).toEqual('777777');
      done();
    }, 600);
  });
});
