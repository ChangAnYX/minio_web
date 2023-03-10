import { url } from "@/request/http";

//全局函数 ，挂载到Vue实例上
export default function install(Vue) {
  //  加载流文件

  Vue.prototype.getThumbnailPath = fileId => url("/api/object/show/" + fileId);

  Vue.prototype.getDownloadFile = fileId => url("/api/object/send/" + fileId);
}
