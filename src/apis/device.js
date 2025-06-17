//管理页设备信息列表
import httpInstance from "@/utlis/http";

//获取设备信息
export const getDeviceList = (token) =>
  httpInstance.get("/device/list", {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

// 添加设备信息
export const addDevice = (device, token) =>
  httpInstance.post("/device/add", device, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

// 编辑设备信息
export const editDevice = (device, token) =>
  httpInstance.post("/device/update",device, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

//删除设备信息
export const delDevice = (id, token) =>
  httpInstance.delete(`/device/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

//搜索设备列表
export const searchDevice = (name, deviceId, status, token) =>
  httpInstance.post(
    "/device/search",
    {
      name,
      deviceId,
      status,
    },
    {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  );

//分页
export const pageDeviceList = (pageNo, pageSize, token) =>
  httpInstance.get("/device/list", {
    params: {
      pageNo: pageNo,
      pageSize: pageSize,
    },
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
