const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
