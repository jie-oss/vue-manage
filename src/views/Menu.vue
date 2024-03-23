<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery" v-has="'menu_query'"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)" v-has="'menu-create'"
          >创建</el-button
        >
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id">
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
              v-has="'menu-add'"
              >新增</el-button
            >
            <el-button
              link
              size="mini"
              @click="handleEdit(scope.row)"
              v-has="'menu-edit'"
              >编辑</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              v-has="'menu-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "Menu",
  data() {
    return {
      queryForm: {
        menuState: 1,
      },
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return dayjs(value).format("YYYY-MM-DD");
          },
        },
      ],
      menuForm: {
        menuType: 1,
        menuState: 1,
      },
      showModal: false,
      action: "add",
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 获取菜单数据
    async getMenuList(params) {
      const res = await this.$api.menuList(params);
      this.menuList = res;
    },
    // 查询
    handleQuery() {
      this.getMenuList(this.queryForm);
    },
    // 重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        this.menuForm = Object.assign({}, row);
      });
    },
    // 删除
    async handleDelete(id) {
      await this.$api.menuSubmit({ action: "delete", _id: id });
      this.$message.success("删除成功");
      this.getMenuList();
    },
    // 新增/创建
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      if (type == 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      }
    },
    // 取消
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    // 确认
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { action, menuForm } = this;
          const params = { action, ...menuForm };
          const res = await this.$api.menuSubmit(params);
          this.showModal = false;
          this.$message.success("操作成功");
          this.handleReset("dialogForm");
          this.getMenuList();
        } else {
          this.$message.error("操作失败");
        }
      });
    },
  },
  mounted() {
    this.getMenuList();
  },
};
</script>

<style>
</style>