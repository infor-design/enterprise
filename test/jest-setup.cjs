/* eslint-disable no-multi-assign */
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

const $ = require('jquery');

global.$ = $;
global.jQuery = $;
global.$.fn = $.prototype;
