const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");
const { Roles } = require("../config/constants");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orgId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM(...Roles),
      allowNull: false,
      defaultValue: "MEMBER",
    },
  },
  {
    tableName: "users",
    indexes: [{ fields: ["orgId"] }, { fields: ["role"] }],
  },
);

module.exports = { User };
