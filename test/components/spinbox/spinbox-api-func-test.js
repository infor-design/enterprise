/**
 * @jest-environment jsdom
 */
import { Spinbox } from '../../../src/components/spinbox/spinbox';
import { cleanup } from '../../helpers/func-utils';

const spinboxHTML = `<div class="row">
  <div class="one-half column">
    <div class="field">
      <label for="regular-spinbox">Select a number from 1 to 10</label>
      <input id="regular-spinbox" name="regular-spinbox" type="text" class="spinbox" data-options="{min: 0, max: 10}"/>
    </div>
  </div>
</div>`;

let spinboxEl;
let spinboxAPI;
const spinboxId = '#regular-spinbox';

describe('Spinbox API', () => {
  beforeEach(() => {
    spinboxEl = null;
    spinboxAPI = null;

    document.body.insertAdjacentHTML('afterbegin', spinboxHTML);

    spinboxEl = document.body.querySelector(spinboxId);

    spinboxAPI = new Spinbox(spinboxEl, {});
  });

  afterEach(() => {
    spinboxAPI.destroy();
    cleanup();
  });

  it('Can be invoked', () => {
    expect(spinboxAPI).toBeTruthy();
  });

  it('should disable spinbox', () => {
    spinboxAPI.disable();

    expect(document.body.querySelector('.spinbox[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.spinbox-wrapper.is-disabled')).toBeTruthy();
    expect(spinboxAPI.isDisabled()).toBeTruthy();
  });

  it('should enable spinbox', () => {
    spinboxAPI.enable();

    expect(document.body.querySelector('.field.is-disabled .spinbox')).toBeFalsy();
    expect(spinboxAPI.isDisabled()).toBeFalsy();
  });

  it('should handle readonly', () => {
    spinboxAPI.readonly();

    expect(document.body.querySelector('.spinbox[readonly]')).toBeTruthy();
    expect(document.body.querySelector('.spinbox-wrapper.is-readonly')).toBeTruthy();
    expect(spinboxAPI.isDisabled()).toBeFalsy();
  });

  it('should handle toggling readonly', () => {
    spinboxAPI.readonly();

    expect(document.body.querySelector('.spinbox[readonly]')).toBeTruthy();
    expect(document.body.querySelector('.spinbox-wrapper.is-readonly')).toBeTruthy();
    expect(spinboxAPI.isDisabled()).toBeFalsy();

    spinboxAPI.enable();

    expect(document.body.querySelector('.spinbox[readonly]')).toBeFalsy();
    expect(document.body.querySelector('.spinbox-wrapper.is-readonly')).toBeFalsy();
    expect(spinboxAPI.isDisabled()).toBeFalsy();
  });

  it('should handle toggling disabled', () => {
    spinboxAPI.disable();

    expect(document.body.querySelector('.spinbox[disabled]')).toBeTruthy();
    expect(document.body.querySelector('.spinbox-wrapper.is-disabled')).toBeTruthy();
    expect(spinboxAPI.isDisabled()).toBeTruthy();

    spinboxAPI.enable();

    expect(document.body.querySelector('.spinbox[disabled]')).toBeFalsy();
    expect(document.body.querySelector('.spinbox-wrapper.is-disabled')).toBeFalsy();
    expect(spinboxAPI.isDisabled()).toBeFalsy();
  });

  it('Can be destroyed', () => {
    spinboxAPI.destroy();

    expect($(spinboxEl).data('spinbox')).toBeFalsy();
  });

  it('Can increase value', () => {
    spinboxAPI.updateVal('5');
    spinboxAPI.increaseValue();

    expect(spinboxEl.value).toEqual('6');
  });

  it('Can decrease value', () => {
    spinboxAPI.updateVal('5');
    spinboxAPI.decreaseValue();

    expect(spinboxEl.value).toEqual('4');
  });

  it('Can update value', () => {
    spinboxAPI.updateVal('5');

    expect(spinboxEl.value).toEqual('5');
  });
});
