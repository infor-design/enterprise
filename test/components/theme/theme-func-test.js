/**
 * @jest-environment jsdom
 */
import { theme } from '../../../src/components/theme/theme';
import { Locale } from '../../../src/components/locale/locale';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/es-ES.js');

describe('Theme API', () => {
  beforeEach(() => {
    Locale.set('en-US');
  });

  it('should be an object', () => {
    expect(theme).toBeTruthy();
  });

  it('should contain current theme', () => {
    expect(theme.currentTheme.id).toEqual('theme-new-light');
  });

  it('should be able to set current theme legacy', () => {
    theme.setTheme('theme-soho-dark');

    expect(theme.currentTheme.id).toEqual('theme-classic-dark');
    theme.setTheme('theme-new-light');
  });

  it('should be able to set current theme', () => {
    theme.setTheme('theme-new-dark');

    expect(theme.currentTheme.id).toEqual('theme-new-dark');
    theme.setTheme('theme-new-light');
  });

  it('should list Soho theme mode colors and Amber10 should be the same', () => {
    const sohoAmber10 = '#fbe9bf';

    expect(theme.allColors[0].colors.palette.amber['10'].value.toLowerCase()).toBe(sohoAmber10);
    expect(theme.allColors[1].colors.palette.amber['10'].value.toLowerCase()).toBe(sohoAmber10);
    expect(theme.allColors[2].colors.palette.amber['10'].value.toLowerCase()).toBe(sohoAmber10);
  });

  it('should list new theme mode colors and Amber10 should be the same', () => {
    const newAmber10 = '#fef2e5';

    expect(theme.allColors[3].colors.palette.amber['10'].value.toLowerCase()).toBe(newAmber10);
    expect(theme.allColors[4].colors.palette.amber['10'].value.toLowerCase()).toBe(newAmber10);
    expect(theme.allColors[5].colors.palette.amber['10'].value.toLowerCase()).toBe(newAmber10);
  });

  it('should manage 6 total themes', () => {
    expect(theme.allColors.length).toEqual(6);
  });

  it('should be able to list themes', () => {
    expect(theme.themes().length).toEqual(6);
    expect(theme.themes()[0].id).toEqual('theme-classic-light');
    expect(theme.themes()[1].id).toEqual('theme-classic-dark');
    expect(theme.themes()[2].id).toEqual('theme-classic-contrast');
    expect(theme.themes()[3].id).toEqual('theme-new-light');
    expect(theme.themes()[4].id).toEqual('theme-new-dark');
    expect(theme.themes()[5].id).toEqual('theme-new-contrast');
  });

  it('should be able to get theme colors', () => {
    expect(theme.themeColors().palette.azure['70'].value).toEqual('#0066D4');
    theme.setTheme('theme-classic-light');

    expect(theme.themeColors().palette.azure['70'].value).toEqual('#2578a9');
    theme.setTheme('theme-new-light');
  });

  it('should be able to get personalization colors', () => {
    expect(theme.personalizationColors().azure.value).toEqual('#0066D4');
    // Locale doesnt work in the test but this proves it fires translate
    expect(theme.personalizationColors().azure.name).toEqual('Azure');
    theme.setTheme('theme-classic-light');

    expect(theme.personalizationColors().azure.value).toEqual('#2578a9');
    expect(theme.personalizationColors().azure.id).toEqual('azure');
    theme.setTheme('theme-new-light');
  });
});
