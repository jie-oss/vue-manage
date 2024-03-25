<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form
        :model="user"
        label-width="auto"
        :rules="rules"
        status-icon
        ref="userForm"
      >
        <div class="title">登录页</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            v-model="user.userName"
            :prefix-icon="users"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            v-model="user.userPwd"
            :prefix-icon="view"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { User, View } from "@element-plus/icons-vue";
export default {
  data() {
    return {
      user: {
        userName: "",
        userPwd: "",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        userPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    users() {
      return User;
    },
    view() {
      return View;
    },
  },
  methods: {
    login() {
      this.$refs.userForm.validate((res) => {
        if (res) {
          this.$api.login(this.user).then((res) => {
            this.$store.commit("saveUserInfo", res);
            this.$router.replace("/");
            this.$store.dispatch("loadAsyncRoutes");
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 35px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 35px;
      line-height: 1.5;
      text-align: center;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>