<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.menuName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">创建</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="mini"
              @click="handleAdd(2, scope.row)"
              >新增</el-button
            >
            <el-button link size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <el-dialog
      :title="action == 'add' ? '菜单新增' : '编辑菜单'"
      v-model="showModal"
      :before-close="handleClose"
    >
      <el-form
        :model="menuForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader
            v-model="menuForm.parentId"
            placeholder="请选择部门"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选则默认是创建一级菜单</span>
        </el-form-item>
        <el-form-item prop="menuType" label="菜单类型">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="menuName" label="菜单名称">
          <el-input
            placeholder="请输入菜单的名称"
            v-model="menuForm.menuName"
          />
        </el-form-item>
        <el-form-item
          prop="icon"
          label="菜单图标"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入菜单图标" v-model="menuForm.icon" />
        </el-form-item>
        <el-form-item
          prop="path"
          label="路由地址"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入路由地址" v-model="menuForm.path" />
        </el-form-item>
        <el-form-item
          prop="menuCode"
          label="权限标识"
          v-show="menuForm.menuType == 2"
        >
          <el-input placeholder="请输入权限标识" v-model="menuForm.menuCode" />
        </el-form-item>
        <el-form-item
          prop="component"
          label="组件路径"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入组件路径" v-model="menuForm.component" />
        </el-form-item>
        <el-form-item
          prop="menuState"
          label="菜单状态"
          v-show="menuForm.menuType == 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "Role",
  data() {
    return {
      queryForm: {
        roleName: "",
      },
      roleList: [],
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "menuType",
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return dayjs(value).format("YYYY-MM-DD");
          },
        },
      ],
    };
  },
  methods: {
    async getRoleList() {},
  },
  mounted() {
    this.$api.getRoleList();
  },
};
</script>

<style>
</style>