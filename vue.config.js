let proxyObj = {};

proxyObj["/"] = {
  ws: false,
  //目标地址
  target: "http://localhost:8081",
  //发送请求头host会被设置target
  changeOrigin: true,
  //不重写请求地址
  pathReWrite: {
    "^/": "/"
  }
};

proxyObj["/ws"] = {
  ws: true,
  target: "ws://localhost:8081"
};

module.exports = {
  lintOnSave: false, //是否开启eslint语法检查

  devServer: {
    host: "0.0.0.0",
    port: 8080,
    proxy: proxyObj
  }
};
