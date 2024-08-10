
let loopCount = 999; // 循环次数
let customMsg = "你好，我们致力于弘一法师拓片的制作，感觉你的作品和我们有很好的契合度，寻求合作机会，vx：17826697475";  // 自定义消息

const logDir = "/sdcard/脚本/微信/logs/";      // 日志目录
const sendedAccountsDir = "/sdcard/脚本/微信/sendedAccounts/"; // 已发送账号目录
const whiteListPath = "/sdcard/脚本/微信/whiteList.csv"; // 白名单文件
const searchAccountsPath = "/sdcard/脚本/微信/searchAccounts的副本.csv"; // 搜索账号名单文件


const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayStr = `-${year}-${month}-${day}`;
let whiteListContent = "";
let sendedAccountsContent = "";
//let searchAccounts = [];

auto.waitFor();
loopCount = dialogs.input("请输入循环次数", "999");
customMsg = dialogs.rawInput("请输入自定义消息", "你好，我们致力于弘一法师拓片的制作，感觉你的作品和我们有很好的契合度，寻求合作机会，vx：17826697475");
app.launch("com.tencent.mm");
CustomSleep(3,5,"启动微信中...");
console.info("微信启动成功");

let wechatAccountName =  getWechatAccountName();

// 创建log文件
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

//get/create searchAccounts file
const url = "http://139.9.61.95:5244/d/work/text.txt";
//读取这个url中的txt文件，并打印出第8到10行
var text = http.get(url).body.string();

//定义searchAccountsPath=text的1-50行
var searchAccounts = text.split("\n").slice(50, 100).join("\n");

let discoverTextView = className("android.widget.TextView").text("发现").findOne(5000);
discoverTextView.parent().parent().click();
CustomSleep(1,2,"点击发现...");

let obj = className("android.widget.TextView").text("视频号").findOne();
let clicked =  click(obj.bounds().centerX(), obj.bounds().centerY());
CustomSleep(1,2,"点击视频号...");

let searchImage = className("android.widget.ImageView").desc("搜索").findOne(10000);
press(searchImage.bounds().centerX(), searchImage.bounds().centerY(), 400);
console.log("pressed searchImage");
CustomSleep(2,3,"点击搜索...");

for (let i = 0; i < searchAccounts.length; i++) {
    if(i > loopCount){
        break;
    }
    if(sendedAccountsContent.includes(searchAccounts[i].trim())){
        console.log("已发送过该视频号，跳过");
        continue;
    }
    className("android.widget.EditText").waitFor();
    setText(0,searchAccounts[i].trim());
    CustomSleep(2,3,"输入搜索账号...");
    let searchBtn = className("android.widget.TextView").text("搜索").clickable().findOne(10000);
    searchBtn.click();
    CustomSleep(3.5,5.5,"点击搜索...");

    let accountBtn = className("android.view.View").textContains("帐号").clickable().findOne(10000);
    accountBtn.click();
    CustomSleep(2,3,"点击帐号...");

    let accountBar;
    for (let i = 0; i < 5; i++) {
        accountBar = className("android.view.View").textContains("帐号").clickable().findOnce(1);
        sleep(1000);
        if (accountBar) {
            break;
        }
    }   
    if (accountBar) {
        console.log("找到帐号栏");
        accountBar.click();
        CustomSleep(5.5,8.5,"等待视频号信息页加载...");
        let accountNameObj = id("com.tencent.mm:id/e5z").className("android.widget.TextView").findOne(10000);
        let accountName = accountNameObj.text();
        console.log("当前视频号名字: ",accountName);

        // skip whiteList and sendedAccounts
        if (sendedAccountsContent.includes(accountName)) {
            console.log("已经给这个账号发过了，跳过");
            let backBtn = className("android.widget.ImageView").desc("返回").findOne(5000);
            click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
            continue;
        }
        else if (whiteListContent.includes(accountName)) {
            console.log("白名单账号，跳过");
            let backBtn = className("android.widget.ImageView").desc("返回").findOne(5000);
            click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
            continue;
        }

        // 如果是公众号，就点击视频号再发消息
        let videoBtn = className("android.widget.TextView").textStartsWith("视频号").findOne(5000);

        if (videoBtn) {
            console.log("点击公众号的视频号...");
            videoBtn.click();
            CustomSleep(3.5,5.5,"等待公众号的视频号信息页加载...");
            sendMessage();
            // write to sendedAccounts file
            files.append(sendedAccountsPath, accountName + "\n");
            sendedAccountsContent += accountName + "\n";

            CustomSleep(3.5,5.5,"从公众号返回...");
            let backBtn = className("android.widget.ImageView").desc("返回").findOne(5000);
            click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
        } else {
            sendMessage();
            // write to sendedAccounts file
            files.append(sendedAccountsPath, accountName + "\n");
            sendedAccountsContent += accountName + "\n";
        }

        CustomSleep(2,3,"从视频号返回到短视频页...");
        className("android.widget.TextView").textStartsWith("视频号").findOne(20000);
        className("android.widget.TextView").textMatches(/私信|客服/).findOne(10000);
   
        let backBtn = className("android.widget.ImageView").desc("返回").findOne(5000);
        click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
    }else {
        console.log("没有找到帐号栏");
        continue;
    }

    
}

function sendMessage() {
    let messsageBtn = className("android.widget.TextView").textMatches(/私信|客服/).findOne().parent();

    messsageBtn.click();
    console.log("clicked messsageBtn");

    CustomSleep(3.5,5.5,"等待聊天页面加载...");

    // some account has a beginChatBtn
    let beginChatBtn = className("android.widget.TextView").text("发起聊天").clickable().findOne(5000);
    if (beginChatBtn) {
        beginChatBtn.click();
        console.log("clicked beginChatBtn");
        CustomSleep(2,3,"点击发起聊天等待聊天页面加载...");
    }

    let inputWidget = className("android.widget.FrameLayout").depth(20).findOne();
    click(inputWidget.bounds().centerX(), inputWidget.bounds().centerY());
    CustomSleep(1,2,"等待输入框加载...");

    setText(0,customMsg);

    let sendBtn = className("android.widget.Button").text("发送").findOne();
    sendBtn.click();
    CustomSleep(1,2,"发送消息...");

    let backBtn = className("android.widget.ImageView").desc("返回").findOne();
    click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
    CustomSleep(2,3,"从聊天页返回...");
}

function getWechatAccountName(){
    let discoverText = className("android.widget.TextView").text("我").findOne();

    discoverText.parent().parent().click();
    CustomSleep(2,3,"打开个人账号页面...");

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