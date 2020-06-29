/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blade_visual_config', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    visualId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'visual_id'
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'detail'
    },
    component: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'component'
    }
  }, {
    tableName: 'blade_visual_config',
    timestamps: false
  });
};
