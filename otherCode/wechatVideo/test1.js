//请求横屏截图
requestScreenCapture(false);
sleep(2000);
//截图
var img = captureScreen();

let clip = images.clip(img,248, 362, 570, 1900);


let res = paddle.ocr(clip);
console.log(JSON.stringify(res));

swipe(500, 1000, 500, 500, 500);
swipe(500, 1000, 500, 500, 500);
swipe(500, 1000, 500, 500, 500);
swipe(500, 1000, 500, 500, 500);

sleep(2000);

img = captureScreen();
clip = images.clip(img,248, 362, 570, 1900);
res = paddle.ocr(clip);
console.log(JSON.stringify(res));




