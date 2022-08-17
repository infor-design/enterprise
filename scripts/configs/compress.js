export default {
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
