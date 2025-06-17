//管理页人员信息列表
import httpInstance from "@/utlis/http";

//获取人员信息
export const getPersonList = (token) =>
    httpInstance.get('/user/list', {
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    })

// 添加人员信息
export const addPerson = (user,token) =>
    httpInstance.post("/user/add", 
        user
    ,{
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });

// 编辑人员信息
export const editPerson = (user, token) =>
    httpInstance.post("/user/update", user
    ,{
        headers: {
            "Content-Type": "application/json",
            token: token,
        }
    }
  );

//删除人员信息
export const delPerson = (id, token) =>
  httpInstance.delete(`/user/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      'token': token
    },
  });

//搜索人员列表
export const searchPerson = (username, token) =>
  httpInstance.post(
    "/user/search",
    null, // 请求体为空
    {
      params: {
        username: username, // 通过 params 传递查询参数
      },
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  );

//分页
export const pagePersonList = (pageNo, pageSize,token) =>
  httpInstance.get("/user/list", {
    params: {
      pageNo: pageNo,
      pageSize: pageSize,
    },
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });