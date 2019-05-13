// Initializes the `balance` service on path `/balance`
const createService = require('feathers-sequelize');
const createModel = require('../../models/balance.model');
const hooks = require('./balance.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/balance', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('balance');

  service.hooks(hooks);
};
