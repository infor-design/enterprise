/**
 * @jest-environment jsdom
 */
import './_sohoConfig';
import { renderLoop } from '../../../src/utils/renderloop';

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('RenderLoop API (Manual Start)', () => {
  it('should not loop if `start()` has not been called', (done) => {
    setTimeout(() => {
      expect(renderLoop.startTime).toBeUndefined();
      done();
    }, 400);
  });
});
