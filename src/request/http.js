//拦截器配置
import { Message } from "element-ui";
import { Notification } from "element-ui";
import router from "../router";

axios.interceptors.request.use(
  config => {
    //如果存在token，则请求携带这token
    if (window.sessionStorage.getItem("tokenStr")) {
      config.headers["Authorization"] = window.sessionStorage.getItem(
        "tokenStr"
      );
    }
    return config;
  },
  error => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  success => {
    //业务逻辑错误
    if (success.status && success.status === 200) {
      if (
        success.data.code === 500 ||
        success.data.code === 401 ||
        success.data.code === 403
      ) {
        Notification.error({
          title: success.data.message
          //message: ''
        });
        //Message.error({message:success.data.message});
        return;
      }
      //操作成功
      if (success.data.message) {
        Notification.success({
          title: success.data.message,
          position: "bottom-right"
        });
        //Message.success({message:success.data.message});
      }
    }
    return success.data;
  },
  error => {
    if (error.response.code === 504 || error.response.code === 404) {
      Message.error({ message: "服务器宕机了，( ╯□╰ )" });
    } else if (error.response.code === 403) {
      Message.error({ message: "您的权限不足" });
    } else if (error.response.code === 401) {
      Message.error({ message: "尚未登录，请登录" });
      //跳至登录页面
      router.replace("/");
    } else if (error.response.data.message) {
      Message.error({ message: error.response.data.message });
    } else {
      Message.error({ message: "未知错误" });
    }
  }
);

/**
 * get方法，对应get请求
 */
import axios from "axios";

export function get(url, params, info = "") {
  return new Promise((resolve, reject) => {
    axios
      .get(url + info, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * post方法，对应post请求
 * info为 true，formData格式；
 * info为 undefined或false，是json格式
 */
export function post(url, data = {}, info) {
  return new Promise((resolve, reject) => {
    let newData = data;
    if (info) {
      //  转formData格式
      newData = new FormData();
      for (let i in data) {
        newData.append(i, data[i]);
      }
    }
    axios
      .post(url, newData)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 封装put请求
 */

export function put(url, params = {}, info = "") {
  return new Promise((resolve, reject) => {
    axios.put(url + info, params).then(
      res => {
        resolve(res);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装delete请求
 */
export function axiosDelete(url, params = {}, info = "") {
  return new Promise((resolve, reject) => {
    axios
      .delete(url + info, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function url(uri) {
  return uri;
}
