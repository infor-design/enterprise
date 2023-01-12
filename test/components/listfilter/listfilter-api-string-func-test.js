/**
 * @jest-environment jsdom
 */
import { ListFilter } from '../../../src/components/listfilter/listfilter';

const statesStringData = require('../../../app/data/states-string.json');

const caseSensitiveData = [
  'CALIFORNIA',
  'california',
  'CaLiFoRnIa'
];

const phraseData = [
  'I eat chicken',
  'You eat beef',
  'He will eat fish',
  'Some eat tofu',
  'Eat all the things'
];

const keywordData = [
  'grape apple kiwi',
  'orange strawberry banana',
  'blueberry apricot',
  'pear banana raspberry',
  'apple blackberry starfruit',
  'kiwi orange apple',
  'blackberry raspberry blueberry'
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
    expect(listfilterArrayAPI).toBeTruthy();
    expect(typeof listfilterArrayAPI.filter).toEqual('function');
    expect(listfilterArrayAPI.settings.filterMode).toEqual('wordStartsWith');
  });

  it('can be updated with new settings', () => {
    listfilterArrayAPI.updated({
      filterMode: 'contains'
    });

    expect(listfilterArrayAPI.settings.filterMode).toEqual('contains');
  });

  it.skip('returns `false` if the incoming list is not an array or a jQuery Selector', () => {
    let items = listfilterArrayAPI.filter('junk', '');

    expect(items).toBeTruthy();
    expect(items).toEqual(false);

    items = listfilterArrayAPI.filter(12, '');

    expect(items).toBeTruthy();
    expect(items).toEqual(false);
  });

  it('can filter a set of results against a search term', () => {
    const items = listfilterArrayAPI.filter(statesStringData, 'new');

    expect(items).toBeTruthy();
    expect(items[1]).toEqual('New Jersey');
    expect(items[3]).toEqual('New York');
  });

  it.skip('returns `false` if there were no matching results', () => {
    const items = listfilterArrayAPI.filter(statesStringData, '');

    expect(items).toBeTruthy();
    expect(items).toEqual(false);
  });

  it('can implement case-agnostic filtering', () => {
    const items = listfilterArrayAPI.filter(caseSensitiveData, 'calif');

    expect(items).toBeTruthy();
    expect(items.length).toBe(3); // should get all results
  });

  it('can implement case-sensitive filtering', () => {
    listfilterArrayAPI.updated({
      caseSensitive: true
    });
    const items = listfilterArrayAPI.filter(caseSensitiveData, 'calif');

    expect(items).toBeTruthy();
    expect(items.length).toBe(1); // should ONLY get the lowercase result
  });

  it('can filter a list by matching the start of words in any place in a string', () => {
    listfilterArrayAPI.updated({
      filterMode: 'wordStartsWith'
    });
    const items = listfilterArrayAPI.filter(phraseData, 'eat');

    expect(items).toBeTruthy();
    expect(items.length).toBe(5); // all results contain the word 'eat'
  });

  it('can filter a list by matching the start of an entire phrase', () => {
    listfilterArrayAPI.updated({
      filterMode: 'phraseStartsWith'
    });
    const items = listfilterArrayAPI.filter(phraseData, 'eat');

    expect(items).toBeTruthy();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual('Eat all the things'); // entire string starts with 'eat'
  });

  it('can filter a list by checking for multiple keywords in each result', () => {
    listfilterArrayAPI.updated({
      filterMode: 'keyword'
    });
    const items = listfilterArrayAPI.filter(keywordData, 'apple orange');

    expect(items).toBeTruthy();
    expect(items.length).toBe(4);
    expect(items[0]).toEqual('grape apple kiwi');
    expect(items[1]).toEqual('orange strawberry banana');
  });

  // Added for Github #384
  it('can be bypassed with a `null` filterMode setting', () => {
    listfilterArrayAPI.updated({
      filterMode: null
    });
    const items = listfilterArrayAPI.filter(phraseData, 'Definitely won\'t ever match without null');

    expect(items).toBeTruthy();
    expect(items.length).toBe(5); // client-side filtering is bypassed.
  });
});
