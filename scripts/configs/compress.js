module.exports = {
  compress: {
    main: {
      options: {
        archive: 'dist.zip'
      },
      files: [
        {
          src: ['dist/**']
        }
      ]
    }
  }
};
