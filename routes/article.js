var express = require('express');
var multer=require("multer");
var router = express.Router();
var auth=require("../usefn/auth.js");
var articleModel=require("../mongoose/dbs").articleModel;
var storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'../public/image')//上传图片的保存的路径地址
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)//上传图片后图片的名字等于原来的图片名字，
	}
})
var upload=multer({storage:storage})



router.get('/add',auth.checkLogin, function(req, res) {
  res.render("article/add",{title:"发表文章"});
});
router.post('/add',auth.checkLogin,upload.single("poster"), function(req, res) {
  var articleInfo=req.body;
  if(req.file){
     articleInfo.poster="/image/" + req.file.filename
  }
  articleInfo.cteateAt=Date.now();
  articleInfo.pointer=0;
  articleInfo.comment=0;
  articleInfo.user=req.session.user._id;
  articleModel.create(articleInfo,function(err,doc){
    if(!err){
       req.flash("success","创建成功");
      res.redirect("/")
    }else{
      req.flash("error","创建失败")
      res.redirect("back")
    }
  })
});


module.exports = router;