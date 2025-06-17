// import { defineStore } from "pinia";
// const useSocketStore = defineStore("socket", {
//   state: () => ({
//     ws: undefined,
//     url: `ws://ytt2wx.natappfree.cc/webSocket`,
//     heartTimeOut: 40000, //监测心跳时间 40秒
//     //this.isReConnection = false
//     lockReconnect: false, //避免重连
//     timerReconnect: undefined,
//     timerHeart: undefined,
//     timerServerHeart: undefined,
//     handClose: false,
//     msg: "",
//   }),
//   actions: {
//     connection(url) {
//       // 如果已经存在一个 WebSocket 连接且未关闭，则先关闭它
//       if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
//         this.closeWs();
//       }
//       // 然后建立新的连接
//       if ("WebSocket" in window) {
//         this.createWebSocket(url);
//       } else {
//         console.log("您的浏览器不支持websocket通信");
//       }
//     },
//     //初始化
//     createWebSocket(url) {
//       try {
//         this.ws = new WebSocket(url);
//         this.initWebsocket();
//       } catch (e) {
//         console.log("catch eeeee=", e);
//         this.reConnection();
//       }
//     },
//     initWebsocket() {
//       //建立连接
//       this.ws.onopen = () => {
//         this.ws.send("连接成功");
//         console.log("连接成功");
//         //连接成功后，需要开启监测心跳
//         this.heartCheck();
//       };

//       this.ws.onmessage = (messages) => {
//         // console.log(messages.data)
//         let msg = messages.data;
//         if (msg.includes("{")) {
//           msg = JSON.parse(msg);
//         }
//         this.msg = msg;
//         //接收到消息后，需要开启监测心跳
//         this.heartCheck();
//       };

//       this.ws.onerror = () => {
//         //连不上时onerror 和 onclose 监听同时会捕捉到
//         console.log("连接失败");
//         // 连失败需要重连
//         this.reConnection();
//       };

//       this.ws.onclose = () => {
//         //是否正常关闭  正常关闭不需要重连， 否则需要重连
//         if (!this.handClose) {
//           this.reConnection();
//         }
//       };
//     },

//     clearTimer() {
//       this.timerReconnect && clearTimeout(this.timerReconnect);
//       this.timerHeart && clearTimeout(this.timerHeart);
//       this.timerServerHeart && clearTimeout(this.timerServerHeart);
//     },

//     //重连
//     reConnection() {
//       console.log("尝试重新连接");
//       if (this.lockReconnect) {
//         console.log("重连锁定中，跳过此次重连尝试");
//         return;
//       }

//       this.lockReconnect = true;

//       // 清除任何存在的重连定时器
//       if (this.timerReconnect) {
//         clearTimeout(this.timerReconnect);
//       }

//       // 确保 WebSocket 已经关闭
//       if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
//         console.log("关闭现有的 WebSocket 连接");
//         this.ws.close();
//       }

//       // 设置延迟重连，避免请求过多
//       this.timerReconnect = setTimeout(() => {
//         try {
//           console.log("启动新的 WebSocket 连接...");
//           this.connection(this.url); // 确保传递 URL 参数
//           this.lockReconnect = false;
//         } catch (error) {
//           console.error("重连时发生错误:", error);
//           this.lockReconnect = false; // 出错后解锁重连
//         }
//       }, 1000); // 你可以根据需要调整延迟时间
//     },

//     //心跳
//     heartCheck() {
//       // console.log("监测心跳")
//       if (this.timerHeart) {
//         clearTimeout(this.timerHeart);
//       }
//       // if(this.timerServerHeart){
//       //   clearTimeout(this.timerServerHeart)
//       // }
//       this.timerHeart = setTimeout(() => {
//         // console.log("PING");
//         // this.ws.send("PING");
//         // this.timerServerHeart = setTimeout(() => {
//         //   // 断了
//         //   this.ws.close()
//         // }, 5000);

//         this.lockReconnect = false;
//       }, this.heartTimeOut); //40秒
//     },

//     //发送消息
//     sendMsg(data) {
//       // console.log("发送消息")
//       if (this.ws.readyState === WebSocket.OPEN) {
//         this.ws.send(JSON.stringify(data));
//       }
//     },

//     //关闭连接 手动关闭
//     closeWs() {
//       console.log("手动关闭ws");
//       this.handClose = true;
//       this.clearTimer();
//       this.ws.close();
//     },
//   },
// });

// export default useSocketStore;
import { defineStore } from "pinia";

const useSocketStore = defineStore("socket", {
  state: () => ({
    ws: undefined,
    url: `ws://ytt2wx.natappfree.cc/webSocket`,
    lockReconnect: false, //避免重连
    timerReconnect: undefined,
    handClose: false,
    msg: "",
  }),
  actions: {
    connection(url) {
      // 如果已经存在一个 WebSocket 连接且未关闭，则先关闭它
      if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
        this.closeWs();
      }
      // 然后建立新的连接
      if ("WebSocket" in window) {
        this.createWebSocket(url);
      } else {
        console.log("您的浏览器不支持websocket通信");
      }
    },
    //初始化
    createWebSocket(url) {
      try {
        this.ws = new WebSocket(url);
        this.initWebsocket();
      } catch (e) {
        console.log("catch eeeee=", e);
        this.reConnection();
      }
    },
    initWebsocket() {
      //建立连接
      this.ws.onopen = () => {
        this.ws.send("连接成功");
        console.log("连接成功");
      };

      this.ws.onmessage = (messages) => {
        let msg = messages.data;
        if (msg.includes("{")) {
          msg = JSON.parse(msg);
        }
        this.msg = msg;
      };

      this.ws.onerror = () => {
        console.log("连接失败");
        this.reConnection();
      };

      this.ws.onclose = () => {
        if (!this.handClose) {
          this.reConnection();
        }
      };
    },

    clearTimer() {
      this.timerReconnect && clearTimeout(this.timerReconnect);
    },

    //重连
    reConnection() {
      console.log("尝试重新连接");
      if (this.lockReconnect) {
        console.log("重连锁定中，跳过此次重连尝试");
        return;
      }

      this.lockReconnect = true;

      if (this.timerReconnect) {
        clearTimeout(this.timerReconnect);
      }

      if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
        console.log("关闭现有的 WebSocket 连接");
        this.ws.close();
      }

      this.timerReconnect = setTimeout(() => {
        try {
          console.log("启动新的 WebSocket 连接...");
          this.connection(this.url);
          this.lockReconnect = false;
        } catch (error) {
          console.error("重连时发生错误:", error);
          this.lockReconnect = false;
        }
      }, 1000);
    },

    //发送消息
    sendMsg(data) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      }
    },

    //关闭连接 手动关闭
    closeWs() {
      console.log("手动关闭ws");
      this.handClose = true;
      this.clearTimer();
      this.ws.close();
    },
  },
});

export default useSocketStore;