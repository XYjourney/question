var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var resStruct = require('./../helper/resStruct');

router.post('/signup',
    passport.authenticate('local.signup',{
        failureFlash:true
    }),function(req,res,next){
        res.json(resStruct({
            retCode: '200',
            retDesc: '注册成功',
            ret: true
          }))
});

router.post('/login',
    passport.authenticate('local.login',{
        failureFlash:true
    }),function(req,res){
        res.json(resStruct({
            retCode: '200',
            retDesc: '登陆成功',
            ret: true
          }))
});
module.exports = router;