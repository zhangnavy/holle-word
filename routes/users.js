var express = require('express');
var router = express.Router();
var auth=require("../usefn/auth.js");
var userModel=require("../mongoose/dbs").userModel;
var md5 = require("../mds/test");
/* GET users listing. */
/*注册 */
router.get("/reg",auth.checkNotLogin,function(req,res){
	res.render("user/reg",{title:"注册"})
})
router.post("/reg",auth.checkNotLogin,function(req,res){
	var userInfo=req.body;
	userInfo.avatar="http://secure.gravatar.com/avatar/" + userInfo.email + "?s=48";
	userInfo.email= md5(userInfo.email);
	var query={username:userInfo.username,email:userInfo.email,addr:userInfo.addr,avatar:userInfo.avatar}
	userModel.findOne(query,function(err,doc){
		if(!err){
			if(doc){
				req.flash("error","当前用户已注册，请更改用户名或密码")
				res.redirect("back")
			}else{
				userModel.create(query,function(err,doc){
					if(!err){
						req.flash("success","用户登录成功")
						res.redirect("/users/login")
					}else{
						req.flash("error","用户登录失败")
						res.redirect("back")
					}
	            })
			}
		}else{
			req.flash("读取数据库失败")
			res.redirect("back")
		}
	})
	
})
/*
* 登录页面*/
router.get("/login",auth.checkNotLogin,function(req,res){
	res.render("user/login",{title:"登录"})
})
router.post("/login",auth.checkNotLogin,function(req,res){
	var userInfo=req.body;

	userInfo.email=md5(userInfo.email);
    userModel.findOne(userInfo,function(err,doc){
		if(!err){
			if(doc){
				req.session.user=doc;
				req.flash("success","登录成功")
				res.redirect("/")
			}else{
				req.flash("error","请先注册")
				res.redirect("/users/reg")
			}
		}else{
			req.flash("error","数据获取失败")
			res.redirect("back")
		}
	})
})
router.get("/logout",auth.checkLogin,function(req,res){
	req.flash("success","成功")
	req.session.user=null;
	res.redirect("/")
})

module.exports = router;
