let file = open('/sdcard/脚本/data.csv', 'w');
file.write('账号名称,认证类型,简介\n');

let uniqueTexts = new Set();

while (true) {
    // 检查是否找到了特定的控件
    let noMoreResults = className("android.widget.TextView").text("没有更多的搜索结果").findOne(1000);
    if (noMoreResults) {
        console.log("没有更多的搜索结果，结束脚本。");
        break;
    }

    let details = className("android.view.View").depth(23).find();

    for (let j = 0; j < details.length; j++) {
        let text = details[j].text();
        if (uniqueTexts.has(text)) {
            continue;
        }
        uniqueTexts.add(text);

        // 删除"帐号, "这部分
        text = text.replace('帐号, ', '');

        let parts = text.split(',');
        let accountName = parts[0] ? parts[0].split(' ')[0].trim() : '';
        let certificationType = parts[0] ? parts[0].split(' ')[1].trim() : '';
        let description = parts[1] ? parts[1].trim() : '';

        file.write(`"${accountName}","${certificationType}","${description}"\n`);
        console.log('获取到的账号名称: ' + accountName);
    }

    // 如果没有找到，滑动屏幕
    swipe(device.width / 2, device.height * 3 / 4, device.width / 2, device.height / 4, 500);

    // 等待随机的时间
    let waitTime = random(2000, 2500);
    sleep(waitTime);
}

file.close();