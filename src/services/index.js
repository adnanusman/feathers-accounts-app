const people = require('./people/people.service.js');
const balance = require('./balance/balance.service.js');
const activity = require('./activity/activity.service.js');
const categories = require('./categories/categories.service.js');
const entries = require('./entries/entries.service.js');
const source = require('./source/source.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(people);
  app.configure(balance);
  app.configure(activity);
  app.configure(categories);
  app.configure(entries);
  app.configure(source);
};
