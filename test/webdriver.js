var chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    app = require('../app'),
    webdriverjs = require('webdriverjs');

describe('tests using webdriverjs', function(){
  var server, client = {};
  this.timeout(99999999);

  //Start Server - Make a Web Driver Connection
  before(function(){
    client = webdriverjs.remote({
      host: 'usmvvwdev67.infor.com',
      port: 4444});

    client.init();

    app.locals.enableLiveReload = false;
    server = app.listen(3001);
  });

  //Shut Down Local Server
  after(function() {
    server.close();
  });

  it('Select Tests',function(done) {
    client
    .url('http://107.170.15.202:4000//')  //to do - start selenuim locally..
    .getTitle(function(err, title) {
      expect(err).to.be.null;
      assert.strictEqual(title, 'Infor Html Controls - Gramercy Park');
    })
    .getElementSize('#states-shdo', function(err, result) {
      expect(err).to.be.null;
      assert.strictEqual(result.height , 45);
    })
    .call(done);
  });

  after(function(done) {
    client.end(done);
  });
});
