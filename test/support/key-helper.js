define([
  'os',
  'process',
  'intern/dojo/node!../../../node_modules/leadfoot/keys'
], function(os, process, k) {

  'use strict';

  return {
    systemControlKey: function() {
      return (os.platform() === 'darwin' && process.env.TEST_BROWSER !== 'phantomjs') ? k.COMMAND : k.CONTROL;
    }
  };

});
