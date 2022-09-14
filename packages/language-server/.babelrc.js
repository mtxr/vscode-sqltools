module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: '14',
        },
      },
    ],
  ],
  // plugins: [
  //   require.resolve('@babel/plugin-proposal-object-rest-spread'),
  //   require.resolve('@babel/plugin-transform-spread'),
  // ],
};
