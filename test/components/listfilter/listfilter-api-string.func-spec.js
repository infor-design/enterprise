import { ListFilter } from '../../../src/components/listfilter/listfilter';

const statesStringData = require('../../../app/data/states-string.json');

let listfilterArrayAPI;

describe('Listfilter API (against arrays of strings)', () => {
  beforeEach(() => {
    listfilterArrayAPI = null;
    listfilterArrayAPI = new ListFilter();
  });

  afterEach(() => {
    listfilterArrayAPI.destroy();
  });

  it('can be invoked', () => {
    expect(listfilterArrayAPI).toBeDefined();
    expect(typeof listfilterArrayAPI.filter).toEqual('function');
    expect(listfilterArrayAPI.settings.filterMode).toEqual('startsWith');
  });

  it('returns `false` if the incoming list is not an array or a jQuery Selector', () => {
    let items = listfilterArrayAPI.filter('junk', '');

    expect(items).toBeDefined();
    expect(items).toEqual(false);

    items = listfilterArrayAPI.filter(12, '');

    expect(items).toBeDefined();
    expect(items).toEqual(false);
  });

  it('can filter a set of results against a search term', () => {
    const items = listfilterArrayAPI.filter(statesStringData, 'new');

    expect(items).toBeDefined();
    expect(items[1]).toEqual('New Jersey');
    expect(items[3]).toEqual('New York');
  });

  it('returns `false` if there were no matching results', () => {
    const items = listfilterArrayAPI.filter(statesStringData, '');

    expect(items).toBeDefined();
    expect(items).toEqual(false);
  });
});
