<template>
  <page-container title="设备列表">
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="设备名称：">
        <el-input v-model="searchName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备位置：">
        <el-input v-model="deviceId" placeholder="请输入设备位置"></el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="status" style="width: 250px;">
        <el-select v-model="formModel.status" placeholder="请选择设备状态">
          <el-option label="在线" value="1"></el-option>  
          <el-option label="下线" value="0"></el-option>  
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onAddDevice">添加</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="deviceList" style="width: 100%">
      <el-table-column prop="id" label="编号" width="150" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="deviceId" label="位置" />
      <el-table-column label="状态">
        <template #default="{ row }">
          {{ row.status === 1 ? '在线' : '下线' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="onEditDevice(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="onDelDevice(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="getData"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 引入子组件 Device-Edit 并传递数据 -->
    <Device-Edit
      ref="dialog"
      :modelValue="dialogVisible"
      :formData="currentDevice"
      dialogTitle="编辑设备"
      @submit="handleSubmit"
      @update:modelValue="dialogVisible = $event"
      @close="resetDialog"
    />
  </page-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getDeviceList, addDevice, editDevice, delDevice, searchDevice, pageDeviceList } from '@/apis/device';
import { useUserStore } from '@/stores/user';
import { ElMessageBox, ElMessage } from 'element-plus';

const userStore = useUserStore();
const token = userStore.userInfo.token;

const deviceList = ref([]); // 当前页的设备列表
const total = ref(0); // 数据总条数
const loading = ref(false);
const dialogVisible = ref(false);
const currentDevice = ref({}); // 当前选中的设备
const searchName = ref('');
const deviceId = ref('');
const searchState = ref('');
const formModel = ref({ name: '', deviceId: '', status: '' });

// 分页参数
const currentPage = ref(1); // 当前页码
const pageSize = ref(5); // 每页显示条数

// 搜索设备
const onSearch = async () => {
  try {
    const res = await searchDevice(searchName.value, deviceId.value, formModel.value.status,token);
    deviceList.value = res.data || []; // 更新设备数据
    total.value = res.type|| 0; // 更新总条数
  } catch (error) {
    console.error("搜索失败:", error);
  }
};

// 获取分页数据
const getData = async (pageNo = 1) => {
  loading.value = true;
  try {
    const res = await pageDeviceList(pageNo, pageSize.value, token);
    deviceList.value = res.data || []; // 更新当前页数据
    total.value = res.type || 0; // 更新总条数
  } catch (error) {
    console.error("获取分页数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 每页显示条数变化时触发
const onSizeChange = (newSize) => {
  pageSize.value = newSize;
  getData(1); // 每次改变每页条数时，回到第一页
};

// 添加设备
const onAddDevice = () => {
  currentDevice.value = { id: null, name: '', deviceId: '', status: '' }; // 清空表单，表示添加新设备
  dialogVisible.value = true;
};

// 编辑设备
const onEditDevice = (row) => {
  currentDevice.value = { ...row }; // 复制设备数据进行编辑
  dialogVisible.value = true;
};

// 删除设备
const onDelDevice = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  });
  await delDevice(row.id); // 删除设备
  await getData(); // 重新获取设备列表
  ElMessage.success('删除成功');
};

// 处理提交的数据
const handleSubmit = async (formData) => {
  try {
    // 如果是编辑操作，直接使用原始的 formData（带有 id）
    // 如果是添加操作，去除 id 字段（formData.id 不存在）
    const dataToSubmit = formData.id ? { ...formData } : { ...formData, id: undefined };

    if (formData.id) {
      // 如果存在 id，表示是编辑操作
      await editDevice(dataToSubmit, token); // 提交编辑数据
      ElMessage.success('编辑成功');
    } else {
      // 如果没有 id，表示是新增设备
      await addDevice(dataToSubmit, token); // 提交新增数据
      ElMessage.success('添加成功');
    }

    // 重新获取数据以更新表格
    await getData(); // 假设 getData 函数会从后端获取最新数据
    dialogVisible.value = false; // 关闭对话框
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error('操作失败，请重试');
  }
};



// 重置弹出层的状态
const resetDialog = () => {
  currentDevice.value = { id: null, name: '', deviceId: '', status: '' };
  dialogVisible.value = false; // 确保关闭弹出层
};

// 初始化数据
onMounted(() => {
  getData(); // 初始化分页数据
});
</script>
