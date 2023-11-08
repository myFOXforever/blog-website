// 传入文章url进行审核包括对审核结果的处理和返回
const {textAudit,imageAudit} = require("../service/contentCensorService");
const fileContent = require("../middleware/md-analysis");

const checkFile=async (fileUrl) => {
    const {imageUrls, textWithoutImages} = fileContent(fileUrl)
    console.log('textWithoutImages', textWithoutImages)
    console.log('imageUrl', imageUrls)
    // const textResult = await textAudit(textWithoutImages);
    // console.log('文本审核结果：', textResult);
    const textPromise = textAudit(textWithoutImages);

    const imagePromises = imageUrls.map(url => imageAudit(url));

    const [textResult, ...imageResults] = await Promise.all([textPromise, ...imagePromises]);
    console.log('文本审核结果：', textResult);
    const textPassed=(textResult.conclusionType===1);
    const imgAllPassed = imageResults.every(result => result.conclusionType === 1);//合格


    if (imgAllPassed&&textPassed) {
        console.log('审核合格');
        return {isPassed:true};
    } else {
        const combinedReasons = imageResults.map(result => result.data);
        const textReasons = textResult.data;
        console.log('审核不通过，原因：', combinedReasons,textReasons);
        return {isPassed:false,data:[{imgRes: combinedReasons}, {textRes: textReasons}]}
    }
}
// 审核评论
const checkComment=async (content)=>{
    const textRes = await textAudit(content);
    if (textRes.conclusionType===1){
        return {isPassed:true};
    }else {
        return {isPassed:false,data:textRes.data};
    }
}
module.exports={
    checkFile,
    checkComment,
}
