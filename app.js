const { request } = require('./utils/request.js')
const { login, getUserInfo } = require('./utils/address.js')

App({
  onLaunch: function (options) {
    this.globalData.scene = options.scene;
    let that = this;
    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let os = res.system;
        let model = res.model;
        that.globalData.model = res.model;
        if(!/android/i.test(os)){
          that.globalData.os = "iOS";
        }else{
          that.globalData.os = "android";
        }
      }
    })
    // 场景值
    // console.log(options.scene)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const code = res.code;
        // 请求参数
        const url = login;
        const data = {
          code: code
        };
        const method = 'GET';
        // 获取 openid and session_key
        request(url, data, method, (res) => {
          // 保存全局
          this.globalData.isRookie = res.data.data.isRookie;
          // this.globalData.session_key = res.data.data;
          // 调用userInfo
          

          this.getUserInfo(res.data.data);

          if(that.sessionKeyCb) {
            that.sessionKeyCb(res)
          }
        });
        // 初始化接口
      }
    })
  },
  getUserInfo(session_id) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 这里不能使用util里面的方法，导致了循环引用
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              this.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              // 由于愚蠢的错误
              const { nickName, gender, avatarUrl, city, country, language, province } = res.userInfo;
              console.log(res.userInfo.avatarUrl)
              const sessionId1 = session_id.sessionId;
              let that = this;
              that.globalData.session = session_id.sessionId;
              request(getUserInfo, {
                sessionId: sessionId1,
                avatarUrl: avatarUrl,
                nickname: nickName,
              }, 'POST', res => {
                // 获取成功
                // wx.clearStorageSync()
                console.log(`后台返回用户信息${JSON.stringify(res)}`);
              });
              fail: res => {
                console.log(`login错误：${res}`)
              }
            }
          })
        }
      }
    })
  },
  // onShow(options){
  //     console.log(options)
  //     wx.getShareInfo({
  //         shareTicket: '',
  //         success: res => {
  //             console.log(res);
  //         },
  //         fail: error => {
  //             console.log(error)
  //         }
  //     })
  // },
  globalData: {
    userInfo: null
  }
})