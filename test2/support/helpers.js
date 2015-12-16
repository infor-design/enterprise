define([
], function() {

  'use strict';

  // Helper methods for tests that assist with async, etc.

  return {

    sleep: function(ms) {
      var dfd = new Promise.Deferred();
      setTimeout(function() {
        dfd.resolve();
      }, ms);
      return dfd.promise();
    }

  };

});
