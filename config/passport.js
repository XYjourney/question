var passport = require('passport');

var User = require("../models/user.js");
var localStategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user.id);
});                           


passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.signup',new localStategy({
        usernameField:'username',
        passwordField:'password',
        passReqToCallback:true  //此处为true，下面函数的参数才能有req
    },function(req,user,password,done){
        User.findOne({'username':user},function(err,user){
            if(err){
                return done(err);
            }
            if(user){
                return done(null,false,{message:"此名称已经被注册"});
            }
            var newUser = new User();
            newUser.username = user;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function(err,result){
                if(err){
                    return done(err);
                }
                return done(null,newUser);
            });
        });
}));



passport.use('local.login',new localStategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true  //此处为true，下面函数的参数才能有req
},function(req,user,password,done){
    User.findOne({'username':user},function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false,{message:"用户名错误!"});
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:"密码错误!"});
        }
        return done(null,user);
    });
}));

module.exports = passport
