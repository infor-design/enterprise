module.exports = {

  run: {
    documentation: {
      options: {
        wait: false
      },
      cmd: 'npm',
      args: [
        'run',
        'documentation'
      ]
    },
    build: {
      options: {
        wait: true
      },
      cmd: 'npm',
      args: [
        'run',
        'build'
      ]
    }
  }

};
