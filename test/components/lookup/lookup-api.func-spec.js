import { Lookup } from '../../../src/components/lookup/lookup';
import { cleanup } from '../../helpers/func-utils';

const lookupHTML = require('../../../app/views/components/lookup/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

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

fdescribe('Lookup API', () => {
  beforeEach((done) => {
    lookupEl = null;
    lookupObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', lookupHTML);
    lookupEl = document.body.querySelector('.lookup');
    lookupObj = new Lookup(lookupEl, settings);
    done();
  });

  afterEach((done) => {
    if (lookupObj) {
      lookupObj.destroy();
    }
    cleanup();
    done();
  });

  it('Should be defined', () => {
    expect(lookupObj).toEqual(jasmine.any(Object));
  });

  it('Should be visible', () => {
    expect(document.body.querySelector('.lookup')).toBeTruthy();
  });

  it('Should be able to disable it', () => {
    lookupObj.disable();

    expect(lookupEl.disabled).toBeTruthy();
    expect(lookupObj.isDisabled()).toBeTruthy();
  });

  it('Should be able to enable it', () => {
    lookupObj.enable();

    expect(lookupEl.readOnly).toBeFalsy();
    expect(lookupObj.isReadonly()).toBeFalsy();
    expect(lookupEl.disabled).toBeFalsy();
    expect(lookupObj.isDisabled()).toBeFalsy();
  });

  it('Should be able to make it readonly', () => {
    lookupObj.readonly();

    expect(lookupEl.readOnly).toBeTruthy();
    expect(lookupObj.isReadonly()).toBeTruthy();
  });

  it('Should hide icon if input is hidden', () => {
    lookupObj.destroy();

    lookupEl.classList.add('hidden');
    lookupObj = new Lookup(lookupEl);

    expect($(lookupEl).siblings('span.trigger').css('visibility')).toEqual('hidden');
  });

  it('Should be able to destroy it', (done) => {
    lookupObj.destroy();

    setTimeout(() => {
      expect(document.body.querySelector('.trigger')).toBeFalsy();
      done();
    }, 300);
  });

  it('Should be able to open the dialog and select', (done) => {
    lookupObj.openDialog();

    setTimeout(() => {
      const modalEl = lookupObj.modal.element[0];

      expect(modalEl.classList.contains('is-visible')).toBeTruthy();
      modalEl.querySelector('tbody td:nth-child(1)').click();

      expect(lookupEl.value).toEqual('2142201');
      done();
    }, 600);
  });

  it('Should be able to update the dataset when closed', (done) => {
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

  it('Should be able to update the dataset when open', (done) => {
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
