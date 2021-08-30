import myBabelPlugin from 'my-awesome-package/babel-plugin.cjs';

export default {
  presets: [['@babel/env']],
  plugins: [
    myBabelPlugin({
      variables: {
        size2: '.125rem',
        size4: '.25rem',
        bp1: '@media screen and (min-width: 480px)',
      },
      classes: {
        btn: {
          padding: '10px',
          borderRadius: '1000px',
          background: '#000',
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
    }),
  ],
};
