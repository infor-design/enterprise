import './_sohoConfig';
import { renderLoop } from '../../../src/utils/renderloop';

describe('RenderLoop API (Manual Start)', () => {
  it('Should not loop if `start()` has not been called', (done) => {
    setTimeout(() => {
      expect(renderLoop.startTime).toBeUndefined();
      done();
    }, 400);
  });
});
