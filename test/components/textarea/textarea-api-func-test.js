/**
 * @jest-environment jsdom
 */
import { Textarea } from '../../../src/components/textarea/textarea';
import { cleanup } from '../../helpers/func-utils';

const textareaHTML = `<div class="row">
  <div class="one-half column">

    <div class="field">
      <label for="description-max">Notes (maxlength)</label>
      <textarea id="description-max" class="textarea" maxlength="90" name="description-max">Line One</textarea>
    </div>

    <div class="field is-disabled">
      <label for="description-disabled">Notes (disabled)</label>
      <textarea id="description-disabled" class="textarea" disabled="true" name="description-disabled" >Line One</textarea>
    </div>

    <div class="field">
      <label for="description">Notes (resizable)</label>
      <textarea id="description" class="textarea resizable" name="description" placeholder="Type your notes here..."></textarea>
    </div>

  </div>
  <div class="one-half column">
    <div class="field">
      <label for="description-readonly">Notes (readonly)</label>
      <textarea id="description-readonly" class="textarea" readonly="true" name="description-readonly" >Line One</textarea>
    </div>

    <div class="field">
      <label for="description-dirty">Notes (dirty tracking)</label>
      <textarea id="description-dirty" class="textarea" data-trackdirty="true" name="description-dirty" >I will show a dirty indicator if change me and tab out.</textarea>
    </div>

    <div class="field">
      <label for="description-error" class="required">Notes (error)</label>
      <textarea id="description-error" class="textarea" aria-required="true" data-validate="required" name="description-error" >I will show an error if you clear the value and tab out.</textarea>
    </div>
  </div>
</div>`;

let textareaEl;
let textareaObj;

describe('Textarea API', () => {
  beforeEach(() => {
    textareaEl = null;
    textareaObj = null;
    document.body.insertAdjacentHTML('afterbegin', textareaHTML);
    textareaEl = document.body.querySelector('#description');
    textareaObj = new Textarea(textareaEl);
  });

  afterEach(() => {
    textareaObj.destroy();
    cleanup();
  });

  it('should be defined', () => {
    expect(textareaObj).toBeTruthy();
  });

  it('should destroy textarea', () => {
    textareaObj.destroy();

    expect($(textareaEl).data('textarea')).toBeFalsy();
    expect(textareaEl.parentNode.children.length).toEqual(2);
  });

  it('should disable textarea', () => {
    textareaObj.disable();

    expect(textareaEl.disabled).toBeTruthy();
    expect(textareaObj.isDisabled()).toBeTruthy();
  });

  it('should enable textarea', () => {
    textareaObj.enable();

    expect(textareaEl.disabled).toBeFalsy();
    expect(textareaEl.readOnly).toBeFalsy();
    expect(textareaObj.isDisabled()).toBeFalsy();
  });

  it('should render textarea readonly', () => {
    textareaObj.readonly();

    expect(textareaEl.disabled).toBeFalsy();
    expect(textareaEl.readOnly).toBeTruthy();
    expect(textareaObj.isDisabled()).toBeFalsy();
  });

  it('should update a print version', () => {
    textareaEl.value = 'This is a test \n This is a test \n This is a test \n This is a test \n This is a test';
    textareaObj.updateCounter();

    expect(textareaObj.printarea[0].innerHTML).toEqual(textareaEl.value);
  });
});
