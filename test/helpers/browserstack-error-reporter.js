const r2 = require('r2');

const browserStackErrorHTTPReporter = async (error) => {
  if (process.argv.filter(item => item.includes('bs.conf')).length > 0) {
    const username = process.env.BROWSERSTACK_USERNAME;
    const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
    const session = await browser.driver.getSession();
    const sessionId = session.getId();
    const url = `https://${username}:${accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`;
    const obj = {
      status: 'error',
      reason: error.description
    };

    try {
      await r2.put(url, { json: obj }).json;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }
};

const browserStackErrorReporter = {
  async specDone(result) {
    if (result.failedExpectations.length) {
      await browserStackErrorHTTPReporter(result);
    }
  }
};

module.exports.browserStackErrorReporter = browserStackErrorReporter;
