// Import all the locales
import { theme } from '../../../src/components/theme/theme';

require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/es-ES.js');

describe('Theme API', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    Locale.set('en-US');
  });

  it('Should be an object', () => {
    expect(theme).toBeDefined();
  });

  it('Should contain current theme', () => {
    expect(theme.currentTheme.id).toEqual('light');
  });

  it('Should be able to set current theme', () => {
    theme.setTheme('dark');

    expect(theme.currentTheme.id).toEqual('dark');
    theme.setTheme('light');
  });

  it('Should be able to list all colors', () => {
    expect(theme.allColors.length).toEqual(4);
    expect(theme.allColors[0].colors.palette.amber['10'].value).toEqual('#fbe9bf');
    expect(theme.allColors[1].colors.palette.amber['10'].value).toEqual('#fbe9bf');
    expect(theme.allColors[2].colors.palette.amber['10'].value).toEqual('#fbe9bf');
    expect(theme.allColors[3].colors.palette.amber['10'].value).toEqual('#FDF0DD');
  });

  it('Should be able to list themes', () => {
    expect(theme.themes().length).toEqual(4);
    expect(theme.themes()[0].id).toEqual('light');
    expect(theme.themes()[1].id).toEqual('dark');
    expect(theme.themes()[2].id).toEqual('high-contrast');
    expect(theme.themes()[3].id).toEqual('uplift');
  });

  it('Should be able to get theme colors', () => {
    expect(theme.themeColors().palette.azure['70'].value).toEqual('#2578a9');
    theme.setTheme('uplift');

    expect(theme.themeColors().palette.azure['70'].value).toEqual('#0563C2');
    theme.setTheme('light');
  });

  it('Should be able to get personalization colors', () => {
    expect(theme.personalizationColors().azure.value).toEqual('#2578a9');
    // Locale doesnt work in the test but this proves it fires translate
    expect(theme.personalizationColors().azure.name).toEqual('[Azure]');
    theme.setTheme('uplift');

    expect(theme.personalizationColors().azure.value).toEqual('#0563C2');
    expect(theme.personalizationColors().azure.id).toEqual('azure');
    theme.setTheme('light');
  });
});
