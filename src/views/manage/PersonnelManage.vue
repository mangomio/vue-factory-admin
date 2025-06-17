<template>
  <page-container title="人员列表">
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="姓名：">
        <el-input v-model="searchName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onAddPerson">添加</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="personList" style="width: 100%">
      <el-table-column prop="id" label="编号" width="150" />
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="createTime" label="创建时间">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="onEditPerson(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="onDelPerson(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 分页控件 -->
<el-pagination
  v-model:currentPage="searchData.current"
  v-model:pageSize="searchData.limit"
  :total="total"
  layout="total, sizes, prev, pager, next, jumper"
  :page-sizes="[5, 10, 15, 20]"
  @size-change="onSizeChange"
  @current-change="onCurrentChange"
  style="margin-top: 20px; justify-content: flex-end"
/>

    <!-- 编辑人员对话框 -->
    <Edit-Prop
      ref="dialog"
      :modelValue="dialogVisible"
      :formData="currentPerson"
      dialogTitle="编辑人员"
      @submit="handleSubmit"
      @update:modelValue="dialogVisible = $event"
      @close="resetDialog"
    />
  </page-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { editPerson, delPerson, addPerson, searchPerson, pagePersonList } from '@/apis/person';
import { useUserStore } from '@/stores/user';
import { formatTime } from '@/utlis/format';

const userStore = useUserStore();
const token = userStore.userInfo.token;

const personList = ref([]); // 当前页的人员列表
const total = ref(0); // 数据总条数
const loading = ref(false);
const dialogVisible = ref(false);
const currentPerson = ref({}); // 当前选中的人员
const searchName = ref(''); // 搜索姓名

// 分页参数
const searchData = reactive({
  current: 1, // 当前页码
  limit: 5 // 每页显示条数
});

// 获取分页数据
const getData = async (pageNo = 1) => {

  searchData.current = pageNo;
  try {
    const res = await pagePersonList(pageNo, searchData.limit, token);
    console.log(res)
    personList.value = res.data || []; // 更新当前页数据
    total.value = res.type|| 0; // 更新总条数
  } catch (error) {
    console.error("获取分页数据失败:", error);
  }
};

// 搜索人员
const onSearch = async () => {
  if (searchName.value.trim()) {
    try {
      const res = await searchPerson(searchName.value, token);
      personList.value = res.data|| []; // 更新当前页数据
      total.value = res.type || 0; // 更新总条数
      console.log(res.data)
      console.log(personList.value)
    } catch (error) {
      console.error("搜索失败:", error);
    }
  } else {
    getData(); // 如果没有搜索内容，恢复分页数据
  }
};

// 每页显示条数变化时触发
const onSizeChange = (newSize) => {
  searchData.limit = newSize;
  getData(1); // 每次改变每页条数时，回到第一页
};

// 分页控件页码变化时触发
const onCurrentChange = (newPage) => {
  getData(newPage);
};

// 添加人员
const onAddPerson = () => {
  currentPerson.value = { id: null, username: '', role: '' }; // 确保id被设置为null或不包含在对象中
  dialogVisible.value = true;
};

// 编辑人员
const onEditPerson = (row) => {
  currentPerson.value = { ...row };
  dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async (formData) => {
  try {
    if (!formData.username || !formData.role) {
      ElMessage.error('姓名和角色不能为空');
      return;
    }

    // 如果是添加操作，确保id不包含在formData中
    if (!formData.id) {
      delete formData.id; // 删除id属性，防止错误地传递给后端
    }

    if (formData.id) {
      await editPerson({ ...formData }, token);
    } else {
      await addPerson({ ...formData }, token);
    }

    await getData(); // 重新获取分页数据
    dialogVisible.value = false;
    ElMessage.success(formData.id ? '编辑成功' : '添加成功');
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error('操作失败，请重试');
  }
};

// 删除人员
const onDelPerson = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  });
  await delPerson(row.id, token);
  await getData(); // 重新获取分页数据
  ElMessage.success('删除成功');
};

onMounted(() => {
  getData(); // 初始化分页数据
});

const resetDialog = () => {
  currentPerson.value = { id: null, username: '', role: '' };
  dialogVisible.value = false;
  getData(); // 重新获取分页数据
};
</script>
