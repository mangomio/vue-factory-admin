//管理页警告信息列表
import httpInstance from "@/utlis/http";

//获取警告信息
export const getWarnList = (token) =>
  httpInstance.get("/warn-log/list", {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

// 添加警告信息
export const addWarn = (Warn, token) =>
  httpInstance.post("/warn/add", Warn, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

// 编辑警告信息
export const editWarn = (Warn, token) =>
  httpInstance.post("/warn/update", Warn, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

//删除警告信息
export const delWarn = (id, token) =>
  httpInstance.delete(`/warn-log/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

//搜索警告列表
export const searchWarn = (detail, deviceId, level, token) =>
  httpInstance.post(
    "/warn-log/search",
    {
      detail,
      deviceId,
      level,
    },
    {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  );

//分页
export const pageWarnList = (pageNo, pageSize, token) =>
  httpInstance.get("/warn-log/list", {
    params: {
      pageNo: pageNo,
      pageSize: pageSize,
    },
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
