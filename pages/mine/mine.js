const app = getApp().globalData;
const { request } = require('../../utils/request.js')
const time = require('../../utils/util.js');
const { login, openRedBag, center } = require('../../utils/address.js')
const { getLogin, postUserInfo } = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_key:'',
    gold: '',
    income: '',
    avatarUrl: '',
    nickname: '',
    credit: '',
    openId: '',
    userId: '',
    shouqian: 0,
    shouqian1: 0,
    isAuthorized: '',
    isRookie: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.jiazai();
  },
  ongetuserinfo(res) {
    const { encryptedData, errMsg, iv, rawData, signature, userInfo } = res.detail;
    // 保存到全局
    //登录次数
    app.userInfo = userInfo;
    let logintimes3 = time.formatTime(new Date());
    let userId3 = this.data.session_key.userId;
    wx.reportAnalytics('thelogin', {
      userid: userId3,
      logintimes: logintimes3,
      scene: app.scene,
    });
    // 检测用户是否授权
    if (userInfo) {
      // 调用保存用户信息

      /*调取红包接口*/
      postUserInfo(userInfo);
      let that = this;
      setTimeout(function () {
        that.jiazai();
      }, 300);
    } else {
      // 未授权
      this.setData({
        isLogin: true,
      })
    }
  },
  ongetuserinfo1(res) {
    const { encryptedData, errMsg, iv, rawData, signature, userInfo } = res.detail;
    // 保存到全局
    app.userInfo = userInfo;

    let logintimes3 = time.formatTime(new Date());
    let userId3 = this.data.session_key.userId;
    wx.reportAnalytics('cash', {
      userid: userId3,
      logintimes: logintimes3,
      scene: app.scene,
    });
    // 检测用户是否授权
    if (userInfo) {
      // 调用保存用户信息
      /*调取红包接口*/
      postUserInfo(userInfo);
      let that = this;
      setTimeout(function () {
        that.jiazai();
      }, 200);
      setTimeout(function () {
        let openId = that.data.openId;
        let userId = that.data.userId;
        let credit = that.data.credit;
        wx.navigateTo({
          url: '../withdrawal/withdrawal?openId=' + openId +'&&userId=' + userId + '&&credit=' + credit,
        })
      }, 300);
    } else {
      // 未授权
      this.setData({
        isLogin: true,
      })
    }
  },
  ongetuserinfo2(res) {
    const { encryptedData, errMsg, iv, rawData, signature, userInfo } = res.detail;
    // 保存到全局
    app.userInfo = userInfo;
    let logintimes3 = time.formatTime(new Date());
    let userId3 = this.data.session_key.userId;
    wx.reportAnalytics('my_order', {
      userid: userId3,
      logintimes: logintimes3,
      scene: app.scene,
    });
    // 检测用户是否授权
    if (userInfo) {
      // 调用保存用户信息
      /*调取红包接口*/
      postUserInfo(userInfo);
      let that = this;
      setTimeout(function () {
        that.jiazai();
      }, 200);
      setTimeout(function () {
        let openId = that.data.openId;
        let userId = that.data.userId;
        let credit = that.data.credit;
        wx.navigateTo({
          url: '../record/record?openId=' + openId + '&&userId=' + userId + '&&credit=' + credit,
        })
      }, 300);
    } else {
      // 未授权
      this.setData({
        isLogin: true,
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  cashing: function (){
    //客服
    let logintimes3 = time.formatTime(new Date());
    let userId3 = this.data.session_key.userId;
    wx.reportAnalytics('service', {
      userid: userId3,
      logintimes: logintimes3,
      scene: app.scene,
    });
  },
  jiazai: function (){
    if (app.session_key) {
      this.setData({
        session_key: app.session_key
      });
      


      let url = center
      let sessionId2 = this.data.session_key.sessionId
      request(url, {
        sessionId: sessionId2,
      }, 'POST', res => {
        let openId = res.data.data.openId;
        let userId = res.data.data.userId;
        let gold = res.data.data.gold;
        let income1 = res.data.data.income/100;
        let income = this.returnFloat(income1)
        let avatarUrl = res.data.data.avatarUrl;
        let nickname = res.data.data.nickname;
        let credit1 = res.data.data.credit/100;
        let credit = this.returnFloat(credit1)
        this.setData({
          gold: gold,
          income: income,
          avatarUrl: avatarUrl,
          nickname: nickname,
          credit: credit,
          openId: openId,
          userId: userId,
        })
      });
    } else {
      // 重新请求密钥
      getLogin(key => {
        this.setData({
          session_key: key
        })
      })
    }
  },
  returnFloat:function (value){
    var value= Math.round(parseFloat(value) * 100) / 100;
    var xsd= value.toString().split(".");
    if(xsd.length==1) {
      value = value.toString() + ".00";
      return value;
    }
 if(xsd.length>1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
      }
      return value;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.jiazai();
    //用户中心访问次数
    let logintimes3 = time.formatTime(new Date());
    let userId3 = this.data.session_key.userId;
    wx.reportAnalytics('center_display', {
      userid: userId3,
      logintimes: logintimes3,
      scene: app.scene,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '送你一个红包，快拆！',
      path: '/pages/index/index',
      imageUrl: '../../images/Shareenvelope.png',
      success: res => {
        console.log('成功')
      },
      fail: error => {
        console.log(error)
      }
    }
  }
})