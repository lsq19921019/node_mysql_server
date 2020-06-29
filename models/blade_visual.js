/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blade_visual', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    backgroundUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'background_url'
    },
    category: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createUser: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'create_user'
    },
    createDept: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'create_dept'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'create_time'
    },
    updateUser: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'update_user'
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'update_time'
    },
    status: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      field: 'is_deleted'
    }
  }, {
    tableName: 'blade_visual',
    timestamps: false
  });
};
