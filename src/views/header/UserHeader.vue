<template>
  <div class="el_header">
    <!--头部左侧图标li-->
    <ul class="header_left_ul">
      <li title="刷新" @click="goF5">
        <i class="el-icon-refresh" />
      </li>
    </ul>
    <!--头部右侧图标li-->
    <ul class="header_right_ul">
      <li title="全屏">
        <i class="el-icon-full-screen" />
      </li>
      <li title="小雨">
        <i class="el-icon-heavy-rain" />
      </li>
      <li title="在线聊天" @click="goChat">
        <i class="el-icon-bell" />
      </li>
      <li class="throwLiStyle" style="width: 135px">
        <el-dropdown @command="handleCommand">
          <div class="el-dropdown-link">
            <!--用户头像 src默认未加载图片路径-->
            <el-avatar
              :size="30"
              src=""
              @error="errorHandler"
              class="user_Face"
            >
              <img :src="user.userFace" />
            </el-avatar>
            <!--用户名-->
            <span>{{ user.name }}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo" icon="el-icon-s-custom"
              >个人中心</el-dropdown-item
            >
            <el-dropdown-item command="setting" icon="el-icon-setting"
              >系统设置</el-dropdown-item
            >
            <el-dropdown-item
              command="exit"
              icon="el-icon-switch-button"
              divided
              >注销登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <li title="更多">
        <i class="el-icon-s-operation" />
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserHeader",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    /*用户信息下拉列表点击*/
    handleCommand(command) {
      switch (command) {
        case "userInfo":
          this.$router.push("/userInfo");
          break;
        case "setting":
          break;
        case "exit":
          this.$confirm("此操作将注销登录, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              //执行注销登录
              axios.post("/api/logout");
              //清空sessionStorage中的数据
              window.sessionStorage.clear();
              //清空vuex中的菜单信息
              this.$store.commit("initRoutes", []);
              //跳转到登录页
              this.$router.replace("/");
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "操作已取消"
              });
            });
      }
    },
    /*用户头像加载失败*/
    errorHandler() {
      return true;
    },
    //跳转至chat聊天窗口
    goChat() {
      this.$router.push("/chat");
    },
    goF5() {
      this.$forceUpdate();
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
}

/*主容器*/
.body_container {
  height: 100%;
  background-color: #eef0f4;
  overflow: hidden;
}
.el-container {
  height: 100%;
}

/*头部*/
.el_header {
  display: flex;
  height: 100px;
  /*align-items: center;*/
  /*去除头部内边距多余的空格*/
  justify-content: space-between;
  //border-bottom: 1px #F5F5F5 solid;
}

//头部图标ul li
.el_header ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.el_header ul li {
  float: left;
  width: 50px;
  text-align: center;
  line-height: 60px;
}

/*鼠标移至头部icon*/
.el_header ul li:hover {
  background-color: #f7f7f7;
}

/*显示的头像*/
.el-dropdown-link {
  cursor: pointer;
}

/*用户头像*/
.user_Face {
  margin-right: 10px;
  width: 30px;
  height: 32px;
  background-color: #fff;
  vertical-align: middle;
}
</style>
