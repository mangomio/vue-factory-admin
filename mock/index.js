// import Mock from 'mockjs';

// // 定义用户数据
// const users = [
//     {
//         username: 'admin',
//         password: '123456',
//         role: 'admin',
//         token: 'admin-token',
//     },
//     {
//         username: 'user',
//         password: '123456',
//         role: 'user',
//         token: 'user-token',
//     },
// ];

// // 模拟登录接口
// Mock.mock('/api/login', 'post', (options) => {
//     const { username, password } = JSON.parse(options.body);
//     const user = users.find(
//         (u) => u.username === username && u.password === password
//     );

//     if (user) {
//         return {
//             code: 200,
//             message: '登录成功',
//             data: {
//                 token: user.token,
//                 role: user.role,
//             },
//         };
//     } else {
//         return {
//             code: 401,
//             message: '用户名或密码错误',
//         };
//     }
// });


// // 模拟获取用户信息接口
// Mock.mock('/api/userinfo', 'get', (options) => {
//     const token = options.headers.Authorization;
//     const user = users.find((u) => u.token === token);

//     if (user) {
//         return {
//             code: 200,
//             data: {
//                 username: user.username,
//                 role: user.role,
//             },
//         };
//     } else {
//         return {
//             code: 403,
//             message: '无效的Token',
//         };
//     }
// });

// // 模拟退出登录接口
// Mock.mock('/api/logout', 'post', () => {
//     return {
//         code: 200,
//         message: '退出成功',
//     };
// });

// // 模拟温度数据
// Mock.mock('/temp', 'get', () => {
//     return {
//         status: 200,
//         data: {
//             temperature: Mock.Random.integer(1, 40), // New random temperature each time
//             timestamp: new Date().toISOString(), // Current timestamp
//         },
//     };
// });


// // 模拟湿度数据
// Mock.mock('/humi', 'get', () => {
//     return {
//         status: 200,
//         data: {
//             humidity: Mock.Random.integer(30, 90), // 湿度范围 30% 到 90%
//             timestamp: new Date().toISOString()
//         }
//     }
// });

// // 模拟电压数据
// Mock.mock('/volt', 'get', () => {
//     return {
//         status: 200,
//         data: {
//             voltage: Mock.Random.float(200, 240, 2, 2), // 电压范围 200V 到 240V
//             timestamp: new Date().toISOString()
//         }
//     }
// });

// // 模拟烟雾数据
// Mock.mock('/smog', 'get', () => {
//     return {
//         status: 200,
//         data: {
//             smog: Mock.Random.float(0, 100, 1, 2), // 烟雾浓度范围 0 到 100
//             timestamp: new Date().toISOString()
//         }
//     }
// });

// // 模拟设备数据
// Mock.mock('/device', 'get', () => {
//     return {
//         status: 200,
//         data: {
//             deviceId: Mock.Random.guid(),
//             status: Mock.Random.boolean() ? 'online' : 'offline',
//             lastUpdated: new Date().toISOString()
//         }
//     }
// });
// export default Mock;
