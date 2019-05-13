// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const entries = sequelizeClient.define('entries', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.STRING
    },
    personId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'people',
        key: 'id'
      }
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  entries.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    entries.belongsTo(models.people);
    entries.belongsTo(models.categories);
  };

  return entries;
};
