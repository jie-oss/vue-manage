<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :model="user" inline>
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户id"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatch">批量删除</el-button>
      </div>
      <el-table
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :key="item.prop"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
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
      :title="action == 'add' ? '用户新增' : '编辑用户'"
      v-model="showModal"
      :before-close="handleClose"
    >
      <el-form
        :model="userForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item prop="userName" label="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="userForm.userName"
            :disabled="action == 'edit'"
          />
        </el-form-item>
        <el-form-item prop="userEmail" label="邮箱">
          <el-input
            placeholder="请输入邮箱"
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
          >
            <template #append>@outlook.com </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input placeholder="请输入手机号" v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item prop="job" label="岗位">
          <el-input placeholder="请输入岗位" v-model="userForm.job" />
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roleList" label="系统角色">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :value="role._id"
              :label="role.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" label="部门">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
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
  </div>
</template>

<script>
import { ref, onMounted, reactive, getCurrentInstance, toRaw } from "vue";

export default {
  name: "User",
  setup() {
    onMounted(() => {
      // 调用获取用户列表的方法
      getUserList();
      getRoleList();
      getDepList();
    });
    const { proxy } = getCurrentInstance();
    // 查找的数据
    const user = reactive({
      // userId: "",
      // userName: "",
      state: 0, // 0:所有 1：在职 2：离职 3：试用期
      // pageNum: 1, // 当前页码
      // pageSize: 10, // 每页条数，默认10
    });
    // 用户列表
    const userList = ref([
      {
        state: 1,
        role: "0",
        roleList: [
          "60180b07b1eaed6c45fbebdb",
          "60150cb764de99631b2c3cd3",
          "60180b59b1eaed6c45fbebdc",
        ],
        deptId: ["60167059c9027b7d2c520a61", "60167345c6a4417f2d27506f"],
        userId: 1000002,
        userName: "admin",
        userEmail: "admin@jason.com",
        createTime: "2021-01-17T13:32:06.381Z",
        lastLoginTime: "2021-01-17T13:32:06.381Z",
        __v: 0,
        job: "前端架构师",
        mobile: "17611020000",
      },
    ]);
    // 表格列的配置
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登陆时间",
        prop: "lastLoginTime",
      },
    ]);
    // 分页的配置
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10,
    });

    // 获取用户列表的方法
    const getUserList = async () => {
      let params = { ...user, ...pager };
      const { page, list } = await proxy.$api.userList(params);
      userList.value = list;
      pager.total = page.total;
    };

    // 查询的方法
    const handleQuery = () => {
      getUserList();
    };

    // 重置的方法
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

    // 切换页码时对应的方法
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };

    // 删除
    const handleDelete = async (row) => {
      const res = await proxy.$api.userDelete({
        userIds: [row.userId],
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };

    // 批量删除
    const checkedUsersIds = ref([]);
    const handlePatch = async () => {
      if (checkedUsersIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDelete({
        userIds: checkedUsersIds.value,
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };

    const handleSelectionChange = (list) => {
      let arr = [];
      list.forEach((item) => {
        arr.push(item.userId);
      });
      checkedUsersIds.value = arr;
    };

    // dialog是否显示
    const showModal = ref(false);

    // dialog中表单数据
    const userForm = reactive({
      state: 1,
    });

    // dialog表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择用户部门",
          trigger: "blur",
        },
      ],
      // mobile: [
      //   {
      //     required: true,
      //     pattern: /1[3-9]\d{9}/,
      //     message: "请输入正确的手机号码",
      //     trigger: "blur",
      //   },
      // ],
    });

    // 系统角色
    const roleList = ref([]);
    const getRoleList = async () => {
      const res = await proxy.$api.getRoleList();
      roleList.value = res;
    };

    // 部门
    const deptList = ref([]);
    const getDepList = async () => {
      const res = await proxy.$api.getDepList();
      deptList.value = res;
    };

    // 取消
    const handleClose = () => {
      handleReset("dialogForm");
      showModal.value = false;
    };

    // 用来判断是新增还是编辑
    const action = ref("add");

    // 用户新增
    const handleCreate = () => {
      showModal.value = true;
      action.value = "add";
    };

    // 确认
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm); // 将双向绑定的对象变成普通的对象
          params.userEmail += "@outlook.com";
          params.action = action.value;
          let res = await proxy.$api.userSubmit(params);
          if (res) {
            showModal.value = false;
            if (action.value == "add") {
              proxy.$message.success("新增用户成功");
            } else {
              proxy.$message.success("编辑用户成功");
            }

            handleReset("dialogForm");
            getUserList();
          }
        }
      });
    };

    // 编辑
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };

    return {
      user,
      userList,
      columns,
      handleQuery,
      handleReset,
      pager,
      handleCurrentChange,
      handleDelete,
      handlePatch,
      handleSelectionChange,
      showModal,
      handleCreate,
      userForm,
      rules,
      roleList,
      deptList,
      handleClose,
      handleSubmit,
      handleEdit,
      action,
    };
  },
};
</script>

<style>
</style>