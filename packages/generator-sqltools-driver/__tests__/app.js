'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-sqltools-driver:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ displayName: 'My Cool Driver' })
      .withPrompts({ name: 'my-cool-driver' })
      .withPrompts({ description: 'My Cool Driver for SQLTools' });
  });

  it('creates files', () => {
    // assert.file(['dummyfile.txt']);
  });
});
