/* eslint-disable no-multi-assign */
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

const $ = require('jquery');
const d3Obj = require('../node_modules/d3/dist/d3.min');

global.$ = $;
global.jQuery = $;
global.$.fn = $.prototype;

global.Soho = {
  modalManager: {
    destroyAll: () => {}
  }
};

global.d3 = d3Obj;

