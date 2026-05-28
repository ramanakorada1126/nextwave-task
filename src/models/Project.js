const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orgId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(140), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "projects",
    indexes: [{ fields: ["orgId"] }, { fields: ["name"] }],
  },
);

module.exports = { Project };
