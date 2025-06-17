<template>
  <el-dialog
    class="Edit-Prop"
    v-model="dialogVisible"  
    :title="formModel.id ? '编辑' : '添加人员'"
    width="500"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="用户姓名" prop="username">
        <el-input v-model="formModel.username" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户身份" prop="role">
        <el-input
          v-model="formModel.role"
          placeholder="请输入信息"
        ></el-input>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // 控制对话框显示
  formData: { type: Object, default: () => ({ id: null, username: '', role: '' }) }, // 默认数据包含 id
  dialogTitle: { type: String, default: '添加人员' }
});

const emit = defineEmits(['update:modelValue', 'submit', 'success']);
const formRef = ref(null);
const formModel = ref({ id: null, username: '', role: '' }); // 包含 id

// 控制对话框的显示与隐藏
const dialogVisible = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue;
});

watch(dialogVisible, (newValue) => {
  emit('update:modelValue', newValue);
});

// 确保每次收到新的 formData 时更新 formModel
watch(() => props.formData, (newValue) => {
  // 深拷贝，确保不会直接引用传递的数据
  formModel.value = { ...newValue }; // 包含 id
}, { immediate: true });

// 确认提交
const onConfirm = async () => {
  // 验证表单后提交
  if (await formRef.value.validate()) {
    const { id, username, role } = formModel.value;
    emit('submit', { id, username, role });  // 提交数据包含 id
    emit('update:modelValue', false); // 关闭对话框
    emit('success');
  }
};

const rules = {
  username: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '姓名必须是2-10位非空字符',
      trigger: 'blur'
    }
  ],
  role: [
    { required: true, message: '请输入用户身份', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '信息必须是2-10位非空字符',
      trigger: 'blur'
    }
  ]
};
</script>