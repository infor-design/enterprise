import { utils } from '../../../src/utils/utils';

describe('Extend Tests', () => {
  it('can extend and clone plain objects', () => {
    const setting1 = { prop1: 1, prop2: 2 };
    const setting2 = { prop2: 'B' };
    const newObject = utils.extend(true, setting1, setting2);

    expect(newObject.prop1).toEqual(1);
    expect(newObject.prop2).toEqual('B');
    expect(setting1.prop1).toEqual(1);
    expect(setting1.prop2).toEqual(2);
    expect(setting2.prop2).toEqual('B');
  });

  it('can extend and clone plain objects (wrong paramater)', () => {
    const setting1 = { prop1: 1, prop2: 2 };
    const setting2 = { prop2: 'B' };
    const newObject = utils.extend(false, setting1, setting2);

    expect(newObject.prop1).toEqual(1);
    expect(newObject.prop2).toEqual('B');
    expect(setting1.prop1).toEqual(1);
    expect(setting1.prop2).toEqual(2);
    expect(setting2.prop2).toEqual('B');
  });

  it('can extend plain objects', () => {
    const setting1 = { prop1: 1, prop2: 2 };
    const setting2 = { prop2: 'B' };
    const newObject = utils.extend(setting1, setting2);

    expect(newObject.prop1).toEqual(1);
    expect(newObject.prop2).toEqual('B');
    expect(setting1.prop1).toEqual(1);
    expect(setting1.prop2).toEqual('B');
    expect(setting2.prop2).toEqual('B');
  });

  it('can extend a nested object with nulls', () => {
    const setting1 = { prop1: 1, prop2: { left: [], right: [] } };
    const setting2 = { prop1: 1, prop2: { left: ['column1'] } };
    const newObject = utils.extend(true, {}, setting1, setting2);

    expect(newObject.prop1).toEqual(1);
    expect(newObject.prop2.left).toEqual(['column1']);
    expect(newObject.prop2.right).toEqual([]);
    expect(setting1.prop1).toEqual(1);
    expect(setting1.prop2.right).toEqual([]);
    expect(setting1.prop2.left).toEqual([]);
    expect(setting2.prop2.left).toEqual(['column1']);
  });

  it('can extend a jQuery object', () => {
    const setting1 = { prop1: 1, prop2: $() };
    const setting2 = { prop1: 2, prop2: $('body') };
    const newObject = utils.extend(true, {}, setting1, setting2);

    expect(newObject.prop1).toEqual(2);
    expect(newObject.prop2.is($('body'))).toEqual(true);
  });
});
