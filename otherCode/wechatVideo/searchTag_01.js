
let loopCount = 10; // 循环次数
let customMsg = "你好，我是街拍小姐姐，希望能和你交个朋友，关注我吧！";  // 自定义消息
let searchTag = "#街拍"; // 搜索标签

const logDir = "/sdcard/脚本/微信/logs/";      // 日志目录
const sendedAccountsDir = "/sdcard/脚本/微信/sendedAccounts/"; // 已发送账号目录
const whiteListPath = "/sdcard/脚本/微信/whiteList.csv"; // 白名单文件


const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayStr = `-${year}-${month}-${day}`;
let whiteListContent = "";
let sendedAccountsContent = "";

auto.waitFor();
loopCount = dialogs.input("请输入循环次数", "10");
customMsg = dialogs.rawInput("请输入自定义消息", "你好，我是街拍小姐姐，希望能和你交个朋友，关注我吧！");
searchTag = dialogs.rawInput("请输入搜索标签tag", "#街拍");
app.launch("com.tencent.mm");
CustomSleep(1,2,"启动微信中...");
console.info("微信启动成功");

let wechatAccountName =  getWechatAccountName();

// create log file
const logFilePath = logDir + wechatAccountName + todayStr + ".log";
if(!files.exists(logFilePath)){
    const r = files.createWithDirs(logFilePath);
    console.log("创建log文件: ", r);
}
// get/create sendedAccounts file
const sendedAccountsPath = sendedAccountsDir + wechatAccountName +".csv";
if(!files.exists(sendedAccountsPath)){
    const re = files.createWithDirs(sendedAccountsPath);
    console.log("创建已发送账号文件： ", re);
} else {
    sendedAccountsContent =  files.read(sendedAccountsPath);
    console.log("已发送视频号列表： ",sendedAccountsContent);
}
// files.append(sendedAccountsPath, "hello world\n");

// get/create whiteList file
if(!files.exists(whiteListPath)){
    const ret = files.createWithDirs(whiteListPath);
    console.log("创建白名单文件： ", ret);
} else {
    whiteListContent =  files.read(whiteListPath);
    console.log("白名单： ",whiteListContent);
}

let discoverTextView = className("android.widget.TextView").text("发现").findOne();
discoverTextView.parent().parent().click();
CustomSleep(0.5,1.5,"点击发现...");

let obj = className("android.widget.TextView").text("视频号").findOne();
let clicked =  click(obj.bounds().centerX(), obj.bounds().centerY());
CustomSleep(0.5,1.5,"点击视频号...");

let searchImage = className("android.widget.ImageView").desc("搜索").findOne(4000);
press(searchImage.bounds().centerX(), searchImage.bounds().centerY(), 400);
console.log("pressed searchImage");
className("android.widget.EditText").waitFor();
setText(0, searchTag);
CustomSleep(0.5,1.5,"输入搜索标签...");
let searchBtn = className("android.widget.TextView").text("搜索").clickable().findOne(5000);
searchBtn.click();
CustomSleep(0.5,1.5,"点击搜索按钮...");
let videoView = className("android.view.View").textContains("播放").clickable().findOne(5000);
videoView.click();

for (let i = 0; i < loopCount; i++) {
    CustomSleep(0.5,1.5,"等待短视频页面加载...");
    let liveChannel = className("android.widget.TextView").depth(22).clickable().findOne(2000);
    if(liveChannel) {
        console.log("直播间名称:  ",liveChannel.text());
        // skip whiteList and sendedAccounts
        if (sendedAccountsContent.includes(liveChannel.text())) {
            console.log("已经给这个账号发过了，跳过");
            scrollDown();
            continue;
        }
        if (whiteListContent.includes(liveChannel.text())) {
            console.log("白名单账号，跳过");
            scrollDown();
            continue;
        }
        click(liveChannel.bounds().centerX(), liveChannel.bounds().centerY());
        console.log("点击直播间头像...");
        CustomSleep(0.5,1.5,"等待直播号信息页加载...");
        sendMessage();
        // write to sendedAccounts file
        files.append(sendedAccountsPath, liveChannel.text() + "\n");
        sendedAccountsContent += liveChannel.text() + "\n";
    } 

    //let accountTextView = id("com.tencent.mm:id/bh6").className("android.widget.TextView").depth(21).clickable().findOne(2000);
    // TODO tag 的 depth 是 20
    let accountTextView = className("android.widget.TextView").depth(20).clickable().find().filter(
        function (item) {
            if(item.bounds){
                return item.bounds().centerX() > 10 && item.bounds().centerY() < device.height - 10;
            }
        }
    );
    if(accountTextView.length === 0) {
        console.log("没有找到视频号，向下滑动...");
        scrollDown();
        continue;
    }
    let accountName = accountTextView[0].text();
    console.log("当前视频号名字: ",accountName);
    // skip whiteList and sendedAccounts
    if (sendedAccountsContent.includes(accountName)) {
        console.log("已经给这个账号发过了，跳过");
        scrollDown();
        continue;
    }
    if (whiteListContent.includes(accountName)) {
        console.log("白名单账号，跳过");
        scrollDown();
        continue;
    }
    
    click(accountTextView[0].bounds().centerX(), accountTextView[0].bounds().centerY());
    console.log("clicked accountName");
    CustomSleep(0.5,1.5,"等待视频号信息页加载...");

    // 如果是公众号，就点击视频号再发消息
    let videoBtn = className("android.widget.TextView").textStartsWith("视频号").findOne(2000);

    if (videoBtn) {
        console.log("点击公众号的视频号...");
        videoBtn.click();
        CustomSleep(0.5,1.5,"等待公众号的视频号信息页加载...");
        sendMessage();
        // write to sendedAccounts file
        files.append(sendedAccountsPath, accountName + "\n");
        sendedAccountsContent += accountName + "\n";

        CustomSleep(0.5,1.5,"从公众号返回...");
        let backBtn = className("android.widget.ImageView").desc("返回").findOne(1000);
        click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
    } else {
        sendMessage();
        // write to sendedAccounts file
        files.append(sendedAccountsPath, accountName + "\n");
        sendedAccountsContent += accountName + "\n";
    }

    CustomSleep(0.5,1.5,"从视频号返回到短视频页...");
    className("android.widget.TextView").textStartsWith("视频号").findOne(2000);
    className("android.widget.TextView").textMatches(/私信|客服/).findOne(2000);
    click(557,335);
    CustomSleep(0.5,1.5,"从视频号返回到短视频页...");
    click(557,335);
    CustomSleep(0.5,1.5,"滑动下一个视频...");
    scrollDown();
}

function sendMessage() {
    let messsageBtn = className("android.widget.TextView").textMatches(/私信|客服/).findOne().parent();

    messsageBtn.click();
    console.log("clicked messsageBtn");

    CustomSleep(0.5,1.5,"等待聊天页面加载...");

    // some account has a beginChatBtn
    let beginChatBtn = className("android.widget.TextView").text("发起聊天").clickable().findOne(1000);
    if (beginChatBtn) {
        beginChatBtn.click();
        console.log("clicked beginChatBtn");
        CustomSleep(0.5,1.5,"点击发起聊天等待聊天页面加载...");
    }

    let inputWidget = className("android.widget.FrameLayout").depth(20).findOne();
    click(inputWidget.bounds().centerX(), inputWidget.bounds().centerY());
    CustomSleep(0.5,1.5,"等待输入框加载...");

    setText(0,customMsg);

    let sendBtn = className("android.widget.Button").text("发送").findOne();
    //sendBtn.click();
    CustomSleep(0.5,1.5,"发送消息...");

    let backBtn = className("android.widget.ImageView").desc("返回").findOne();
    click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
    CustomSleep(0.5,1.5,"从聊天页返回...");
}

function getWechatAccountName(){
    let discoverText = className("android.widget.TextView").text("我").findOne();

    discoverText.parent().parent().click();
    CustomSleep(0.5,1.5,"打开个人账号页面...");

    let accountTextView = className("android.widget.TextView").textContains("微信号").findOne();
    let wechatAccountName = accountTextView.text().split("：")[1];
    console.log("当前微信号id: ",wechatAccountName);
    return wechatAccountName;
}



//自定义延迟 
//minNum~maxNum：延迟范围 
//msg：提示消息 
//scroll：是否自动滚屏 
function CustomSleep(minNum, maxNum, msg, scroll) { 
    console.info(msg); 
    files.append(logFilePath, getDateTime() +"  ---------"+ msg + "\n");
    if (maxNum > 0 && maxNum >= minNum) { 
        var sleeptimes = parseInt(random(minNum * 1000, maxNum * 1000), 10); 
        var tick = 1000; 
        if (sleeptimes > tick) { 
            for (var i = 0; i < sleeptimes; i += tick) { 
                console.verbose("……【" + (100 - parseInt((sleeptimes - i) * 100 / (sleeptimes), 10)) + "%】……"); 
                var sleeptick = Math.min(tick, sleeptimes - i); 
                sleep(sleeptick); 
                if (scroll && i % 3 == 1) scrollDown(); 
            } 
        } 
        else { 
            sleep(sleeptimes); 
            if (scroll) scrollDown(); 
        } 
        console.verbose("……【100%】……"); 
    } 
} 

function getDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const nowStr = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return nowStr;
}