define([
  'intern!object',
  'intern/chai!expect',
  'jsdom',
], function(registerSuite, expect) {

  var jsdom = require('jsdom').jsdom;
  document = jsdom('<!DOCTYPE html><html id="html"><head></head><body></body></html>'); // jshint ignore:line
  window = document.defaultView;  // jshint ignore:line

  //Load the Locale.js we are testing
  require('../../../js/locale.js');
  Locale = window.Locale; // jshint ignore:line

  //Load the Locales because Ajax doesnt work
  require('../../../js/cultures/en-US.js');
  require('../../../js/cultures/ar-SA.js');
  require('../../../js/cultures/de-DE.js');
  require('../../../js/cultures/nb-NO.js');
  require('../../../js/cultures/no-NO.js');
  require('../../../js/cultures/es-ES.js');
  require('../../../js/cultures/bg-BG.js');
  require('../../../js/cultures/ar-EG.js');
  require('../../../js/cultures/fi-FI.js');
  require('../../../js/cultures/lt-LT.js');
  require('../../../js/cultures/vi-VN.js');
  require('../../../js/cultures/tr-TR.js');
  require('../../../js/cultures/it-IT.js');
  require('../../../js/cultures/sv-SE.js');
  require('../../../js/cultures/cs-CZ.js');
  require('../../../js/cultures/hu-HU.js');
  require('../../../js/cultures/ja-JP.js');
  require('../../../js/cultures/ru-RU.js');

  registerSuite({

    name: 'Locale',

    // Checks the scaffolding we set up to make sure everything works
    'should exist': function() {
      expect(window.Locale).to.exist;
    },

    // Test that we can set the locale
    'should have a locale method': function() {
      Locale.set('en-US').done(function (result) {
        expect(result).to.equal('en-US');
      });
    },

    //Setting the locale should set the lang attribute in the document
    'should set the html lang attribute': function() {
      Locale.set('de-DE').done(function (result) {
        expect(result).to.equal('de-DE');
      });

      var html = window.document.getElementsByTagName('html')[0];
      expect(html.getAttribute('lang')).to.equal('de-DE');
    },

    //Test Formatting English dates of different size
    'should format en dates': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.formatDate(new Date(2000, 10, 8))).to.equal('11/8/2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {date: 'short'})).to.equal('11/8/2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {date: 'medium'})).to.equal('Nov 8, 2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {date: 'long'})).to.equal('November 8, 2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {pattern: 'M/d/yyyy'})).to.equal('11/8/2000');

      //Other Edge Cases
      expect(Locale.formatDate('11/8/2000')).to.equal('11/8/2000');
      expect(Locale.formatDate()).to.equal(undefined);
    },

    'should format timestamp': function() {
      expect(Locale.formatDate(new Date(2015, 10, 5, 10, 20, 5), {date: 'timestamp'})).to.equal('10:20:05 AM');
      expect(Locale.formatDate(new Date(2015, 10, 5, 10, 20, 5), {pattern: 'hhmmss'})).to.equal('102005');

      var dt = new Date(),
        h = (dt.getHours() > 12 ? dt.getHours()-12 : dt.getHours()).toString(),
        h24 = Locale.pad(dt.getHours().toString(), 2),
        m = Locale.pad(dt.getMinutes(), 2).toString(),
        s = Locale.pad(dt.getSeconds(), 2).toString();

      expect(Locale.formatDate(dt, {pattern: 'hmmss'})).to.equal(h+m+s);
      expect(Locale.formatDate(dt, {pattern: 'HHmmss'})).to.equal(h24+m+s);
      //expect(Locale.formatDate(dt, {date: 'timestamp'})).to.equal(h+m+s);

    },

    'should format millis': function() {
      expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), {pattern: 'd/M/yyyy h:mm:ss.SSS a '})).to.equal('15/3/2016 12:30:36.142 PM');
      expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36, 142), {pattern: 'd/M/yyyy h:mm:ss.SSS '})).to.equal('15/3/2016 12:30:36.142');
    },

    //Format some random date type cases
    'should format other dates': function() {
      Locale.set('de-DE');    //year, month, day
      expect(Locale.formatDate(new Date(2000, 10, 8))).to.equal('08.11.2000');
      expect(Locale.formatDate(new Date(2000, 11, 1))).to.equal('01.12.2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {date: 'short'})).to.equal('08.11.2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {date: 'medium'})).to.equal('08.11.2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {date: 'long'})).to.equal('8. November 2000');
      expect(Locale.formatDate(new Date(2000, 10, 8), {pattern: 'M.dd.yyyy'})).to.equal('11.08.2000');

      Locale.set('fi-FI');    //year, month, day
      expect(Locale.formatDate(new Date(2000, 11, 1))).to.equal('1.12.2000');
    },

    //Format time in us and europe
    'should format time': function() {
      Locale.set('en-US');    //year, month, day, hours, mins , secs
      expect(Locale.formatDate(new Date(2000, 10, 8, 13, 40), {date: 'datetime'})).to.equal('11/8/2000 1:40 PM');
      expect(Locale.formatDate(new Date(2000, 10, 8, 13, 0), {date: 'datetime'})).to.equal('11/8/2000 1:00 PM');
      Locale.set('de-DE');
      expect(Locale.formatDate(new Date(2000, 11, 1, 13, 40), {date: 'datetime'})).to.equal('01.12.2000 13:40');
      expect(Locale.formatDate(new Date(2000, 11, 1, 13, 05), {pattern: 'M.dd.yyyy HH:mm'})).to.equal('12.01.2000 13:05');

      var date = new Date(2017, 01, 01, 17, 27, 40),
        opts = {pattern: 'yyyy-MM-dd HH:mm' , date: 'datetime'};

      Locale.set('fi-FI');
      expect(Locale.formatDate(date, opts)).to.equal('1.2.2017 5:27');
      Locale.set('cs-CZ');
      expect(Locale.formatDate(date, opts)).to.equal('01.02.2017 5:27');
      Locale.set('hu-HU');
      expect(Locale.formatDate(date, opts)).to.equal('2017. 02. 01. 5:27');
      Locale.set('ja-JP');
      expect(Locale.formatDate(date, opts)).to.equal('2017/02/01 5:27');
      Locale.set('ru-RU');
      expect(Locale.formatDate(date, opts)).to.equal('2/1/2017 5:27');
    },

    //monthYear and yearMonth
    'should format a year and month locale': function() {
      Locale.set('en-US');    //year, month, day, hours, mins , secs
      expect(Locale.formatDate(new Date(2000, 10, 8, 13, 40), {date: 'month'})).to.equal('November 8');
      expect(Locale.formatDate(new Date(2000, 10, 8, 13, 0), {date: 'year'})).to.equal('November 2000');

      Locale.set('de-DE');
      expect(Locale.formatDate(new Date(2000, 11, 1, 13, 40), {date: 'month'})).to.equal('1. Dezember');
      expect(Locale.formatDate(new Date(2000, 11, 1, 13, 05), {date: 'year'})).to.equal('Dezember 2000');

      Locale.set('sv-SE');
      expect(Locale.formatDate(new Date(2000, 11, 1, 13, 40), {date: 'month'})).to.equal('den 1 december');
      expect(Locale.formatDate(new Date(2000, 11, 1, 13, 05), {date: 'year'})).to.equal('december 2000');
    },

    //monthYear and yearMonth
    'should be able to test RTL': function() {
      Locale.set('en-US');    //year, month, day, hours, mins , secs
      expect(Locale.isRTL()).to.equal(false);
      Locale.set('ar-SA');
      expect(Locale.isRTL()).to.equal(true);
    },

    //Formating Hours
    'should be able to format and parse hours': function() {
      Locale.set('en-US');
      var dt = Locale.parseDate('000100', 'HHmmss', false);
      expect(dt.getTime()).to.equal(new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1,'00', '01', '00').getTime());
      expect(Locale.formatDate(dt, {pattern: 'h:mm a'})).to.equal('12:01 AM');
      expect(Locale.formatDate(dt, {pattern: 'HHmmss'})).to.equal('000100');

      //Test 12:00 specifically
      expect(Locale.parseDate('10/28/2015 12:00:00 AM', 'M/d/yyyy h:mm:ss a').getTime()).to.equal(new Date(2015, 9, 28, 0, 0, 0).getTime());
      expect(Locale.parseDate('25/04/2017 12:00:00 AM', { pattern: 'd/MM/yyyy h:mm:ss a'}).getTime()).to.equal(new Date(2017, 3, 25, 0, 0, 0).getTime());

    },

    'should be able to parse 2 and 3 digit years': function() {
      Locale.set('en-US');
      expect(Locale.parseDate('10/10/10', 'M/d/yyyy').getTime()).to.equal(new Date(2010, 09, 10, 0, 0, 0).getTime());
      expect(Locale.parseDate('10/10/010', 'M/d/yyyy')).to.equal(undefined);
      // expect(Locale.parseDate('10/10/010', 'M/d/yyyy').getTime()).to.equal(new Date(2010, 09, 10, 0, 0, 0).getTime());
    },

    'should be able to parse UTC toISOString': function() {
      Locale.set('en-US');
      expect(Locale.parseDate('2000-01-01T00:00:00.000Z', 'yyyy-MM-ddTHH:mm:ss.SSSZ').getTime()).to.equal(new Date(Date.UTC(2000, 0, 1, 0, 0, 0)).getTime());
      expect(Locale.parseDate('2000-01-01T00:00:00.001Z', 'yyyy-MM-DDTHH:mm:ss.SSSZ').toISOString()).to.equal('2000-01-01T00:00:00.001Z');
    },

    //Test Long Formatting
    'should format long': function() {
      Locale.set('en-US');    //year, month, day, hours, mins , secs
      expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40), {date: 'long'})).to.equal('January 8, 2015');

      Locale.set('de-DE');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'})).to.equal('1. Januar 2015');

      Locale.set('es-ES');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'})).to.equal('1 de Enero de 2015');

      Locale.set('lt-LT');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'})).to.equal('2015 m. sausis 1 d.');

      Locale.set('vi-VN');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'})).to.equal('ngày 01 tháng 01 năm 2015');
    },

    'should format long with day of week': function() {
      Locale.set('en-US');    //year, month, day, hours, mins , secs
      expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40), {date: 'full'})).to.equal('Thursday, January 8, 2015');
      expect(Locale.formatDate(new Date(2015, 2, 7, 13, 40), {date: 'full'})).to.equal('Saturday, March 7, 2015');

      Locale.set('de-DE');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'full'})).to.equal('Donnerstag, 1. Januar 2015');
    },

    'should format long days': function() {
      Locale.set('en-US');    //year, month, day, hours, mins , secs
      expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40), {date: 'long'})).to.equal('January 8, 2015');

      Locale.set('de-DE');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'})).to.equal('1. Januar 2015');

      Locale.set('ar-EG');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'})).to.equal('1 محرم، 2015');

      Locale.set('bg-BG');
      expect(Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'})).to.equal('1 януари 2015 г.');
    },

    'should be able to parse dates': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.parseDate('11/8/2000').getTime()).to.equal(new Date(2000, 10, 8).getTime());
      expect(Locale.parseDate('11/8/00').getTime()).to.equal(new Date(2000, 10, 8).getTime());
      expect(Locale.parseDate('10 / 15 / 2014').getTime()).to.equal(new Date(2014, 9, 15).getTime());
      Locale.set('de-DE');    //year, month, day
      expect(Locale.parseDate('08.11.2000').getTime()).to.equal(new Date(2000, 10, 8).getTime());
    },


    'should parse dates with month zero': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.parseDate('2016-01-01', 'yyyy-MM-dd').getTime()).to.equal(new Date(2016, 0, 1).getTime());
      expect(Locale.parseDate('2016-01-03', 'yyyy-MM-dd').getTime()).to.equal(new Date(2016, 0, 3).getTime());
      expect(Locale.parseDate('2016-01-31', 'yyyy-MM-dd').getTime()).to.equal(new Date(2016, 0, 31).getTime());
    },

    'can format with no separator': function() {
      Locale.set('en-US');
      expect(Locale.parseDate('20151028', 'yyyyMMdd').getTime()).to.equal(new Date(2015, 9, 28).getTime());
      expect(Locale.parseDate('28/10/2015', 'dd/MM/yyyy').getTime()).to.equal(new Date(2015, 9, 28).getTime());
      expect(Locale.parseDate('10/28/2015', 'M/d/yyyy').getTime()).to.equal(new Date(2015, 9, 28).getTime());
      expect(Locale.parseDate('10282015', 'Mdyyyy').getTime()).to.equal(new Date(2015, 9, 28).getTime());
      expect(Locale.parseDate('10282015', 'Mdyyyy').getTime()).to.equal(new Date(2015, 9, 28).getTime());
      expect(Locale.parseDate('10/28/99', 'MM/dd/yy').getTime()).to.equal(new Date(2099, 9, 28).getTime());

      //We can parse either 4 or 2 digit month day
      expect(Locale.parseDate('10282015', 'Mdyyyy').getTime()).to.equal(new Date(2015, 9, 28).getTime());
      expect(Locale.parseDate('222015', 'dMyyyy').getTime()).to.equal(new Date(2015, 1, 2).getTime());
    },

    'parse date time': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.parseDate('10/28/2015 8:12:10', 'M/d/yyyy h:mm:ss').getTime()).to.equal(new Date(2015, 9, 28, 8, 12, 10).getTime());
      expect(Locale.parseDate('10/28/2015 8:12:10 PM', 'M/d/yyyy h:mm:ss a').getTime()).to.equal(new Date(2015, 9, 28, 20, 12, 10).getTime());
      expect(Locale.parseDate('10/28/2015 8:12:10 AM', 'M/d/yyyy h:mm:ss a').getTime()).to.equal(new Date(2015, 9, 28, 8, 12, 10).getTime());
      expect(Locale.parseDate('10/28/2015', 'M/d/yyyy h:mm:ss')).to.equal(undefined);
      expect(Locale.parseDate('10/28/2015 20:12:10', 'M/d/yyyy HH:mm:ss').getTime()).to.equal(new Date(2015, 9, 28, 20, 12, 10).getTime());
      expect(Locale.parseDate('10/28/2015 30:12:10', 'M/d/yyyy HH:mm:ss')).to.equal(undefined);
      expect(Locale.parseDate('10/28/2015 30:30:10 AM', 'M/d/yyyy h:mm:ss a')).to.equal(undefined);
      expect(Locale.parseDate(undefined)).to.equal(undefined);
    },

    'parse incomplete dates': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.parseDate('10/28/2015 8:12:10', 'M/d/yyyy h:mm:ss').getTime()).to.equal(new Date(2015, 9, 28, 8, 12, 10).getTime());
      var dt = new Date(),
        y = dt.getFullYear();

      expect(Locale.parseDate('1105','MMdd').getTime()).to.equal(new Date(y, 10, 05, 0, 0, 0).getTime());
      expect(Locale.parseDate('201511','yyyyMM').getTime()).to.equal(new Date(2015, 10, 1, 0, 0, 0).getTime());
    },

    'should round minutes to 60 ': function() {
       Locale.set('en-US');
       expect(Locale.parseDate('10/28/2015 8:65:10', 'M/d/yyyy h:mm:ss').getTime()).to.equal(new Date(2015, 9, 28, 8, 0, 10).getTime());
       expect(Locale.parseDate('10/28/2015 8:10:65', 'M/d/yyyy h:mm:ss').getTime()).to.equal(new Date(2015, 9, 28, 8, 10, 0).getTime());
    },

    'parse date should handle leap years': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.parseDate('02/29/2016', 'M/d/yyyy').getTime()).to.equal(new Date(2016, 1, 29).getTime());
      expect(Locale.parseDate('02/30/2016', 'M/d/yyyy')).to.equal(undefined);
    },

    'should cleanly handle non dates': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.parseDate('111/81/20001')).to.equal(undefined);
      expect(Locale.formatNumber(undefined, {date: 'timestamp'})).to.equal(undefined);
      expect(Locale.parseDate('13/28/2015', 'MM/d/yyyy')).to.equal(undefined);
      expect(Locale.parseDate('10/32/2015', 'MM/dd/yyyy')).to.equal(undefined);
    },

    'should parse text months': function() {
      Locale.set('en-US');    //year, month, day
      expect(Locale.parseDate('2015 December', 'yyyy MMMM').getTime()).to.equal(new Date(2015, 11, 1, 0, 0, 0).getTime());

      Locale.set('de-DE');
      expect(Locale.parseDate('Dezember 2015', 'MMMM yyyy').getTime()).to.equal(new Date(2015, 11, 1, 0, 0, 0).getTime());
    },

    'should parse Dates with - in them': function() {
      Locale.set('en-US');    //year, month, day

      // Test date only
      expect(Locale.parseDate('2015-05-10', 'yyyy-dd-MM').getTime()).to.equal(new Date(2015, 09, 5, 0, 0, 0).getTime());

      // Test date only different format
      expect(Locale.parseDate('05-10-2015', 'dd-MM-yyyy').getTime()).to.equal(new Date(2015, 09, 5, 0, 0, 0).getTime());

    },

    'be able to return time format': function(){
      Locale.set('en-US');
      expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40, 45), {date: 'timestamp'})).to.equal('1:40:45 PM');

      Locale.set('de-DE');
      expect(Locale.formatDate(new Date(2015, 0, 8, 13, 40, 45), {date: 'timestamp'})).to.equal('13:40:45');
    },

    //monthYear and yearMonth
    'should be format time stamp': function() {
      Locale.set('en-US');    //year, month, day, hours, mins , secs
      expect(Locale.isRTL()).to.equal(false);
      Locale.set('ar-SA');
      expect(Locale.isRTL()).to.equal(true);
    },

    'be work with either no-NO or nb-NO': function() {
      Locale.set('no-NO');
      expect(Locale.translate('Loading')).to.equal('Laster');
      Locale.set('nb-NO');
      expect(Locale.translate('Loading')).to.equal('Laster');
      expect(Locale.calendar().timeFormat).to.equal('HH.mm');
      Locale.set('en-US');
    },

    'be able to translate': function() {
      //Normal
      Locale.set('en-US');
      expect(Locale.translate('Required')).to.equal('Required');

      //With Object Selector
      //TODO: Add back when we get translations
      //Locale.set('de-DE');
      //expect(Locale.translate('Required')).to.equal('Erforderlich');
      //expect(Locale.translate('Loading')).to.equal('Wird Geladen');

      //Error
      expect(Locale.translate('XYZ')).to.equal(undefined);

      //Non Existant in locale - use EN
      Locale.set('de-DE');
      expect(Locale.translate('Equals')).to.equal('Gleich');

      //Error
      expect(Locale.translate('XYZ')).to.equal(undefined);

    },

    'be possible to add translations': function() {
      Locale.set('en-US');
      Locale.currentLocale.data.messages.CustomValue = {id: 'CustomValue', value: 'Added Custom Value'};

      expect(Locale.translate('CollapseAppTray')).to.equal('Collapse App Tray');
      expect(Locale.translate('CustomValue')).to.equal('Added Custom Value');
    },

    //We tried to translate a local that doesnt exist
    'no translate errors on non existant locale': function() {
      //Normal
      Locale.set('xx-XX');
      expect(Locale.translate('Required')).to.equal('Required');
    },

    'should format decimals': function() {
      Locale.set('en-US');
      expect(Locale.formatNumber(12345.1234)).to.equal('12,345.123');
      expect(Locale.formatNumber(12345.123, {style: 'decimal', maximumFractionDigits:2})).to.equal('12,345.12');
      expect(Locale.formatNumber(12345.123456, {style: 'decimal', maximumFractionDigits:3})).to.equal('12,345.123');
      expect(Locale.formatNumber(0.0000004, {style: 'decimal', maximumFractionDigits:7})).to.equal('0.0000004');
      expect(Locale.formatNumber(20.1, {style: 'decimal', round: true, minimumFractionDigits: 2})).to.equal('20.10');
      expect(Locale.formatNumber(20.1, {style: 'decimal', round: true})).to.equal('20.10');
	    expect(Locale.formatNumber('12,345.123')).to.equal('12,345.123');
	    expect(Locale.formatNumber(12345.1234, {group: ''})).to.equal('12345.123');
      expect(Locale.formatNumber(5.1, { minimumFractionDigits: 2 , maximumFractionDigits: 2 })).to.equal('5.10');

      Locale.set('de-DE');
      expect(Locale.formatNumber(12345.1)).to.equal('12.345,10');
      expect(Locale.formatNumber(0.0000004, {style: 'decimal', maximumFractionDigits:7})).to.equal('0,0000004');
      expect(Locale.formatNumber(0.000004, {style: 'decimal', maximumFractionDigits:7})).to.equal('0,000004');

      Locale.set('ar-EG');
      expect(Locale.formatNumber(12345.1)).to.equal('12٬345٫10');
      Locale.set('bg-BG');
      expect(Locale.formatNumber(12345.1)).to.equal('12 345,10');

    },

    'should truncate not round decimals': function() {
      Locale.set('en-US');
      expect(Locale.formatNumber(123456.123456, {style: 'decimal', maximumFractionDigits: 5})).to.equal('123,456.12345');
      expect(Locale.formatNumber(123456.123456, {style: 'decimal', maximumFractionDigits: 4})).to.equal('123,456.1234');
      expect(Locale.formatNumber(1.001, {style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3})).to.equal('1');
      expect(Locale.formatNumber(1.001, {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3})).to.equal('1.001');
      expect(Locale.formatNumber(1.001, {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3, round: true})).to.equal('1.001');
      expect(Locale.formatNumber(1.0019, {style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3})).to.equal('1.001');
      expect(Locale.formatNumber(1.0019, {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3})).to.equal('1.001');
      expect(Locale.formatNumber(1.0019, {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3, round: true})).to.equal('1.002');
      expect(Locale.formatNumber(12345.6789, {style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 3})).to.equal('12,345.678');
      expect(Locale.formatNumber(12345.6789, {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3})).to.equal('12,345.678');
      expect(Locale.formatNumber(12345.6789, {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3, round: true})).to.equal('12,345.679');
    },

    'should format integers': function() {
      Locale.set('en-US');
      expect(Locale.formatNumber(12345.123, {style: 'integer'})).to.equal('12,345');

      Locale.set('de-DE');
      expect(Locale.formatNumber(12345.123, {style: 'integer'})).to.equal('12.345');
    },

    //A string which was a number can be parsed
    'should format string numbers': function() {
      Locale.set('en-US');
      expect(Locale.formatNumber('12345', {style: 'integer'})).to.equal('12,345');

    },

    'should format currency': function() {
      Locale.set('en-US');
      expect(Locale.formatNumber(12345.129, {style: 'currency'})).to.equal('$12,345.12');

      Locale.set('de-DE');
      expect(Locale.formatNumber(12345.123, {style: 'currency'})).to.equal('12.345,12 €');
    },

    'should format percent': function() {
      Locale.set('en-US');
      expect(Locale.formatNumber(0.0500000, {style: 'percent'})).to.equal('5 %');
      expect(Locale.formatNumber(0.050000, {style: 'percent', maximumFractionDigits: 0})).to.equal('5 %');
      expect(Locale.formatNumber(0.05234, {style: 'percent', minimumFractionDigits: 4, maximumFractionDigits: 4})).to.equal('5.2340 %');

      expect(Locale.formatNumber(0.57, {style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0})).to.equal('57 %');
      expect(Locale.formatNumber(0.57, {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})).to.equal('57.00 %');
      expect(Locale.formatNumber(0.5700, {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})).to.equal('57.00 %');
      expect(Locale.formatNumber(0.57010, {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})).to.equal('57.01 %');
      expect(Locale.formatNumber(0.5755, {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})).to.equal('57.55 %');

      Locale.set('tr-TR');
      expect(Locale.formatNumber(0.0500000, {style: 'percent'})).to.equal('%5');

      Locale.set('it-IT');
      expect(Locale.formatNumber(0.0500000, {style: 'percent'})).to.equal('5%');
    },

    'should parse numbers back': function() {
      Locale.set('en-US');
      expect(Locale.parseNumber('$12,345.13')).to.equal(12345.13);

      Locale.set('de-DE');
      expect(Locale.parseNumber('12.345,12 €')).to.equal(12345.12);
    },

    'should return NaN for bad numbers': function() {
      Locale.set('en-US');
      expect(NaN).to.deep.equal(NaN);
      expect(Locale.parseNumber()).to.deep.equal(NaN);
      expect(Locale.parseNumber('')).to.deep.equal(NaN);
      expect(Locale.parseNumber('sdf')).to.deep.equal(NaN);
      expect(Locale.parseNumber(undefined)).to.deep.equal(NaN);
    },

    'should parse with multiple group separators': function() {
      Locale.set('en-US');
      expect(Locale.parseNumber('1,234,567,890.12346')).to.equal(1234567890.12346);
    },

   'should handle big numbers': function() {
      Locale.set('en-US');
      expect(Locale.parseNumber('1123456789123456.57')).to.equal(1123456789123456.57);
      expect(Locale.parseNumber('1123456789123.57')).to.equal(1123456789123.57);
      expect(Locale.parseNumber('112345678912345.57')).to.equal(112345678912345.57);
      expect(Locale.parseNumber('11234567891.57')).to.equal(11234567891.57);
    },

    'should handle AM/PM': function() {
      Locale.set('en-US');
      expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36), {pattern: 'd/M/yyyy h:mm:ss a'})).to.equal('15/3/2016 12:30:36 PM');
      expect(Locale.formatDate(new Date(2016, 2, 15, 0, 30, 36), {pattern: 'd/M/yyyy h:mm:ss a'})).to.equal('15/3/2016 12:30:36 AM');
      expect(Locale.formatDate(new Date(2016, 2, 15, 12, 30, 36), {pattern: 'd/M/yyyy HH:mm:ss'})).to.equal('15/3/2016 12:30:36');
      expect(Locale.formatDate(new Date(2016, 2, 15, 0, 30, 36), {pattern: 'd/M/yyyy HH:mm:ss'})).to.equal('15/3/2016 00:30:36');
    },

    'should handle minimumFractionDigits': function() {
      Locale.set('en-US');
      expect(Locale.formatNumber('12345', {minimumFractionDigits:0 , maximumFractionDigits: 2})).to.equal('12,345');
      expect(Locale.formatNumber('12345.1', {minimumFractionDigits:0 , maximumFractionDigits: 2})).to.equal('12,345.1');
      expect(Locale.formatNumber('12345.12', {minimumFractionDigits:0 , maximumFractionDigits: 2})).to.equal('12,345.12');
      expect(Locale.formatNumber('12345.123', {minimumFractionDigits:0 , maximumFractionDigits: 2})).to.equal('12,345.12');
      expect(Locale.formatNumber('12345.1234', {minimumFractionDigits:0 , maximumFractionDigits: 2})).to.equal('12,345.12');

      expect(Locale.formatNumber('12345', {minimumFractionDigits:2 , maximumFractionDigits: 4})).to.equal('12,345.00');
      expect(Locale.formatNumber('12345.1', {minimumFractionDigits:2 , maximumFractionDigits: 4})).to.equal('12,345.10');
      expect(Locale.formatNumber('12345.12', {minimumFractionDigits:2 , maximumFractionDigits: 4})).to.equal('12,345.12');
      expect(Locale.formatNumber('12345.123', {minimumFractionDigits:2 , maximumFractionDigits: 4})).to.equal('12,345.123');
      expect(Locale.formatNumber('12345.12345678', {minimumFractionDigits:2 , maximumFractionDigits: 4})).to.equal('12,345.1234');

      //Leave out the maximumFractionDigits
      expect(Locale.formatNumber('12345', {minimumFractionDigits:2})).to.equal('12,345.00');
      expect(Locale.formatNumber('12345', {minimumFractionDigits:0})).to.equal('12,345');
      expect(Locale.formatNumber('12345.1', {minimumFractionDigits:0})).to.equal('12,345.1');

      expect(Locale.formatNumber('12345', {minimumFractionDigits: 4})).to.equal('12,345.0000');
      expect(Locale.formatNumber('12345.1', {minimumFractionDigits: 5})).to.equal('12,345.10000');

    },

    'can round optionally': function() {
      expect(Locale.formatNumber('3.01999', {maximumFractionDigits: 2, round: true})).to.equal('3.02');
      expect(Locale.formatNumber('4.1', {minimumFractionDigits: 0, maximumFractionDigits: 2})).to.equal('4.1');
      expect(Locale.formatNumber('5.1', {minimumFractionDigits: 2, maximumFractionDigits: 2})).to.equal('5.10');
      expect(Locale.formatNumber('12.341', {minimumFractionDigits: 0, maximumFractionDigits: 2, round: true})).to.equal('12.34');
      expect(Locale.formatNumber('12.340', {minimumFractionDigits: 0, maximumFractionDigits: 2, round: true})).to.equal('12.34');
      expect(Locale.formatNumber('12.344', {minimumFractionDigits: 0, maximumFractionDigits: 2, round: true})).to.equal('12.34');
      expect(Locale.formatNumber('12.349', {minimumFractionDigits: 0, maximumFractionDigits: 2, round: true})).to.equal('12.35');
      expect(Locale.formatNumber('12345.12345678', {minimumFractionDigits:2 , maximumFractionDigits: 4, round: true})).to.equal('12,345.1235');
    },

    'truncate decimals': function() {
      expect(Locale.truncateDecimals('1111111111.11', 2, 2)).to.equal('1111111111.11');
      expect(Locale.truncateDecimals('11111111111.11', 2, 2)).to.equal('11111111111.11');
      expect(Locale.truncateDecimals('1.10', 2, 2)).to.equal('1.10');
      expect(Locale.truncateDecimals('2.10', 2, 2)).to.equal('2.10');
      expect(Locale.truncateDecimals('3.10', 2, 2)).to.equal('3.10');
      expect(Locale.truncateDecimals('4.10', 2, 2)).to.equal('4.10');
      expect(Locale.truncateDecimals('5.10', 2, 2)).to.equal('5.10');
      expect(Locale.truncateDecimals('5.1', 2, 2)).to.equal('5.10');
      expect(Locale.truncateDecimals('6.10', 2, 2)).to.equal('6.10');
    },

    // Related JIRA Ticket: SOHO-5408
    'should properly convert character cases in some specific Locales': function() {
      Locale.set('tr-TR');
      expect(Locale.toUpperCase('kodları')).to.equal('KODLARI');
      expect(Locale.toLowerCase('İSTANBUL')).to.equal('istanbul');
      expect(Locale.capitalize('istanbul')).to.equal('İstanbul');
      expect(Locale.capitalizeWords('kodları istanbul')).to.equal('Kodları İstanbul');
    },

    'should properly convert from Gregorian to Islamic UmAlQura': function() {
      Locale.set('ar-SA');
      var islamicDate = Locale.calendar().conversions.fromGregorian(new Date(new Date(2017, 04, 31)));
      expect(islamicDate[0].toString()+ ' ' + islamicDate[1].toString()+ ' ' + islamicDate[2].toString()).to.equal('1438 8 5');

      islamicDate = Locale.calendar().conversions.fromGregorian(new Date(new Date(2010, 11, 01)));
      expect(islamicDate[0].toString()+ ' ' + islamicDate[1].toString()+ ' ' + islamicDate[2].toString()).to.equal('1431 11 25');
    },

    'should properly convert from Islamic UmAlQura to Gregorian': function() {
      Locale.set('ar-SA');
      expect(Locale.calendar().conversions.toGregorian(1438, 8, 5).getTime()).to.equal(new Date(2017, 04, 31, 0, 0, 0).getTime());
      expect(Locale.calendar().conversions.toGregorian(1431, 11, 25).getTime()).to.equal(new Date(2010, 11, 1, 0, 0, 0).getTime());
    }

  });

});
