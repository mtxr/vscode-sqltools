module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), { targets: { node: 'current' }, modules: false }],
    require.resolve('@babel/preset-react'),
  ],
};
