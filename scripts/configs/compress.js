module.exports = {

  compress: {
    main: {
      options: {
        archive: 'dist/all.zip'
      },

      files: [
        {src: ['dist/**'], dest: 'dist/'}
      ]
    }
  }

};
