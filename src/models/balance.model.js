// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const balance = sequelizeClient.define('balance', {
    currentBal: {
      type: DataTypes.STRING,
      defaultValue: 0,
      allowNull: true
    },
    personId: {
      type: DataTypes.INTEGER,
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
  balance.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    balance.belongsTo(models.people)
  };

  return balance;
};
