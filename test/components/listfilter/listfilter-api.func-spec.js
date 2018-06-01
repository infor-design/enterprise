import { ListFilter } from '../../../src/components/listfilter/listfilter';

const statesData = require('../../../app/data/states-all.json');

let listfilterAPI;

describe('Listfilter API (startsWith)', () => {
  beforeEach(() => {
    listfilterAPI = null;
    listfilterAPI = new ListFilter();
  });

  afterEach(() => {
    listfilterAPI.destroy();
  });

  it('can be invoked', () => {
    expect(listfilterAPI).toBeDefined();
    expect(typeof listfilterAPI.filter).toEqual('function');
    expect(listfilterAPI.settings.filterMode).toEqual('startsWith');
  });

  xit('can filter a set of results against a search term', () => {
    const items = listfilterAPI.filter(statesData, 'new');
  });
});
