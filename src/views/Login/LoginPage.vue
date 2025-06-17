<template>
  <el-row class="login-page">
    <el-col :span="12" :offset="6" class="form">
      <!-- 登录相关表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        autocomplete="off"
        v-if="!isRegister"
      >
        <!-- 表单的一行 -->
        <el-form-item>
          <h1>系统登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            name="password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item>
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          </el-form-item>
          <!-- <el-link type="primary" :underline="false">忘记密码？</el-link> -->
        </el-form-item>
        <el-form-item>
          <el-button
            @click="Login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="info"
            :underline="false"
            @click="isRegister = true"
            style="margin-top: -10px; font-size: 14px"
            >没有账号，前往注册</el-link
          >
        </el-form-item>
      </el-form>

      <!-- 注册相关表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>系统注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            name="password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input
            v-model="form.rePassword"
            name="rePassword"
            type="password"
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
            >注册</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            type="info"
            :underline="false"
            @click="isRegister = false"
            style="margin-top: -10px; font-size: 14px"
            >返回登录</el-link
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, watch,watchEffect } from "vue";
import { useRouter } from "vue-router";
import { User, Lock } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user.js";
import { userRegisterAPI } from "@/apis/user";
import { Base64 } from "js-base64";

const rememberMe = ref(false);
const router = useRouter();
const UserStore = useUserStore();
const form = ref({
  username: "",
  password: "",
  rePassword: "",
});

const rules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 10, message: "用户名必须是 2-10位的字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { pattern: /^\S{4,15}$/, message: "密码长度为4-15个字符", trigger: "blur" },
  ],
  rePassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^\S{4,15}$/,
      message: "密码长度为4-15个字符",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

const isRegister = ref(false);

//获取form实例
const formRef = ref(null);

//登录
const Login = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const { username, password } = form.value;
        await UserStore.getUserInfo({ username, password });
        if (UserStore.token) {
          ElMessage({ type: "success", message: "登录成功" });
          if (rememberMe.value) {
            // 使用 Base64 编码用户名和密码
            localStorage.setItem("username", Base64.encode(username));
            localStorage.setItem("password", Base64.encode(password));
          } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
          }
          // 根据角色进行不同的路由跳转
          if (UserStore.role === "admin") {
            router.replace({ path: "/manage/personnel" });
          } else {
            router.replace({ path: "/home" });
          }
        } else {
          ElMessage({ type: "error", message: "用户名或密码错误" });
        }
      } catch (error) {
        console.error("登录失败:", error);
        ElMessage({ type: "error", message: "登录失败，请重试" });
      }
    }
  });
};

watchEffect(() => {
  if (localStorage.getItem("username") && localStorage.getItem("password")) {
    // 使用 Base64 解码用户名和密码
    form.value.username = Base64.decode(localStorage.getItem("username"));
    form.value.password = Base64.decode(localStorage.getItem("password"));
    rememberMe.value = true; // 自动勾选“记住我”
  }
});

//注册
const register = async () => {
  formRef.value.validate(async (valid) => {
    //valid：所有表单都通过才为true
    if (valid) {
      const res = await userRegisterAPI(form.value);
      console.log(res);
      if (res === "") {
        ElMessage({ type: "error", message: "用户名已存在" });
      } else {
        ElMessage.success("注册成功");
      }
      isRegister.value = false;
    }
  });
};

// const login = async () => {
//   await form.value.validate(); // Validate form before proceeding
//   const { username, password } = formModel.value;
//   try {
//     const response = await userLoginService({ username, password });
//     console.log("Login response:", response);
//     if (response.code === 200) {
//       const userStore = useUserStore();
//       userStore.setToken(response.data.token);
//       userStore.setRole(response.data.role);
//       if (response.data.role === 'admin') {
//         ElMessage.success('登录成功');
//         router.push('/manage/personnel');
//       } else {
//         ElMessage.success('登录成功');
//         router.push('/home');
//       }
//     } else {
//       ElMessage.error('用户名或密码错误');
//     }
//   } catch (error) {
//     ElMessage.error('登录失败，请重试');
//     console.error(error);
//   }
// };
watch(isRegister, () => {
  form.value = {
    username: "",
    password: "",
    repassword: "",
  };
});
</script>
<style scoped>
.login-page {
  min-height: 100vh; /* 确保页面高度至少为视口高度 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中对齐内容 */
  position: relative;
  background-image: url("@/assets/dlbg.png");
  background-repeat: no-repeat;
  z-index: 0;
  background-size: cover;
  background-position: center bottom; /* 将背景图定位到底部 */
  background-attachment: fixed; /* 固定背景图，防止滚动时出现空白 */
}

.login-page::before {
  height: 100%; 
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  content: "";
  z-index: -1;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 200px auto;
  z-index: 1;
}

.form .el-form {
  background-color: #fff;
  max-width: 500px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  margin: 50px auto;
  padding: 35px 50px 15px 50px;
  /* box-shadow: 0 0 25px #cacaca; */
  z-index: 2; /* 提高表单内容的层级 */
  position: relative; /* 确保层级作用正确 */
}

.form .el-form .el-form-item {
  margin-bottom: 22px;
}

.form .el-form .button {
  width: 100%;
}

.form .el-form .flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
