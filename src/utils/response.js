function send(res, { status = 200, message = "OK", data = null, ...extra } = {}) {
  return res.status(status).json({ status, message, data, ...extra });
}

module.exports = { send };

