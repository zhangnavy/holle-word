var express = require('express');
var markdown=require("markdown").markdown;
auth=require("../usefn/auth.js");
var reviewModel=require("../mongoose/dbs").reviewModel;
var router = express.Router();
var articleModel=require("../mongoose/dbs").articleModel;
/*主页面展现*/
router.get('/', function(req, res) {
	var keyword=req.query.keyword;
	req.session.keyword=keyword;
	var query={};
	if(keyword){
		var reg = new RegExp(keyword,"i");
		query={$or:[{title:reg},{content:reg}]};
	}
	var pageNum=parseInt(req.query.pageNum) || 1;
	var pageSize=parseInt(req.query.pageSize) || 4;
	
  articleModel.find(query).skip((pageNum-1)*pageSize).limit(pageSize).populate("user").exec(function(err,doc){
    if(!err){
       req.flash("success","获取列表信息成功");
       doc.forEach(function(sum,index){
       	   doc.content = markdown.toHTML(sum.content)
       })
       articleModel.count(query,function(err,count){
       	if(!err){
       		 res.render("index",{
       		 	          title:"文章列表",
       		 	          article:doc,
       		 	          keyword:keyword,
       		 	          pageNum:pageNum,
       		 	          pageSize:pageSize,
       		 	          totalPage:Math.ceil(count/pageSize),
       		 })
       	}else{
       		req.flash("error","获取总条数失败");
            res.redirect("back");
       	}
      })
    }else{
      req.flash("error","获取数据失败");
      res.redirect("back");
    }
  })
});
/*点赞*/
var idp="";
router.get("/praise",auth.checkLogin,function(req,res){
	var id=req.query.pointer;
	if(id != idp){
		idp=id;
		articleModel.findById(id,function(err,doc){
		if(!err){
			articleModel.update(doc,{$set:{pointer:parseInt(doc.pointer) + 1}},function(err,succ){
				if(!err){
					req.flash("success","点赞成功");
					res.redirect("/");
				}else{
					req.flash("error","点赞没成");
					res.redirect("/");
				}
			})
		}else{
			req.flash("error","点赞失败");
			res.redirect("/");
		}
	    })
	}else{
		req.flash("error","您已经点过");
		res.redirect("/");
	}
	
})
/*评论主页*/
router.get("/review",auth.checkLogin,function(req,res){
	var id=req.query.id;
	articleModel.findById(id).populate("user").exec(function(err,doc){
		if(!err){
			reviewModel.find({id:id},function(err,info){
				if(!err){
					var totalReview=info.length;
					req.flash("success","跳跃成功");
					res.render("article/review",{title:"评论页面",article:doc,review:info,totalReview:totalReview})
				}else{
					req.flash("error","评论失败");
					res.redirect("back");
				}
			})

		}else{
			req.flash("error","跳跃失败");
			res.redirect("/");
		}
	})
})
/*提交评论*/
router.post("/review",function(req,res){
	var review=req.body;
	review.name=req.session.user.username;
	review.createData=Date.now();
	console.log(review);
    reviewModel.create(review,function(err,doc){
		if(!err){
			req.flash("success","创建成功");
			res.redirect("/review?id=" + review.id);
		}else{
			req.flash("error","创建失败");
			res.redirect("back");
		}
	})


})
/*详情*/
router.get("/detail",function(req,res){
	console.log(req.query);
	req.flash("success","详情成功");
	res.redirect("/");
})
module.exports = router;
