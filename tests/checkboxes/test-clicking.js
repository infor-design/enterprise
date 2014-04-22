module.exports = {
'Page title is correct': function (test) {
  test
    .open('http://localhost:4000')
    .assert.title().is('Infor Html Controls - Gramercy Park', 'It has title')
    .screenshot('test/screenshots/phantomjs.png')
    .done();
},
'Checkbox Is Checked': function (test) {
  test
    .open('http://localhost:4000')
    .assert.selected('#checkbox2')
    .type('#inputStandard', '\uE00D Test \uE00D Test')
    .screenshot('test/screenshots/phantomjs.png')
    .assert.width('#checkbox2').is(15)
    .done();
}
};