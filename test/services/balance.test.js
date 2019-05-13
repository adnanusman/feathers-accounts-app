const assert = require('assert');
const app = require('../../src/app');

describe('\'balance\' service', () => {
  it('registered the service', () => {
    const service = app.service('balance');

    assert.ok(service, 'Registered the service');
  });
});
