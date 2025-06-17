//首页信息
import httpInstance from "@/utlis/http";

//获取设备信息
export const getHomeList = (token) =>
  httpInstance.get("/sys/data", {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
