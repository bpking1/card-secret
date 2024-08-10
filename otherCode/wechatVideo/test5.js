// 查找所有的微信图标
let wechatIcons = className("android.widget.TextView").text("微信").find();
console.log(wechatIcons);
// 如果找到了至少两个微信图标，就点击第二个
if (wechatIcons.length >= 2) {
    console.log('2222222222222222222222222222222')
    let secondWechatIcon = wechatIcons[1];
    //secondWechatIcon.click();
    //let clicked =  click(secondWechatIcon.bounds().centerX(), secondWechatIcon.bounds().centerY());
    press(secondWechatIcon.bounds().centerX(), secondWechatIcon.bounds().centerY(), 400);
    console.info("微信启动成功");
} else {
    let secondWechatIcon = wechatIcons[0];
    press(secondWechatIcon.bounds().centerX(), secondWechatIcon.bounds().centerY(), 400);
    console.info("微信启动成功");
}