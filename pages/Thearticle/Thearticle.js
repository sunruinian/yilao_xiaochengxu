var WxParse = require('../../wxParse/wxParse.js');
const { request } = require('../../utils/request.js');
const { readAdd, initialize, sendFormId } = require('../../utils/address.js');
const time = require('../../utils/util.js');
const { getLogin, postUserInfo } = require('../../utils/util.js');
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [],
    unixTimestamp: '',
    article: '',
    gold: '',
    readAddGoldNum: '',
    timeout: false,
    reward: false,
    isLogin: false,
    argument: 0,
    showModal: false,
    logintimes: '',
    logintimes1: '',
    session_key: '',
    Backnumber: '',
    isAuthorized: '',
    isRookie: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getLogin(key => {
      this.setData({
        session_key: key
      })
    })
    
    let logintimes1 = Date.parse(new Date());
    let logintimes = time.formatTime(new Date());
    this.setData({
      logintimes1: logintimes1,
      logintimes: logintimes,
    })

    request(initialize, {}, 'POST', res => {
      // 获取成功
      let readAddGoldNum1 = res.data.data.readAddGoldDelayTime;
      this.setData({
        readAddGoldNum: readAddGoldNum1
      })
    });
    const that = this;
    const argument = options.id;
    console.log(argument)
    if (options.Backnumber == 2) {
      let Backnumber = options.Backnumber;
      that.setData({
        Backnumber: Backnumber,
      })
    }
    that.setData({
      argument: argument,
    })
    const url = 'https://info.coohua.com/api/news/wx/' + argument;
    console.log(url)
    wx.request({
      url: url,
      success: function (res) {
        if (res.data !== '') {
          let oldArticles = that.data.articles,
            newArticles = oldArticles.concat(res.data.result);
          let Times = res.data.result.uperUpdateTime;
          let Timestamp = new Date(Times);
          Date.prototype.toLocaleString = function () {
            return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds()
          }
          let commonTime = Timestamp.toLocaleString();
          let content = res.data.result.content;
          that.setData({
            articles: newArticles,
            unixTimestamp: commonTime,
            article: content
          });
          WxParse.wxParse('article', 'html', that.data.article, that, 5);
          that.setData({
            article: that.data.article
          })
        }
      }
    })

    setTimeout(function () {
      that.setData({
        timeout: true
      })
    }, 10000);

    let id = setInterval(function () {
      if (that.data.timeout && that.data.reward) {
        that.addCoin();
        clearInterval(id);
      }
    }, 500)
    //wx.clearStorageSync()
  },
  onPageScroll: function (e) {
    if (!this.data.reward) {
      if (e.scrollTop > 1000) {
        // 加奖励
        this.setData({
          reward: true
        })
      }
    }

  },
  addCoin: function () {
    const yanchi = this.data.readAddGoldNum;
    let arr = wx.getStorageSync('key');
    if (arr == '') {
      arr = [];
      wx.setStorageSync(
        'key', arr,
      )
    }
    let arrSet = new Set(arr);
    let argument = this.data.argument;
    if (!arrSet.has(argument)) {
      let sessionId2 = app.session_key.sessionId
      let url1 = readAdd
      request(url1, {
        sessionId: sessionId2,
      }, 'POST', res => {
        if (res.data.code == 0) {
          let gold = res.data.data.gold
          let limitTime = res.data.data.limitTime
          let that = this
          setTimeout(function () {
            that.setData({
              isLogin: true,
              gold: gold,
            })
          }, yanchi);
          arr.push(argument);
          wx.setStorageSync(
            'key', arr,
          )
        } else {
          this.setData({
            showModal: false
          });
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getLogin(key => {
      this.setData({
        isAuthorized: key.isAuthorized,
      })
      this.setData({
        isRookie: key.isRookie,
      })
      console.log(key.isAuthorized)
      console.log(key.isRookie)
      if (key.isAuthorized == 0) {
        //全局变量
        app.weishouquan = 0
      }
      if (key.isRookie == 0) {
        //全局变量
        app.weilingqu = 0
      }
    })
    // console.log(this.data.isAuthorized)
    // console.log(this.data.isRookie)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.leves();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      timeout: false,
      reward: false,
    })
    this.leves();
  },
  leves: function () {
    let userid = this.data.session_key.userId;
    let logintimes1 = this.data.logintimes1;
    let logintimes = this.data.logintimes
    let levestime = Date.parse(new Date());
    let durationtimes = (levestime - logintimes1) / 1000;
    wx.reportAnalytics('duration', {
      userid: userid,
      durationtimes: durationtimes,
      scene: app.scene,
      logintimes: logintimes,
    });
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
  homepage: function () {
    wx.navigateBack({
      delta: 2
    })

    if(this.data.Backnumber == 2){
      let shuzucan = this.data.Backnumber
      wx.reLaunch({
        url: '/pages/index/index?shuzucan=' + shuzucan, 
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  submit: function (e) {
    console.log('fromid',e.detail.formId);
    console.log(this.data.session_key.sessionId)
    if (this.data.session_key.sessionId !== undefined ) {
      request(sendFormId, {
        formId: e.detail.formId,
        sessionId: this.data.session_key.sessionId,
      }, 'POST', res => {
        // 获取成功
        console.log('成功了', res.data.data)
      });
    }
  },
  onShareAppMessage: function () {
    let title = this.data.articles[0].title;
    let imageUrls = this.data.article.imageUrls[0];
    let Backnumber = 2
    let argument = this.data.argument;
    //已认证
    if (imageUrls !== undefined) {
      return {
        title: title,
        path: 'pages/Thearticle/Thearticle?id=' + argument + '&&Backnumber=' + Backnumber,
        imageUrl: imageUrls,
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    } else {
      return {
        title: title,
        path: 'pages/Thearticle/Thearticle?id=' + argument + '&&Backnumber=' + Backnumber,
        imageUrl: '../../images/Sharearticle.png',
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  }
})