<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList" style="width: 100%">
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
              @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              >作废</el-button
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
      title="申请休假"
      v-model="showModal"
      :before-close="handleClose"
      width="70%"
    >
      <el-form
        :model="leaveForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item prop="applyType" label="休假类型">
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假日期" required>
          <el-col :span="8">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="leaveForm.startTime"
                type="date"
                placeholder="请选择开始日期"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">-</el-col>
          <el-col :span="8">
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="leaveForm.endTime"
                type="date"
                placeholder="请选择结束日期"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="休假时长" prop="leaveTime">{{
          leaveForm.leaveTime
        }}</el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input
            type="textarea"
            placeholder="请输入休假原因"
            :row="3"
            v-model="leaveForm.reasons"
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
    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal">
      <el-steps
        :active="detail.applyState > 2 ? 3 : 1"
        :process-status="detail.applyState == 2 ? 'finish' : 'process'"
        :finish-status="getstatus(detail.applyState)"
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型">
          <div>
            {{ detail.applyTypeName }}
          </div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>
            {{ detail.time }}
          </div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>
            {{ detail.leaveTime }}
          </div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>
            {{ detail.reasons }}
          </div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>
            {{ detail.applyStateName }}
          </div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>
            {{ detail.curAuditUserName }}
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, reactive, getCurrentInstance, watchEffect } from "vue";
import dayjs from "dayjs";

export default {
  name: "Leave",
  setup() {
    const { proxy } = getCurrentInstance();
    // 查找的数据
    const queryForm = reactive({ applyState: "" });
    // 审批数据
    const applyList = ref([]);
    // 表格列的配置
    const columns = reactive([
      {
        label: "申请单号",
        prop: "orderNo",
      },
      {
        label: "休假时间",
        prop: "",
        formatter(row) {
          return (
            dayjs(row.startTime).format("YYYY-MM-DD") +
            "到" +
            dayjs(row.endTime).format("YYYY-MM-DD")
          );
        },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
      },
      {
        label: "休假类型",
        prop: "applyType",
        formatter(row, column, value) {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[value];
        },
      },
      {
        label: "休假原因",
        prop: "reasons",
      },
      {
        label: "申请时间",
        prop: "createTime",
        formatter(row, column, value) {
          dayjs(value).format("YYYY--MM-DD");
        },
      },
      {
        label: "审批人",
        prop: "auditUsers",
      },
      {
        label: "当前审批人",
        prop: "curAuditUserName",
      },
      {
        label: "审批状态",
        prop: "applyState",
        formatter(row, column, value) {
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废",
          }[value];
        },
      },
    ]);
    // 分页的配置
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10,
    });
    // dialog是否显示
    const showModal = ref(false);
    // dialog表单数据
    const leaveForm = reactive({
      applyType: 1,
      startTime: "",
      endTime: "",
      leaveTime: "0天",
      reasons: "",
    });
    const action = ref("create");
    const rules = {
      applyType: [{ required: true }],
      startTime: [
        { required: true, message: "请选择起始时间", trigger: "blur" },
      ],
      endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
    };

    onMounted(() => {
      getApplyList();
    });

    // 获取审批数据
    const getApplyList = async () => {
      const { list, page } = await proxy.$api.getApplyList({
        ...pager,
        ...queryForm,
      });
      pager.total = page.total;
      applyList.value = list;
    };

    // 重置的方法
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

    // 查询
    const handleQuery = () => {
      getApplyList();
    };

    // 申请休假
    const handleApply = () => {
      showModal.value = true;
      action.value = "create";
    };

    // 切换页码时对应的方法
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
    };

    // 取消
    const handleClose = () => {
      handleReset("dialogForm");
      showModal.value = false;
    };

    // 确认
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = { ...leaveForm, action: action.value };
            let res = await proxy.$api.ApplyListOperate(params);
            handleClose();
            getApplyList();
            proxy.$message.success("创建成功");
          } catch (error) {}
        }
      });
    };

    const disabledDate = (time) => {
      return time.getTime() < Date.now() - 8.64e7;
    };

    watchEffect(
      () => {
        let { startTime, endTime } = leaveForm;
        leaveForm.leaveTime =
          startTime && endTime
            ? (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天"
            : "0天";
      },
      { immediate: false }
    );
    let detail = ref({});
    let showDetailModal = ref(false);
    // 查看
    const handleDetail = (row) => {
      let data = { ...row };
      data.applyTypeName = {
        1: "事假",
        2: "调休",
        3: "年假",
      }[data.applyType];
      data.time =
        dayjs(data.startTime).format("YYYY-MM-DD") +
        "到" +
        dayjs(data.endTime).format("YYYY-MM-DD");

      data.applyStateName = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[data.applyState];
      detail.value = data;
      showDetailModal.value = true;
    };

    // 作废
    const handleDelete = async (_id) => {
      try {
        let params = { _id, action: "delete" };
        let res = await proxy.$api.ApplyListOperate(params);
        proxy.$message.success("删除成功");
        getApplyList();
      } catch (error) {}
    };

    function getstatus(status) {
      switch (status) {
        case 4:
          return "success";
        case 5:
          return "error";
        case 3:
          return "error";
        case 1:
          return "finish";
        case 2:
          return "success";
      }
    }

    return {
      queryForm,
      leaveForm,
      applyList,
      columns,
      action,
      showModal,
      pager,
      rules,
      detail,
      showDetailModal,
      handleCurrentChange,
      handleApply,
      handleClose,
      handleQuery,
      handleReset,
      handleSubmit,
      disabledDate,
      handleDetail,
      handleDelete,
      getstatus,
    };
  },
};
</script>

<style>
</style>