/***************************
 * Locale - Mocha Tests
 * These tests run just using plain Mocha
***************************/

//Use JsDom and setup a window, and document
var jsdom = require('jsdom').jsdom;
window = jsdom().parentWindow;  // jshint ignore:line
document = jsdom('<!DOCTYPE html><html id="html"><head></head><body></body></html>'); // jshint ignore:line

//Load Jquery from node packages
$ = jQuery = require('jquery'); // jshint ignore:line

//Load the Locale.js we are testing
require('../../../js/locale.js');
Locale = window.Locale; // jshint ignore:line

//Load the Locales because Ajax doesnt work
require('../../../js/cultures/en-US.js');
require('../../../js/cultures/de-DE.js');
require('../../../js/cultures/nb-NO.js');
require('../../../js/cultures/no-NO.js');
require('../../../js/cultures/es-ES.js');
require('../../../js/cultures/bg-BG.js');
require('../../../js/cultures/ar-EG.js');
require('../../../js/cultures/fi-FI.js');
require('../../../js/cultures/lt-LT.js');
require('../../../js/cultures/vi-VN.js');

//Tests
describe('Locale [mocha]', function(){

  it('should exist', function() {
    should.exist(window.Locale);
  });

  it('should have a locale method', function(){
    Locale.set('en-US').done(function (result) {
      result.should.equal('en-US');
    });
  });

  it('should set the html lang attribute', function(){
    Locale.set('de-DE').done(function (result) {
      result.should.equal('de-DE');
    });

    var html = window.document.getElementsByTagName('html')[0];
    html.getAttribute('lang').should.equal('de-DE');
  });

  it('should format en dates', function(){
    Locale.set('en-US');    //year, month, day
    Locale.formatDate(new Date(2000, 10, 8)).should.equal('11/8/2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'short'}).should.equal('11/8/2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'medium'}).should.equal('Nov 8, 2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'long'}).should.equal('November 8, 2000');
    Locale.formatDate(new Date(2000, 10, 8), {pattern: 'M/d/yyyy'}).should.equal('11/8/2000');
  });

  it('should format other dates', function(){
    Locale.set('de-DE');    //year, month, day
    Locale.formatDate(new Date(2000, 10, 8)).should.equal('08.11.2000');
    Locale.formatDate(new Date(2000, 11, 1)).should.equal('01.12.2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'short'}).should.equal('08.11.2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'medium'}).should.equal('08.11.2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'long'}).should.equal('8. November 2000');
    Locale.formatDate(new Date(2000, 10, 8), {pattern: 'M.dd.yyyy'}).should.equal('11.08.2000');

    Locale.set('fi-FI');    //year, month, day
    Locale.formatDate(new Date(2000, 11, 1)).should.equal('1.12.2000');

  });

  it('should format time', function(){
    Locale.set('en-US');    //year, month, day, hours, mins , secs
    Locale.formatDate(new Date(2000, 10, 8, 13, 40), {date: 'datetime'}).should.equal('11/8/2000 1:40 PM');
    Locale.formatDate(new Date(2000, 10, 8, 13, 0), {date: 'datetime'}).should.equal('11/8/2000 1:00 PM');
    Locale.set('de-DE');
    Locale.formatDate(new Date(2000, 11, 1, 13, 40), {date: 'datetime'}).should.equal('01.12.2000 13:40');
    Locale.formatDate(new Date(2000, 11, 1, 13, 05), {pattern: 'M.dd.yyyy HH:mm'}).should.equal('12.01.2000 13:05');
  });

  it('should format long', function() {
    Locale.set('en-US');    //year, month, day, hours, mins , secs
    Locale.formatDate(new Date(2015, 0, 8, 13, 40), {date: 'long'}).should.equal('January 8, 2015');
    Locale.set('de-DE');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'}).should.equal('1. Januar 2015');
    Locale.set('es-ES');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'}).should.equal('1 de Enero de 2015');
    Locale.set('lt-LT');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'}).should.equal('2015 m. sausis 1 d.');
    Locale.set('vi-VN');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'}).should.equal('ngày 01 tháng 01 năm 2015');
  });

  it('should format long with day of week', function() {
    Locale.set('en-US');    //year, month, day, hours, mins , secs
    Locale.formatDate(new Date(2015, 0, 8, 13, 40), {date: 'full'}).should.equal('Thursday, January 8, 2015');
    Locale.formatDate(new Date(2015, 2, 7, 13, 40), {date: 'full'}).should.equal('Saturday, March 7, 2015');
    Locale.set('de-DE');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'full'}).should.equal('Donnerstag, 1. Januar 2015');
  });

  it('should format long days', function() {
    Locale.set('en-US');    //year, month, day, hours, mins , secs
    Locale.formatDate(new Date(2015, 0, 8, 13, 40), {date: 'long'}).should.equal('January 8, 2015');
    Locale.set('de-DE');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'}).should.equal('1. Januar 2015');
    Locale.set('ar-EG');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'}).should.equal('1 يناير، 2015');
    Locale.set('bg-BG');
    Locale.formatDate(new Date(2015, 0, 1, 13, 40), {date: 'long'}).should.equal('1 януари 2015 г.');
  });

  it('should be able to parse dates', function() {
    Locale.set('en-US');    //year, month, day
    Locale.parseDate('11/8/2000').getTime().should.equal(new Date(2000, 10, 8).getTime());
    Locale.parseDate('10 / 15 / 2014').getTime().should.equal(new Date(2014, 9, 15).getTime());
    Locale.set('de-DE');    //year, month, day
    Locale.parseDate('08.11.2000').getTime().should.equal(new Date(2000, 10, 8).getTime());
  });

  it('be able to return time format', function(){
    Locale.set('en-US');
    Locale.calendar().timeFormat.should.equal('h:mm a');
    Locale.set('de-DE');
    Locale.calendar().timeFormat.should.equal('HH:mm');
  });

  it('be work with either no-NO or nb-NO', function() {
    Locale.set('no-NO');
    Locale.translate('Loading').should.equal('Laster');
    Locale.set('nb-NO');
    Locale.translate('Loading').should.equal('Laster');
    Locale.calendar().timeFormat.should.equal('HH.mm');
    Locale.set('en-US');
  });

  it('be able to translate', function(){
    //Normal
    Locale.set('en-US');
    Locale.translate('Required').should.equal('Required');

    //With Object Selector
    Locale.set('de-DE');
    Locale.translate('Required').should.equal('Erforderlich');
    Locale.translate('Loading').should.equal('Wird Geladen');

    //Error
    should.not.exist(Locale.translate('XYZ'));
  });

  it('should format decimals', function() {
    Locale.set('en-US');
    Locale.formatNumber(12345.1234).should.equal('12,345.123');
    Locale.formatNumber(12345.123, {style: 'decimal', maximumFractionDigits:2}).should.equal('12,345.12');
    Locale.formatNumber(12345.123456, {style: 'decimal', maximumFractionDigits:3}).should.equal('12,345.123');

    Locale.set('de-DE');
    Locale.formatNumber(12345.1).should.equal('12.345,100');

    Locale.set('ar-EG');
    Locale.formatNumber(12345.1).should.equal('12٬345٫100');
    Locale.set('bg-BG');
    Locale.formatNumber(12345.1).should.equal('12 345,100');

  });

  it('should format integers', function() {
    Locale.set('en-US');
    Locale.formatNumber(12345.123, {style: 'integer'}).should.equal('12,345');

    Locale.set('de-DE');
    Locale.formatNumber(12345.123, {style: 'integer'}).should.equal('12.345');
  });

  it('should format currency', function() {
    Locale.set('en-US');
    Locale.formatNumber(12345.129, {style: 'currency'}).should.equal('$12,345.13');

    Locale.set('de-DE');
    Locale.formatNumber(12345.123, {style: 'currency'}).should.equal('12.345,12 €');
  });


});
