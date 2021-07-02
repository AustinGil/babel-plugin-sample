import myBabelPlugin from 'my-awesome-package/babel-plugin.js';

export default {
  presets: [['@babel/env']],
  plugins: [
    myBabelPlugin({
      variables: {
        size4: '.25rem',
      },
      classes: {
        btn: {
          padding: '10px',
          borderRadius: '1000px',
          background: 'blue',
        },
      },
    }),
  ],
};
