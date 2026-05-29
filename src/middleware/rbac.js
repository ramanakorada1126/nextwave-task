function authorizeRoles(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({ status: 401, code: "UNAUTHORIZED", message: "Not authenticated" });
    }
    if (!roles.includes(role)) {
      return res.status(403).json({ status: 403, code: "FORBIDDEN", message: "Insufficient permissions" });
    }
    return next();
  };
}

module.exports = { authorizeRoles };

