const File=require('../model/fileModel')

const FileService={
    getAllFiles:async ()=>{
        return await File.findAll()
    },

    createFile:async (FileData)=>{
        return File.create(FileData)
    },

    updateFile:async (FileId,FileData)=>{
        const File=await File.findByPk(FileId)
        if (File){
            return await File.update(FileData)
        }
        return null;
    },
    deleteFile:async (FileId)=>{
        const File=await File.findByPk(FileId);
        if (File){
            return await File.destroy()
        }
        return null;
    },
    getFileByName:async (Filename)=>{
        return await File.findOne({where:{Filename:Filename}})
    },
    getFileById:async (FileId)=>{
        return await File.findByPk(FileId)
    }
}

module.exports=FileService;
