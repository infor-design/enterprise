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
require('../../../js/Locale.js');
Locale = window.Locale; // jshint ignore:line

//Load the Locales because Ajax doesnt work
require('../../../js/cultures/en.js');
require('../../../js/cultures/de-DE.js');

//Tests
describe('Locale [mocha]', function(){

  it('should exist', function() {
    should.exist(window.Locale);
  });

  it('should have a locale method', function(){
    Locale.set('en').done(function (result) {
      result.should.equal('en');
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
    Locale.set('en');    //year, month, day
    Locale.formatDate(new Date(2000, 10, 8)).should.equal('11/8/2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'short'}).should.equal('11/8/2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'medium'}).should.equal('Nov 8, 2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'long'}).should.equal('November 8, 2000');
    Locale.formatDate(new Date(2000, 10, 8), {pattern: 'M/d/yyyy'}).should.equal('11/8/2000');
  });

  it('should format de dates', function(){
    Locale.set('de-DE');    //year, month, day
    Locale.formatDate(new Date(2000, 10, 8)).should.equal('08.11.2000');
    Locale.formatDate(new Date(2000, 11, 1)).should.equal('01.12.2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'short'}).should.equal('08.11.2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'medium'}).should.equal('08.11.2000');
    Locale.formatDate(new Date(2000, 10, 8), {date: 'long'}).should.equal('8. November 2000');
    Locale.formatDate(new Date(2000, 10, 8), {pattern: 'M.dd.yyyy'}).should.equal('11.08.2000');
  });

  it('should be able to parse dates', function(){
    Locale.set('en');    //year, month, day
    Locale.parseDate('11/8/2000').getTime().should.equal(new Date(2000, 10, 8).getTime());
    Locale.parseDate('10 / 15 / 2014').getTime().should.equal(new Date(2014, 9, 15).getTime());
    Locale.set('de-DE');    //year, month, day
    Locale.parseDate('08.11.2000').getTime().should.equal(new Date(2000, 10, 8).getTime());
  });

  it('be able to return time format', function(){
    Locale.set('en');
    Locale.calendar().timeFormat.should.equal('h:mm a');
    Locale.set('de-DE');
    Locale.calendar().timeFormat.should.equal('HH:mm');
  });

  it('be able to translate', function(){
    //Normal
    Locale.set('en');
    Locale.translate('Required').should.equal('Required');

    //With Object Selector
    Locale.set('de-DE');
    Locale.translate('Required').should.equal('Erforderlich');
    Locale.translate('Loading').should.equal('Wird Geladen');

    //Error
    should.not.exist(Locale.translate('XYZ'));
  });

});
