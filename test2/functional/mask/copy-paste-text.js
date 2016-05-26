define([
    'intern!object',
    'intern/chai!expect',
    'intern/dojo/node!../../../node_modules/leadfoot/keys',
    'test2/support/key-helper',
    'require'
], function (registerSuite, expect, k, keyhelper, require) {

  'use strict';

  registerSuite({

    name: 'Mask (Copy/Paste)',

    setup: function() {
      return this.remote
        .get(require.toUrl('http://localhost:4000/tests/mask/copy-paste-text'))
          .setFindTimeout(5000)
          .setWindowSize(1024, 768);
    },

    'should properly format copy/pasted text': function() {
      var CTRL = keyhelper.systemControlKey(); // COMMAND or CONTROL, depending on the OS.
      var r = this.remote,
        browser = r.environmentType.browserName,
        platform = r.environmentType.platform;

      // NOTE: Bug in Selenium on Mac, ChromeDriver & SafariDriver prevents "command + [insert key here]" from working properly on a Mac
      // https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/8555
      // https://github.com/theintern/leadfoot/issues/42
      // https://bugs.chromium.org/p/chromedriver/issues/detail?id=30
      // Comment this test out when running on Chrome, Safari, MobileSafari, Android, etc
      if (browser === 'chrome' || browser === 'safari' || platform === 'MAC') {
        var condition = '';
        if (browser === 'chrome' || browser === 'safari') {
          condition += 'in ' + browser;
        }
        if (platform === 'MAC') {
          condition += (condition.length ? ' ' : '') + 'on Mac OS X';
        }
        condition += '.';

        this.skip('Due to known bugs, this test will never run ' + condition);
      }

      r.findById('copypasta');
        r.click();
        r.pressKeys([k.CONTROL, 'a', k.NULL]); // select all
        r.pressKeys([k.CONTROL, 'x', k.NULL]); // cut
        r.end();
      r.findById('phone-number');
        r.click();
        r.pressKeys([k.CONTROL, 'a', k.NULL]); // select all
        r.pressKeys([k.CONTROL, 'v', k.NULL]); // paste
        r.end();

      return r.findById('phone-number')
        .getProperty('value')
        .then(function(val) {
          expect(val).to.exist;
          expect(val).to.equal('(000) 00');
        });

        /*
        .findById('copypasta')
          .click()
          .pressKeys([CTRL, 'A', k.NULL]) // select all
          .pressKeys([CTRL, 'X', k.NULL]) // cut
          .end()
        .findById('phone-number')
          .click()
          .pressKeys([CTRL, 'A', k.NULL]) // select all
          .pressKeys([CTRL, 'V', k.NULL]) // paste
          .end()
        .takeScreenshot()
          .then(function(buffer) {
            expect(buffer).to.exist;
            fs.writeFileSync('copypasta-test.png', buffer, 'base64');
          })
          .end()
        .findById('phone-number')
          .getProperty('value')
          .then(function(val) {
            expect(val).to.exist;
            expect(val).to.equal('(000) 00');
          });
          */
    }

  });

});
