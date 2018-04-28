let fs        = require('fs');
let gm        = require('gm');
let path      = require('path');
let request   = require('request');
let tesseract = require('node-tesseract');

//识别本地图片
IdentifyWords('img/test.jpg',70);

//识别网络图片
/*let url = 'http://www..../.jpg';
let _img = Math.random().toString().slice(-8)+'.jpg';
gm(request(url)).write(_img, (err)=>{
    if (!err) IdentifyWords(_img,200);
});*/

function IdentifyWords(file,thresholdVal=55) {
    let newPath = Math.random().toString().slice(-8)+file.substring(file.lastIndexOf('.'));
    new Promise((resolve, reject) => {
        gm(file).threshold(thresholdVal).write(newPath, (err) => {
            if (err) return reject(err);
            resolve(newPath);
        });
    }).then(img => {
        return new Promise((resolve, reject) => {
            tesseract.process(path.resolve(__dirname, img), {
                l: 'chi_sim',
                psm: 6
            }, (err, text) => {
                if (err) return reject(err);
                resolve(text.replace(/[\r\n\s]/gm, ''));
            });
        }).then(text => {
            fs.unlink(img,function(){});
            console.log(`识别结果:${text}`);
        });
    }).catch((err) => {
        console.error(`识别失败:${err}`);
    });
}
