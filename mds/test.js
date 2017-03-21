/**
 * Created by Administrator on 2017/3/16.
 */

module.exports=function(num){
    var crypto=require("crypto");
    var md5=crypto.createHash("md5");
    md5.update(num);
    console.log("jiami")
    var result=md5.digest("hex");
    return result;

}