if (!device.isScreenOn()) {
    // 唤醒设备
    device.wakeUp();
    // 等待屏幕亮起
    sleep(1000);
    // 滑动解锁（这里需要根据你的设备的解锁方式进行修改）
    swipe(device.width / 2, device.height - 100, device.width / 2, 0, 500);
    // 等待解锁
    sleep(1000);
}

// 在这里，你可以开始你的新脚本
let loopCount = 100; // 循环次数
//let customMsg = "你好，我是街拍小姐姐，希望能和你交个朋友，关注我吧！";  // 自定义消息

const logDir = "/sdcard/脚本/微信/logs/";      // 日志目录
const sendedAccountsDir = "/sdcard/脚本/微信/sendedAccounts/"; // 已发送账号目录
const whiteListPath = "/sdcard/脚本/微信/whiteList.csv"; // 白名单文件
const searchAccountsPath = "/sdcard/脚本/微信/searchAccounts.csv"; // 搜索账号名单文件

const searchAccountsUrl = "http://kilig.fun:5244/d/%E9%98%BF%E9%87%8C%E5%A4%87%E4%BB%BD%E7%9B%98/%E8%87%AA%E7%94%A8/alist/%E6%90%9C%E7%B4%A2%E8%B4%A6%E5%8F%B7%E5%90%8D%E5%8D%95.txt";  // 搜索账号名单文件
const whiteListUrl = "http://kilig.fun:5244/d/%E9%98%BF%E9%87%8C%E5%A4%87%E4%BB%BD%E7%9B%98/%E8%87%AA%E7%94%A8/alist/%E7%99%BD%E5%90%8D%E5%8D%95.txt";  // 白名单文件
const sendContentUrl = "http://kilig.fun:5244/d/%E9%98%BF%E9%87%8C%E5%A4%87%E4%BB%BD%E7%9B%98/%E8%87%AA%E7%94%A8/alist/%E6%96%87%E6%A1%88_%E5%A4%A7%E4%BC%97%E7%B1%BB%E7%9B%AE/1-1.txt"; //读取网络上的文案，发送五十条切换下一条

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayStr = `-${year}-${month}-${day}`;
let whiteListContent = "";
let sendedAccountsContent = "";
let searchAccounts = [];

auto.waitFor();
//loopCount = dialogs.input("请输入循环次数", "50");
//customMsg = dialogs.rawInput("请输入自定义消息", "你好，我是街拍小姐姐，希望能和你交个朋友，关注我吧！");
//app.launch("com.tencent.mm");

var w = floaty.rawWindow(
    <frame gravity="center" bg="#44ffcc00">
        <vertical>
            <text id="textCurrent" textSize="20sp" textColor="red">当前运行微信1</text>
            <text id="textSucces" textSize="20sp" textColor="red">成功发送条数:0</text>
            <text id="textSkip" textSize="20sp" textColor="red">跳过账号数:0</text>
            <text id="textInfo" textSize="16sp" textColor="red">悬浮文字</text>
        </vertical>
    </frame>
);

//CustomSleep(3,5,"启动微信中...");
//console.info("微信启动成功");
//
//app.launch("com.android.mms");
sleep(3000);
// 打开"最近任务"界面
recents();

// 等待一段时间，让"最近任务"界面加载完成
sleep(3000);

// 查找"清除任务"按钮
let clearButton = className("android.widget.RelativeLayout").id("clearbox").findOne(3000);

// 如果找到了"清除任务"按钮，就点击它的中心点
if (clearButton) {
    let x = clearButton.bounds().centerX();
    let y = clearButton.bounds().centerY();
    click(x, y);
}

// 等待一段时间，让清除任务的操作完成
sleep(2000);

// 清除任务后，回到主页
home();

// 等待一段时间，让主页加载完成
sleep(2000);

// 查找所有的微信图标
let wechatIcons = className("android.widget.TextView").text("微信").find();
// 如果找到了至少两个微信图标，就点击第二个
if (wechatIcons.length >= 2) {
    let secondWechatIcon = wechatIcons[1];
    //secondWechatIcon.click();
    //let clicked =  click(secondWechatIcon.bounds().centerX(), secondWechatIcon.bounds().centerY());
    press(secondWechatIcon.bounds().centerX(), secondWechatIcon.bounds().centerY(), 400);
    CustomSleep(3, 5, "启动微信中...");
    console.info("微信启动成功");
} else {
    let secondWechatIcon = wechatIcons[0];
    press(secondWechatIcon.bounds().centerX(), secondWechatIcon.bounds().centerY(), 400);
    CustomSleep(3, 5, "启动微信中...");
    console.info("微信启动成功");
}


//w.setSize(-1, -1);
w.setTouchable(false);

let wechatAccountName = getWechatAccountName();

// create log file
const logFilePath = logDir + wechatAccountName + todayStr + ".log";
if (!files.exists(logFilePath)) {
    const r = files.createWithDirs(logFilePath);
    console.log("创建log文件: ", r);
}
// get/create sendedAccounts file
const sendedAccountsPath = sendedAccountsDir + wechatAccountName + ".csv";
if (!files.exists(sendedAccountsPath)) {
    const re = files.createWithDirs(sendedAccountsPath);
    console.log("创建已发送账号文件： ", re);
} else {
    sendedAccountsContent = files.read(sendedAccountsPath);
    console.log("已发送视频号列表： ", sendedAccountsContent);
}
// files.append(sendedAccountsPath, "hello world\n");

/*
// get/create whiteList file
if(!files.exists(whiteListPath)){
    const ret = files.createWithDirs(whiteListPath);
    console.log("创建白名单文件： ", ret);
} else {
    whiteListContent =  files.read(whiteListPath);
    console.log("白名单： ",whiteListContent);
}

//get/create searchAccounts file
if(!files.exists(searchAccountsPath)){
    const retu = files.createWithDirs(searchAccountsPath);
    console.log("创建搜索账号文件： ", retu);
} else {
    let searchAccountsContent =  files.read(searchAccountsPath);
    console.log("搜索账号： ",searchAccountsContent);
    searchAccounts = searchAccountsContent.split("\n");
}
*/

//读取searchAccounts
let searchAccountsContentRes = http.get(searchAccountsUrl);
if (searchAccountsContentRes.statusCode != 200) {
    toast("获取搜索账号失败" + res.statusCode + "  " + res.statusMessage);
    exit();
}
searchAccounts = searchAccountsContentRes.body.string().split("\n").slice(0, 100);
//读取whiteList
let whiteListContentRes = http.get(whiteListUrl);
if (whiteListContentRes.statusCode != 200) {
    toast("获取白名单失败" + res.statusCode + "  " + res.statusMessage);
    exit();
}
whiteListContent = whiteListContentRes.body.string();

//读取sendContent
let sendContentsRes = http.get(sendContentUrl);
if (sendContentsRes.statusCode != 200) {
    toast("获取发送内容失败" + res.statusCode + "  " + res.statusMessage);
    exit();

}
let sendContents = sendContentsRes.body.string().split("\n");

let discoverTextView = className("android.widget.TextView").text("发现").findOne(5000);
discoverTextView.parent().parent().click();
CustomSleep(3.5, 5.5, "点击发现...");

let obj = className("android.widget.TextView").text("视频号").findOne();
let clicked = click(obj.bounds().centerX(), obj.bounds().centerY());
CustomSleep(3.5, 5.5, "点击视频号...");

let button = className("android.widget.Button").id("b1k").findOne(2000); // 尝试在1秒内找到按钮
if (button) { // 如果找到了按钮
    click(button.bounds().centerX(), button.bounds().centerY()); // 点击按钮的中心点
    CustomSleep(3.5, 5.5, "点击我知道了..."); // 等待一段时间
}

let searchImage = className("android.widget.ImageView").desc("搜索").findOne(10000);
press(searchImage.bounds().centerX(), searchImage.bounds().centerY(), 400);
console.log("pressed searchImage");
CustomSleep(3.5, 5.5, "点击搜索...");

let successCount = 0;

for (let i = 0; i < searchAccounts.length; i++) {
    if (i > loopCount) {
        break;
    }
    if (sendedAccountsContent.includes(searchAccounts[i].trim())) {
        console.log("已发送过该视频号，跳过");
        continue;
    }
    className("android.widget.EditText").waitFor();
    setText(0, searchAccounts[i].trim());
    CustomSleep(3.5, 5.5, "输入搜索账号...");
    let searchBtn = className("android.widget.TextView").text("搜索").clickable().findOne(5000);
    searchBtn.click();
    CustomSleep(3.5, 5.5, "点击搜索...");

    let accountBtn = className("android.view.View").textContains("账号").clickable().findOne(6000);
    accountBtn.click();
    CustomSleep(3.5, 5.5, "点击账号...");

    let accountBar;
    for (let i = 0; i < 5; i++) {

        accountBar = className("android.view.View").textContains("账号").clickable().findOnce(1);
        if (!accountBar) {
            accountBar = className("android.view.View").textContains("帐号").clickable().findOnce(0);
        }
        sleep(1000);
        if (accountBar) {
            break;
        }
    }
    if (accountBar) {
        console.log("找到账号栏");
        accountBar.click();
        CustomSleep(5.5, 8.5, "等待视频号信息页加载...");
        let accountNameObj = id("com.tencent.mm:id/fzn").className("android.widget.TextView").findOne(10000);
        //console.log(accountNameObj);
        let accountName = accountNameObj.text();
        console.log("当前视频号名字: ", accountName);

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
            CustomSleep(3.5, 5.5, "等待公众号的视频号信息页加载...");
            sendMessage();
            // write to sendedAccounts file
            files.append(sendedAccountsPath, accountName + "\n");
            sendedAccountsContent += accountName + "\n";

            CustomSleep(3.5, 5.5, "从公众号返回...");
            let backBtn = className("android.widget.ImageView").desc("返回").findOne(5000);
            click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
        } else {
            sendMessage();
            // write to sendedAccounts file
            files.append(sendedAccountsPath, accountName + "\n");
            sendedAccountsContent += accountName + "\n";
        }

        CustomSleep(3.5, 5.5, "从视频号返回到短视频页...");
        className("android.widget.TextView").textStartsWith("视频号").findOne(2000);
        className("android.widget.TextView").textMatches(/私信|客服/).findOne(2000);

        let backBtn = className("android.widget.ImageView").desc("返回").findOne(5000);
        click(backBtn.bounds().centerX(), backBtn.bounds().centerY());

        successCount++;
        ui.run(function () {
            w.textSucces.setText(`成功发送条数：${successCount}`);
            w.textSkip.setText(`跳过账号数：${i - successCount + 1}`);
            //w.textInfo.setText("当前账号");
        });
    } else {
        console.log("没有找到账号栏");
        continue;
    }


}

function sendMessage() {
    let messsageBtn = className("android.widget.TextView").textMatches(/私信|客服/).findOne().parent();

    messsageBtn.click();
    console.log("clicked messsageBtn");

    CustomSleep(3.5, 5.5, "等待聊天页面加载...");

    // some account has a beginChatBtn
    let beginChatBtn = className("android.widget.TextView").text("发起聊天").clickable().findOne(5000);
    if (beginChatBtn) {
        beginChatBtn.click();
        console.log("clicked beginChatBtn");
        CustomSleep(3.5, 5.5, "点击发起聊天等待聊天页面加载...");
    }

    let inputWidget = className("android.widget.FrameLayout").depth(20).findOne();
    click(inputWidget.bounds().centerX(), inputWidget.bounds().centerY());
    CustomSleep(3.5, 5.5, "等待输入框加载...");

    // 成功发送50次后，换一条消息
    setText(0, sendContents[successCount % sendContents.length]);

    let sendBtn = className("android.widget.Button").text("发送").findOne();
    sendBtn.click();
    CustomSleep(2.5, 4.5, "发送消息...");

    let backBtn = className("android.widget.ImageView").desc("返回").findOne();
    click(backBtn.bounds().centerX(), backBtn.bounds().centerY());
    CustomSleep(3.5, 5.5, "从聊天页返回...");
}

function getWechatAccountName() {
    let discoverText = className("android.widget.TextView").text("我").findOne();

    discoverText.parent().parent().click();
    CustomSleep(3.5, 5.5, "打开个人账号页面...");

    let accountTextView = className("android.widget.TextView").textContains("微信号").findOne();
    let wechatAccountName = accountTextView.text().split("：")[1];
    console.log("当前微信号id: ", wechatAccountName);
    return wechatAccountName;
}



//自定义延迟 
//minNum~maxNum：延迟范围 
//msg：提示消息 
//scroll：是否自动滚屏 
function CustomSleep(minNum, maxNum, msg, scroll) {
    ui.run(function () {
        w.textInfo.setText(msg);
    });
    console.info(msg);
    files.append(logFilePath, getDateTime() + "  ---------" + msg + "\n");
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
events.on('exit', function () {
    // 当脚本退出时执行的操作
    console.log("脚本已退出");
    // 可以在这里添加你想要执行的操作，例如保持悬浮窗显示
});

// 保持脚本持续运行
setInterval(() => { }, 1000);