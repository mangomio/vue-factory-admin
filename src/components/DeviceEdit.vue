<template>
  <el-dialog class="Edit-Prop" v-model="dialogVisible" :title="title" width="500">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备位置" prop="deviceId">
        <el-input v-model="formModel.deviceId" placeholder="请输入设备位置"></el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="status">
        <el-select v-model="formModel.status" placeholder="请选择设备状态">
          <el-option label="在线" value="1"></el-option>
          <el-option label="下线" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

// 接收父组件的props
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  formData: {
    type: Object,
    default: () => ({ name: '', deviceId: '', status: '' })  // 确保初始值有 status
  },
  dialogTitle: { type: String, default: '添加设备' }
});

const emit = defineEmits(['update:modelValue', 'submit']);

const formModel = ref({ name: '', deviceId: '', status: '' });  // 初始化时确保有 status
const title = computed(() => (props.formData.id ? '修改设备' : '添加设备'));

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/, 
      message: '设备名称必须是2-10位非空字符',
      trigger: 'blur'
    }
  ],
  deviceId: [
    { required: true, message: '请输入设备位置', trigger: 'blur' },
    {
      pattern: /^\S{1,20}$/, 
      message: '设备位置必须是1-20位非空字符',
      trigger: 'blur'
    }
  ],
  status: [{ required: true, message: '请选择设备状态', trigger: 'change' }]
};

const formRef = ref();

// 监听 props.formData 的变化，更新 formModel
watch(
  () => props.formData,
  (newValue) => {
    formModel.value = {
      ...newValue,
      status: String(newValue.status) // 确保 status 是字符串类型
    };
  },
  { immediate: true }
);

const dialogVisible = ref(props.modelValue);

// 监听 dialogVisible，更新弹窗显示状态
watch(
  () => props.modelValue,
  (newValue) => {
    dialogVisible.value = newValue;
  }
);

const onCancel = () => {
  emit('update:modelValue', false); // 关闭对话框
};

const onConfirm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', formModel.value);  // 通过事件传递表单数据
      emit('update:modelValue', false); // 关闭对话框
    } else {
      console.log('表单验证失败');
    }
  });
};
</script>