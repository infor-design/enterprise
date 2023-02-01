/**
 * @jest-environment jsdom
 */
import { numberUtils } from '../../../src/utils/number';

describe('Number Utils', () => {
  it('should Replace toFixed', () => {
    for (let i = 0; i < 10000; i++) {
      const number = `${i}.${i}`;
      for (let j = 0; j < 6; j++) {
        expect(numberUtils.toFixed(number, j)).toEqual(numberUtils.fixTo(number, j));
      }
    }

    expect(numberUtils.toFixed('12345678999999999999.999', 0)).toEqual('12345679000000000000');
    expect(numberUtils.toFixed('123456789123456789.50', 0)).toEqual('123456789123456790');
    expect(numberUtils.toFixed(123.59, 1)).toEqual('123.6');
    expect(numberUtils.toFixed(123.59, 5)).toEqual('123.59000');
    expect(numberUtils.toFixed(123.59000, 5)).toEqual('123.59000');
    expect(numberUtils.toFixed(123.5900, 5)).toEqual('123.59000');
    expect(numberUtils.toFixed(800.002, 0)).toEqual('800');
    expect(numberUtils.toFixed(800.002, 1)).toEqual('800.0');
    expect(numberUtils.toFixed(800.002, 2)).toEqual('800.00');
    expect(numberUtils.toFixed(800.002, 3)).toEqual('800.002');
    expect(numberUtils.toFixed(800.0029, 3)).toEqual('800.003');
    expect(numberUtils.toFixed('800.002', 0)).toEqual('800');
    expect(numberUtils.toFixed(800.99, 0)).toEqual('801');
    expect(numberUtils.toFixed('800.99', 0)).toEqual('801');
    expect(numberUtils.toFixed('123456789123456789.00', 0)).toEqual('123456789123456789');
    expect(numberUtils.toFixed('123456789123456789.50', 0)).toEqual('123456789123456790');
    expect(numberUtils.toFixed('123456789123456789.50', 0)).toEqual('123456789123456790');
    expect(numberUtils.toFixed('123456789123456789.99', 0)).toEqual('123456789123456790');
  });

  it('should Truncate Decimals', () => {
    expect(numberUtils.truncate(123456789012.12346)).toEqual('123456789012.12');
    expect(numberUtils.truncate('123456789012.12346')).toEqual('123456789012.12');
    expect(numberUtils.truncate(123456789012.12346, 1)).toEqual('123456789012.1');
    expect(numberUtils.truncate(123456789012.12346, 2)).toEqual('123456789012.12');
    expect(numberUtils.truncate(123456789012.12346, 3)).toEqual('123456789012.123');
    expect(numberUtils.truncate(123456789012.12346, 4)).toEqual('123456789012.1234');
    expect(numberUtils.truncate(123456789012.12346, 5)).toEqual('123456789012.12346');
    expect(numberUtils.truncate(123456789012.12346, 6)).toEqual('123456789012.12346');
    expect(numberUtils.truncate(123456789012.12346, 7)).toEqual('123456789012.12346');
    expect(numberUtils.truncate(123456789012.12346, 8)).toEqual('123456789012.12346');
    expect(numberUtils.truncate(123456789012.12346, 9)).toEqual('123456789012.12346');
  });

  it('should Truncate Big Numbers', () => {
    expect(numberUtils.truncate('123456789012.123456', 6)).toEqual('123456789012.123456');
    expect(numberUtils.truncate('123456789012.123456', 7)).toEqual('123456789012.123456');
    expect(numberUtils.truncate('123456789012.123456')).toEqual('123456789012.12');
    expect(numberUtils.truncate('123456789012.1234567')).toEqual('123456789012.12');
    expect(numberUtils.truncate('1234567890123.123456')).toEqual('1234567890123.12');
  });

  it('should Round Decimals', () => {
    expect(numberUtils.round(800.9905673502324, 0)).toEqual('801');
    expect(numberUtils.round('1234567890123456789.0', 0)).toEqual('1234567890123456789');
    expect(numberUtils.round(123456789012.12346)).toEqual('123456789012.12');
    expect(numberUtils.round('123456789012.12346')).toEqual('123456789012.12');
    expect(numberUtils.round(123456789012.12346, 1)).toEqual('123456789012.1');
    expect(numberUtils.round(123456789012.12346, 2)).toEqual('123456789012.12');
    expect(numberUtils.round(123456789012.12346, 3)).toEqual('123456789012.123');
    expect(numberUtils.round(123456789012.12346, 4)).toEqual('123456789012.1235');
    expect(numberUtils.round(123456789012.12346, 5)).toEqual('123456789012.12346');
    expect(numberUtils.round(123456789012.12346, 6)).toEqual('123456789012.123460');
    expect(numberUtils.round(123456789012.12346, 7)).toEqual('123456789012.1234600');
    expect(numberUtils.round(123456789012.12346, 8)).toEqual('123456789012.12346000');
    expect(numberUtils.round(123456789012.12346, 9)).toEqual('123456789012.123460000');

    expect(numberUtils.round(123.005)).toEqual('123.01');
    expect(numberUtils.round(123.099)).toEqual('123.10');
    expect(numberUtils.round(123)).toEqual('123.00');
    expect(numberUtils.round(123, 0)).toEqual('123');
  });

  it('should Count Decimals', () => {
    expect(numberUtils.decimalPlaces(123.00)).toEqual(0);
    expect(numberUtils.decimalPlaces(123.1)).toEqual(1);
    expect(numberUtils.decimalPlaces(123.10)).toEqual(1);
    expect(numberUtils.decimalPlaces(123.12)).toEqual(2);
    expect(numberUtils.decimalPlaces(123.120)).toEqual(2);
    expect(numberUtils.decimalPlaces(123.123)).toEqual(3);
    expect(numberUtils.decimalPlaces(123.1230)).toEqual(3);
    expect(numberUtils.decimalPlaces(123.1234)).toEqual(4);
    expect(numberUtils.decimalPlaces(123.12340)).toEqual(4);
    expect(numberUtils.decimalPlaces(123.12345)).toEqual(5);
    expect(numberUtils.decimalPlaces(123.123450)).toEqual(5);
    expect(numberUtils.decimalPlaces(123.123456)).toEqual(6);
    expect(numberUtils.decimalPlaces(123.1234560)).toEqual(6);
    expect(numberUtils.decimalPlaces(123.123456789)).toEqual(9);
    expect(numberUtils.decimalPlaces(123.1234567890000)).toEqual(9);
  });
});
