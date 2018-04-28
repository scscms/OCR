//如果你会用photoShop软件就直接处理好图片在此识别，不需要安装依懒模块
const fs    = require('fs');
const exec  = require('child_process').exec;
/*
* img/code.jpg 获取不理想   img/code_deal.jpg 阈值处理后获取正常
* img/test.jpg 获取不到     img/test_deal.jpg 阈值处理后获取正常
* */
let imgPath = 'img/test.jpg';//识别图片文件
let options = {
    '-l': 'chi_sim',//语言包:eng英文（默认） chi_sim简体中文 chi_tra繁体中文
    '--psm': 6,//分页模式（可选）
};
let _file;//临时存储文件
do {
    _file = Math.random().toString().slice(-8)+'.txt';
}while(fs.existsSync(_file));
exec(`tesseract ${imgPath} ${_file.replace('.txt','')} ${Object.entries(options).map(a=>a.join(' ')).join(' ')}`, (err, stdout, stderr)=>{
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }
    fs.readFile(_file, 'utf8', function(err, data) {
        if (err) {
            console.error(`readFile error: ${err}`);
            return;
        }
        console.log(data.replace(/\s+/gm, ''));
        fs.unlink(_file,()=>{});
    });
});
