// 构建层级结构
function buildHierarchy(tags) {
    const tagMap = new Map();
    const rootTags = [];

    // 首先，将标签按照 faTagId 分组，并放入 tagMap 中
    tags.forEach(tag => {
        if (!tagMap.has(tag.faTagId)) {
            tagMap.set(tag.faTagId, []);
        }
        tagMap.get(tag.faTagId).push(tag);
    });

    // 递归构建层级结构
    function buildTree(tag) {
        const children = tagMap.get(tag.tagId) || [];
        if (children.length === 0) {
            return { ...tag, children: [] };
        }

        const subtree = { ...tag, children: [] };
        children.forEach(child => {
            const childTree = buildTree(child);
            subtree.children.push(childTree);
        });
        return subtree;
    }

    // 找出根标签，即没有父标签的标签
    tags.forEach(tag => {
        if (!tag.faTagId) {
            const rootTag = buildTree(tag);
            rootTags.push(rootTag);
        }
    });


    return rootTags;
}

module.exports={
    buildHierarchy
}
