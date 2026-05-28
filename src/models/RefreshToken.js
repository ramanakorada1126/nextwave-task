const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tokenHash: { type: DataTypes.STRING(64), allowNull: false },
    tokenId: { type: DataTypes.STRING(64), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
    replacedByTokenId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  },
  {
    tableName: "refresh_tokens",
    indexes: [
      { fields: ["userId"] },
      { fields: ["tokenHash"], unique: true },
      { fields: ["tokenId"] },
    ],
  },
);

module.exports = { RefreshToken };
