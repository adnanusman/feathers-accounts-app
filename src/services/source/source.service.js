// Initializes the `source` service on path `/source`
const createService = require('feathers-sequelize');
const createModel = require('../../models/source.model');
const hooks = require('./source.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/source', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('source');

  service.hooks(hooks);
};
