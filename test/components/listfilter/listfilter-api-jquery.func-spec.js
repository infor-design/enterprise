import { ListFilter } from '../../../src/components/listfilter/listfilter';

const statesStringData = require('../../../app/data/states-string.json');

let listfilterJQueryAPI;

describe('Listfilter API (against jQuery collection)', () => {
  beforeEach(() => {
    listfilterJQueryAPI = null;
    listfilterJQueryAPI = new ListFilter();
  });

  afterEach(() => {
    listfilterJQueryAPI.destroy();
  });

  it('can filter items in a jQuery collection', () => {
    let $items = $();
    statesStringData.forEach((item) => {
      $items = $items.add(`<li><a href="#">${item}</a></li>`);
    });

    const items = listfilterJQueryAPI.filter($items, 'new');

    expect(items).toBeDefined();
    expect(items.eq(1).text().trim()).toEqual('New Jersey');
    expect(items.eq(3).text().trim()).toEqual('New York');
  });

  it('returns an empty jQuery collection if there are no matching results', () => {
    const fakeData = [
      'One',
      'Two',
      'Three',
      'Four'
    ];

    let $items = $();
    fakeData.forEach((item) => {
      $items = $items.add(`<li><a href="#">${item}</a></li>`);
    });

    const items = listfilterJQueryAPI.filter($items, 'new');

    expect(items).toBeDefined();
    expect(items instanceof $).toEqual(true);
    expect(items.length).toBe(0);
  });
});
