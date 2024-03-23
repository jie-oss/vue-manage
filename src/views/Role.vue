<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery" v-has="'role-query'"
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
        <el-button type="primary" @click="handleAdd" v-has="'role-create'"
          >创建</el-button
        >
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
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <el-button
              link
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              v-has="'role-edit'"
              >编辑</el-button
            >
            <el-button
              link
              size="mini"
              @click="handlePermission(scope.row)"
              v-has="'role-setting'"
              >设置权限</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              v-has="'role-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pager.total"
        class="pagination"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="action == 'create' ? '角色新增' : '角色编辑'"
      v-model="showModal"
      :before-close="handleClose"
    >
      <el-form
        :model="roleForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input
            placeholder="请输入角色的名称"
            v-model="roleForm.roleName"
          />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="roleForm.remark"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      title="设置权限"
      v-model="showPermission"
      :before-close="handlePermissionClose"
    >
      <el-form label-width="100px">
        <el-form-item prop="roleName" label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item prop="remark" label="选择权限">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName' }"
            default-expand-all
            ref="permissionTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handlePermissionClose">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "Role",
  data() {
    return {
      menuList: [],
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
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              if (key) names.push(this.actionMap[key]);
            });
            names = names.filter((item) => item);
            return names.join(",");
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
      pager: {
        total: 0,
        pageSize: 10,
      },
      action: "create",
      showModal: false,
      roleForm: [],
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色的名称",
            trigger: "blur",
          },
        ],
      },
      showPermission: false,
      curRoleName: "",
      curRoleId: "",
      actionMap: {},
    };
  },
  methods: {
    async getRoleList(params) {
      const { list, page } = await this.$api.roleList(params);
      this.pager = page;
      this.roleList = list;
    },
    // 重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 分页
    handleCurrentChange(page) {
      this.pager.pageNum = page;
      this.getRoleList({ ...this.pager });
    },
    // 查询
    handleQuery() {
      this.getRoleList({ ...this.queryForm });
    },
    // 取消
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    // 创建
    handleAdd() {
      this.showModal = true;
      this.action = "create";
    },
    // 编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      let { roleName, remark, _id } = row;
      this.$nextTick(() => {
        this.roleForm = Object.assign({}, { roleName, remark, _id });
      });
    },
    // 确认
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { roleForm, action } = this;
          let params = { ...roleForm, action };
          const res = await this.$api.roleOperate(params);
          if (res) {
            this.showModal = false;
            this.action == "create"
              ? this.$message.success("创建成功")
              : this.$message.success("编辑成功");
            this.handleReset("dialogForm");
            this.getRoleList({ ...this.pager });
          } else {
            this.action == "create"
              ? this.$message.error("创建失败")
              : this.$message.error("编辑失败");
          }
        }
      });
    },
    // 删除
    async handleDelete(id) {
      const res = await this.$api.roleOperate({ _id: id, action: "delete" });
      this.$message.success("删除成功");
      this.getRoleList({ ...this.pager });
    },
    // 设置权限模态款的取消
    handlePermissionClose() {
      this.showPermission = false;
    },
    // 设置权限模态框的确认
    async handlePermissionSubmit() {
      let nodes = this.$refs.permissionTree.getCheckedNodes();
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      const res = await this.$api.updataPermission(params);
      if (res) {
        this.showPermission = false;
        this.$message.success("权限设置成功");
        this.getRoleList({ ...this.pager });
      } else {
        this.$message.error("权限设置失败");
      }
    },
    // 设置权限
    handlePermission(row) {
      this.showPermission = true;
      this.curRoleId = row._id;
      this.curRoleName = row.roleName;
      const { checkedKeys } = row.permissionList;
      setTimeout(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys);
      });
    },
    // 获取菜单数据
    async getMenuList() {
      const res = await this.$api.menuList();
      this.menuList = res;
      this.getActionMap(res);
    },
    getActionMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.shift();
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          }
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      this.actionMap = actionMap;
    },
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
};
</script>

<style>
</style>