var options = ["feed流", "话题标题", "名单搜索"];
var i = dialogs.singleChoice("请选择运行模式", options);
if(i >= 0){
    toast("您选择的是" + options[i]);
}else{
    toast("您取消了选择");
}


// contains 可能有名字包含的情况，后面可以改下