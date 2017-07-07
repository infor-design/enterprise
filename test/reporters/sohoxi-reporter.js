define([
  'intern/dojo/node!../../../node_modules/colors',
  'intern/dojo/node!../../../node_modules/istanbul/lib/collector',
  'intern/dojo/node!../../../node_modules/istanbul/lib/report/text'
], function(colors, Collector, Reporter) {

  // Constants
  var PAD = new Array(100).join(' '),
    SPINNER_STATES = ['/', '-', '\\', '|'],
    PASS = 0,
    SKIP = 1,
    FAIL = 2,
    BROWSERS = {
      chrome: 'Chr',
      firefox: 'Fx',
      opera: 'O',
      safari: 'Saf',
      'internet explorer': 'IE',
      phantomjs: 'Phan'
    }/*,
    ASCII_COLOR = {
      red: encode('[31m'),
      green: encode('[32m'),
      yellow: encode('[33m'),
      cyan: encode('[36m'),
      reset: encode('[0m'),
    }*/;

  // Test
  function Test(groupname, description, result) {
    this._groupName = groupName;
    this._description = description;
    this._result = result;
  };

  Test.prototype = {
    groupName: function() {
      return this._groupName;
    },

    result: function() {
      return this._result;
    },

    description: function() {
      return this._description;
    },

    report: function() {
      return {
        'groupName': this._groupName,
        'result': this._result,
        'description': this._description
      };
    }
  };





  // Report Constructor
  function Report(environment, sessionId) {
    this._environment = environment;
    this._sessionId = sessionId;

    this.counters = {
      passed: 0,
      failed: 0,
      skipped: 0
    };

    this._results = [];
    this._coverage = new Collector();
  }

  Report.prototype = {

    record: function(test) {
      var result = test.report();
      this._results.push(result);
      this.tally(result);
    },

    reset: function() {
      if (!this.counters || typeof this.counters !== 'object') {
        this.counters = {};
      }

      this.counters.passed = 0;
      this.counters.failed = 0;
      this.counters.skipped = 0;
    },

    tally: function(results) {
      if (!results) { // If no results are passed in, re-tally everything.
        this.reset();
        results = this._results;
      }
      if (!(results instanceof [])) {
        results = [results];
      }

      for (var i = 0; i < results.length; i++) {
        switch(results[i].description) {
          case PASS:
            ++this.counters.passed;
            break;
          case SKIP:
            ++this.counters.skipped;
            break;
          case FAIL:
            ++this.counters.failed;
            break;
        }
      }
    },

    length: function() {
      return this._results.length;
    },

    results: function(useSimple) {
      if (useSimple) {
        return this._getSimpleResults();
      }
      return this._results;
    },

    _getSimpleResults: function() {
      return {
        total: this._results.length,
        passed: this.counters.passed,
        skipped: this.counters.skipped,
        failed: this.counters.failed
      };
    }

  };






  function SohoXiReporter(config) {
    config = config || {};

    this._console = config.console;
    this._output = config.output;

    this._collector = new Collector();
    this._reporter = new Reporter();
  }

  SohoXiReporter.prototype = {

    coverage: function(sessionId, coverage) {
      this._collector.add(coverage);
    },

    runStart: function() {

    },

    runEnd: function() {
      this._reporter.writeReporter(this._collector, true);
    },

    stop: function() {
      this._console.log('SoHo Xi Tests Completed!');
    },

  };

  return SohoXiReporter;

});
