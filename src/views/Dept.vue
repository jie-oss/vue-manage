<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form ref="form" inline :model="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="queryForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery" v-has="'dept-query'"
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
        <el-button @click="handleCreate" type="primary" v-has="'dept-create'"
          >创建</el-button
        >
        <el-table
          :data="deptList"
          row-key="_id"
          :tree-props="{ children: 'children' }"
          stripe
          default-expand-all
        >
          <el-table-column
            v-for="item in columns"
            :key="item.prop"
            v-bind="item"
          ></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                v-has="'dept-edit'"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row._id)"
                v-has="'el-delete'"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="action == 'create' ? '创建部门' : '编辑部门'"
      v-model="showModal"
      :before-close="handleClose"
    >
      <el-form
        :model="deptForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            placeholder="请选择部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            show-all-levels
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select
            placeholder="请输入负责人"
            v-model="deptForm.userName"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="deptForm.userEmail"
            placeholder="请输入邮箱"
            disabled
          ></el-input>
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
  data() {
    return {
      queryForm: {},
      deptList: [],
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return dayjs(value).format("YYYY-MM-DD");
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
      deptForm: {},
      showModal: false,
      action: "create",
      userList: [],
      rules: {
        parentId: [
          { required: true, message: "请选择上级部门", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请选择负责人", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    // 获取部门列表
    async getDeptList(params) {
      const res = await this.$api.deptList(params);
      this.deptList = res;
    },
    // 查询
    handleQuery() {
      this.getDeptList(this.queryForm);
    },
    // 重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 创建
    handleCreate() {
      this.showModal = true;
      this.action = "create";
    },
    // 编辑
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      console.log(row);
      this.$nextTick(() => {
        Object.assign(this.deptForm, row);
      });
    },
    // 删除
    async handleDelete(id) {
      const res = await this.$api.deptOperate({ _id: id, action: "delete" });
      if (res) {
        this.$message.success("删除成功");
        this.getDeptList();
      }
    },
    // 取消
    handleClose() {
      this.handleReset("dialogForm");
      this.showModal = false;
    },
    // 确认
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const res = await this.$api.deptOperate({
            ...this.deptForm,
            action: this.action,
          });
          if (res) {
            this.getDeptList();
            this.showModal = false;
            this.handleReset("dialogForm");
            this.action == "create"
              ? this.$message.success("创建成功")
              : this.$message.success("编辑成功");
          } else {
            this.action == "create"
              ? this.$message.error("创建失败")
              : this.$message.error("编辑失败");
          }
        }
      });
    },
    // 负责人
    async getUserList() {
      const res = await this.$api.userAllList();
      this.userList = res;
    },
    // 请选择负责人
    handleUser(val) {
      const [userId, userName, userEmail] = val.split("/");
      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
  },
};
</script>

<style>
</style>