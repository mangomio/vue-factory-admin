import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userLoginAPI } from "@/apis/user.js";

export const useUserStore = defineStore(
  "user",
  () => {
    const userInfo = ref({});

    const token = computed(() => userInfo.value.token || "");
    const role = computed(() => userInfo.value.role || "");

    // 获取用户信息（登录时使用）
    const getUserInfo = async ({ username, password }) => {
      const res = await userLoginAPI({ username, password });
      if (res.token) {
        // 设置用户信息，如果 role 为空，则默认为 "user"
        const { token, role } = res;
        userInfo.value = {
          token,
          role: role || "user", // 如后端返回的 role 为空，则设置为 "user"
        };
      } else {
        userInfo.value = {}; // 清空用户信息
      }
      console.log(res);
    };
    // 设置 Token
    const setToken = (token, role = "") => {
      if (token) {
        userInfo.value = { token, role }; // 同时保存 token 和 role
      } else {
        userInfo.value = {}; // 清空用户信息
      }
    };

    return {
      userInfo,
      getUserInfo,
      setToken,
      token,
      role,
    };
  },
  {
    persist: {
      key: "userStore",
      strategies: [
        {
          key: "userStore",
          storage: localStorage,
        },
      ],
    },
  }
);
