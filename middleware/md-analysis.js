// markdown文件解析
const fs = require('fs');



module.exports=(filePath)=>{
    // 读取Markdown文件内容
    const markdownContent =fs.readFileSync(filePath, 'utf-8');
// 使用Markdown解析库解析Markdown内容
    // 正则表达式来匹配图片地址
    const imgRegex = /(http|https):\/\/.*\.(jpg|jpeg|png|gif|bmp)/gi;
    const imageUrls = markdownContent.match(imgRegex) || [];
    // 提取非图片文本
    const textWithoutImages = markdownContent.replace(imgRegex, '');
    return {imageUrls,textWithoutImages}
}
