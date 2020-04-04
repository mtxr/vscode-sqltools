module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: '8',
        },
      },
    ],
  ],
  // plugins: [
  //   require.resolve('@babel/plugin-proposal-object-rest-spread'),
  //   require.resolve('@babel/plugin-transform-spread'),
  // ],
};
