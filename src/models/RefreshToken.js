const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    tokenHash: { type: DataTypes.STRING(64), allowNull: false },
    jti: { type: DataTypes.STRING(64), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
    replacedByTokenId: { type: DataTypes.UUID, allowNull: true },
  },
  {
    tableName: "refresh_tokens",
    indexes: [
      { fields: ["userId"] },
      { fields: ["tokenHash"], unique: true },
      { fields: ["jti"] },
    ],
  },
);

module.exports = { RefreshToken };
