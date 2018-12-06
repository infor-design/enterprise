import { ListFilter } from '../../../src/components/listfilter/listfilter';

const statesStringData = require('../../../app/data/states-string.json');

const caseSensitiveData = [
  'CALIFORNIA',
  'california',
  'CaLiFoRnIa'
];

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

  it('can be updated with new settings', () => {
    listfilterArrayAPI.updated({
      filterMode: 'contains'
    });

    expect(listfilterArrayAPI.settings.filterMode).toEqual('contains');
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

  it('can implement case-agnostic filtering', () => {
    const items = listfilterArrayAPI.filter(caseSensitiveData, 'calif');

    expect(items).toBeDefined();
    expect(items.length).toBe(3); // should get all results
  });

  it('can implement case-sensitive filtering', () => {
    listfilterArrayAPI.updated({
      caseSensitive: true
    });
    const items = listfilterArrayAPI.filter(caseSensitiveData, 'calif');

    expect(items).toBeDefined();
    expect(items.length).toBe(1); // should ONLY get the lowercase result
  });
});
