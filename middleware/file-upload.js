const multer = require('multer');

// 设置 Multer 中间件
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            // 设置文件存储路径，例如 'uploads/'
            try {
                let uploadPath = 'upload/';

                if (file.mimetype.startsWith('image')) {
                    uploadPath += 'avatar/';
                } else if (file.mimetype === 'text/markdown') {
                    uploadPath += 'md/';
                } else {
                    uploadPath += 'other/'; // 存放其他类型的文件
                }

                cb(null, uploadPath);
            } catch (error) {
                console.error('文件上传错误：Error in destination function:', error);
                cb(error, null);
            }
        } catch (error) {
            console.error('文件上传错误：Error in destination function:', error);
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        try {
            // 设置自定义文件名，
            cb(null, Date.now() + '-' + req.user.userId+file.originalname);
        } catch (error) {
            console.error('文件上传错误：Error in filename function:', error);
            cb(error, null);
        }
    }
});
const upload = multer({ storage: storage });
module.exports=upload;
