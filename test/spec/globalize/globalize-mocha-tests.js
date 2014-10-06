/***************************
 * Globalize - Mocha Tests
 * These tests run just using plain Mocha
***************************/

//Use JsDom and setup a window, and document
var jsdom = require('jsdom').jsdom;
window = jsdom().parentWindow;  // jshint ignore:line
document = jsdom('<!DOCTYPE html><html id="html"><head></head><body></body></html>'); // jshint ignore:line

//Load Jquery from node packages
$ = jQuery = require('jquery'); // jshint ignore:line

//Load the globalize.js we are testing
require('../../../js/globalize.js');
Globalize = window.Globalize; // jshint ignore:line

//Load the Locales because Ajax doesnt work
require('../../../js/cultures/en.js');
require('../../../js/cultures/de.js');

//Tests
describe('Globalize [mocha]', function(){

  it('should exist', function() {
    should.exist(window.Globalize);
  });

  it('should have a locale method', function(){
    Globalize.locale('en').should.equal('en');
  });

  it('should set the html lang attribute', function(){
    Globalize.locale('de').should.equal('de');
    var html = window.document.getElementsByTagName('html')[0];
    html.getAttribute('lang').should.equal('de');
  });

  it('should format en dates', function(){
    Globalize.locale('en');    //year, month, day
    Globalize.formatDate(new Date(2000, 10, 8)).should.equal('10/8/00');
    Globalize.formatDate(new Date(2000, 10, 8), {date: 'short'}).should.equal('10/8/00');
    Globalize.formatDate(new Date(2000, 10, 8), {date: 'medium'}).should.equal('Oct 8, 2000');
    Globalize.formatDate(new Date(2000, 10, 8), {date: 'long'}).should.equal('October 8, 2000');
    Globalize.formatDate(new Date(2000, 10, 8), {pattern: 'M/d/yyyy'}).should.equal('10/8/2000');
  });

  it('should format de dates', function(){
    Globalize.locale('de');    //year, month, day
    Globalize.formatDate(new Date(2000, 10, 8)).should.equal('08.10.00');
    Globalize.formatDate(new Date(2000, 10, 8), {date: 'short'}).should.equal('08.10.00');
    Globalize.formatDate(new Date(2000, 10, 8), {date: 'medium'}).should.equal('08.10.2000');
    Globalize.formatDate(new Date(2000, 10, 8), {date: 'long'}).should.equal('8. Oktober 2000');
    Globalize.formatDate(new Date(2000, 10, 8), {pattern: 'M.dd.yyyy'}).should.equal('10.08.2000');
  });

});
