import { get, post } from "./http";

//左侧菜单选择的为 全部 时，根据路径，获取文件列表
export const getFileListByPath = p => get("/api/file/list", p);
//左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
export const getFileListByType = p => get("/api/file/list/type", p);
//模糊查询
export const getFileByName = p => get("/api/file/list/search", p);
// 创建文件夹
export const makerDir = p => post("/api/file/mkDir", p);
// 新建文件
export const createFile = p => post("/api/file/create", p);
//获取存储空间已占用大小
export const getFileStorage = p => get("/api/admin/getStorage", p);
//获取文件夹列表 树状结构
export const getFileTree = p => get("/api/file/getTree", p);

// 单文件操作接口
// 删除文件
export const deleteFile = p => post("/api/file/delete", p, true);
// 文件移动
export const moveFile = p => post("/api/file/move", p, true);
// 重命名文件
export const renameFile = p => post("/api/file/rename", p, true);

// 批量文件操作接口
// 批量删除文件
export const batchDeleteFile = p => post("/api/file/delete/Batch", p);
// 批量移动文件
export const batchMoveFile = p => post("/api/file/move/Batch", p);

// 回收站文件操作
// 清空回收站
export const getEmptyTrash = p => get("/api/file/EmptyTrash", p);
// 还原回收站文件
export const getRestoreTrash = p => get("/api/file/RestoreTrash", p);
// 批量彻底删除文件
export const batchEmptyFile = p => post("/api/file/Empty/Batch", p);
// 批量还原文件
export const batchRestoreFile = p => post("/api/file/Restore/Batch", p);

//文件上传
//获取分片上传端口
export const getUpFile = p => get("/api/FileTran/createMultipartUpload", p);
//上传完成后申请合并
export const getMultipartUpload = p => get("/api/FileTran/completeMultipartUpload", p);

//文本文件展示
export const getFilePreview = p => get("/api/object/preview/txt", p);
