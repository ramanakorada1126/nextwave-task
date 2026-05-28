const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(120), allowNull: false },
  },
  {
    tableName: "organizations",
    indexes: [{ fields: ["name"] }],
  },
);

module.exports = { Organization };
