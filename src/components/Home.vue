<template>
  <div class="basic-layout">
    <!-- 左侧部分 -->
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <div class="logo">
        <img src="./../assets/logo.png" alt="" />
        <span>Manage</span>
      </div>
      <!-- 菜单部分 -->
      <el-menu
        default-active="2"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
        router
      >
        <tree-menu :userMenu="menuList"></tree-menu>
      </el-menu>
    </div>
    <!-- 右侧顶部和内容 -->
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <!-- 顶部 -->
      <div class="nav-top">
        <div class="nav-left">
          <fold class="menu-fold" @click="isCollapse = !isCollapse"></fold>
          <div class="bread">
            <breadcrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount" class="user-badge">
            <!-- <el-icon class="el-icon-bell"><bell /></el-icon> -->
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo && userInfo.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱:{{ userInfo && userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 内容 -->
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "./Breadcrumb.vue";
import TreeMenu from "./TreeMenu.vue";
export default {
  components: { TreeMenu, Breadcrumb },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: false,
      menuList: [],
    };
  },
  methods: {
    handleLogout(key) {
      if (key === "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = null;
      this.$router.push("/login");
    },
    async getNoticeCount() {
      const res = await this.$api.noticeCount();
      this.noticeCount = res ? true : false;
    },
    async getMenuList() {
      const res = await this.$api.menuList();
      this.menuList = res;
    },
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
};
</script>

<style lang="scss" scoped>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100%;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 15px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      border-right: none;
      height: calc(100vh - 150px);
      .menu-setting {
        width: 20px;
        height: 20px;
        margin-right: 12px;
      }
    }
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          width: 25px;
          height: 25px;
          margin-right: 15px;
        }
      }
      .user-info {
        display: flex;
        align-items: center;
        .user-badge {
          line-height: 30px;
          margin-right: 15px;
          margin-top: 5px;
        }
        .user-link {
          cursor: pointer;
          color: #4091ff;
        }
      }
    }
    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        height: 100%;
        background-color: #fff;
      }
    }
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
  }
}
</style>