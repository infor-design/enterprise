/* eslint-disable jasmine/no-focused-tests */
import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';

const datagridHTML = require('../../../app/views/components/datagrid/example-index.html');
const svg = require('../../../src/components/icons/svg.html');
const sampleData = require('../../../app/data/datagrid-sample-data');

require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let svgEl;
let datagridObj;

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'productId', name: 'Id', field: 'productId', reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName', reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text' });
columns.push({ id: 'activity', name: 'Activity', field: 'activity', reorderable: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', field: 'price', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', reorderable: true, filterType: 'Text', formatter: Formatters.Text });

describe('Datagrid Paging API', () => {
  const Locale = window.Soho.Locale;

  describe('Check Indeterminate Paging using DataGrid source API', () => {
    beforeEach(() => {
      datagridEl = null;
      svgEl = null;
      datagridObj = null;
      document.body.insertAdjacentHTML('afterbegin', svg);
      document.body.insertAdjacentHTML('afterbegin', datagridHTML);
      datagridEl = document.body.querySelector('#datagrid');
      svgEl = document.body.querySelector('.svg-icons');

      Locale.set('en-US');
    });

    afterEach(() => {
      datagridObj.destroy();
      datagridEl.parentNode.removeChild(datagridEl);
      svgEl.parentNode.removeChild(svgEl);

      const rowEl = document.body.querySelector('.row');
      rowEl.parentNode.removeChild(rowEl);
    });

    it('test initial data load', (done) => {
      // build a source function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = true;
          request.lastPage = false;
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'initial'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source function is called.
      setTimeout(() => {
        // ensure it's been called with a request.type of 'initial'
        expect(dataSourceSpy).toHaveBeenCalled();
        expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
        expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('initial');
        done();
      }, 1);
    });

    it('test using triggerSource(\'first\')', (done) => {
      // build a source callback function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = request.type === 'first';
          request.lastPage = false;
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'first'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source function is called.
      setTimeout(() => {
        datagridObj.triggerSource('first', () => {
          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('first');
          done();
        });
      }, 1);
    });

    it('test using triggerSource(\'last\')', (done) => {
      // build a source callback function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = false;
          request.lastPage = request.type === 'last';
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'first'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source function is called.
      setTimeout(() => {
        datagridObj.triggerSource('first', () => {
          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('first');
          done();
        });
      }, 1);
    });

    it('test using triggerSource(\'next\')', (done) => {
      // build a source function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = false;
          request.lastPage = request.type === 'next';
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'next'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source function is called.
      setTimeout(() => {
        datagridObj.triggerSource('next', () => {
          // ensure it's been called with a request.type of 'next'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('next');
          done();
        });
      }, 1);
    });

    it('test using triggerSource(\'prev\')', (done) => {
      // build a source function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = request.type === 'prev';
          request.lastPage = false;
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'prev'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source function is called.
      setTimeout(() => {
        datagridObj.triggerSource('prev', () => {
          // ensure it's been called with a request.type of 'prev'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('prev');
          done();
        });
      }, 1);
    });

    it('test using first paging bar button', (done) => {
      // build a source function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = request.type === 'first';
          request.lastPage = false;
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'first'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source data is loaded
      // and the paging bar is rendered
      setTimeout(() => {
        // get first button and click it
        const buttonEl = document.body.querySelector('li.pager-first a');
        const buttonClickSpy = spyOnEvent(buttonEl, 'click.button');
        buttonEl.click();

        // wait for any timeouts to complete
        setTimeout(() => {
          expect(buttonClickSpy).toHaveBeenTriggered();

          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('first');
          done();
        }, 500);
      }, 1);
    });

    it('test using last paging bar button', (done) => {
      // build a source function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = false;
          request.lastPage = request.type === 'last';
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'last'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source data is loaded
      // and the paging bar is rendered
      setTimeout(() => {
        // get first button and click it
        const buttonEl = document.body.querySelector('li.pager-last a');
        const buttonClickSpy = spyOnEvent(buttonEl, 'click.button');
        buttonEl.click();

        // wait for any timeouts to complete
        setTimeout(() => {
          expect(buttonClickSpy).toHaveBeenTriggered();

          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('last');
          // expect(dataSourceSpy).toHaveBeenCalledWith(jasmine.objectContaining({ type: 'last' }));
          done();
        }, 500);
      }, 1);
    });

    it('test using next paging bar button', (done) => {
      // build a source function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = false;
          request.lastPage = request.type === 'last';
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'next'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source data is loaded
      // and the paging bar is rendered
      setTimeout(() => {
        // get first button and click it
        const buttonEl = document.body.querySelector('li.pager-last a');
        const buttonClickSpy = spyOnEvent(buttonEl, 'click.button');
        buttonEl.click();

        // wait for any timeouts to complete
        setTimeout(() => {
          expect(buttonClickSpy).toHaveBeenTriggered();

          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('last');
          done();
        }, 500);
      }, 1);
    });

    it('test using last paging bar button', (done) => {
      // build a source function
      const dataSourceContainer = {
        dataSource: (request, response) => {
          request.firstPage = false;
          request.lastPage = request.type === 'last';
          response(sampleData, request);
        }
      };

      // build a spy to ensure the dataSource is called
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();

      // build the dataGrid object with a source option. This should to cause the
      // source() to be called with a request.type === 'last'
      const options = { columns, paging: true, pagesize: 5, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      // wait for any timeouts to complete to ensure the source data is loaded
      // and the paging bar is rendered
      setTimeout(() => {
        // get first button and click it
        const buttonEl = document.body.querySelector('li.pager-last a');
        const buttonClickSpy = spyOnEvent(buttonEl, 'click.button');
        buttonEl.click();

        // wait for any timeouts to complete
        setTimeout(() => {
          expect(buttonClickSpy).toHaveBeenTriggered();

          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('last');
          done();
        }, 500);
      }, 1);
    });
  });

  describe('Check DataGrid.loadData with paging events', () => {
    beforeEach(() => {
      datagridEl = null;
      svgEl = null;
      datagridObj = null;
      document.body.insertAdjacentHTML('afterbegin', svg);
      document.body.insertAdjacentHTML('afterbegin', datagridHTML);
      datagridEl = document.body.querySelector('#datagrid');
      svgEl = document.body.querySelector('.svg-icons');

      Locale.set('en-US');
    });

    afterEach(() => {
      datagridObj.destroy();
      datagridEl.parentNode.removeChild(datagridEl);
      svgEl.parentNode.removeChild(svgEl);

      const rowEl = document.body.querySelector('.row');
      rowEl.parentNode.removeChild(rowEl);
    });

    // todo: implement me
  });
});
