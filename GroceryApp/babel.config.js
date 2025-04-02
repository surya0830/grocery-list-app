module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      '@babel/plugin-transform-runtime'
    ],
    overrides: [
      {
        test: './node_modules/react-native/Libraries/vendor/emitter/EventEmitter.js',
        plugins: [
          '@babel/plugin-transform-flow-strip-types'
        ]
      },
      {
        test: './node_modules/react-native/Libraries/',
        plugins: [
          '@babel/plugin-transform-flow-strip-types'
        ]
      },
      {
        test: './node_modules/@azure/storage-blob/',
        plugins: [
          '@babel/plugin-transform-flow-strip-types'
        ]
      }
    ]
  };
}; 