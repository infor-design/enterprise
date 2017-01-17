module.exports = {

  md2html: {
    changelog: {
      options: {
        // Task-specific options go here.
      },
      files: [{
        src: ['CHANGELOG.md'],
        dest: 'views/docs/changelog-contents.html'
      }]
    }
  }

};
