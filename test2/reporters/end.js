/**
 * Just an extra reporter that adds some command-line text at the end of a test.
 * Used by our test harness to stop executables (Selenium/CMD)
 */
define([], function () {
  return {
    stop: function () {
      console.log('SoHo Xi Tests Completed!');
    }
  };
});
