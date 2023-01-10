/**
 * @jest-environment jsdom
 */
import { ListFilter } from '../../../src/components/listfilter/listfilter';

const statesObjectData = require('../../../app/data/states-all.json');

function statesObjectSearchableTextCallback(item) {
  return item.label;
}

let listfilterObjectAPI;

describe('Listfilter API (against an array of objects)', () => {
  beforeEach(() => {
    listfilterObjectAPI = null;
    listfilterObjectAPI = new ListFilter({
      searchableTextCallback: statesObjectSearchableTextCallback
    });
  });

  afterEach(() => {
    listfilterObjectAPI.destroy();
  });

  it('can filter items that are objects in an array', () => {
    const items = listfilterObjectAPI.filter(statesObjectData, 'new');

    expect(items).toBeTruthy();
    expect(items[1].label).toEqual('New Jersey');
    expect(items[3].label).toEqual('New York');
  });

  it('returns `false` if there are no matching results', () => {
    const fakeData = [
      { label: 'One' },
      { label: 'Two' },
      { label: 'Three' },
      { label: 'Four' }
    ];

    const items = listfilterObjectAPI.filter(fakeData, 'new');

    expect(items).toBeTruthy();
    expect(items).toEqual(false);
  });
});
