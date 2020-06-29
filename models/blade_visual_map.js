/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blade_visual_map', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'blade_visual_map',
    timestamps: false
  });
};
