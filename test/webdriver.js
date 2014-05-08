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
    .url('http://usmvvwdev67.infor.com:4000/')  //to do - start selenuim locally..
    .getTitle(function(err, title) {
      expect(err).to.be.null;
      assert.strictEqual(title, 'Infor Html Controls - Gramercy Park');
    })
    .getElementSize('#country-shdo', function(err, result) {
      expect(err).to.be.null;
      assert.strictEqual(result.height , 48);
    })
    /*.getElementCssProperty('css selector','a[href="/plans"]', 'color', function(err, result){
      expect(err).to.be.null;
      assert.strictEqual(result, 'rgba(65,131,196,1)');
    })*/
    .call(done);
  });

  after(function(done) {
    client.end(done);
  });
});
