import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Login from '@/views/Login/LoginPage.vue';
import Layout from '@/views/Layout/index.vue';
import Echarts from '@/views/Echarts/index.vue';
import Floor from '@/views/Floor/index.vue';
import Admin from '@/views/AdminLayout/Admin.vue';
import AdminHome from '@/views/AdminHome/AdminHome.vue'
import AdminPersonnel from '@/views/manage/PersonnelManage.vue'
import AdminDevice from '@/views/manage/DeviceManage.vue'
import AdminWarn from '@/views/AdminWarn/adminWarn.vue';
import EchartsWarn from '@/views/EchartsWarn/index.vue'
import { storeToRefs } from 'pinia';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login", // 默认重定向到登录页
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/home",
      name: "home",
      component: Layout,
      redirect: "/home/echarts",
      children: [
        {
          path: "echarts",
          name: "echarts",
          component: Echarts,
        },
        {
          path: "floor",
          name: "floor",
          component: Floor,
        },
        {
          path: "warn",
          name: "warn",
          component: EchartsWarn,
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      children: [
        {
          name: "admin/home",
          path: "/admin/home",
          meta: {
            requireAuth: true, // 该路由项需要权限校验
          },
          component: AdminHome,
        },
        {
          name: "manage/personnel",
          path: "/manage/personnel",
          meta: {
            requireAuth: true, // 该路由项需要权限校验
          },
          component: AdminPersonnel,
        },
        {
          name: "manage/device",
          path: "/manage/device",
          meta: {
            requireAuth: true, // 该路由项需要权限校验
          },
          component: AdminDevice,
        },
        {
          name: "adminwarn",
          path: "/adminwarn",
          meta: {
            requireAuth: true, // 该路由项需要权限校验
          },
          component: AdminWarn,
        },
      ],
    },
  ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const { token, role } = storeToRefs(userStore); // 使用 storeToRefs 解构响应式对象

  if (!token.value) {
    // 如果没有 token，且目标不是登录页，则重定向到登录页
    if (to.path !== "/login") {
      next("/login");
    } else {
      next(); // 允许访问登录页
    }
  } else {

    if (role.value === "admin") {
      // 管理员可以访问所有页面
      return next();
    } else if (role.value === "user" || !role.value) {
      // 普通用户或 role 为空
      // 普通用户只能访问 /home 下的路径
      if (/^\/home/.test(to.path) || to.path === "/login") {
        return next(); // 允许访问 /home 下的页面和登录页
      } else {
        // 阻止访问其他路径并提示无权限
        ElMessage.warning("您没有权限访问此页面");
        next("/home/echarts"); // 重定向到默认首页
      }
    } else {
      // 其他情况（未知角色）
      ElMessage.warning("用户角色未知，无法访问此页面");
      next("/home/echarts");
    }
  }
});

export default router;
