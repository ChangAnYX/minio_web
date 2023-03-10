import { get } from "@/request/http";

// 获取图片链接
export const getImage = p => get("/api/show/images", p);
