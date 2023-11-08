const articleTagModel = require('../model/articleTagModel'); // 假设路径和模型定义的位置相对应

const ArticleTagService = {
    getAllArticleTags: async () => {
        return await articleTagModel.findAll();
    },

    getArticleTagById: async (userId) => {
        return await articleTagModel.findByPk(userId);
    },

    createArticleTag: async (userData) => {
        return  articleTagModel.create(userData);
    },
    // 批量插入
    createArticleTags: async (userData) => {
        return  articleTagModel.bulkCreate(userData);
    },
    updateArticleTag: async (userId, userData) => {
        const user = await articleTagModel.findByPk(userId);
        if (user) {
            return await user.update(userData);
        }
        return null;
    },

    deleteArticleTag: async (userId) => {
        const user = await articleTagModel.findByPk(userId);
        if (user) {
            return await user.destroy();
        }
        return null;
    }
};

module.exports = ArticleTagService;

