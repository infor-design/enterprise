/**
 * @jest-environment jsdom
 */
import { Personalize } from '../../../src/components/personalize/personalize';

let personalization = {};

describe('Personalize API', () => {
  beforeEach(() => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-light' });
  });

  it('should define personalization', () => {
    expect(personalization).toBeTruthy();
  });

  it('should define currentTheme', () => {
    expect(personalization.currentTheme).toEqual('theme-new-light');
  });

  it('should not run if config is ignored', () => {
    personalization = new Personalize(document.documentElement, { noInit: true });

    expect(personalization.currentTheme).toBeUndefined();
  });

  it('should set theme on html tag', () => {
    expect(document.documentElement.classList.contains('theme-new-light')).toBeTruthy();
  });

  it('should set theme on html tag for random theme name', () => {
    personalization = new Personalize(document.documentElement, { theme: 'cat-in-a-hat' });

    expect(document.documentElement.classList.contains('cat-in-a-hat')).toBeTruthy();
  });

  it('should set theme on legacy light theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'light' });

    expect(document.documentElement.classList.contains('light-theme')).toBeTruthy();
  });

  it('should set theme on legacy dark theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'dark' });

    expect(document.documentElement.classList.contains('dark-theme')).toBeTruthy();
  });

  it('should set theme on legacy high-contrast theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'high-contrast' });

    expect(document.documentElement.classList.contains('high-contrast-theme')).toBeTruthy();
  });

  it('should set theme on soho light theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-light' });

    expect(document.documentElement.classList.contains('theme-new-light')).toBeTruthy();
  });

  it('should set theme on soho dark theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-dark' });

    expect(document.documentElement.classList.contains('theme-new-dark')).toBeTruthy();
  });

  it('should set theme on soho contrast theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-contrast' });

    expect(document.documentElement.classList.contains('theme-new-contrast')).toBeTruthy();
  });

  it('should set theme on new light theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-light' });

    expect(document.documentElement.classList.contains('theme-new-light')).toBeTruthy();
  });

  it('should set theme on new dark theme', () => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-dark' });

    expect(document.documentElement.classList.contains('theme-new-dark')).toBeTruthy();
  });

  it.skip('should fire colorschanged on setColors', () => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-light' });
    const callback = jest.fn();
    $('html').on('colorschanged', callback);
    personalization.setColors('personalization');

    expect(callback).toHaveBeenCalled();
  });

  it.skip('should fire colorschanged on setColorsToDefault', () => {
    personalization = new Personalize(document.documentElement, { theme: 'theme-new-light' });
    const callback = jest.fn();
    $('html').on('colorschanged', callback);
    personalization.setColorsToDefault();

    expect(callback).toHaveBeenCalled();
  });
});
