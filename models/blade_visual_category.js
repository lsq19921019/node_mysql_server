/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blade_visual_category', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    categoryKey: {
      type: DataTypes.STRING(12),
      allowNull: true,
      field: 'category_key'
    },
    categoryValue: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'category_value'
    },
    isDeleted: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: '0',
      field: 'is_deleted'
    }
  }, {
    tableName: 'blade_visual_category',
    
    timestamps: false
  });
};
