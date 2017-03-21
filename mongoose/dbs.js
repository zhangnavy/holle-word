var mongoose=require("mongoose");
mongoose.connect(require("../dbUrl").dbUrl)
var personSchema=new mongoose.Schema({
	username:String,
	email:String,
	addr:String,
	//用户注册的头像
	avatar:String	
})
var userModel=mongoose.model("user",personSchema);
var articleSchema= new mongoose.Schema({
	title:String,
	content:String,
	poster:String,
	pointer:Number,
	comment:Number,
	createAt:{
		type:Date,
		default:Date.now()
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"user"
	}
});
var articleModel=mongoose.model("article",articleSchema);

var reviewSchema=new mongoose.Schema({
	id:String,
	name:String,
	content:String,
	createData:{
		type:Date,
		default:Date.now()
	},
});
var reviewModel=mongoose.model("review",reviewSchema);
module.exports.reviewModel=reviewModel;
module.exports.userModel=userModel;
module.exports.articleModel=articleModel;
