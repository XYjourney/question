const record = require('./record')
const admin = require('./admin')
var express = require('express')
var router = express.Router()
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/index.html#/admin/login')
  }
}
router.get('/',function(req,res){
  res.redirect('/index.html#/');
});
module.exports = function(app) {
  app.use('/', router);
  app.use('/admin', admin);
  app.use('/record', record);
}
