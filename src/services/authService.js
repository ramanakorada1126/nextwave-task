const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { env } = require("../config/env");
const { RefreshToken, User } = require("../models");
const { randomToken, sha256Hex } = require("../utils/crypto");
const { ApiError } = require("../utils/apiError");

function signAccessToken(user) {
  return jwt.sign({ orgId: user.orgId, role: user.role }, env.JWT_ACCESS_SECRET, {
    subject: String(user.id),
    expiresIn: env.JWT_ACCESS_TTL_SECONDS
  });
}

function refreshExpiresAt() {
  const ms = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

async function issueRefreshToken(userId) {
  const raw = randomToken();
  const tokenHash = sha256Hex(raw);
  const tokenId = randomToken(24);

  const token = await RefreshToken.create({
    userId,
    tokenHash,
    tokenId,
    expiresAt: refreshExpiresAt(),
    revokedAt: null,
    replacedByTokenId: null
  });

  return { refreshToken: raw, refreshTokenId: token.id };
}

async function rotateRefreshToken(rawToken) {
  // console.log("rawToken",rawToken)
  const tokenHash = sha256Hex(rawToken);
  console.log(tokenHash)

  const existing = await RefreshToken.findOne({ where: { tokenHash } });

  if (!existing) throw new ApiError(401, "UNAUTHORIZED", "Invalid refresh token");

  if (existing.revokedAt) throw new ApiError(401, "UNAUTHORIZED", "Refresh token has been revoked");

  if (existing.expiresAt.getTime() <= Date.now()) throw new ApiError(401, "UNAUTHORIZED", "Refresh token has expired");


  const user = await User.findByPk(existing.userId);
  if (!user) throw new ApiError(401, "UNAUTHORIZED", "Invalid refresh token");

  const { refreshToken, refreshTokenId } = await issueRefreshToken(user.id);

  existing.revokedAt = new Date();
  existing.replacedByTokenId = refreshTokenId;
  await existing.save();

  return {
    accessToken: signAccessToken(user),
    refreshToken
  };
}

async function revokeRefreshToken(rawToken) {
  const tokenHash = sha256Hex(rawToken);
  const existing = await RefreshToken.findOne({ where: { tokenHash } });
  console.log(existing)
  if (!existing) return;
  if (!existing.revokedAt) {
    existing.revokedAt = new Date();
    await existing.save();
  }
}

async function revokeAllUserRefreshTokens(userId) {
  await RefreshToken.update(
    { revokedAt: new Date() },
    { where: { userId, revokedAt: { [Op.is]: null } } }
  );
}

module.exports = {
  issueRefreshToken,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
  rotateRefreshToken,
  signAccessToken
};
