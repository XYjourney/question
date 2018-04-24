module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/index.html#/admin/login')
  }
}
module.exports.delNull = function (obj) {
  var result = {}
  for (let i in obj) {
    if (obj[i] || obj[i] === 0) {
      result = {...result, i: obj[i]}
    }
  }
  return result
}

module.exports.getClientIp = function (req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
}

