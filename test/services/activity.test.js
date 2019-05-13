const assert = require('assert');
const app = require('../../src/app');

describe('\'activity\' service', () => {
  it('registered the service', () => {
    const service = app.service('activity');

    assert.ok(service, 'Registered the service');
  });
});
