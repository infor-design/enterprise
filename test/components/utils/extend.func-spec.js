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

  it('can extend an array by position', () => {
    const setting1 = ['1', '2'];
    const setting2 = [];
    const newArray1 = utils.extend(true, [], setting1, setting2);

    expect(newArray1[0]).toEqual('1');
    expect(newArray1[1]).toEqual('2');

    const setting3 = ['1', '2'];
    const setting4 = ['3', '4'];
    const newArray2 = utils.extend(true, [], setting3, setting4);

    expect(newArray2[0]).toEqual('3');
    expect(newArray2[1]).toEqual('4');
  });

  it('can extend/merge arrays with empty', () => {
    const setting1 = { x: 1, triggers: ['1', '2'] };
    const setting2 = { x: 2, triggers: [] };
    const newObject = utils.extend(true, [], setting1, setting2);

    expect(newObject.triggers[0]).toEqual('1');
    expect(newObject.triggers[1]).toEqual('2');
  });

  it('can extend/merge arrays with non empty', () => {
    const newArray1 = Soho.utils.extend(true, [], [1, 2, 3], []);

    expect(newArray1[0]).toEqual(1);
    expect(newArray1[1]).toEqual(2);
    expect(newArray1[2]).toEqual(3);

    const newArray2 = Soho.utils.extend(true, [], [1, 2, 3], ['x']);

    expect(newArray2[0]).toEqual('x');
    expect(newArray2[1]).toEqual(2);
    expect(newArray2[2]).toEqual(3);
  });

  it('can skip/handler empty cases', () => {
    const newArray1 = Soho.utils.extend(true, [], [1, 2, 3], []);

    expect(newArray1[0]).toEqual(1);
    expect(newArray1[1]).toEqual(2);
    expect(newArray1[2]).toEqual(3);

    const newArray2 = Soho.utils.extend(true, [], [], [1, 2, 3]);

    expect(newArray2[0]).toEqual(1);
    expect(newArray2[1]).toEqual(2);
    expect(newArray2[2]).toEqual(3);

    const newObj1 = Soho.utils.extend(true, {}, { test: 1 }, {});

    expect(newObj1.test).toEqual(1);

    const newObj2 = Soho.utils.extend(true, {}, {}, { test: 1 });

    expect(newObj2.test).toEqual(1);
  });

  it('can extend arrays of objects', () => {
    const newArray1 = utils.extend(true, [], [{ test1: '1', test2: '1' }, { test1: '2', test2: '2' }]);

    expect(newArray1[0]).toEqual({ test1: '1', test2: '1' });
    expect(newArray1[1]).toEqual({ test1: '2', test2: '2' });
  });
});
