import httpInstance from "@/utlis/http";
//获取楼层实时数据
export const GetRoomAPI = () => {
  return httpInstance({
    url: "/device/room",
    method: "get",
  });
};
