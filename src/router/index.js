import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import FriendChat from "../views/chat/FriendChat";
import AdminInfo from "../views/userinfo/AdminInfo";
import index from "../views/index";

Vue.use(VueRouter);

const routes = [
  {
    //登录页面
    path: "/",
    name: "Login",
    component: Login,
    hidden: true
  },
  {
    //home主页面
    path: "/index",
    name: "index",
    component: index,
    children: [
      {
        path: "/chat",
        name: "在线聊天",
        component: FriendChat
      },
      {
        path: "/userInfo",
        name: "个人中心",
        component: AdminInfo
      }
    ]
  }
];

const router = new VueRouter({
  routes
  //mode: 'history'
});

export default router;
