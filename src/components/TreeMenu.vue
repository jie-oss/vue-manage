<template>
  <template v-for="menu in userMenu" :key="menu._id">
    <el-sub-menu
      :index="menu.path"
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
    >
      <template #title>
        <i :class="menu.icon"></i>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :userMenu="menu.children"></tree-menu>
    </el-sub-menu>
    <el-menu-item
      v-else-if="menu.menuType == 1"
      :key="menu._id"
      :index="menu.path"
      >{{ menu.menuName }}</el-menu-item
    >
  </template>
</template>

<script>
export default {
  name: "TreeMenu",
  props: {
    userMenu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    console.log("git分支测试");
  },
};
</script>

<style>
</style>