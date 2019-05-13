// Initializes the `entries` service on path `/entries`
const createService = require('feathers-sequelize');
const createModel = require('../../models/entries.model');
const hooks = require('./entries.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/entries', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('entries');

  service.hooks(hooks);
};
