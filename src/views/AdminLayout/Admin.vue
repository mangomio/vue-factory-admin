<template>
  <el-container class="layout-container-demo">
    <el-header
      style="
        display: flex;
        text-align: right;
        font-size: 12px;
        background-color: #fff;
      "
    >
      <div class="title">
        <img src="@/assets/admin-icon.png" />
        <span>工厂环境监测系统后台管理</span>
      </div>
      <div class="toolbar">
        <el-dropdown @command="handleCommand">
          <el-icon class="dropdown-link">
            <ArrowDown />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item>个人资料</el-dropdown-item> -->
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-active="activeRoute" text-color="#2e3033" router>
            <el-menu-item index="/admin/home">
              <template #title>
                <el-icon>
                  <HomeFilled /> </el-icon
                >首页
              </template>
            </el-menu-item>
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon>
                  <Menu /> </el-icon
                >信息管理
              </template>
              <el-menu-item-group>
                <el-menu-item index="/manage/personnel">用户管理</el-menu-item>
                <el-menu-item index="/manage/device">设备管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="/warn">
              <template #title>
                <el-icon>
                  <WarnTriangleFilled /> </el-icon
                >警告提醒
              </template>
              <el-menu-item-group>
                <el-menu-item index="/adminwarn">异常记录</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item index="/home">
              <template #title>
                <el-icon>
                  <setting /> </el-icon
                >工厂实况
              </template>
            </el-menu-item>

            <!-- <el-sub-menu index="/analysis">
              <template #title>
                <el-icon>
                  <Stopwatch />
                </el-icon>观测洞察
              </template>
              <el-menu-item-group>
                <el-menu-item index="/analysis/data">数据分析</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="/log">
              <template #title>
                <el-icon>
                  <Tickets />
                </el-icon>日志
              </template>
              <el-menu-item-group>
                <el-menu-item index="/log/operate">操作日志</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu> -->
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import {
  HomeFilled,
  Menu,
  Setting,
  ArrowDown,
  WarnTriangleFilled,
  Stopwatch,
  Tickets,
} from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

const activeRoute = route.path;

const handleCommand = async (key) => {
  if (key === "logout") {
    await ElMessageBox.confirm("确定退出登录吗？", "温馨提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });
    router.push("/login");
  }
};
</script>

<style lang="scss" scoped>
.layout-container-demo .el-header {
  position: fixed;
  width: 100%;
  z-index: 1000;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.layout-container-demo .el-aside {
  position: fixed;
  font-family: "微软雅黑";
  font-size: 12px;
  font-weight: bold;
  margin-top: 10px;
  top: 60px;
  height: calc(100vh - 60px);
  width: 200px;
}

.layout-container-demo .el-main {
  margin-top: 56px;
  margin-left: 200px;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 56px);
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.layout-container-demo .dropdown-link {
  margin-right: 8px;
}

.layout-container-demo .username {
  margin-right: 20px;
}

.title {
  margin-left: 40px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  line-height: 25px;
  img {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }
}
</style>
