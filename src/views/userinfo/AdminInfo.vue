<template>
  <!--个人中心-->
  <div style="overflow:hidden;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ admin.name }}</span
        ><span style="font-size: 12px;color: #808080;margin-left: 10px"
          >({{ admin.username }})</span
        >
        <el-button
          @click="handleEdit"
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-edit"
          title="编辑"
        ></el-button>
      </div>
      <div>
        <!--用户头像-->
        <div class="user_avatar">
          <el-upload
            action="/admin/upUserFace"
            :headers="headers"
            :show-file-list="true"
            :on-success="onSuccess"
          >
            <el-avatar
              :size="85"
              :src="admin.userFace"
              title="点击修改用户头像"
            >
              <img :src="admin.userFace" class="user_face" />
            </el-avatar>
          </el-upload>
        </div>

        <!--用户详细信息-->
        <ul class="user_info_ul">
          <li>
            昵称：<el-tag size="small">{{ admin.name }}</el-tag>
          </li>
          <li>
            邮箱：<el-tag size="small">{{ admin.email }}</el-tag>
          </li>
          <li>
            存储大小：<el-tag size="small">{{ admin.disksize }}G</el-tag>
          </li>
        </ul>
      </div>
      <el-button
        @click="updatePwd"
        type="danger"
        size="small"
        style="float: right"
        >修改密码</el-button
      >
    </el-card>

    <!--修改用户信息对话框-->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="UserDialogVisible"
      width="30%"
    >
      <div>
        <el-form
          :model="updateAdmin"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="账户:" prop="username">
            <el-input
              v-model="updateAdmin.username"
              size="small"
              disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称:" prop="name">
            <el-input v-model="updateAdmin.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="age">
            <el-input
              v-model="updateAdmin.email"
              size="small"
              disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UserDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="userDialogSubmit" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--修改用户密码对话框-->
    <el-dialog title="修改密码" :visible.sync="UserPassword" width="30%">
      <div>
        <el-form
          :model="updatePassword"
          :rules="rulesPassword"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="原密码:" prop="oldPassword" type="password">
            <el-input
              v-model="updatePassword.oldPassword"
              type="password"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码:" prop="newPassword" type="password">
            <el-input
              v-model="updatePassword.newPassword"
              type="password"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="再次:" prop="agPassword" type="password">
            <el-input
              size="small"
              v-model="updatePassword.agPassword"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="UpdatePasswordButton" size="small"
          >确 定</el-button
        >
        <el-button @click="UserPassword = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminInfo",
  data() {
    return {
      headers: {
        Authorization: window.sessionStorage.getItem("tokenStr")
      },
      imageUrl: "",
      admin: {},
      updateAdmin: {},
      updatePassword: {
        oldPassword: "",
        newPassword: "",
        agPassword: ""
      },
      UserDialogVisible: false,
      UserPassword: false,
      rules: {
        name: [{ required: true, message: "请输入昵称", trigger: "change" }]
      },
      rulesPassword: {
        oldPassword: [{ required: true, message: "请输入原密码" }],
        newPassword: [{ required: true, message: "请输入新密码" }],
        agPassword: [{ required: true, message: "请再次密码" }]
      }
    };
  },
  mounted() {
    this.getAdminInfo();
  },
  methods: {
    //初始化数据
    getAdminInfo() {
      axios.get("/api/admin/info").then(resp => {
        if (resp) {
          this.admin = resp;
        }
      });
    },
    //修改用户信息
    handleEdit() {
      axios.get("/api/admin/info").then(resp => {
        if (resp) {
          this.updateAdmin = resp;
          this.UserDialogVisible = true;
        }
      });
    },
    //提交用户信息
    userDialogSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          axios.put("/api/admin/update", this.updateAdmin).then(resp => {
            if (resp) {
              this.UserDialogVisible = false;
              this.getAdminInfo();
            }
          });
        }
      });
    },
    // 修改密码窗口
    updatePwd() {
      this.UserPassword = true;
    },
    //提交修改密码
    UpdatePasswordButton() {
      axios
        .put(
          "/api/admin/upPassword?oldPassword=" +
            this.updatePassword.oldPassword +
            "&password=" +
            this.updatePassword.newPassword
        )
        .then(resp => {
          if (resp.code === 200) {
            this.UserDialogVisible = false;
            this.getAdminInfo();
          }
        });
    },
    //提交图片成功
    onSuccess() {
      this.getAdminInfo();
    }
  }
};
</script>

<style scoped>
/*用户信息卡片*/
.box-card {
  width: 600px;
  margin: 30px auto;
  padding: 10px;
}

/*展示用户具体信息ul*/
.user_info_ul {
  list-style: none;
}
.user_info_ul li {
  margin-bottom: 20px;
}

.user_avatar {
  cursor: pointer;
  display: flex;
  justify-content: center;
}
/*用户头像*/
.user_face {
}
</style>
