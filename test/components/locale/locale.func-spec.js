// Import all the locales

require('../../../src/components/locale/cultures/af-ZA.js');
require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/bg-BG.js');
require('../../../src/components/locale/cultures/cs-CZ.js');
require('../../../src/components/locale/cultures/da-DK.js');
require('../../../src/components/locale/cultures/de-DE.js');
require('../../../src/components/locale/cultures/el-GR.js');
require('../../../src/components/locale/cultures/en-AU.js');
require('../../../src/components/locale/cultures/en-GB.js');
require('../../../src/components/locale/cultures/en-IN.js');
require('../../../src/components/locale/cultures/en-NZ.js');
require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/en-ZA.js');
require('../../../src/components/locale/cultures/es-AR.js');
require('../../../src/components/locale/cultures/es-ES.js');
require('../../../src/components/locale/cultures/es-MX.js');
require('../../../src/components/locale/cultures/es-419.js');
require('../../../src/components/locale/cultures/es-US.js');
require('../../../src/components/locale/cultures/et-EE.js');
require('../../../src/components/locale/cultures/fi-FI.js');
require('../../../src/components/locale/cultures/fr-CA.js');
require('../../../src/components/locale/cultures/fr-FR.js');
require('../../../src/components/locale/cultures/he-IL.js');
require('../../../src/components/locale/cultures/hi-IN.js');
require('../../../src/components/locale/cultures/hr-HR.js');
require('../../../src/components/locale/cultures/hu-HU.js');
require('../../../src/components/locale/cultures/id-ID.js');
require('../../../src/components/locale/cultures/it-IT.js');
require('../../../src/components/locale/cultures/ja-JP.js');
require('../../../src/components/locale/cultures/ko-KR.js');
require('../../../src/components/locale/cultures/la-IT.js');
require('../../../src/components/locale/cultures/lt-LT.js');
require('../../../src/components/locale/cultures/lv-LV.js');
require('../../../src/components/locale/cultures/ms-bn.js');
require('../../../src/components/locale/cultures/ms-my.js');
require('../../../src/components/locale/cultures/nb-NO.js');
require('../../../src/components/locale/cultures/nl-NL.js');
require('../../../src/components/locale/cultures/no-NO.js');
require('../../../src/components/locale/cultures/pl-PL.js');
require('../../../src/components/locale/cultures/pt-BR.js');
require('../../../src/components/locale/cultures/pt-PT.js');
require('../../../src/components/locale/cultures/ro-RO.js');
require('../../../src/components/locale/cultures/ru-RU.js');
require('../../../src/components/locale/cultures/sl-SI.js');
require('../../../src/components/locale/cultures/sv-SE.js');
require('../../../src/components/locale/cultures/sk-SK.js');
require('../../../src/components/locale/cultures/th-TH.js');
require('../../../src/components/locale/cultures/tr-TR.js');
require('../../../src/components/locale/cultures/uk-UA.js');
require('../../../src/components/locale/cultures/vi-VN.js');
require('../../../src/components/locale/cultures/zh-CN.js');
require('../../../src/components/locale/cultures/zh-Hans.js');
require('../../../src/components/locale/cultures/zh-Hant.js');
require('../../../src/components/locale/cultures/zh-TW.js');

describe('Locale API', () => {
  const Locale = window.Soho.Locale;

  afterEach(() => {
    Locale.set('en-US');
  });

  it('Should be possible to preset culturesPath', () => {
    window.SohoConfig = { culturesPath: 'dist/js/cultures/' };

    expect(window.SohoConfig.culturesPath).toEqual('dist/js/cultures/');
    window.SohoConfig.culturesPath = null;
  });

  it('Should be possible to require minified cultures', () => {
    window.SohoConfig = { minifyCultures: true };

    expect(window.SohoConfig.minifyCultures).toBeTruthy();
    window.SohoConfig.minifyCultures = null;
  });

  it('Should be an object', () => {
    expect(Locale).toBeDefined();
  });

  it('Should be possible to set locale', () => {
    Locale.set('en-US');

    expect(Locale.currentLocale.name).toEqual('en-US');

    Locale.set('de');

    expect(Locale.currentLocale.name).toEqual('de-DE');
  });

  it('Should be possible to set locale and use the format', (done) => {
    let locale = 'en-GB';
    Locale.set(locale).done((name) => {
      expect(name).toEqual('en-GB');
      expect(Locale.currentLocale.data.englishName).toEqual('English (United Kingdom)');
      expect(Object.keys(Locale.currentLanguage.messages).length).toBeGreaterThan(1);
      expect(Locale.currentLanguage.name).toEqual('en');
      expect(Locale.currentLanguage.name).toEqual('en');
      expect(Locale.currentLocale.dataName).toEqual('en-GB');
      expect(Locale.currentLocale.data.calendars[0].dateFormat.short).toEqual('dd/MM/yyyy');
      expect(Locale.formatDate(new Date(2019, 11, 4))).toEqual('04/12/2019');
    });

    locale = 'es-US';
    Locale.set(locale).done((name) => {
      expect(name).toEqual('es-US');
      expect(Locale.currentLocale.data.englishName).toEqual('Spanish (United States)');
      expect(Object.keys(Locale.currentLanguage.messages).length).toBeGreaterThan(1);
      expect(Locale.currentLanguage.name).toEqual('es');
      expect(Locale.currentLocale.dataName).toEqual('es-US');
      expect(Locale.currentLocale.data.calendars[0].dateFormat.short).toEqual('M/d/yyyy');
      expect(Locale.formatDate(new Date(2019, 11, 4))).toEqual('12/4/2019');
    });

    locale = 'da-DK';
    Locale.set(locale).done((name) => {
      expect(name).toEqual('da-DK');
      expect(Locale.currentLocale.data.englishName).toEqual('Danish (Denmark)');
      expect(Object.keys(Locale.currentLanguage.messages).length).toBeGreaterThan(1);
      expect(Locale.currentLanguage.name).toEqual('da');
      expect(Locale.formatDate(new Date(2019, 11, 4))).toEqual('04-12-2019');
      expect(Locale.currentLocale.dataName).toEqual('da-DK');
      expect(Locale.currentLocale.data.calendars[0].dateFormat.short).toEqual('dd-MM-yyyy');
      done();
    });

    locale = 'pt-BR';
    Locale.set(locale).done((name) => {
      expect(name).toEqual('pt-BR');
      expect(Locale.currentLocale.data.englishName).toEqual('Portuguese (Brazil)');
      expect(Object.keys(Locale.currentLanguage.messages).length).toBeGreaterThan(1);
      expect(Locale.currentLanguage.name).toEqual('pt');
      expect(Locale.formatDate(new Date(2019, 11, 4))).toEqual('04/12/2019');
      expect(Locale.currentLocale.dataName).toEqual('pt-BR');
      expect(Locale.currentLocale.data.calendars[0].dateFormat.short).toEqual('dd/MM/yyyy');
      done();
    });
  });

  it('Should be impossible to set locale that is not in the default list', () => {
    Locale.set('xx-XX');

    expect(Locale.currentLocale.name).toEqual('en-US');

    Locale.set('xx');

    expect(Locale.currentLocale.name).toEqual('en-US');
  });

  it('Should be possible to after set locale', () => {
    Locale.culturesPath = 'dist/js/cultures/';

    expect(Locale.culturesPath).toEqual('dist/js/cultures/');
    Locale.culturesPath = null;
  });

  it('Should set the html lang and dir attribute', () => {
    Locale.set('de-DE');

    expect(Locale.currentLocale.name).toEqual('de-DE');

    let html = window.document.getElementsByTagName('html')[0];

    expect(html.getAttribute('lang')).toEqual('de-DE');

    Locale.set('ar-SA');

    expect(Locale.currentLocale.name).toEqual('ar-SA');

    html = window.document.getElementsByTagName('html')[0];

    expect(html.getAttribute('lang')).toEqual('ar-SA');
    expect(html.getAttribute('dir')).toEqual('rtl');
  });

  it('Should change font for some locales', () => {
    Locale.set('ar-EG');
    const body = window.getComputedStyle(document.body, null);

    expect(body.getPropertyValue('font-family')).toEqual('DejaVu, Tahoma, helvetica, arial');
    Locale.set('ar-SA');

    expect(body.getPropertyValue('font-family')).toEqual('DejaVu, Tahoma, helvetica, arial');
    Locale.set('ja-JP');

    expect(body.getPropertyValue('font-family')).toEqual('"MS PGothic", "ＭＳ Ｐゴシック", helvetica, arial');
    Locale.set('ko-KR');

    expect(body.getPropertyValue('font-family')).toEqual('"Malgun Gothic", AppleGothic, helvetica, arial');
    Locale.set('zh-CN');

    expect(body.getPropertyValue('font-family')).toEqual('华文细黑, 宋体, 微软雅黑, "Microsoft YaHei New", helvetica, arial');
    Locale.set('zh-tw');

    expect(body.getPropertyValue('font-family')).toEqual('华文细黑, 宋体, 微软雅黑, "Microsoft YaHei New", helvetica, arial');
    Locale.set('zh-Hans');

    expect(body.getPropertyValue('font-family')).toEqual('华文细黑, 宋体, 微软雅黑, "Microsoft YaHei New", helvetica, arial');
    Locale.set('zh-Hant');

    expect(body.getPropertyValue('font-family')).toEqual('华文细黑, 宋体, 微软雅黑, "Microsoft YaHei New", helvetica, arial');
  });

  it('Should map in-ID to id-ID', () => {
    Locale.set('in-ID');

    expect(Locale.currentLocale.name).toEqual('id-ID');
  });

  it('Should map iw and iw-IL to he-IL', () => {
    Locale.set('iw-IL');

    expect(Locale.currentLocale.name).toEqual('he-IL');

    Locale.set('iw');

    expect(Locale.currentLocale.name).toEqual('he-IL');
  });

  it('Should format arabic month format', () => {
    Locale.set('ar-SA');
    // Note date is year, month, day
    expect(Locale.formatDate(new Date(2000, 12, 1), { pattern: Locale.calendar().dateFormat.month })).toEqual('01 محرم');
    expect(Locale.formatDate(new Date(2017, 10, 8), { pattern: Locale.calendar().dateFormat.month })).toEqual('08 ذو القعدة');
  });

  it('Should format hebrew dates', () => {
    Locale.set('he-IL');

    expect(Locale.formatDate(new Date(2019, 12, 1), { date: 'short' })).toEqual('1.1.2020');
    expect(Locale.formatDate(new Date(2019, 10, 8), { date: 'medium' })).toEqual('8 בנוב׳ 2019');
    expect(Locale.formatDate(new Date(2019, 10, 8), { date: 'long' })).toEqual('8 בנובמבר 2019');
  });

  it('Should format zh-Hans dates', () => {
    Locale.set('zh-Hans');

    expect(Locale.formatDate(new Date(2019, 12, 1), { date: 'short' })).toEqual('2020/1/1');
    expect(Locale.formatDate(new Date(2019, 10, 8), { date: 'medium' })).toEqual('2019年11月8日');
    expect(Locale.formatDate(new Date(2019, 10, 8), { date: 'long' })).toEqual('2019年11月8日');
    expect(Locale.formatDate(new Date(2019, 10, 8), { date: 'datetime' })).toEqual('2019/11/8 上午12:00');
  });

  it('Should format year in es-ES', () => {
    Locale.set('es-ES');

    expect(Locale.formatDate(new Date(2018, 10, 10), { date: 'year' })).toEqual('Noviembre de 2018');
  });

  it('Should format datetime in es-419', () => {
    Locale.set('es-419');

    expect(Locale.formatDate(new Date(2018, 10, 10), { date: 'short' })).toEqual('10/11/2018');
    expect(Locale.formatDate(new Date(2018, 10, 10), { date: 'medium' })).toEqual('10 nov. 2018');
    expect(Locale.formatDate(new Date(2018, 10, 10), { date: 'long' })).toEqual('10 de noviembre de 2018');
    expect(Locale.formatDate(new Date(2018, 10, 10), { date: 'full' })).toEqual('sábado, 10 de noviembre de 2018');
    expect(Locale.formatDate(new Date(2018, 10, 10), { date: 'month' })).toEqual('10 de noviembre');
    expect(Locale.formatDate(new Date(2018, 10, 10), { date: 'year' })).toEqual('noviembre de 2018');
    expect(Locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), { date: 'timestamp' })).toEqual('14:15:12');
    expect(Locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), { date: 'hour' })).toEqual('14:15');
    expect(Locale.formatDate('10 nov. 2018 14:15', { date: 'datetime' })).toEqual('10 nov. 2018 14:15');
    expect(Locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), { date: 'timezone' })).toEqual('10 nov. 2018 14:15 GT-');
    expect(['2014-12-31', '10 nov. 2018 14:15 hora estándar oriental', '10 nov. 2018 14:15 hora de verano oriental']).toContain(Locale.formatDate(new Date(2018, 10, 10, 14, 15, 12), { date: 'timezoneLong' }));
    expect(Locale.formatDate(new Date(2018, 10, 10), 'd MMM yyyy HH:mm')).toEqual('10 nov. 2018 00:00');
    expect(Locale.formatDate(new Date(2018, 10, 10, 14, 15), 'd MMM yyyy HH:mm')).toEqual('10 nov. 2018 14:15');
    expect(Locale.formatDate(new Date(2018, 10, 10, 14, 15), 'd MMM yyyy h:mm a')).toEqual('10 nov. 2018 2:15 p.m.');
    expect(Locale.formatDate(new Date(2018, 10, 10, 14, 15), 'd MMM yyyy hh:mm a')).toEqual('10 nov. 2018 02:15 p.m.');
    expect(Locale.formatDate('10 nov. 2018 14:15', Locale.calendar().dateFormat.datetime)).toEqual('10 nov. 2018 14:15');
  });

  it('Should format year in da-DK', () => {
    Locale.set('da-DK');

    expect(Locale.formatDate(new Date(2019, 3, 1), { date: 'year' })).toEqual('april 2019');
    Locale.set('en-US');
  });

  it('Should parse year in different languages', () => {
    Locale.set('es-ES');

    expect(Locale.parseDate('Noviembre de 2018', { date: 'year' }).getTime()).toEqual(new Date(2018, 10, 1, 0, 0, 0).getTime());

    Locale.set('en-US');

    expect(Locale.parseDate('November 2018', { date: 'year' }).getTime()).toEqual(new Date(2018, 10, 1, 0, 0, 0).getTime());
  });

  it('Should parse am/pm in Korean', () => {
    Locale.set('ko-KO');

    expect(Locale.parseDate('2020-02-26 오전 12:00', { pattern: 'yyyy-MM-dd a h:mm' }).getTime())
      .toEqual(new Date(2020, 1, 26, 0, 0, 0).getTime());

    expect(Locale.parseDate('2020-02-26 오후 12:00', { pattern: 'yyyy-MM-dd a h:mm' }).getTime())
      .toEqual(new Date(2020, 1, 26, 12, 0, 0).getTime());
  });

  it('Should parse am/pm in zh-TW', () => {
    Locale.set('zh-TW');

    expect(Locale.parseDate('2020/2/26 上午12:00', { pattern: 'yyyy/M/d ah:mm' }).getTime())
      .toEqual(new Date(2020, 1, 26, 0, 0, 0).getTime());

    expect(Locale.parseDate('2020-02-26 下午12:00', { pattern: 'yyyy/M/d ah:mm' }).getTime())
      .toEqual(new Date(2020, 1, 26, 12, 0, 0).getTime());

    expect(Locale.parseDate('2020/3/4 下午9:00', { pattern: 'yyyy/M/d ah:mm' }).getTime())
      .toEqual(new Date(2020, 2, 4, 9, 0, 0).getTime());
  });

  it('Should format en-US dates', () => {
    Locale.set('en-US');
    // Note date is year, month, day
    expect(Locale.formatDate(new Date(2000, 10, 8))).toEqual('11/8/2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { date: 'short' })).toEqual('11/8/2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { date: 'medium' })).toEqual('Nov 8, 2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { date: 'long' })).toEqual('November 8, 2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { pattern: 'M/d/yyyy' })).toEqual('11/8/2000');

    // Other Cases
    expect(Locale.formatDate('11/8/2000')).toEqual('11/8/2000');
    expect(Locale.formatDate('2018-11-29', { pattern: 'yyyy-MM-dd' })).toEqual('2018-11-29');
    expect(Locale.formatDate(1458054935410, { pattern: 'yyyy-MM-dd' })).toEqual('2016-03-15');

    // Test Can return different values depending on machine timezone.
    expect(['2014-12-31', '2015-01-01']).toContain(Locale.formatDate('2015-01-01T05:00:00.000Z', { pattern: 'yyyy-MM-dd' }));
    expect(['2015-04-10', '2015-05-10']).toContain(Locale.formatDate('2015-05-10T00:00:00', { pattern: 'yyyy-MM-dd' }));
    expect(Locale.formatDate()).toEqual(undefined);
  });

  it('Should format timestamp in Arabic', () => {
    Locale.set('ar-SA');
    // Note date is year, month, day
    expect(Locale.formatDate(new Date(2000, 12, 1), { pattern: Locale.calendar().dateFormat.month })).toEqual('01 محرم');
    expect(Locale.formatDate(new Date(2017, 10, 8), { pattern: Locale.calendar().dateFormat.month })).toEqual('08 ذو القعدة');
  });

  it('Should format timestamp in English', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date(2015, 10, 5, 10, 20, 5), { date: 'timestamp' })).toEqual('10:20:05 AM');
    expect(Locale.formatDate(new Date(2015, 10, 5, 10, 20, 5), { pattern: 'hhmmss' })).toEqual('102005');

    const dt = new Date();
    const h = (dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours()).toString();
    const h24 = Locale.pad(dt.getHours().toString(), 2);
    const m = Locale.pad(dt.getMinutes(), 2).toString();
    const s = Locale.pad(dt.getSeconds(), 2).toString();

    expect(Locale.formatDate(dt, { pattern: 'hmmss' })).toEqual(h + m + s);
    expect(Locale.formatDate(dt, { pattern: 'HHmmss' })).toEqual(h24 + m + s);
  });

  it('Should format hours', () => {
    Locale.set('en-US');

    expect(Locale.formatHour(0)).toEqual('12:00 AM');
    expect(Locale.formatHour('0:30')).toEqual('12:30 AM');
    expect(Locale.formatHour(0.5)).toEqual('12:30 AM');
    expect(Locale.formatHour(5)).toEqual('5:00 AM');
    expect(Locale.formatHour('5:30')).toEqual('5:30 AM');
    expect(Locale.formatHour(5.5)).toEqual('5:30 AM');
    expect(Locale.formatHour(10)).toEqual('10:00 AM');
    expect(Locale.formatHour('10:30')).toEqual('10:30 AM');
    expect(Locale.formatHour(10.5)).toEqual('10:30 AM');
    expect(Locale.formatHour(12)).toEqual('12:00 PM');
    expect(Locale.formatHour('12:30')).toEqual('12:30 PM');
    expect(Locale.formatHour(12.5)).toEqual('12:30 PM');
    expect(Locale.formatHour(15)).toEqual('3:00 PM');
    expect(Locale.formatHour('15:30')).toEqual('3:30 PM');
    expect(Locale.formatHour(15.5)).toEqual('3:30 PM');
    expect(Locale.formatHour(20)).toEqual('8:00 PM');
    expect(Locale.formatHour('20:30')).toEqual('8:30 PM');
    expect(Locale.formatHour(20.5)).toEqual('8:30 PM');
    expect(Locale.formatHour(24)).toEqual('12:00 AM');
    expect(Locale.formatHour('24:30')).toEqual('12:30 AM');
    expect(Locale.formatHour(24.5)).toEqual('12:30 AM');

    Locale.set('en-US');
  });

  it('Should format hours in de-DE', () => {
    Locale.set('de-DE');

    expect(Locale.formatHour(0)).toEqual('00:00');
    expect(Locale.formatHour('0:30')).toEqual('00:30');
    expect(Locale.formatHour(5)).toEqual('05:00');
    expect(Locale.formatHour('5:30')).toEqual('05:30');
    expect(Locale.formatHour(10)).toEqual('10:00');
    expect(Locale.formatHour('10:30')).toEqual('10:30');
    expect(Locale.formatHour(12)).toEqual('12:00');
    expect(Locale.formatHour('12:30')).toEqual('12:30');
    expect(Locale.formatHour(15)).toEqual('15:00');
    expect(Locale.formatHour('15:30')).toEqual('15:30');
    expect(Locale.formatHour(20)).toEqual('20:00');
    expect(Locale.formatHour('20:30')).toEqual('20:30');
    expect(Locale.formatHour(24)).toEqual('00:00');
    expect(Locale.formatHour('24:30')).toEqual('00:30');

    Locale.set('en-US');
  });

  it('Should format hours in da-DK', () => {
    Locale.set('da-DK');

    expect(Locale.formatHour(0)).toEqual('00.00');
    expect(Locale.formatHour('0:30')).toEqual('00.30');
    expect(Locale.formatHour('0.30')).toEqual('00.30');
    expect(Locale.formatHour(5)).toEqual('05.00');
    expect(Locale.formatHour('5:30')).toEqual('05.30');
    expect(Locale.formatHour('5.30')).toEqual('05.30');
    expect(Locale.formatHour(10)).toEqual('10.00');
    expect(Locale.formatHour('10:30')).toEqual('10.30');
    expect(Locale.formatHour(12)).toEqual('12.00');
    expect(Locale.formatHour('12:30')).toEqual('12.30');
    expect(Locale.formatHour(15)).toEqual('15.00');
    expect(Locale.formatHour('15:30')).toEqual('15.30');
    expect(Locale.formatHour(20)).toEqual('20.00');
    expect(Locale.formatHour('20:30')).toEqual('20.30');
    expect(Locale.formatHour(24)).toEqual('00.00');
    expect(Locale.formatHour('24:30')).toEqual('00.30');

    Locale.set('en-US');
  });

  it('Should format hours in fi-FI', () => {
    Locale.set('fi-FI');

    expect(Locale.formatHour(0)).toEqual('0.00');
    expect(Locale.formatHour('0:30')).toEqual('0.30');
    expect(Locale.formatHour('0.30')).toEqual('0.30');
    expect(Locale.formatHour(5)).toEqual('5.00');
    expect(Locale.formatHour('5:30')).toEqual('5.30');
    expect(Locale.formatHour('5.30')).toEqual('5.30');
    expect(Locale.formatHour(10)).toEqual('10.00');
    expect(Locale.formatHour('10:30')).toEqual('10.30');
    expect(Locale.formatHour(12)).toEqual('12.00');
    expect(Locale.formatHour('12:30')).toEqual('12.30');
    expect(Locale.formatHour(15)).toEqual('15.00');
    expect(Locale.formatHour('15:30')).toEqual('15.30');
    expect(Locale.formatHour(20)).toEqual('20.00');
    expect(Locale.formatHour('20:30')).toEqual('20.30');
    expect(Locale.formatHour(24)).toEqual('0.00');
    expect(Locale.formatHour('24:30')).toEqual('0.30');

    Locale.set('en-US');
  });

  it('Should format hours in ko-KR', () => {
    Locale.set('ko-KR');

    expect(Locale.formatHour(0)).toEqual('오전 12:00');
    expect(Locale.formatHour('0:30')).toEqual('오전 12:30');
    expect(Locale.formatHour(5)).toEqual('오전 5:00');
    expect(Locale.formatHour('5:30')).toEqual('오전 5:30');
    expect(Locale.formatHour(10)).toEqual('오전 10:00');
    expect(Locale.formatHour('10:30')).toEqual('오전 10:30');
    expect(Locale.formatHour(12)).toEqual('오후 12:00');
    expect(Locale.formatHour('12:30')).toEqual('오후 12:30');
    expect(Locale.formatHour(15)).toEqual('오후 3:00');
    expect(Locale.formatHour('15:30')).toEqual('오후 3:30');
    expect(Locale.formatHour(20)).toEqual('오후 8:00');
    expect(Locale.formatHour('20:30')).toEqual('오후 8:30');
    expect(Locale.formatHour(24)).toEqual('오전 12:00');
    expect(Locale.formatHour('24:30')).toEqual('오전 12:30');

    Locale.set('en-US');
  });

  it('Should format hours in zh-Hant', () => {
    Locale.set('zh-Hant');

    expect(Locale.formatHour(0)).toEqual('上午12:00');
    expect(Locale.formatHour('0:30')).toEqual('上午12:30');
    expect(Locale.formatHour(5)).toEqual('上午5:00');
    expect(Locale.formatHour('5:30')).toEqual('上午5:30');
    expect(Locale.formatHour(10)).toEqual('上午10:00');
    expect(Locale.formatHour('10:30')).toEqual('上午10:30');
    expect(Locale.formatHour(12)).toEqual('下午12:00');
    expect(Locale.formatHour('12:30')).toEqual('下午12:30');
    expect(Locale.formatHour(15)).toEqual('下午3:00');
    expect(Locale.formatHour('15:30')).toEqual('下午3:30');
    expect(Locale.formatHour(20)).toEqual('下午8:00');
    expect(Locale.formatHour('20:30')).toEqual('下午8:30');
    expect(Locale.formatHour(24)).toEqual('上午12:00');
    expect(Locale.formatHour('24:30')).toEqual('上午12:30');

    Locale.set('en-US');
  });

  it('Should format hour range', () => {
    Locale.set('en-US');

    expect(Locale.formatHourRange(0, 5)).toEqual('12 - 5:00 AM');
    expect(Locale.formatHourRange(0.5, 5)).toEqual('12:30 - 5:00 AM');
    expect(Locale.formatHourRange(5, 10)).toEqual('5 - 10:00 AM');
    expect(Locale.formatHourRange(10, 12)).toEqual('10:00 AM - 12:00 PM');
    expect(Locale.formatHourRange(10, 20)).toEqual('10:00 AM - 8:00 PM');
    expect(Locale.formatHourRange(19, 20)).toEqual('7 - 8:00 PM');
    expect(Locale.formatHourRange(12.5, 13)).toEqual('12:30 - 1:00 PM');
    expect(Locale.formatHourRange(15.5, 17)).toEqual('3:30 - 5:00 PM');
    expect(Locale.formatHourRange(20, 24)).toEqual('8:00 PM - 12:00 AM');

    Locale.set('nl-NL');

    expect(Locale.formatHourRange(0, 5)).toEqual('00:00 - 05:00');
    expect(Locale.formatHourRange(0.5, 5)).toEqual('00:30 - 05:00');
    expect(Locale.formatHourRange(0.25, 5)).toEqual('00:15 - 05:00');
    expect(Locale.formatHourRange(5, 10)).toEqual('05:00 - 10:00');
    expect(Locale.formatHourRange(10, 12)).toEqual('10:00 - 12:00');
    expect(Locale.formatHourRange(10, 20)).toEqual('10:00 - 20:00');
    expect(Locale.formatHourRange(19, 20)).toEqual('19:00 - 20:00');
    expect(Locale.formatHourRange(12.5, 13)).toEqual('12:30 - 13:00');
    expect(Locale.formatHourRange(15.5, 17)).toEqual('15:30 - 17:00');
    expect(Locale.formatHourRange(15.25, 17)).toEqual('15:15 - 17:00');
    expect(Locale.formatHourRange(20, 24)).toEqual('20:00 - 00:00');
  });

  it('Should format millis', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), { pattern: 'd/M/yyyy h:mm:ss.SSS a ' })).toEqual('15/3/2016 12:30:36.142 PM');
    expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), { pattern: 'd/M/yyyy h:mm:ss.SSS ' })).toEqual('15/3/2016 12:30:36.142');
  });

  // Format some random date type cases
  it('Should format other dates', () => {
    Locale.set('de-DE');

    expect(Locale.formatDate(new Date(2000, 10, 8))).toEqual('08.11.2000');
    expect(Locale.formatDate(new Date(2000, 11, 1))).toEqual('01.12.2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { date: 'short' })).toEqual('08.11.2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { date: 'medium' })).toEqual('08.11.2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { date: 'long' })).toEqual('8. November 2000');
    expect(Locale.formatDate(new Date(2000, 10, 8), { pattern: 'M.dd.yyyy' })).toEqual('11.08.2000');

    Locale.set('fi-FI');

    expect(Locale.formatDate(new Date(2000, 11, 1))).toEqual('1.12.2000');
  });

  // Format time in us and europe
  it('Should format time', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date(2000, 10, 8, 13, 40), { date: 'datetime' })).toEqual('11/8/2000 1:40 PM');
    expect(Locale.formatDate(new Date(2000, 10, 8, 13, 0), { date: 'datetime' })).toEqual('11/8/2000 1:00 PM');

    Locale.set('de-DE');

    expect(Locale.formatDate(new Date(2000, 11, 1, 13, 40), { date: 'datetime' })).toEqual('01.12.2000 13:40');
    expect(Locale.formatDate(new Date(2000, 11, 1, 13, 5), { pattern: 'M.dd.yyyy HH:mm' })).toEqual('12.01.2000 13:05');

    const date = new Date(2017, 1, 1, 17, 27, 40);
    const opts = { date: 'datetime' };

    Locale.set('fi-FI');

    expect(Locale.formatDate(date, opts)).toEqual('1.2.2017 17.27');

    Locale.set('cs-CZ');

    expect(Locale.formatDate(date, opts)).toEqual('01.02.2017 17:27');

    Locale.set('hu-HU');

    expect(Locale.formatDate(date, opts)).toEqual('2017. 02. 01. 17:27');

    Locale.set('ja-JP');

    expect(Locale.formatDate(date, opts)).toEqual('2017/02/01 17:27');

    Locale.set('ru-RU');

    expect(Locale.formatDate(date, opts)).toEqual('01.02.2017 17:27');
  });

  it('Should format milliseconds', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date('2015-01-01T06:00:00.123Z'), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' })).toEqual('2015-01-01T01:00:00.123');
    expect(Locale.formatDate(new Date('2015-01-02T06:00:00.120Z'), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' })).toEqual('2015-01-02T01:00:00.120');
    expect(Locale.formatDate(new Date('2015-01-03T06:00:00.012Z'), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' })).toEqual('2015-01-03T01:00:00.012');
    expect(Locale.formatDate(new Date('2015-01-04T06:00:00.100Z'), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' })).toEqual('2015-01-04T01:00:00.100');
    expect(Locale.formatDate(new Date('2015-01-05T06:00:00.010Z'), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' })).toEqual('2015-01-05T01:00:00.010');
    expect(Locale.formatDate(new Date('2015-01-06T06:00:00.001Z'), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' })).toEqual('2015-01-06T01:00:00.001');
  });

  // monthYear and yearMonth
  it('Should format a year and month locale', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date(2000, 10, 8, 13, 40), { date: 'month' })).toEqual('November 8');
    expect(Locale.formatDate(new Date(2000, 10, 8, 13, 0), { date: 'year' })).toEqual('November 2000');

    Locale.set('de-DE');

    expect(Locale.formatDate(new Date(2000, 11, 1, 13, 40), { date: 'month' })).toEqual('1. Dezember');
    expect(Locale.formatDate(new Date(2000, 11, 1, 13, 5), { date: 'year' })).toEqual('Dezember 2000');

    Locale.set('sv-SE');

    expect(Locale.formatDate(new Date(2000, 11, 1, 13, 40), { date: 'month' })).toEqual('1 december');
    expect(Locale.formatDate(new Date(2000, 11, 1, 13, 5), { date: 'year' })).toEqual('december 2000');
  });

  // monthYear and yearMonth
  it('Should be able to test RTL', () => {
    Locale.set('en-US');

    expect(Locale.isRTL()).toEqual(false);
    Locale.set('ar-SA');

    expect(Locale.isRTL()).toEqual(true);
  });

  // Formating Hours
  it('Should be able to format and parse hours', () => {
    Locale.set('en-US');
    const dt = Locale.parseDate('000100', 'HHmmss', false);

    expect(dt.getTime()).toEqual(new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1, '00', '01', '00').getTime());
    expect(Locale.formatDate(dt, { pattern: 'h:mm a' })).toEqual('12:01 AM');
    expect(Locale.formatDate(dt, { pattern: 'HHmmss' })).toEqual('000100');

    // Test 12:00 specifically
    expect(Locale.parseDate('10/28/2015 12:00:00 AM', 'M/d/yyyy h:mm:ss a').getTime()).toEqual(new Date(2015, 9, 28, 0, 0, 0).getTime());
    expect(Locale.parseDate('25/04/2017 12:00:00 AM', { pattern: 'd/MM/yyyy h:mm:ss a' }).getTime()).toEqual(new Date(2017, 3, 25, 0, 0, 0).getTime());
  });

  it('Should be able to parse 2 and 3 digit years', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('10/10/10', 'M/d/yyyy').getTime()).toEqual(new Date(2010, 9, 10, 0, 0, 0).getTime());
    expect(Locale.parseDate('10/10/010', 'M/d/yyyy')).toEqual(undefined);
  });

  it('Should parseDate in fi-FI', () => {
    Locale.set('fi-FI');

    expect(Locale.parseDate('18.10.2019 7.15', Locale.calendar().dateFormat.datetime).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
    expect(Locale.parseDate('18.10.2019', Locale.calendar().dateFormat.short).getTime()).toEqual(new Date(2019, 9, 18, 0, 0, 0).getTime());
    expect(Locale.parseDate('18.10.2019 7.15', Locale.calendar().dateFormat.datetime, true).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
    expect(Locale.parseDate('18.10.2019', Locale.calendar().dateFormat.short, true).getTime()).toEqual(new Date(2019, 9, 18, 0, 0, 0).getTime());
  });

  it('Should parseDate with single digit formats', () => {
    expect(Locale.parseDate('18.10.2019 7.15', 'd.M.yyyy H.mm').getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
    expect(Locale.parseDate('18.10.2019 7.15', 'd.M.yyyy H.mm', true).getTime()).toEqual(new Date(2019, 9, 18, 7, 15, 0).getTime());
  });

  it('Should be able to parse UTC toISOString', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('2000-01-01T00:00:00.000Z', 'yyyy-MM-ddTHH:mm:ss.SSSZ').getTime()).toEqual(new Date(Date.UTC(2000, 0, 1, 0, 0, 0)).getTime());
    expect(Locale.parseDate('2000-01-01T00:00:00.001Z', 'yyyy-MM-ddTHH:mm:ss.SSSZ').toISOString()).toEqual('2000-01-01T00:00:00.001Z');
    expect(Locale.parseDate('2000-01-01T00:00:00.001Z', 'yyyy-MM-ddTHH:mm:ss.SSSZ').toISOString()).toEqual('2000-01-01T00:00:00.001Z');
    expect(Locale.parseDate('2019-01-04T05:00:00.000Z', 'yyyy-MM-ddTHH:mm:ss.SSSZ').toISOString()).toEqual('2019-01-04T05:00:00.000Z');
    expect(Locale.parseDate('2018-08-24T14:00:00.000Z', 'yyyy-MM-ddTHH:mm:ss.SSSZ').toISOString()).toEqual('2018-08-24T14:00:00.000Z');
    expect(Locale.parseDate('2019-01-31T23:59:59.000Z', 'yyyy-MM-ddTHH:mm:ss.SSSZ').toISOString()).toEqual('2019-01-31T23:59:59.000Z');
  });

  // Test Long Formatting
  it('Should format long', () => {
    Locale.set('en-US');
    // Date format is year, month, day, hours, mins , secs
    expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40), { date: 'long' })).toEqual('January 8, 2015');

    Locale.set('de-DE');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'long' })).toEqual('1. Januar 2015');

    Locale.set('es-ES');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'long' })).toEqual('1 de Enero de 2015');

    Locale.set('lt-LT');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'long' })).toEqual('2015 m. sausis 1 d.');

    Locale.set('vi-VN');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'long' })).toEqual('1 Tháng Giêng, 2015');
  });

  it('Should format long with day of week', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40), { date: 'full' })).toEqual('Thursday, January 8, 2015');
    expect(Locale.formatDate(new Date(2015, 2, 7, 13, 40), { date: 'full' })).toEqual('Saturday, March 7, 2015');

    Locale.set('de-DE');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'full' })).toEqual('Donnerstag, 1. Januar 2015');
  });

  it('Should format long days', () => {
    Locale.set('en-US');
    // Date format is year, month, day, hours, mins , secs
    expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40), { date: 'long' })).toEqual('January 8, 2015');

    Locale.set('de-DE');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'long' })).toEqual('1. Januar 2015');

    Locale.set('ar-EG');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'long' })).toEqual('2015 يناير، 1');

    Locale.set('bg-BG');

    expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), { date: 'long' })).toEqual('1 януари 2015 г.');
  });

  it('Should be able to parse dates', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('11/8/2000').getTime()).toEqual(new Date(2000, 10, 8).getTime());
    expect(Locale.parseDate('11/8/00').getTime()).toEqual(new Date(2000, 10, 8).getTime());
    expect(Locale.parseDate('10 / 15 / 2014').getTime()).toEqual(new Date(2014, 9, 15).getTime());
    Locale.set('de-DE');

    expect(Locale.parseDate('08.11.2000').getTime()).toEqual(new Date(2000, 10, 8).getTime());
  });

  it('Should parse dates with month zero', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('2016-01-01', 'yyyy-MM-dd').getTime()).toEqual(new Date(2016, 0, 1).getTime());
    expect(Locale.parseDate('2016-01-03', 'yyyy-MM-dd').getTime()).toEqual(new Date(2016, 0, 3).getTime());
    expect(Locale.parseDate('2016-01-31', 'yyyy-MM-dd').getTime()).toEqual(new Date(2016, 0, 31).getTime());
  });

  it('Should be able to format with no separator', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('20151028', 'yyyyMMdd').getTime()).toEqual(new Date(2015, 9, 28).getTime());
    expect(Locale.parseDate('28/10/2015', 'dd/MM/yyyy').getTime()).toEqual(new Date(2015, 9, 28).getTime());
    expect(Locale.parseDate('10/28/2015', 'M/d/yyyy').getTime()).toEqual(new Date(2015, 9, 28).getTime());
    expect(Locale.parseDate('10282015', 'Mdyyyy').getTime()).toEqual(new Date(2015, 9, 28).getTime());
    expect(Locale.parseDate('10282015', 'Mdyyyy').getTime()).toEqual(new Date(2015, 9, 28).getTime());
    expect(Locale.parseDate('10/28/99', 'MM/dd/yy').getTime()).toEqual(new Date(1999, 9, 28).getTime());

    // We can parse either 4 or 2 digit month day
    expect(Locale.parseDate('10282015', 'Mdyyyy').getTime()).toEqual(new Date(2015, 9, 28).getTime());
    expect(Locale.parseDate('222015', 'dMyyyy').getTime()).toEqual(new Date(2015, 1, 2).getTime());
  });

  it('Should be able to parse date time', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('10/28/2015 8:12:10', 'M/d/yyyy h:mm:ss').getTime()).toEqual(new Date(2015, 9, 28, 8, 12, 10).getTime());
    expect(Locale.parseDate('10/28/2015 8:12:10 PM', 'M/d/yyyy h:mm:ss a').getTime()).toEqual(new Date(2015, 9, 28, 20, 12, 10).getTime());
    expect(Locale.parseDate('10/28/2015 8:12:10 AM', 'M/d/yyyy h:mm:ss a').getTime()).toEqual(new Date(2015, 9, 28, 8, 12, 10).getTime());
    expect(Locale.parseDate('10/28/2015', 'M/d/yyyy h:mm:ss')).toEqual(undefined);
    expect(Locale.parseDate('10/28/2015 20:12:10', 'M/d/yyyy HH:mm:ss').getTime()).toEqual(new Date(2015, 9, 28, 20, 12, 10).getTime());
    expect(Locale.parseDate('10/28/2015 30:12:10', 'M/d/yyyy HH:mm:ss')).toEqual(undefined);
    expect(Locale.parseDate('10/28/2015 30:30:10 AM', 'M/d/yyyy h:mm:ss a')).toEqual(undefined);
    expect(Locale.parseDate(undefined)).toEqual(undefined);
  });

  it('Should parse incomplete dates', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('10/28/2015 8:12:10', 'M/d/yyyy h:mm:ss').getTime()).toEqual(new Date(2015, 9, 28, 8, 12, 10).getTime());
    const dt = new Date();
    const y = dt.getFullYear();

    expect(Locale.parseDate('1105', 'MMdd').getTime()).toEqual(new Date(y, 10, 5, 0, 0, 0).getTime());
    expect(Locale.parseDate('201511', 'yyyyMM').getTime()).toEqual(new Date(2015, 10, 1, 0, 0, 0).getTime());
  });

  it('Should round minutes to 60 ', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('10/28/2015 8:65:10', 'M/d/yyyy h:mm:ss').getTime()).toEqual(new Date(2015, 9, 28, 8, 0, 10).getTime());
    expect(Locale.parseDate('10/28/2015 8:10:65', 'M/d/yyyy h:mm:ss').getTime()).toEqual(new Date(2015, 9, 28, 8, 10, 0).getTime());
  });

  it('Should handle leap years', () => {
    const isLeap = y => ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
    const closestLeap = () => {
      let closestLeapYear = (new Date()).getFullYear();
      for (let i2 = 0; i2 < 4; i2++) {
        if (isLeap(closestLeapYear)) {
          break;
        }
        closestLeapYear--;
      }
      return closestLeapYear;
    };
    Locale.set('en-US');

    expect(Locale.parseDate('02/29/2016', 'M/d/yyyy').getTime()).toEqual(new Date(2016, 1, 29).getTime());
    expect(Locale.parseDate('02/30/2016', 'M/d/yyyy')).toEqual(undefined);
    expect(Locale.parseDate('0229', 'MMdd').getTime()).toEqual(new Date(closestLeap(), 1, 29).getTime());
    expect(Locale.parseDate('February 29', 'MMMM d').getTime()).toEqual(new Date(closestLeap(), 1, 29).getTime());
  });

  it('Should cleanly handle non dates', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('111/81/20001')).toEqual(undefined);
    expect(Locale.formatNumber(undefined, { date: 'timestamp' })).toEqual(undefined);
    expect(Locale.parseDate('13/28/2015', 'MM/d/yyyy')).toEqual(undefined);
    expect(Locale.parseDate('10/32/2015', 'MM/dd/yyyy')).toEqual(undefined);
  });

  it('Should parse text months', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('2015 December', 'yyyy MMMM').getTime()).toEqual(new Date(2015, 11, 1, 0, 0, 0).getTime());
    expect(Locale.parseDate('13 Oct 2017 1:00 PM', 'd MMM yyyy H:mm a').getTime()).toEqual(new Date(2017, 9, 13, 13, 0, 0).getTime());

    Locale.set('de-DE');

    expect(Locale.parseDate('Dezember 2015', 'MMMM yyyy').getTime()).toEqual(new Date(2015, 11, 1, 0, 0, 0).getTime());
  });

  it('Should parse Dates with dashes in them', () => {
    Locale.set('en-US');

    // Test date only
    expect(Locale.parseDate('2015-05-10', 'yyyy-dd-MM').getTime()).toEqual(new Date(2015, 9, 5, 0, 0, 0).getTime());

    // Test date only different format
    expect(Locale.parseDate('05-10-2015', 'dd-MM-yyyy').getTime()).toEqual(new Date(2015, 9, 5, 0, 0, 0).getTime());
  });

  it('Should be able to return time format', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40, 45), { date: 'timestamp' })).toEqual('1:40:45 PM');

    Locale.set('de-DE');

    expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40, 45), { date: 'timestamp' })).toEqual('13:40:45');
  });

  it('Should treat no-NO and nb-NO as the same locale', () => {
    Locale.set('no-NO');

    expect(Locale.translate('Loading')).toEqual('Laster');
    Locale.set('nb-NO');

    expect(Locale.translate('Loading')).toEqual('Laster');
    expect(Locale.calendar().timeFormat).toEqual('HH:mm');
    Locale.set('en-US');
  });

  it('Should translate', () => {
    // Normal
    Locale.set('en-US');

    expect(Locale.translate('Required')).toEqual('Required');

    // With Object Selector
    Locale.set('de-DE');

    expect(Locale.translate('Required')).toEqual('Obligatorisch');
    expect(Locale.translate('Loading')).toEqual('Laden...');

    // Error
    expect(Locale.translate('XYZ')).toEqual('[XYZ]');

    // Non Existant in locale - use EN
    Locale.set('de-DE');

    expect(Locale.translate('Equals')).toEqual('Gleich');

    // Afrikaans
    Locale.set('af-ZA');

    expect(Locale.translate('Equals')).toEqual('Gelyk aan');

    // Error
    expect(Locale.translate('XYZ')).toEqual('[XYZ]');
  });

  it('Should show undefined keys with [] around', () => {
    // Add due to SOHO-6782
    Locale.set('en-US');

    expect(Locale.translate('TestLocaleDefaults')).toEqual('Test Locale Defaults');
    Locale.set('de-DE');

    expect(Locale.translate('TestLocaleDefaults')).toEqual('Test Locale Defaults');
    Locale.set('ar-EG');

    expect(Locale.translate('XYZ')).toEqual('[XYZ]');
  });

  it('Should be possible to add translations', () => {
    Locale.set('en-US');
    Locale.currentLanguage.messages.CustomValue = { id: 'CustomValue', value: 'Added Custom Value' };

    expect(Locale.translate('CollapseAppTray')).toEqual('Collapse App Tray');
    expect(Locale.translate('CustomValue')).toEqual('Added Custom Value');
  });

  it('Not error on a non existant locale', () => {
    Locale.set('en-US');
    Locale.set('xx-XX');

    expect(Locale.translate('Required')).toEqual('Required');
  });

  it('Should format decimals', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber(145000)).toEqual('145,000.00');
    expect(Locale.formatNumber(283423)).toEqual('283,423.00');
    expect(Locale.formatNumber(12345.1234)).toEqual('12,345.123');
    expect(Locale.formatNumber(12345.123, { style: 'decimal', maximumFractionDigits: 2 })).toEqual('12,345.12');
    expect(Locale.formatNumber(12345.123456, { style: 'decimal', maximumFractionDigits: 3 })).toEqual('12,345.123');
    expect(Locale.formatNumber(0.0000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0.0000004');
    expect(Locale.formatNumber(20.1, { style: 'decimal', round: true, minimumFractionDigits: 2 })).toEqual('20.10');
    expect(Locale.formatNumber(20.1, { style: 'decimal', round: true })).toEqual('20.10');
    expect(Locale.formatNumber('12,345.123')).toEqual('12,345.123');
    expect(Locale.formatNumber(12345.1234, { group: '' })).toEqual('12345.123');
    expect(Locale.formatNumber(5.1, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('5.10');
    expect(Locale.formatNumber(145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 })).toEqual('145,000.00000');

    Locale.set('de-DE');

    expect(Locale.formatNumber(145000)).toEqual('145.000,00');
    expect(Locale.formatNumber(283423)).toEqual('283.423,00');
    expect(Locale.formatNumber(12345.1)).toEqual('12.345,10');
    expect(Locale.formatNumber(0.0000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0,0000004');
    expect(Locale.formatNumber(0.000004, { style: 'decimal', maximumFractionDigits: 7 })).toEqual('0,000004');
    expect(Locale.formatNumber(145000, { style: 'decimal', minimumFractionDigits: 5, maximumFractionDigits: 7 })).toEqual('145.000,00000');

    Locale.set('ar-EG');

    expect(Locale.formatNumber(12345.1)).toEqual('12٬345.10');
    Locale.set('bg-BG');

    expect(Locale.formatNumber(12345.1)).toEqual('12 345,10');
  });

  it('Should truncate and not round decimals', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber(123456.123456, { style: 'decimal', maximumFractionDigits: 5 })).toEqual('123,456.12345');
    expect(Locale.formatNumber(123456.123456, { style: 'decimal', maximumFractionDigits: 4 })).toEqual('123,456.1234');
    expect(Locale.formatNumber(1.001, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3 })).toEqual('1.001');
    expect(Locale.formatNumber(1.001, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })).toEqual('1.001');
    expect(Locale.formatNumber(1.001, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3, round: true })).toEqual('1.001');
    expect(Locale.formatNumber(1.0019, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3 })).toEqual('1.001');
    expect(Locale.formatNumber(1.0019, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })).toEqual('1.001');
    expect(Locale.formatNumber(1.0019, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3, round: true })).toEqual('1.002');
    expect(Locale.formatNumber(12345.6789, { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3 })).toEqual('12,345.678');
    expect(Locale.formatNumber(12345.6789, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 })).toEqual('12,345.678');
    expect(Locale.formatNumber(12345.6789, { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3, round: true })).toEqual('12,345.679');
  });

  it('Should format integers', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber(12345.123, { style: 'integer' })).toEqual('12,345');

    Locale.set('de-DE');

    expect(Locale.formatNumber(145000, { style: 'integer' })).toEqual('145.000');
    expect(Locale.formatNumber(283423, { style: 'integer' })).toEqual('283.423');
    expect(Locale.formatNumber(12345.123, { style: 'integer' })).toEqual('12.345');
  });

  it('Should be able to parse string numbers into number type', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber('12345', { style: 'integer' })).toEqual('12,345');
  });

  it('Should format currency', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber(12345.129, { style: 'currency' })).toEqual('$12,345.12');

    Locale.set('de-DE');

    expect(Locale.formatNumber(12345.123, { style: 'currency' })).toEqual('12.345,12 €');
  });

  it('Should allow currency override', () => {
    Locale.set('es-ES');

    expect(Locale.formatNumber(12345.12, { style: 'currency', currencySign: '$' })).toEqual('12.345,12 $');
    Locale.set('de-DE');

    expect(Locale.formatNumber(12345.12, {
      style: 'currency',
      decimal: '.',
      group: ',',
      currencyFormat: '¤ ###',
      currencySign: '$'
    })).toEqual('$ 12,345.12');
  });

  it('Should format percent', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber(0.0500000, { style: 'percent' })).toEqual('5 %');
    expect(Locale.formatNumber(0.050000, { style: 'percent', maximumFractionDigits: 0 })).toEqual('5 %');
    expect(Locale.formatNumber(0.05234, { style: 'percent', minimumFractionDigits: 4, maximumFractionDigits: 4 })).toEqual('5.2340 %');
    expect(Locale.formatNumber(0.57, { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 })).toEqual('57 %');
    expect(Locale.formatNumber(0.57, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.00 %');
    expect(Locale.formatNumber(0.5700, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.00 %');
    expect(Locale.formatNumber(0.57010, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.01 %');
    expect(Locale.formatNumber(0.5755, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('57.55 %');
    expect(Locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253.00 %');
    expect(Locale.formatNumber(-2.53, { style: 'percent' })).toEqual('-253 %');
    expect(Locale.formatNumber(0.10, { style: 'percent' })).toEqual('10 %');
    expect(Locale.formatNumber(1, { style: 'percent' })).toEqual('100 %');

    Locale.set('tr-TR');

    expect(Locale.formatNumber(0.0500000, { style: 'percent' })).toEqual('%5');

    Locale.set('it-IT');

    expect(Locale.formatNumber(0.0500000, { style: 'percent' })).toEqual('5%');

    Locale.set('de-DE');

    expect(Locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253,00 %');
    expect(Locale.formatNumber(-2.53, { style: 'percent' })).toEqual('-253 %');
    expect(Locale.formatNumber(0.10, { style: 'percent' })).toEqual('10 %');
    expect(Locale.formatNumber(1, { style: 'percent' })).toEqual('100 %');
  });

  it('Should parse numbers back', () => {
    Locale.set('en-US');

    expect(Locale.parseNumber('$12,345.13')).toEqual(12345.13);

    Locale.set('de-DE');

    expect(Locale.parseNumber('12.345,12 €')).toEqual(12345.12);
  });

  it('Should format numbers in current locale', () => {
    Locale.set('nl-NL');

    expect(Locale.parseNumber('100,00')).toEqual(100);
    expect(Locale.parseNumber('836,45')).toEqual(836.45);
    expect(Locale.parseNumber('1200,12')).toEqual(1200.12);
    expect(Locale.parseNumber('10,99')).toEqual(10.99);
    expect(Locale.parseNumber('130300,00')).toEqual(130300.00);
  });

  it('Should return NaN for bad numbers', () => {
    Locale.set('en-US');

    expect(NaN).toEqual(NaN);
    expect(Locale.parseNumber()).toEqual(NaN);
    expect(Locale.parseNumber('')).toEqual(NaN);
    expect(Locale.parseNumber('sdf')).toEqual(NaN);
    expect(Locale.parseNumber(undefined)).toEqual(NaN);
  });

  it('Should parse with decimal and group properties', () => {
    // group = space; decimal = comma
    Locale.set('fr-FR');

    expect(Locale.parseNumber('1 234 567 890,1234')).toEqual(1234567890.1234);

    // // group = D9AC; decimal = D9AB
    Locale.set('ar-SA');

    expect(Locale.parseNumber('1٬234٬567٬890٫1234')).toEqual(1234567890.1234);

    // group = period; decimal = comma
    Locale.set('es-ES');

    expect(Locale.parseNumber('1.234.567.890,1234')).toEqual(1234567890.1234);

    // group = comma; decimal = period
    Locale.set('en-US');

    expect(Locale.parseNumber('1,234,567,890.1234')).toEqual(1234567890.1234);
  });

  it('Should parse with multiple group separators', () => {
    Locale.set('en-US');

    expect(Locale.parseNumber('1,234,567,890.12346')).toEqual(1234567890.12346);
  });

  it('Should parse big numbers', () => {
    Locale.set('en-US');

    expect(Locale.parseNumber('123456,789,012,345,678.123456')).toEqual('123456789012345678.123456');
    expect(Locale.parseNumber('1123456789123456.57')).toEqual('1123456789123456.57');
    expect(Locale.parseNumber('1,123,456,789,123,456.57')).toEqual('1123456789123456.57');
    Locale.set('de-DE');

    expect(Locale.parseNumber('123.456.789.012.345.678,123456')).toEqual('123456789012345678.123456');
  });

  it('Should format big numbers', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber('123456789012.123456', {
      style: 'decimal',
      round: true,
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    })).toEqual('123,456,789,012.123456');

    expect(Locale.formatNumber(parseFloat('123456789012.123456'), {
      style: 'decimal',
      round: true,
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    })).toEqual('123,456,789,012.123460');
  });

  it('Should handle AM/PM', () => {
    Locale.set('en-US');

    expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36), { pattern: 'd/M/yyyy h:mm:ss a' })).toEqual('15/3/2016 12:30:36 PM');
    expect(Locale.formatDate(new Date(2016, 2, 15, 0, 30, 36), { pattern: 'd/M/yyyy h:mm:ss a' })).toEqual('15/3/2016 12:30:36 AM');
    expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36), { pattern: 'd/M/yyyy HH:mm:ss' })).toEqual('15/3/2016 12:30:36');
    expect(Locale.formatDate(new Date(2016, 2, 15, 0, 30, 36), { pattern: 'd/M/yyyy HH:mm:ss' })).toEqual('15/3/2016 00:30:36');
  });

  it('Should handle minimumFractionDigits', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber('12345', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345');
    expect(Locale.formatNumber('12345.1', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.1');
    expect(Locale.formatNumber('12345.12', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.12');
    expect(Locale.formatNumber('12345.123', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.12');
    expect(Locale.formatNumber('12345.1234', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('12,345.12');

    expect(Locale.formatNumber('12345', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.00');
    expect(Locale.formatNumber('12345.1', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.10');
    expect(Locale.formatNumber('12345.12', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.12');
    expect(Locale.formatNumber('12345.123', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.123');
    expect(Locale.formatNumber('12345.12345678', { minimumFractionDigits: 2, maximumFractionDigits: 4 })).toEqual('12,345.1234');

    // Leave out the maximumFractionDigits
    expect(Locale.formatNumber('12345', { minimumFractionDigits: 2 })).toEqual('12,345.00');
    expect(Locale.formatNumber('12345', { minimumFractionDigits: 0 })).toEqual('12,345');
    expect(Locale.formatNumber('12345.1', { minimumFractionDigits: 0 })).toEqual('12,345.1');

    expect(Locale.formatNumber('12345', { minimumFractionDigits: 4 })).toEqual('12,345.0000');
    expect(Locale.formatNumber('12345.1', { minimumFractionDigits: 5 })).toEqual('12,345.10000');
  });

  it('Should format negative numbers', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber(-1000000, { style: 'currency' })).toEqual('-$1,000,000.00');

    Locale.set('de-DE');

    expect(Locale.formatNumber(-1000000, { style: 'currency' })).toEqual('-1.000.000,00 €');

    Locale.set('ar-SA');

    expect(Locale.formatNumber(-1000000, { style: 'currency' })).toEqual('-﷼ 1٬000٬000٫00');
  });

  it('Should round when the round option is used', () => {
    Locale.set('en-US');

    expect(Locale.formatNumber('3.01999', { maximumFractionDigits: 2, round: true })).toEqual('3.02');
    expect(Locale.formatNumber('800.9905673502324', { round: true, minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' })).toEqual('$801');
    expect(Locale.formatNumber('4.1', { minimumFractionDigits: 0, maximumFractionDigits: 2 })).toEqual('4.1');
    expect(Locale.formatNumber('5.1', { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toEqual('5.10');
    expect(Locale.formatNumber('12.341', { minimumFractionDigits: 0, maximumFractionDigits: 2, round: true })).toEqual('12.34');
    expect(Locale.formatNumber('12.340', { minimumFractionDigits: 0, maximumFractionDigits: 2, round: true })).toEqual('12.34');
    expect(Locale.formatNumber('12.344', { minimumFractionDigits: 0, maximumFractionDigits: 2, round: true })).toEqual('12.34');
    expect(Locale.formatNumber('12.349', { minimumFractionDigits: 0, maximumFractionDigits: 2, round: true })).toEqual('12.35');
    expect(Locale.formatNumber('12345.12345678', { minimumFractionDigits: 2, maximumFractionDigits: 4, round: true })).toEqual('12,345.1235');
  });

  it('work on big numbers (as string)', () => {
    expect(Locale.truncateDecimals('123456789012.12346', 6, 6)).toEqual('123456789012.123460');
    expect(Locale.truncateDecimals('123456789012.12346', 2, 2)).toEqual('123456789012.12');
    expect(Locale.truncateDecimals('123456789012.12346', 0, 6)).toEqual('123456789012.12346');
    expect(Locale.truncateDecimals('123456789012.12346', 6, 6)).toEqual('123456789012.123460');
  });

  it('truncate decimals', () => {
    Locale.set('en-US');

    expect(Locale.truncateDecimals(800.9905673502324, 0, 0, true)).toEqual('801');
    expect(Locale.truncateDecimals(123456.123456, 6, 6)).toEqual('123456.123456');
    expect(Locale.truncateDecimals('123456789012.123456', 6, 6)).toEqual('123456789012.123456');
    expect(Locale.truncateDecimals('123456789012.12346', 6, 6)).toEqual('123456789012.123460');
    expect(Locale.truncateDecimals('123456789012.12346', 6, 6)).toEqual('123456789012.123460');
    expect(Locale.truncateDecimals('123456789012.1234', 6, 6)).toEqual('123456789012.123400');
    expect(Locale.truncateDecimals('123456789012.12346', 6, 6)).toEqual('123456789012.123460');

    expect(Locale.truncateDecimals('123456789012.12345699', 6, 6, true)).toEqual('123456789012.123457');
    expect(Locale.truncateDecimals('123456789012.123456', 6, 6)).toEqual('123456789012.123456');
    expect(Locale.truncateDecimals('123456789012.123456', 6, 6, true)).toEqual('123456789012.123456');
    expect(Locale.truncateDecimals('123456789012.123456', 6, 6, true)).toEqual('123456789012.123456');
    expect(Locale.truncateDecimals('123456789012.123456', 7, 7)).toEqual('123456789012.1234560');
    expect(Locale.truncateDecimals('123456789012.123456', 7, 7, true)).toEqual('123456789012.1234560');

    expect(Locale.truncateDecimals('1.10', 2, 2)).toEqual('1.10');
    expect(Locale.truncateDecimals('2.10', 2, 2)).toEqual('2.10');
    expect(Locale.truncateDecimals('3.10', 2, 2)).toEqual('3.10');
    expect(Locale.truncateDecimals('4.10', 2, 2)).toEqual('4.10');
    expect(Locale.truncateDecimals('5.10', 2, 2)).toEqual('5.10');
    expect(Locale.truncateDecimals('5.1', 2, 2)).toEqual('5.10');
    expect(Locale.truncateDecimals('6.10', 2, 2)).toEqual('6.10');
  });

  it('Should properly convert character cases in some specific Locales', () => {
    // Related JIRA Ticket: SOHO-5408
    Locale.set('tr-TR');

    expect(Locale.toUpperCase('kodları')).toEqual('KODLARI');
    expect(Locale.toLowerCase('İSTANBUL')).toEqual('istanbul');
    expect(Locale.capitalize('istanbul')).toEqual('İstanbul');
    expect(Locale.capitalizeWords('kodları istanbul')).toEqual('Kodları İstanbul');
  });

  it('Should properly convert from Gregorian to Islamic UmAlQura', () => {
    Locale.set('ar-SA');
    let islamicDate = Locale.gregorianToUmalqura(new Date(new Date(2017, 4, 31)));

    expect(`${islamicDate[0].toString()} ${islamicDate[1].toString()} ${islamicDate[2].toString()}`).toEqual('1438 8 5');

    islamicDate = Locale.gregorianToUmalqura(new Date(new Date(2010, 11, 1)));

    expect(`${islamicDate[0].toString()} ${islamicDate[1].toString()} ${islamicDate[2].toString()}`).toEqual('1431 11 25');
  });

  it('Should properly convert from Islamic UmAlQura to Gregorian', () => {
    Locale.set('ar-SA');
    const time = Locale.umalquraToGregorian(1431, 11, 25).getTime();

    expect(time).toEqual(new Date(2010, 11, 1, 0, 0, 0).getTime());
  });

  it('Should handle numbers passed to parseNumber', () => {
    Locale.set('en-US');

    expect(Locale.parseNumber(4000)).toEqual(4000);
  });

  it('Should have 12 months per locale', () => {
    for (let culture in Locale.cultures) { //eslint-disable-line
      Locale.set(culture);

      expect(Locale.calendar().months.wide.length).toEqual(12);
      expect(Locale.calendar().months.abbreviated.length).toEqual(12);
    }
  });

  it('Should default bad/missing locales', () => {
    for (let culture in Locale.cultures) {  //eslint-disable-line
      Locale.set('de-AU');

      expect(Locale.currentLocale.name).toEqual('de-DE');

      Locale.set('en-UG');

      expect(Locale.currentLocale.name).toEqual('en-US');

      Locale.set('fi-RU');

      expect(Locale.currentLocale.name).toEqual('fi-FI');

      Locale.set('zz-ZZ');

      expect(Locale.currentLocale.name).toEqual('en-US'); // not found
    }
  });

  it('Should convert date from Gregorian (if needed) before formatting date (when fromGregorian is true)', () => {
    Locale.set('ar-SA');

    expect(Locale.formatDate(new Date(2018, 5, 20), { pattern: 'yyyy/MM/dd', fromGregorian: true })).toEqual('1439/10/06');
  });

  it('Should convert date to Gregorian (if needed) before formatting date (when toGregorian is true)', () => {
    Locale.set('ar-SA');

    expect(Locale.formatDate(Locale.parseDate('1439/10/06', Locale.calendar().dateFormat.short, false), { pattern: 'yyyyMMdd', toGregorian: true })).toEqual('20180620');
  });

  it('Should parse dates with and without spaces, dash, comma format', () => {
    Locale.set('en-US');

    // Date with spaces, dashes and comma
    expect(Locale.parseDate('2014-12-11', 'yyyy-MM-dd').getTime()).toEqual(new Date(2014, 11, 11, 0, 0, 0).getTime());
    expect(Locale.parseDate('2014/12/11', 'yyyy/MM/dd').getTime()).toEqual(new Date(2014, 11, 11, 0, 0, 0).getTime());
    expect(Locale.parseDate('2014 12 11', 'yyyy MM dd').getTime()).toEqual(new Date(2014, 11, 11, 0, 0, 0).getTime());

    // Date without spaces, dashes and comma
    expect(Locale.parseDate('20141211', 'yyyyMMdd').getTime()).toEqual(new Date(2014, 11, 11, 0, 0, 0).getTime());
  });

  it('Should parse arabic dates in year pattern', () => {
    Locale.set('ar-SA');

    // Date with spaces, dashes and comma
    expect(Locale.parseDate('ذو الحجة 1439', 'MMMM yyyy')[0]).toEqual(1439);
    expect(Locale.parseDate('ذو الحجة 1439', 'MMMM yyyy')[1]).toEqual(11);
    expect(Locale.parseDate('ذو الحجة 1439', 'MMMM yyyy')[2]).toEqual(1);
  });

  it('Should parse or format a string of four, six, or eight zeroes', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('0000')).toEqual(undefined);
    expect(Locale.parseDate('000000')).toEqual(undefined);
    expect(Locale.parseDate('00000000')).toEqual(undefined);

    expect(Locale.formatDate('0000')).toEqual('');
    expect(Locale.formatDate('000000')).toEqual('');
    expect(Locale.formatDate('00000000')).toEqual('');
  });

  it('Should format dates with short timezones', () => {
    Locale.set('en-US');

    expect(['3/22/2018 8:11 PM EST', '3/22/2018 8:11 PM EDT']).toContain(Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { date: 'timezone' }));
    expect(['22-03-2018 20:11 EST', '22-03-2018 20:11 EDT', '22-03-2018 20:11 GT-']).toContain(Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { pattern: 'dd-MM-yyyy HH:mm zz' }));
    Locale.set('nl-NL');

    expect(['22-03-2018 20:11 GMT-5', '22-03-2018 20:11 GMT-4', '22-03-2018 20:11 EDT', '22-03-2018 20:11 GT-', '22-03-2018 20:11 EST']).toContain(Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { date: 'timezone' }));
    expect(['22-03-2018 20:11 GMT-5', '22-03-2018 20:11 GMT-4', '22-03-2018 20:11 EDT', '22-03-2018 20:11 GT-', '22-03-2018 20:11 EST']).toContain(Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { pattern: 'dd-MM-yyyy HH:mm zz' }));
  });

  it('Should format dates in Slovak', () => {
    Locale.set('sk-SK');

    expect(Locale.formatDate(new Date(2019, 7, 15), { pattern: Locale.currentLocale.data.calendars[0].dateFormat.full })).toEqual('štvrtok 15. augusta 2019');
    expect(Locale.formatDate(new Date(2019, 7, 15), { date: 'full' })).toEqual('štvrtok 15. augusta 2019');
  });

  it('Should format dates with long timezones', () => {
    Locale.set('en-US');

    expect(['3/22/2018 8:11 PM Eastern Standard Time', '3/22/2018 8:11 PM Eastern Daylight Time']).toContain(Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { date: 'timezoneLong' }));
    expect(['22-03-2000 20:11 Eastern Standard Time', '22-03-2000 20:11 Eastern Daylight Time']).toContain(Locale.formatDate(new Date(2000, 2, 22, 20, 11, 12), { pattern: 'dd-MM-yyyy HH:mm zzzz' }));
    Locale.set('nl-NL');

    expect(Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { date: 'timezoneLong' })).toContain('Eastern-');
    expect(Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { pattern: 'dd-MM-yyyy HH:mm zzzz' })).toContain('Eastern-');
  });

  it('Should parse dates with short timezones in current timezone', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('3/22/2018 8:11 PM EST', { date: 'timezone' }).getTime()).toEqual(new Date(2018, 2, 22, 20, 11).getTime());
    expect(Locale.parseDate('22-03-2018 20:11 EST', { pattern: 'dd-MM-yyyy HH:mm zz' }).getTime()).toEqual(new Date(2018, 2, 22, 20, 11).getTime());
    Locale.set('nl-NL');

    expect(Locale.parseDate('22-03-2018 20:11 GMT-5', { date: 'timezone' }).getTime()).toEqual(new Date(2018, 2, 22, 20, 11).getTime());
    expect(Locale.parseDate('22-03-2018 20:11 GMT-5', { pattern: 'dd-MM-yyyy HH:mm zz' }).getTime()).toEqual(new Date(2018, 2, 22, 20, 11).getTime());
  });

  it('Should parse dates with long timezones in current timezone', () => {
    Locale.set('en-US');

    expect(Locale.parseDate('3/22/2018 8:11 PM Eastern Standard Time', { date: 'timezoneLong' }).getTime()).toEqual(new Date(2018, 2, 22, 20, 11).getTime());
    expect(Locale.parseDate('22-03-2000 20:11 Eastern Standard Time', { pattern: 'dd-MM-yyyy HH:mm zzzz' }).getTime()).toEqual(new Date(2000, 2, 22, 20, 11).getTime());
    Locale.set('nl-NL');

    expect(Locale.parseDate('22-03-2018 20:11 Eastern-standaardtijd', { date: 'timezoneLong' }).getTime()).toEqual(new Date(2018, 2, 22, 20, 11).getTime());
    expect(Locale.parseDate('22-03-2000 20:11 Eastern-standaardtijd', { pattern: 'dd-MM-yyyy HH:mm zzzz' }).getTime()).toEqual(new Date(2000, 2, 22, 20, 11).getTime());
  });

  it('Should be able to display dates into another timezone', () => {
    Locale.set('en-US');

    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Australia/Brisbane')).toEqual('3/26/2018, 2:00:00 PM');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Asia/Shanghai')).toEqual('3/26/2018, 12:00:00 PM');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'America/New_York')).toEqual('3/26/2018, 12:00:00 AM');
    Locale.set('nl-NL');

    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Australia/Brisbane')).toEqual('26-3-2018 14:00:00');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Asia/Shanghai')).toEqual('26-3-2018 12:00:00');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'America/New_York')).toEqual('26-3-2018 00:00:00');
  });

  it('Should be able to display dates into another timezone including short timezone name', () => {
    Locale.set('en-US');

    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Australia/Brisbane', 'short')).toEqual('3/26/2018, 2:00:00 PM GMT+10');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Asia/Shanghai', 'short')).toEqual('3/26/2018, 12:00:00 PM GMT+8');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'America/New_York', 'short')).toEqual('3/26/2018, 12:00:00 AM EDT');
    Locale.set('nl-NL');

    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Australia/Brisbane', 'short')).toEqual('26-3-2018 14:00:00 GMT+10');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Asia/Shanghai', 'short')).toEqual('26-3-2018 12:00:00 GMT+8');
    expect(['26-3-2018 0:00:00 EDT', '26-3-2018 00:00:00 GMT-4']).toContain(Locale.dateToTimeZone(Locale.dateToTimeZone(new Date(2018, 2, 26), 'America/New_York', 'short')));
  });

  it('Should be able to display dates into another timezone including long timezone name', () => {
    Locale.set('en-US');

    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Australia/Brisbane', 'long')).toEqual('3/26/2018, 2:00:00 PM Australian Eastern Standard Time');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Asia/Shanghai', 'long')).toEqual('3/26/2018, 12:00:00 PM China Standard Time');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'America/New_York', 'long')).toEqual('3/26/2018, 12:00:00 AM Eastern Daylight Time');
    Locale.set('nl-NL');

    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Australia/Brisbane', 'long')).toEqual('26-3-2018 14:00:00 Oost-Australische standaardtijd');
    expect(Locale.dateToTimeZone(new Date(2018, 2, 26), 'Asia/Shanghai', 'long')).toEqual('26-3-2018 12:00:00 Chinese standaardtijd');
    expect(['26-3-2018 00:00:00 Eastern-zomertijd', '26-3-2018 0:00:00 Eastern-zomertijd']).toContain(Locale.dateToTimeZone(new Date(2018, 2, 26), 'America/New_York', 'long'));
  });

  it('Should be possible to set the language to something other than the current locale', (done) => {
    Locale.set('en-US');

    expect(Locale.translate('Actions')).toEqual('Actions');
    expect(Locale.currentLanguage.name).toEqual('en');
    expect(Locale.currentLocale.name).toEqual('en-US');

    Locale.setLanguage('da').done(() => {
      expect(Locale.translate('Actions')).toEqual('Handlinger');
      expect(Locale.currentLanguage.name).toEqual('da');
      expect(Locale.currentLocale.name).toEqual('en-US');

      Locale.setLanguage('ar').done(() => {
        expect(Locale.translate('Actions')).toEqual('الإجراءات');
        expect(Locale.currentLanguage.name).toEqual('ar');
        expect(Locale.currentLocale.name).toEqual('en-US');
        done();
      });
    });
  });

  it('Should be possible to set the language to nb', (done) => {
    Locale.set('en-US');

    expect(Locale.translate('Actions')).toEqual('Actions');
    expect(Locale.currentLanguage.name).toEqual('en');
    expect(Locale.currentLocale.name).toEqual('en-US');

    Locale.setLanguage('nb').done(() => {
      expect(Locale.translate('Actions')).toEqual('Handlinger');
      expect(Locale.currentLanguage.name).toEqual('no');
      expect(Locale.currentLocale.name).toEqual('en-US');
      done();
    });
  });

  it('Should be possible to set the language to nn', (done) => {
    Locale.set('en-US');

    expect(Locale.translate('Actions')).toEqual('Actions');
    expect(Locale.currentLanguage.name).toEqual('en');
    expect(Locale.currentLocale.name).toEqual('en-US');

    Locale.setLanguage('nn').done(() => {
      expect(Locale.translate('Actions')).toEqual('Handlinger');
      expect(Locale.currentLanguage.name).toEqual('no');
      expect(Locale.currentLocale.name).toEqual('en-US');
      done();
    });
  });

  it('Should be possible to extend the language strings for a locale', (done) => {
    Locale.set('it-lT').done(() => {
      const myStrings = {
        Thanks: { id: 'Thanks', value: 'Grazie', comment: '' },
        YourWelcome: { id: 'YourWelcome', value: 'Prego', comment: '' }
      };
      Locale.extendTranslations(Locale.currentLanguage.name, myStrings);

      expect(Locale.translate('Comments')).toEqual('Commenti');
      expect(Locale.translate('Thanks')).toEqual('Grazie');
      expect(Locale.translate('YourWelcome')).toEqual('Prego');
      done();
    });
  });

  it('Should be possible to extend the language strings for a language', (done) => {
    Locale.set('fr-FR').done(() => {
      Locale.setLanguage('it').done(() => {
        const myStrings = {
          Thanks: { id: 'Thanks', value: 'Grazie', comment: '' },
          YourWelcome: { id: 'YourWelcome', value: 'Prego', comment: '' }
        };
        Locale.extendTranslations(Locale.currentLanguage.name, myStrings);

        expect(Locale.translate('Comments')).toEqual('Commenti');
        expect(Locale.translate('Thanks')).toEqual('Grazie');
        expect(Locale.translate('YourWelcome')).toEqual('Prego');
        done();
      });
    });
  });

  it('Should still trigger done on a non existent locale', (done) => {
    Locale.set('xx-XX').done(() => {
      expect(Locale.currentLocale.name).toEqual('en-US');
      done();
    });
  });

  it('Should be possible to add a locale not in the current set', (done) => {
    Locale.set('en-US');

    expect(Locale.translate('Comments')).toEqual('Comments');
    expect(Locale.translate('SomeTextThatDoesntExist')).toEqual('[SomeTextThatDoesntExist]');

    // Add a new locale not in the setup ones
    Locale.defaultLocales.push({ lang: 'la', default: 'la-IT' });
    Locale.supportedLocales.push('la-IT');

    Locale.set('la-lT').done(() => {
      expect(Locale.translate('Comments')).toEqual('Commenti');
      expect(Locale.translate('SomeTextThatDoesntExist')).toEqual('[SomeTextThatDoesntExist]');
      done();
    });
  });

  it('Should handle group size', () => {
    Locale.set('en-US'); // 3, 3

    expect(Locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253.00 %');
    expect(Locale.formatNumber(1.1234)).toEqual('1.123');
    expect(Locale.formatNumber(12.1234)).toEqual('12.123');
    expect(Locale.formatNumber(123.1234)).toEqual('123.123');
    expect(Locale.formatNumber(1234.1234)).toEqual('1,234.123');
    expect(Locale.formatNumber(12345.1234)).toEqual('12,345.123');
    expect(Locale.formatNumber(123456.1234)).toEqual('123,456.123');
    expect(Locale.formatNumber(1234567.1234)).toEqual('1,234,567.123');
    expect(Locale.formatNumber(12345678.1234)).toEqual('12,345,678.123');
    expect(Locale.formatNumber(123456789.1234)).toEqual('123,456,789.123');
    expect(Locale.formatNumber(1234567890.1234)).toEqual('1,234,567,890.123');
    expect(Locale.formatNumber(123456789.1234, { style: 'currency' })).toEqual('$123,456,789.12');
    expect(Locale.formatNumber(100, { style: 'percent' })).toEqual('10,000 %');

    Locale.set('nl-NL'); // 3, 3

    expect(Locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253,00 %');
    expect(Locale.formatNumber(1.1234)).toEqual('1,123');
    expect(Locale.formatNumber(12.1234)).toEqual('12,123');
    expect(Locale.formatNumber(123.1234)).toEqual('123,123');
    expect(Locale.formatNumber(1234.1234)).toEqual('1.234,123');
    expect(Locale.formatNumber(12345.1234)).toEqual('12.345,123');
    expect(Locale.formatNumber(123456.1234)).toEqual('123.456,123');
    expect(Locale.formatNumber(1234567.1234)).toEqual('1.234.567,123');
    expect(Locale.formatNumber(12345678.1234)).toEqual('12.345.678,123');
    expect(Locale.formatNumber(123456789.1234)).toEqual('123.456.789,123');
    expect(Locale.formatNumber(1234567890.1234)).toEqual('1.234.567.890,123');
    expect(Locale.formatNumber(123456789.1234, { style: 'currency' })).toEqual('€ 123.456.789,12');
    expect(Locale.formatNumber(100, { style: 'percent' })).toEqual('10.000 %');

    Locale.set('hi-IN'); // 3, 2

    expect(Locale.formatNumber(-2.53, { style: 'percent', minimumFractionDigits: 2 })).toEqual('-253.00 %');
    expect(Locale.formatNumber(1.1234)).toEqual('1.123');
    expect(Locale.formatNumber(12.1234)).toEqual('12.123');
    expect(Locale.formatNumber(123.1234)).toEqual('123.123');
    expect(Locale.formatNumber(1234.1234)).toEqual('1,234.123');
    expect(Locale.formatNumber(12345.1234)).toEqual('12,345.123');
    expect(Locale.formatNumber(123456.1234)).toEqual('1,23,456.123');
    expect(Locale.formatNumber(1234567.1234)).toEqual('12,34,567.123');
    expect(Locale.formatNumber(12345678.1234)).toEqual('1,23,45,678.123');
    expect(Locale.formatNumber(123456789.1234)).toEqual('12,34,56,789.123');
    expect(Locale.formatNumber(1234567890.1234)).toEqual('1,23,45,67,890.123');
    expect(Locale.formatNumber(123456789.1234, { style: 'currency' })).toEqual('₹12,34,56,789.12');
    expect(Locale.formatNumber(100, { style: 'percent' })).toEqual('10,000 %');
  });

  it('Should parse group size', () => {
    Locale.set('en-US'); // 3, 3

    expect(Locale.parseNumber('-253.00 %')).toEqual(-253);
    expect(Locale.parseNumber('1.123')).toEqual(1.123);
    expect(Locale.parseNumber('12.123')).toEqual(12.123);
    expect(Locale.parseNumber('123.123')).toEqual(123.123);
    expect(Locale.parseNumber('1,234.123')).toEqual(1234.123);
    expect(Locale.parseNumber('12,345.123')).toEqual(12345.123);
    expect(Locale.parseNumber('123,456.123')).toEqual(123456.123);
    expect(Locale.parseNumber('1234,567.123')).toEqual(1234567.123);
    expect(Locale.parseNumber('12345,678.123')).toEqual((12345678.123));
    expect(Locale.parseNumber('123456,789.123')).toEqual((123456789.123));
    expect(Locale.parseNumber('1234567,890.123')).toEqual((1234567890.123));
    expect(Locale.parseNumber('$123456,789.12')).toEqual((123456789.12));
    expect(Locale.parseNumber('10,000 %')).toEqual((10000));

    Locale.set('nl-NL'); // 3, 3

    expect(Locale.parseNumber('-253,00 %')).toEqual(-253);
    expect(Locale.parseNumber('1,123')).toEqual(1.123);
    expect(Locale.parseNumber('12,123')).toEqual(12.123);
    expect(Locale.parseNumber('123,123')).toEqual(123.123);
    expect(Locale.parseNumber('1.234,123')).toEqual(1234.123);
    expect(Locale.parseNumber('12.345,123')).toEqual(12345.123);
    expect(Locale.parseNumber('123.456,123')).toEqual(123456.123);
    expect(Locale.parseNumber('1234.567,123')).toEqual(1234567.123);
    expect(Locale.parseNumber('12.345.678,123')).toEqual((12345678.123));
    expect(Locale.parseNumber('123.456.789,123')).toEqual((123456789.123));
    expect(Locale.parseNumber('1.234.567.890,123')).toEqual((1234567890.123));
    expect(Locale.parseNumber('$123.456.789,12')).toEqual((123456789.12));
    expect(Locale.parseNumber('10.000 %')).toEqual((10000));

    Locale.set('hi-IN'); // 3, 2

    expect(Locale.parseNumber('-253.00 %')).toEqual(-253);
    expect(Locale.parseNumber('1.123')).toEqual(1.123);
    expect(Locale.parseNumber('12.123')).toEqual(12.123);
    expect(Locale.parseNumber('123.123')).toEqual(123.123);
    expect(Locale.parseNumber('1,234.123')).toEqual(1234.123);
    expect(Locale.parseNumber('12,345.123')).toEqual(12345.123);
    expect(Locale.parseNumber('1,23,456.123')).toEqual(123456.123);
    expect(Locale.parseNumber('12,34,567.123')).toEqual(1234567.123);
    expect(Locale.parseNumber('1,23,45,678.123')).toEqual((12345678.123));
    expect(Locale.parseNumber('12,34,56,789.123')).toEqual((123456789.123));
    expect(Locale.parseNumber('1,23,45,67,890.123')).toEqual((1234567890.123));
    expect(Locale.parseNumber('₹12,34,56,789.12')).toEqual((123456789.12));
    expect(Locale.parseNumber('10,000 %')).toEqual((10000));
  });

  it('Should be able to not show the group size', () => { //eslint-disable-line
    Locale.set('en-US'); // 3, 3

    expect(Locale.formatNumber(1234567.1234, { group: '' })).toEqual('1234567.123');
    expect(Locale.formatNumber(12345678.1234, { group: '' })).toEqual('12345678.123');

    Locale.set('nl-NL'); // 3, 3

    expect(Locale.formatNumber(1234567.1234, { group: '' })).toEqual('1234567,123');
    expect(Locale.formatNumber(12345678.1234, { group: '' })).toEqual('12345678,123');

    Locale.set('hi-IN'); // 3, 2

    expect(Locale.formatNumber(1234567.1234, { group: '' })).toEqual('1234567.123');
    expect(Locale.formatNumber(12345678.1234, { group: '' })).toEqual('12345678.123');
  });

  it('Should be able to set the group size', () => {
    Locale.set('en-US'); // 3, 3

    expect(Locale.formatNumber(1234567.1234, { groupSizes: [3, 0] })).toEqual('1234,567.123');
    expect(Locale.formatNumber(12345678.1234, { groupSizes: [3, 0] })).toEqual('12345,678.123');

    Locale.set('nl-NL'); // 3, 3

    expect(Locale.formatNumber(1234567.1234, { groupSizes: [3, 0] })).toEqual('1234.567,123');
    expect(Locale.formatNumber(12345678.1234, { groupSizes: [3, 0] })).toEqual('12345.678,123');

    Locale.set('hi-IN'); // 3, 2

    expect(Locale.formatNumber(1234567.1234, { groupSizes: [3, 0] })).toEqual('1234,567.123');
    expect(Locale.formatNumber(12345678.1234, { groupSizes: [3, 0] })).toEqual('12345,678.123');
  });

  it('Should be able to set zero group size', () => {
    Locale.set('en-US'); // 3, 3

    expect(Locale.formatNumber(1234567.1234, { groupSizes: [0, 0] })).toEqual('1234567.123');
    expect(Locale.formatNumber(12345678.1234, { groupSizes: [0, 0] })).toEqual('12345678.123');

    Locale.set('nl-NL'); // 3, 3

    expect(Locale.formatNumber(1234567.1234, { groupSizes: [0, 0] })).toEqual('1234567,123');
    expect(Locale.formatNumber(12345678.1234, { groupSizes: [0, 0] })).toEqual('12345678,123');

    Locale.set('hi-IN'); // 3, 2

    expect(Locale.formatNumber(1234567.1234, { groupSizes: [0, 0] })).toEqual('1234567.123');
    expect(Locale.formatNumber(12345678.1234, { groupSizes: [0, 0] })).toEqual('12345678.123');
  });

  it('Should convert arabic numbers', () => {
    expect(Locale.convertNumberToEnglish('١٢٣٤٥٦٧٨٩٠')).toEqual(1234567890);
    expect(Locale.convertNumberToEnglish('١٢٣')).toEqual(123);
    expect(Locale.convertNumberToEnglish('١٢٣.٤٥')).toEqual(123.45);
    expect(Locale.convertNumberToEnglish('١٬٢٣٤٬٥٦٧٬٨٩٠')).toEqual(1234567890);
  });

  it('Should convert hebrew numbers', () => {
    expect(Locale.convertNumberToEnglish('१२३४५६७८९०')).toEqual(1234567890);
    expect(Locale.convertNumberToEnglish('१२३')).toEqual(123);
    expect(Locale.convertNumberToEnglish('१२३.४५')).toEqual(123.45);
    expect(Locale.convertNumberToEnglish('१,२३४,५६७,८९०')).toEqual(1234567890);
  });

  it('Should convert chinese financial traditional numbers', () => {
    expect(Locale.convertNumberToEnglish('壹貳叄肆伍陸柒捌玖零')).toEqual(1234567890);
    expect(Locale.convertNumberToEnglish('貳零壹玖')).toEqual(2019);
    expect(Locale.convertNumberToEnglish('壹貳叄.肆伍')).toEqual(123.45);
    expect(Locale.convertNumberToEnglish('壹,貳叄肆,伍陸柒,捌玖零')).toEqual(1234567890);
  });

  it('Should convert chinese financial simplified numbers', () => {
    expect(Locale.convertNumberToEnglish('壹贰叁肆伍陆柒捌玖零')).toEqual(1234567890);
    expect(Locale.convertNumberToEnglish('贰零壹玖')).toEqual(2019);
    expect(Locale.convertNumberToEnglish('壹贰叁.肆伍')).toEqual(123.45);
    expect(Locale.convertNumberToEnglish('壹,贰叁肆,伍陆柒,捌玖零')).toEqual(1234567890);
  });

  it('Should convert chinese normal numbers', () => {
    expect(Locale.convertNumberToEnglish('一二三四五六七八九零')).toEqual(1234567890);
    expect(Locale.convertNumberToEnglish('二零一九')).toEqual(2019);
    expect(Locale.convertNumberToEnglish('二〇一九')).toEqual(2019);
    expect(Locale.convertNumberToEnglish('一二三.四五')).toEqual(123.45);
    expect(Locale.convertNumberToEnglish('一,二三四,五六七,八九零')).toEqual(1234567890);
  });

  it('Should be able to format a number in a non current locale', (done) => {
    Locale.set('en-US');
    Locale.getLocale('nl-NL').done(() => {
      expect(Locale.currentLocale.name).toEqual('en-US');

      expect(Locale.formatNumber(123456789.1234, { locale: 'en-US' })).toEqual('123,456,789.123');
      expect(Locale.formatNumber(123456789.1234)).toEqual('123,456,789.123');
      expect(Locale.formatNumber(123456789.1234, { locale: 'nl-NL' })).toEqual('123.456.789,123');
      expect(Locale.currentLocale.name).toEqual('en-US');
    });

    Locale.getLocale('hi-IN').done(() => {
      expect(Locale.currentLocale.name).toEqual('en-US');

      expect(Locale.formatNumber(123456789.1234, { locale: 'en-US' })).toEqual('123,456,789.123');
      expect(Locale.formatNumber(123456789.1234)).toEqual('123,456,789.123');
      expect(Locale.formatNumber(123456789.1234, { locale: 'hi-IN' })).toEqual('12,34,56,789.123');
      expect(Locale.currentLocale.name).toEqual('en-US');
      done();
    });
  });

  it('Should be able to parse a number in a a non current locale', (done) => {
    Locale.set('en-US');

    Locale.getLocale('nl-NL').done(() => {
      expect(Locale.parseNumber('-253,00 %', { locale: 'nl-NL' })).toEqual(-253);
      expect(Locale.parseNumber('1.123', { locale: 'nl-NL' })).toEqual(1123);
      expect(Locale.parseNumber('$123456.789,12', { locale: 'nl-NL' })).toEqual((123456789.12));
      expect(Locale.parseNumber('€123456.789,12', { locale: 'nl-NL' })).toEqual((123456789.12));
      expect(Locale.parseNumber('10.000 %', { locale: 'nl-NL' })).toEqual((10000));
    });
    Locale.getLocale('hi-IN').done(() => {
      expect(Locale.parseNumber('-253.00 %', { locale: 'hi-IN' })).toEqual(-253);
      expect(Locale.parseNumber('1.123', { locale: 'hi-IN' })).toEqual(1.123);
      expect(Locale.parseNumber('₹12,34,56,789.12', { locale: 'hi-IN' })).toEqual((123456789.12));
      expect(Locale.parseNumber('10,000 %', { locale: 'hi-IN' })).toEqual((10000));
      done();
    });
  });

  it('Should be able to format a date in a a non current locale', (done) => {
    Locale.set('en-US');

    Locale.getLocale('nl-NL').done(() => {
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'short', locale: 'nl-NL' })).toEqual('08-06-2019');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'medium', locale: 'nl-NL' })).toEqual('8 jun 2019');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'long', locale: 'nl-NL' })).toEqual('8 juni 2019');
      expect(Locale.currentLocale.name).toEqual('en-US');
    });
    Locale.getLocale('hi-IN').done(() => {
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'short', locale: 'hi-IN' })).toEqual('08-06-2019');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'medium', locale: 'hi-IN' })).toEqual('8 जू 2019');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'long', locale: 'hi-IN' })).toEqual('8 जून 2019');
      done();
    });
  });

  it('Should be able to format a date in a a non current language', (done) => {
    Locale.set('en-US');

    expect(Locale.calendar().dateFormat.short).toEqual('M/d/yyyy');

    Locale.getLocale('nl').done(() => {
      expect(Locale.calendar('en-US', 'nl').dateFormat.short).toEqual('M/d/yyyy');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'medium', language: 'nl' })).toEqual('jun 8, 2019');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'long', language: 'nl' })).toEqual('juni 8, 2019');
    });
    Locale.getLocale('hi').done(() => {
      expect(Locale.calendar('en-US', 'hi').dateFormat.short).toEqual('M/d/yyyy');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'medium', language: 'hi' })).toEqual('जू 8, 2019');
      expect(Locale.formatDate(new Date(2019, 5, 8), { date: 'long', language: 'hi' })).toEqual('जून 8, 2019');
      done();
    });
  });

  it('Should be able to parse a date in a non current locale', (done) => {
    Locale.set('en-US');
    Locale.getLocale('es-ES').done(() => {
      expect(Locale.currentLocale.name).toEqual('en-US');
      expect(Locale.parseDate('2019-01-01', 'yyyy-MM-dd').getTime()).toEqual(new Date(2019, 0, 1, 0, 0, 0).getTime());
      expect(Locale.parseDate('2019-01-01', { dateFormat: 'yyyy-MM-dd', locale: 'es-ES' }).getTime()).toEqual(new Date(2019, 0, 1, 0, 0, 0).getTime());
      expect(Locale.parseDate('20/10/2019 20:12', { date: 'datetime', locale: 'es-ES' }).getTime()).toEqual(new Date(2019, 9, 20, 20, 12, 0).getTime());
      expect(Locale.parseDate('Noviembre de 2019', { date: 'year', locale: 'es-ES' }).getTime()).toEqual(new Date(2019, 10, 1, 0, 0, 0).getTime());
      done();
    });
  });

  it('Should load locale which has custom filename', (done) => {
    const filename = 'sv-SE.f0r73571n6purp0537051mul473h45h';
    delete Locale.cultures['sv-SE'];
    spyOn(Locale, 'getCulturesPath').and.returnValue(`${window.location.origin}/base/app/www/test/js/`);

    expect(Locale.cultures['sv-SE']).toBeUndefined('Prerequisite for this unit test was not met');

    Locale.set('en-US');
    Locale.getLocale('sv-SE', filename).done(() => {
      expect(Locale.currentLocale.name).toEqual('en-US');
      expect(Locale.cultures['sv-SE']).toBeDefined();
      done();
    });
  });

  it('Should translations as undefined if not found', () => {
    Locale.set('en-US');

    expect(Locale.translate('XYZ', true)).toEqual(undefined);
    expect(Locale.translate('XYZ', false)).toEqual('[XYZ]');
    expect(Locale.translate('XYZ', { showAsUndefined: true })).toEqual(undefined);
    expect(Locale.translate('XYZ', { showAsUndefined: false })).toEqual('[XYZ]');
    // Show brackets setting
    expect(Locale.translate('XYZ', { showAsUndefined: true, showBrackets: true })).toEqual(undefined);
    expect(Locale.translate('XYZ', { showAsUndefined: false, showBrackets: true })).toEqual('[XYZ]');
    expect(Locale.translate('XYZ', { showAsUndefined: true, showBrackets: false })).toEqual(undefined);
    expect(Locale.translate('XYZ', { showAsUndefined: false, showBrackets: false })).toEqual('XYZ');
    expect(Locale.translate('XYZ', { showBrackets: true })).toEqual('[XYZ]');
    expect(Locale.translate('XYZ', { showBrackets: false })).toEqual('XYZ');
  });

  it('Should be able get translations in a non current locale (de-DE)', (done) => {
    Locale.set('en-US');
    Locale.getLocale('de-DE').done(() => {
      expect(Locale.currentLocale.name).toEqual('en-US');
      expect(Locale.currentLanguage.name).toEqual('en');
      expect(Locale.translate('Required')).toEqual('Required');
      expect(Locale.translate('Loading')).toEqual('Loading');
      expect(Locale.translate('Required', { language: 'de' })).toEqual('Obligatorisch');
      expect(Locale.translate('Loading', { language: 'de' })).toEqual('Laden...');
      done();
    });
  });

  it('Should be able get translations in a non current locale  (fi-FI)', (done) => {
    Locale.set('fi-FI');
    Locale.setLanguage('sv');
    Locale.getLocale('de-DE');

    expect(Locale.translate('Required', { locale: 'fi-FI' })).toEqual('Obligatoriskt');
    expect(Locale.translate('Required', { language: 'de' })).toEqual('Obligatorisch');
    expect(Locale.translate('Required', { locale: 'fi-FI', language: 'de' })).toEqual('Obligatorisch');
    expect(Locale.translate('Required', { language: 'sv' })).toEqual('Obligatoriskt');
    expect(Locale.translate('Required', { locale: 'fi-FI', language: 'sv' })).toEqual('Obligatoriskt');
    done();
  });

  it('Should format times correctly', () => {
    Locale.set('af-ZA');

    expect(Locale.calendar().timeFormat).toEqual('HH:mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('yyyy-MM-dd HH:mm');

    Locale.set('bg-BG');

    expect(Locale.calendar().timeFormat).toEqual('H:mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('H:mm:ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('d.MM.yyyy H:mm');

    Locale.set('cs-CZ');

    expect(Locale.calendar().timeFormat).toEqual('H:mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('H:mm:ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('dd.MM.yyyy H:mm');

    Locale.set('da-DK');

    expect(Locale.calendar().timeFormat).toEqual('HH.mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('HH.mm.ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('dd-MM-yyyy HH.mm');

    Locale.set('de-DE');

    expect(Locale.calendar().timeFormat).toEqual('HH:mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('dd.MM.yyyy HH:mm');

    Locale.set('el-GR');

    expect(Locale.calendar().timeFormat).toEqual('h:mm a');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('h:mm:ss a');
    expect(Locale.calendar().dateFormat.datetime).toEqual('d/M/yyyy h:mm a');

    Locale.set('pl-PL');

    expect(Locale.calendar().timeFormat).toEqual('HH:mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('dd.MM.yyyy HH:mm');

    Locale.set('pt-BR');

    expect(Locale.calendar().timeFormat).toEqual('HH:mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('dd/MM/yyyy HH:mm');

    Locale.set('sl-SI');

    expect(Locale.calendar().timeFormat).toEqual('HH:mm');
    expect(Locale.calendar().dateFormat.timestamp).toEqual('HH:mm:ss');
    expect(Locale.calendar().dateFormat.datetime).toEqual('d. MM. yyyy HH:mm');
  });

  it('Should Get the Parent Locale', () => {
    Locale.set('es-MX');

    expect(Locale.currentLocale.name).toEqual('es-MX');
    expect(Locale.currentLanguage.name).toEqual('es');
    expect(Locale.translate('Required')).toEqual('Obligatorio');

    Locale.set('es-419');

    expect(Locale.currentLocale.name).toEqual('es-419');
    expect(Locale.currentLanguage.name).toEqual('es');
    expect(Locale.translate('Required')).toEqual('Obligatorio');

    Locale.set('nb-NO');

    expect(Locale.currentLocale.name).toEqual('nb-NO');
    expect(Locale.currentLanguage.name).toEqual('no');
    expect(Locale.translate('Required')).toEqual('Obligatorisk');

    Locale.set('no-NO');

    expect(Locale.currentLocale.name).toEqual('no-NO');
    expect(Locale.currentLanguage.name).toEqual('no');
    expect(Locale.translate('Required')).toEqual('Obligatorisk');
  });

  it('Should provide a different fr-CA and fr-FR', () => {
    Locale.set('fr-FR');

    expect(Locale.currentLocale.name).toEqual('fr-FR');
    expect(Locale.currentLanguage.name).toEqual('fr');

    expect(Locale.translate('AddComments')).toEqual('Ajouter commentaires');
    expect(Locale.translate('ReorderRows')).toEqual('Retrier les lignes');
    expect(Locale.translate('SelectDay')).toEqual('Sélectionnez un jour');
    expect(Locale.translate('UserProfile')).toEqual('Profile utilisateur');

    Locale.set('fr-CA');

    expect(Locale.currentLocale.name).toEqual('fr-CA');
    expect(Locale.currentLanguage.name).toEqual('fr');
    expect(Locale.translate('AddComments')).toEqual('Ajouter des commentaires');
    expect(Locale.translate('ReorderRows')).toEqual('Réorganiser les lignes');
    expect(Locale.translate('SelectDay')).toEqual('Sélectionner un jour');
    expect(Locale.translate('UserProfile')).toEqual('Profil utilisateur');
  });

  it('Should be able to set language to full code', () => {
    Locale.set('en-US');
    Locale.setLanguage('fr-CA');

    expect(Locale.currentLocale.name).toEqual('en-US');
    expect(Locale.currentLanguage.name).toEqual('fr-CA');

    expect(Locale.translate('AddComments')).toEqual('Ajouter des commentaires');
    expect(Locale.translate('ReorderRows')).toEqual('Réorganiser les lignes');
    expect(Locale.translate('SelectDay')).toEqual('Sélectionner un jour');
    expect(Locale.translate('UserProfile')).toEqual('Profil utilisateur');

    Locale.setLanguage('de-DE');

    expect(Locale.translate('AddComments')).toEqual('Anmerkungen hinzufügen');
    expect(Locale.translate('ReorderRows')).toEqual('Zeilen neu anordnen');
    expect(Locale.translate('SelectDay')).toEqual('Tag auswählen');
    expect(Locale.translate('UserProfile')).toEqual('Benutzerprofil');
  });

  it('Should be able to set language to full code from a similar language', () => {
    Locale.set('fr-FR');
    Locale.setLanguage('fr-CA');

    expect(Locale.currentLocale.name).toEqual('fr-FR');
    expect(Locale.currentLanguage.name).toEqual('fr-CA');

    expect(Locale.translate('AddComments')).toEqual('Ajouter des commentaires');
    expect(Locale.translate('ReorderRows')).toEqual('Réorganiser les lignes');
    expect(Locale.translate('SelectDay')).toEqual('Sélectionner un jour');
    expect(Locale.translate('UserProfile')).toEqual('Profil utilisateur');
  });

  it('Should be able to switch language', () => {
    Locale.set('en-US');
    Locale.setLanguage('fr-CA');

    expect(Locale.translate('AddComments')).toEqual('Ajouter des commentaires');

    Locale.setLanguage('fr-FR');

    expect(Locale.translate('AddComments')).toEqual('Ajouter commentaires');
    Locale.setLanguage('fr-CA');

    expect(Locale.translate('AddComments')).toEqual('Ajouter des commentaires');
    Locale.setLanguage('fr-FR');

    expect(Locale.translate('AddComments')).toEqual('Ajouter commentaires');
  });
});
