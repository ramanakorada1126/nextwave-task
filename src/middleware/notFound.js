function notFound(_req, res) {
  return res.status(404).json({ status: 404, code: "NOT_FOUND", message: "Route not found" });
}

module.exports = { notFound };

