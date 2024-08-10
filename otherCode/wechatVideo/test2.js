//拿到页面所有名字
let textviews = className("android.widget.TextView").text("文学自媒体").find();
console.log(textviews.length);
textviews.forEach(element => {

    let text = element.parent().parent().child(0).child(1).text();
    //console.log(text);
});
//过滤掉已有的名字

//往下拉动
//scrollDown();
swipe(500, 1000, 500, 500, 284)
swipe(500, 1000, 500, 500, 500)
swipe(500, 1000, 500, 500, 500)
swipe(500, 1000, 500, 500, 500)
swipe(500, 1000, 500, 500, 500)
swipe(500, 1000, 500, 500, 500)