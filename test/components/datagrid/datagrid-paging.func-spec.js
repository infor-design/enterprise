import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { Editors } from '../../../src/components/datagrid/datagrid.editors';
import { cleanup } from '../../helpers/func-utils';

const datagridHTML = require('../../../app/views/components/datagrid/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');
const sampleData = require('../../../app/data/datagrid-sample-data');

require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let datagridObj;

let data = [];
const pagingGetData = (page, size) => {
  const thisData = [];
  const start = size * (page - 1);
  const end = start + size;
  const dataLen = data.length;
  for (let i = start; i < end && i < dataLen; i++) {
    thisData.push(data[i]);
  }
  return thisData;
};

const pagingDataSource = (req, res) => {
  const pagesize = 3;
  let pagingData = [];
  if (req.type === 'initial' || req.type === 'first') {
    req.firstPage = true;
    req.lastPage = false;
    pagingData = pagingGetData(1, pagesize);
  } else if (req.type === 'last') {
    req.firstPage = false;
    req.lastPage = true;
    pagingData = pagingGetData(pagesize, pagesize);
  } else if (req.type === 'next') {
    req.firstPage = false;
    req.lastPage = false;
    pagingData = pagingGetData(req.activePage, pagesize);
    req.activePage++;
  }

  if (req.indeterminate) {
    req.activePage = -1;
  }

  req.total = pagesize;
  res(pagingData, req);
};

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'productId', name: 'Id', field: 'productId', reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
columns.push({
  id: 'productName', name: 'Product Name', field: 'productName', reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text', editor: Editors.Input
});
columns.push({ id: 'activity', name: 'Activity', field: 'activity', reorderable: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', field: 'price', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', reorderable: true, filterType: 'Text', formatter: Formatters.Text });

describe('Datagrid Paging API', () => {
  const Locale = window.Soho.Locale;

  describe('Check Clientside Paging', () => {
    beforeEach(() => {
      datagridEl = null;
      datagridObj = null;
      document.body.insertAdjacentHTML('afterbegin', svg);
      document.body.insertAdjacentHTML('afterbegin', datagridHTML);
      datagridEl = document.body.querySelector('#datagrid');

      Locale.set('en-US');
    });

    afterEach(() => {
      datagridObj.destroy();
      cleanup();
    });

    it('Should be able to track dirty cells with paging', (done) => {
      const options = { dataset: sampleData, columns, paging: true, pagesize: 3, editable: true, showDirty: true }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      let cell1;
      let cell2;
      let input;

      setTimeout(() => {
        cell1 = document.querySelector('tr:nth-child(1) td:nth-child(2)');
        cell2 = document.querySelector('tr:nth-child(1) td:nth-child(3)');

        expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
        expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();

        cell1.click();
        input = cell1.querySelector('input');
        const originalVal = input.value;
        input.value = 'Cell test value';
        cell2.click();

        expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
        expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

        const buttonElNext = document.body.querySelector('li.pager-next .btn-icon');
        const buttonClickSpyNext = spyOnEvent(buttonElNext, 'click.button');
        buttonElNext.click();

        setTimeout(() => {
          expect(buttonClickSpyNext).toHaveBeenTriggered();

          cell1 = document.querySelector('tr:nth-child(1) td:nth-child(2)');
          cell2 = document.querySelector('tr:nth-child(1) td:nth-child(3)');

          expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
          expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();

          const buttonElPrev = document.body.querySelector('li.pager-prev .btn-icon');
          const buttonClickSpyPrev = spyOnEvent(buttonElPrev, 'click.button');
          buttonElPrev.click();

          setTimeout(() => {
            expect(buttonClickSpyPrev).toHaveBeenTriggered();

            cell1 = document.querySelector('tr:nth-child(1) td:nth-child(2)');
            cell2 = document.querySelector('tr:nth-child(1) td:nth-child(3)');

            expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
            expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

            cell1.click();
            input = cell1.querySelector('input');
            input.value = originalVal;
            cell2.click();

            expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
            expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();

            done();
          }, 1);
        }, 1);
      }, 1);
    });
  });

  describe('Check Indeterminate Paging using DataGrid source API', () => {
    beforeEach(() => {
      datagridEl = null;
      datagridObj = null;
      document.body.insertAdjacentHTML('afterbegin', svg);
      document.body.insertAdjacentHTML('afterbegin', datagridHTML);
      datagridEl = document.body.querySelector('#datagrid');

      Locale.set('en-US');
    });

    afterEach(() => {
      datagridObj.destroy();
      cleanup();
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
          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
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
          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
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
          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
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
          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('prev');
          done();
        });
      }, 1);
    });

    it('test using first paging bar button', (done) => {
      data = JSON.parse(JSON.stringify(sampleData));
      const dataSourceContainer = { dataSource: pagingDataSource };
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();
      const options = { columns, paging: true, pagesize: 3, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      setTimeout(() => {
        const buttonElNext = document.body.querySelector('li.pager-next .btn-icon');
        const buttonClickSpyNext = spyOnEvent(buttonElNext, 'click.button');
        buttonElNext.click();

        setTimeout(() => {
          expect(buttonClickSpyNext).toHaveBeenTriggered();

          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('next');

          const buttonElFirst = document.body.querySelector('li.pager-first .btn-icon');
          const buttonClickSpyFirst = spyOnEvent(buttonElFirst, 'click.button');
          buttonElFirst.click();

          setTimeout(() => {
            expect(buttonClickSpyFirst).toHaveBeenTriggered();

            expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
            expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
            expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('first');

            done();
          }, 1);
        }, 1);
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
        const buttonEl = document.body.querySelector('li.pager-last .btn-icon');
        const buttonClickSpy = spyOnEvent(buttonEl, 'click.button');
        buttonEl.click();

        // wait for any timeouts to complete
        setTimeout(() => {
          expect(buttonClickSpy).toHaveBeenTriggered();

          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
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

      // wait for any timeouts to complete to ensure the source data is loaded
      // and the paging bar is rendered
      setTimeout(() => {
        // get first button and click it
        const buttonEl = document.body.querySelector('li.pager-next .btn-icon');
        const buttonClickSpy = spyOnEvent(buttonEl, 'click.button');
        buttonEl.click();

        // wait for any timeouts to complete
        setTimeout(() => {
          expect(buttonClickSpy).toHaveBeenTriggered();

          // ensure it's been called with a request.type of 'first'
          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('next');
          done();
        }, 500);
      }, 1);
    });

    it('test using previous paging bar button', (done) => {
      data = JSON.parse(JSON.stringify(sampleData));
      const dataSourceContainer = { dataSource: pagingDataSource };
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();
      const options = { columns, paging: true, pagesize: 3, indeterminate: true, source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      setTimeout(() => {
        const buttonElNext = document.body.querySelector('li.pager-next .btn-icon');
        const buttonClickSpyNext = spyOnEvent(buttonElNext, 'click.button');
        buttonElNext.click();

        setTimeout(() => {
          expect(buttonClickSpyNext).toHaveBeenTriggered();

          expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('next');

          const buttonElPrev = document.body.querySelector('li.pager-prev .btn-icon');
          const buttonClickSpyPrev = spyOnEvent(buttonElPrev, 'click.button');
          buttonElPrev.click();

          setTimeout(() => {
            expect(buttonClickSpyPrev).toHaveBeenTriggered();

            // ensure it's been called with a request.type of 'first'
            expect(dataSourceSpy).toHaveBeenCalled(); //eslint-disable-line
            expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
            expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('prev');
            done();
          }, 1);
        }, 1);
      }, 1);
    });

    it('test activation row for indeterminate with mixed selection mode', (done) => {
      data = JSON.parse(JSON.stringify(sampleData));
      const dataSourceContainer = { dataSource: pagingDataSource };
      const dataSourceSpy = spyOn(dataSourceContainer, 'dataSource').and.callThrough();
      const options = { columns, paging: true, pagesize: 3, indeterminate: true, selectable: 'mixed', source: dataSourceContainer.dataSource }; // eslint-disable-line max-len
      datagridObj = new Datagrid(datagridEl, options);

      let row;
      let column;

      setTimeout(() => {
        row = document.body.querySelector('tbody tr[aria-rowindex="2"]');
        column = row.querySelector('td[aria-colindex="2"]');

        expect(row.classList.contains('is-rowactivated')).toBeFalsy();
        const rowactivatedSpy = spyOnEvent(datagridEl, 'rowactivated');
        column.click();

        setTimeout(() => {
          row = document.body.querySelector('tbody tr[aria-rowindex="2"]');

          expect(rowactivatedSpy).toHaveBeenTriggered();
          expect(row.classList.contains('is-rowactivated')).toBeTruthy();

          const buttonEl = document.body.querySelector('li.pager-next .btn-icon');
          const buttonClickSpy = spyOnEvent(buttonEl, 'click.button');
          buttonEl.click();

          expect(buttonClickSpy).toHaveBeenTriggered();
          expect(dataSourceSpy).toHaveBeenCalled();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toBeDefined();
          expect(dataSourceSpy.calls.mostRecent().args[0].type).toEqual('next');
          done();
        }, 1);
      }, 1);
    });
  });

  describe('Check DataGrid.loadData with paging events', () => {
    beforeEach(() => {
      datagridEl = null;
      datagridObj = null;
      document.body.insertAdjacentHTML('afterbegin', svg);
      document.body.insertAdjacentHTML('afterbegin', datagridHTML);
      datagridEl = document.body.querySelector('#datagrid');
      Locale.set('en-US');
    });

    afterEach(() => {
      datagridObj.destroy();
      cleanup();
    });
  });
});
