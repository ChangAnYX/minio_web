<template style="box-sizing: border-box;">
  <div class="body">
    <div id="login-box" class="container">
      <div class="form-container sign-up-container">
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="register_rules"
        >
          <h1 style="padding-bottom: 20px">注册</h1>
          <el-form-item prop="username_register">
            <el-input
              v-model="registerForm.username"
              auto-complete="false"
              placeholder="请输入账户名"
              type="text"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password_register">
            <el-input
              v-model="registerForm.password"
              auto-complete="false"
              placeholder="请输入密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pasagain_register">
            <el-input
              v-model="registerForm.passwordAg"
              autocomplete="off"
              placeholder="再次确认密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              autocomplete="off"
              placeholder="输入注册邮箱"
              type="text"
            ></el-input>
          </el-form-item>
          <div style="display: flex;align-items: center">
            <el-form-item prop="emaile_code" style="width: 65%">
              <el-input
                v-model="registerForm.emailCode"
                autocomplete="off"
                placeholder="输入验证码"
                type="text"
              ></el-input>
            </el-form-item>
            <el-button style="width: 35%" type="primary" @click="sendEmail"
              >发送验证码</el-button
            >
          </div>
          <el-button type="primary" @click="submitRegister">注册</el-button>
        </el-form>
      </div>
      <div class="form-container sign-in-container">
        <el-form ref="loginForm" :model="loginForm" :rules="login_rules">
          <h1 style="padding-bottom: 20px">登录</h1>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              auto-complete="false"
              placeholder="请输入账户名"
              type="text"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              auto-complete="false"
              placeholder="请输入密码"
              type="password"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            prop="code"
            style="width: 100%;margin-right: 5px;display: flex;align-items: center"
          >
            <div style="display: flex;align-items: center">
              <el-input
                v-model="loginForm.code"
                auto-complete="false"
                placeholder="点击图片更换验证码"
                style="width: 183px;padding-right: 5px"
                type="text"
              >
              </el-input>
              <img :src="captchaUrl" @click="updateCaptcha" />
            </div>
          </el-form-item>
          <div style="width: 100%;text-align: left;">
            <el-checkbox
              v-model="checked"
              style="text-align: left;padding-bottom: 10px;width: 50px"
              >记住我</el-checkbox
            >

            <a href="#" style="text-align: right; padding-left: 65px">
              忘记密码？</a
            >
          </div>
          <el-button type="primary" @click="submitLogin">登录</el-button>
        </el-form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>已有账号？</h1>
            <p>请使用您的账号进行登录</p>
            <button id="signIn" class="ghost">登录</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>没有账号?</h1>
            <p>立即注册加入我们，和我们一起开始旅程吧</p>
            <button id="signUp" class="ghost">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { post } from "@/request/http";

export default {
  name: "login",
  data() {
    return {
      captchaUrl: "/api/captcha?time=" + new Date(),
      loginForm: {
        username: "test",
        password: "123456",
        code: ""
      },
      checked: false,
      login_rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      registerForm: {
        username: "",
        password: "",
        email: "",
        emailCode: ""
      },
      register_rules: {
        username: [{ required: true, message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }],
        email: [{ required: true, message: "请输入邮箱" }],
        emailCode: [{ required: true, message: "请输入验证码" }]
      }
    };
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = "/api/captcha?time=" + new Date();
    },
    sendEmail() {
      //向邮件发送一份验证码
      post("/api/sendEmail?toEmail=" + this.registerForm.email);
    },
    submitLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          post("/api/login", this.loginForm).then(res => {
            if (res) {
              //存储用户token
              const tokenStr = res.data.tokenHead + res.data.token;
              window.sessionStorage.setItem("tokenStr", tokenStr);
              //清空菜单
              this.$store.commit("initRoutes", []);
              // 页面跳转
              let path = this.$route.query.redirect;
              this.$router.replace(
                path === "/" || path === undefined
                  ? "/index??fileType=0&filePath=%2F"
                  : path
              );
            }
          });
        } else {
          Message({
            showClose: true,
            message: "警告哦，字段填写未完全！",
            type: "warning"
          });
          return false;
        }
      });
    },
    submitRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          post("/api/register", this.registerForm).then(resp => {
            if (resp) {
              //清空菜单
              this.$store.commit("initRoutes", []);
              //页面刷新
              this.$router.go(0);
            }
          });
        } else {
          Message({
            showClose: true,
            message: "警告哦，字段填写未完全！",
            type: "warning"
          });
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.body {
  font-family: "Montserrat", sans-serif;
  background-image: linear-gradient(120deg, #a0f1ea, #ead6ee);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /*margin: -20px 0 50px;*/
}

h1 {
  font-weight: bold;
  margin: 0;
}

p {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container form {
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  justify-content: center;
  text-align: center;
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

.social-container a:hover {
  background-color: #eee;
}

.txtb input {
  font-size: 15px;
  color: #333;
  border: none;
  width: 100%;
  outline: none;
  background: none;
  padding: 0 3px;
  height: 35px;
}

.txtb span::before {
  content: attr(data-placeholder);
  position: absolute;
  top: 50%;
  left: 5px;
  color: #adadad;
  transform: translateY(-50%);
  transition: 0.5s;
}

.txtb span::after {
  content: "";
  position: absolute;
  left: 0;
  top: 100%;
  width: 0;
  height: 2px;
  background-image: linear-gradient(120deg, #a0f1ea, #ead6ee);
  transition: 0.5s;
}

.focus + span::before {
  top: -5px;
}

.focus + span::after {
  width: 100%;
}

button {
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background: #ff4b2b;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background: transparent;
  border-color: #fff;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.form-container button {
  background: linear-gradient(120deg, #9aa0b4, #daa1ea);
  border: none;
  background-size: 200%;
  color: #fff;
  transition: 0.5s;
}

.form-container button:hover {
  background-position: right;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.sign-in-container form a {
  position: relative;
  left: 100px;
}

.sign-up-container {
  left: 0;
  width: 50%;
  z-index: 1;
  opacity: 0;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.overlay {
  background-image: linear-gradient(120deg, #a1eae2, #e4bdec);
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateY(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-panel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  height: 100%;
  width: 50%;
  text-align: center;
  transform: translateY(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateY(0);
}

.overlay-left {
  transform: translateY(-20%);
}

.container.right-panel-active .sign-in-container {
  transform: translateY(100%);
}

.container.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

.container.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.container.container.right-panel-active .overlay-left {
  transform: translateY(0);
}

.container.container.right-panel-active .overlay-right {
  transform: translateY(20%);
}
</style>
