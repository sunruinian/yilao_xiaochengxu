const app = getApp().globalData;
const { request } = require('../../utils/request.js')
const countDownUtl = require('../../utils/time.js')
const { login, openRedBag, readStatus, initialize, clearLimitTime, sendFormId } = require('../../utils/address.js')
const time = require('../../utils/util.js');
const fun_base64 = require('../../utils/Base64.js')
const fun_aes = require('../../utils/aes.js');
const { getLogin, postUserInfo } = require('../../utils/util.js');
const obj_base64 = new fun_base64.Base64();
const str_base64_decode = obj_base64.decode('7WcNcg2P2YAruAO5Y1WoRw==');
const key = fun_aes.CryptoJS.enc.Base64.parse("7WcNcg2P2YAruAO5Y1WoRw==");
const iv = fun_aes.CryptoJS.enc.Utf8.parse('6666666666666666'); 
const n = 0;
Page({
    data: {
        /** 
         * 需要访问的url 
         */
        urls: [
            'https://info.coohua.com/api/news/wx?times=8&exposureTime=0&os='+app.os+'&appCurVersion=3.0.6.0&pubTime=1522080303009&userId=1001&direction=1&typeId=3&count=15',
            'https://info.coohua.com/api/news/wx?times=8&exposureTime=0&os='+app.os+'&appCurVersion=3.0.6.0&pubTime=1522080303009&userId=1001&direction=1&typeId=3&count=15'
        ],
        urln: [
          'http://test-nginx.coohua.com:9988/nap-api/ad/getMiniNewsAd',
          'http://test-nginx.coohua.com:9988/nap-api/ad/getMiniNewsAd'
        ],
        /** 
         * 当前访问的url索引 
         */
        currentUrlIndex: 0,
        currentUrlIndex1: 0,
        canshu: 0,
        canshu1: 0,
        isLogin: true,
        isLogin1: true,
        isLogin2: true,
        isLogin4: true,
        userId: '',
        logintimes: '',
        scene: '',
        system: '',
        model: '',
        /** 
         * 获取到的文章 
         */
        articles: [],
        xiabiao: '',
        /** 
         * 控制上拉到底部时是否出现 "数据加载中..." 
         */
        hidden: true,
        session_key: '',
        redBag: '',
        dailyTimes: '',
        adid: '',
        dailyMaxTimes: '',
        dailyTimes1: '',
        bizhi: '',
        gold: '',
        sec: '',
        time: '',
        limitTime: '',
        readAddGoldNum: '',
        showView: false,
        showView1: false,
        showView2: true,
        showView7: false,
        showView3: false,
        showView5: false,
        showView4: false,
        condition: false,
        condition1: false,
        condition2: false,
        showView6: false,
        sessionId3: '',
        quyaoqing: false,
        userIdname: '',
        options_userId: '',

        /** 
         * 数据是否正在加载中，避免数据多次加载 
         */
        loadingData: false
    },
    onLoad: function (options) {
      app.sessionKeyCb = resObj => {
      }
      this.loadData(false);
      showView: (options.showView == "true" ? true : false);
      showView1: (options.showView1 == "true" ? true : false);
      showView2: (options.showView2 == "true" ? true : false);
      showView3: (options.showView3 == "true" ? true : false);
      showView4: (options.showView4 == "true" ? true : false);
      showView5: (options.showView5 == "true" ? true : false);
      showView6: (options.showView6 == "true" ? true : false);
      showView7: (options.showView7 == "true" ? true : false);
      
     
      // 重新请求密钥
      getLogin(key => {
        this.setData({
          session_key: key
        })
        if (options.shuzucan !== undefined) {
                  //全局变量
          if (key.isAuthorized == 0) {
            console.log('weishouquan', app.weishouquan)
            this.setData({
              showView: true,
              isLogin2: false,
            })
            if (key.isRookie == 1) {
              this.setData({
                showView: false,
              })
            }
          }
          if (key.isRookie === 0) {
            console.log('weilingqu', app.weilingqu)
            this.setData({
              showView: true,
            })
            if (key.isRookie == 1) {
              this.setData({
                showView: false,
              })
            }
          }
        }
        if (options.userId !== undefined) {
          this.setData({
            options_userId: options.userId,
          })
          console.log('options.userId', options.userId);
          console.log('this.data.session_key.sessionId', this.data.session_key.sessionId)
          request(clearLimitTime, {
            sessionId: this.data.session_key.sessionId,
            userId: options.userId,
          }, 'POST', res => {
            // 获取成功
            console.log('clearLimitTime')
          });
        }
        let logintimes = time.formatTime(new Date());
        wx.reportAnalytics('visits', {
          userid: key.userId,
          logintimes: logintimes,
          system: app.os,
          model: app.model,
          scene: app.scene,
        });
        this.Ready();

        /*阅读加金币*/
        let sessionId2 = this.data.session_key.sessionId
        this.setData({
          sessionId3: sessionId2
        })
        const that = this;
        let url3 = readStatus
        request(url3, {
          sessionId: sessionId2,
        }, 'POST', res => {
          console.log('url3')
          // 获取成功
          let dailyTimes = res.data.data.dailyTimes;
          let dailyMaxTimes = res.data.data.dailyMaxTimes;
          let cishu = dailyMaxTimes - dailyTimes;
          let bizhi = dailyTimes / dailyMaxTimes * 100;
          let limitTime = res.data.data.limitTime * 1000;
          if (limitTime > 0) {
            that.setData({
              showView2: false,
              showView5: true,
            })
          }

          if (cishu == 0) {
            that.setData({
              showView3: true,
            })
          }
          that.setData({
            dailyTimes1: dailyTimes,
            dailyMaxTimes: dailyMaxTimes,
            dailyTimes: cishu,
            bizhi: bizhi
          })
        })
      })
      console.log('调起加载事件')
    },
    Ready: function(){
      if (app.session_key.isRookie == 0) {
        var that = this;
        that.setData({
          showView: true,
        })
        //打点红包展示
        let logintimes = time.formatTime(new Date());
        let userId1 = that.data.session_key.userId;
        wx.reportAnalytics('redenvelopeshow', {
          userid: userId1,
          logintimes: logintimes,
          scene: app.scene,
        });
        if (app.session_key.isAuthorized == 0) {
          that.setData({
            isLogin2: false,
          })
        }
        if (app.session_key.isAuthorized == 1) {
        }
      }
      if (app.session_key.isRookie == 1) {
        var that = this;
        that.setData({
          showView: (that.data.showView)
        })
      }
      //领取金币
      request(initialize, {}, 'POST', res => {
        // 获取成功
        console.log('initialize')
        let readAddGoldNum = res.data.data.readAddGoldNum
        this.setData({
          readAddGoldNum: readAddGoldNum
        })
      });

    },
    onChangeShowState1: function () {
      var that = this;
      that.Closes()
      that.setData({
        showView: (!that.data.showView),
        showView1: true,
        // showView2: (!that.data.showView2),
      })
    },
    onChangeShowState: function () {
      var that = this;
      that.Closes()
      that.setData({
        showView: (!that.data.showView),
        showView1: false,
      })
    },
    Closes: function () {
      let logintimes4 = time.formatTime(new Date());
      let userId4 = this.data.session_key.userId;
      wx.reportAnalytics('close_red', {
        userid: userId4,
        logintimes: logintimes4,
        scene: app.scene,
      });
      wx.canIUse('reportAnalytics')
    },
    onshow: function() {
      this.setData({
        showView: (!this.data.showView),
        // showView2: (!that.data.showView2),
      })
      console.log(this.data.showView)
      let logintimes5 = time.formatTime(new Date());
      let userId5 = this.data.session_key.userId;
      wx.reportAnalytics('floating_window', {
        userid: userId5,
        logintimes: logintimes5,
        scene: app.scene,
      });
    },
    onChangeshow: function (){
        this.setData({
          showView7: false,
          showView7: (!this.data.showView7),
          condition: (!this.data.condition),
        })
    },
    onChang: function () {
      this.setData({
        showView4: true,
        condition1: (!this.data.condition1),
      })
    },
    onChanges: function () {
      this.setData({
        showView6: (!this.data.showView6),
        condition2: (!this.data.condition2),
      })
    },
    
    /** 
     * 加载数据 
     * 
     */
    loadData: function (tail, callback) {
        const that = this,
        urlIndex = that.data.currentUrlIndex;
        wx.request({
            url: that.data.urls[urlIndex],
            success: function (res) {
              if (res.data !== '') {
                let result = res.data.result;
                for (let i = 0; i < result.length; i++) {
                  result[i]["pubTime"] = time.formatTime(new Date(result[i]["pubTime"]))
                }
                for (let n = 0; n < 3; n++) {
                  let w = 5 * n + 1;
                  result[w] = ''
                }
                let oldArticles = that.data.articles,
                  newArticles = tail ? oldArticles.concat(result) : res.data.result;
                that.setData({
                  articles: newArticles,
                  currentUrlIndex: (urlIndex + 1) >= that.data.urls.length ? 0 : urlIndex + 1
                });
                if (callback) {
                  callback();
                }
              } 
            },
            error: function (r) {
                console.info('error', r);
            },
            complete: function () { }
        });
      /*阅读加金币*/
      if (that.data.session_key.sessionId !== undefined){
        let sessionId2 = that.data.session_key.sessionId
        console.log('sessionId2',sessionId2)
        that.setData({
          sessionId3: sessionId2
        })
        let url3 = readStatus
        request(url3, {
          sessionId: sessionId2,
        }, 'POST', res => {
          // 获取成功
          console.log('陈宫')
          let dailyTimes = res.data.data.dailyTimes;
          let dailyMaxTimes = res.data.data.dailyMaxTimes;
          let cishu = dailyMaxTimes - dailyTimes;
          let bizhi = dailyTimes / dailyMaxTimes * 100;
          let limitTime = res.data.data.limitTime * 1000;
          if (limitTime > 0) {
            that.setData({
              showView2: false,
              showView5: true,
            })
          }

          if (limitTime <= 0) {
            console.log('limitTime', limitTime)
            that.setData({
              showView5: false,
              showView4: false,
              showView2: true,
            })
          }
          that.setData({
            dailyTimes1: dailyTimes,
            dailyMaxTimes: dailyMaxTimes,
            dailyTimes: cishu,
            bizhi: bizhi
          })
        })
      }
    },

    /** 
     * 监听用户下拉动作 
     */
    onPullDownRefresh: function () {
        console.info('onPullDownRefresh');
        const loadingData = this.data.loadingData,
            that = this;
        if (loadingData) {
            return;
        }
        // 显示导航条加载动画  
        wx.showNavigationBarLoading();
        // 显示 loading 提示框,在 ios 系统下，会导致顶部的加载的三个点看不见  
        // wx.showLoading({  
        //   title: '数据加载中...',  
        // });  
        setTimeout(function () {
            that.loadData(false, () => {
                that.setData({
                    loadingData: false
                });
                wx.stopPullDownRefresh();
                // wx.hideLoading();  
                wx.hideNavigationBarLoading();
                console.info('下拉数据加载完成.');
            });
        }, 50);
    },
    Encrypt: function (word) {
      var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
      var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, { mode: fun_aes.CryptoJS.mode.ECB, padding: fun_aes.CryptoJS.pad.Pkcs7 });
      var encryptedData = encrypted.toString();
      return encryptedData;
    },
    // 解密
    Decrypt: function (word) {
      var encryptedHexStr = fun_aes.CryptoJS.enc.Hex.parse(word);
      var srcs = fun_aes.CryptoJS.enc.Base64.stringify(encryptedHexStr);
      var decrypt = fun_aes.CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
      var decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
      return decryptedStr.toString();
    },
    /** 
     * 页面上拉触底事件的处理函数 
     */
    onReachBottom: function () {
        console.info('onReachBottom');
        const hidden = this.data.hidden,
            loadingData = this.data.loadingData,
            that = this;
        if (hidden) {
            this.setData({
                hidden: false
            });
            console.info(this.data.hidden);
        }
        if (loadingData) {
            return;
        }
        this.setData({
            loadingData: true
        });
        // 加载数据,模拟耗时操作  

        wx.showLoading({
            title: '数据加载中...',
        });

        setTimeout(function () {
            that.loadData(true, () => {
                that.setData({
                    hidden: true,
                    loadingData: false
                });
                wx.hideLoading();
            });
            console.info('上拉数据加载完成.');
        }, 50);
    },
    ongetuserinfo(res) {
      const { encryptedData, errMsg, iv, rawData, signature, userInfo } = res.detail;
      // 保存到全局
      app.userInfo = userInfo;
      let logintimes2 = time.formatTime(new Date());
      let userId2 = this.data.session_key.userId;
      wx.reportAnalytics('authorization', {
        userid: userId2,
        logintimes: logintimes2,
        scene: app.scene,
      });
      // 检测用户是否授权
      if (userInfo) {
        // 调用保存用户信息
        postUserInfo(userInfo);
        let logintimes3 = time.formatTime(new Date());
        let userId3 = this.data.session_key.userId;
        wx.reportAnalytics('confirm_authorization', {
          userid: userId3,
          logintimes: logintimes3,
          scene: app.scene,
        });
        this.zhanshi();
      } else {
        // 未授权
        let logintimes4 = time.formatTime(new Date());
        let userId4 = this.data.session_key.userId;
        wx.reportAnalytics('to_authorize', {
          userid: userId4,
          logintimes: logintimes4,
          scene: app.scene,
        });
        this.setData({
          isLogin: true,
        })
      }
    },
    changeName: function (e) {
      this.zhanshi();
    },
    zhanshi: function (){
      this.setData({
        isLogin: false
      })
      /*调取红包接口*/
      let sessionId2 = app.session_key.sessionId
      let url1 = openRedBag
      request(url1, {
        sessionId: sessionId2,
      }, 'POST', res => {
        // 获取成功
        console.log('陈宫shi')
        let logintimes = time.formatTime(new Date());
        let userId = this.data.session_key.userId;
        wx.reportAnalytics('redapart', {
          userid: userId,
          logintimes: logintimes,
          scene: app.scene,
        });
        wx.reportAnalytics('get_red', {
          userid: userId,
          logintimes: logintimes,
          scene: app.scene,
        });
        let redBag = res.data.data/100;
        let redBag1 = this.returnFloat(redBag)
        this.setData({
          redBag: redBag1,
        })
      });
    },
    onHide: function () {
    },
    returnFloat: function (value) {
      var value = Math.round(parseFloat(value) * 100) / 100;
      var xsd = value.toString().split(".");
      if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
      }
      if (xsd.length > 1) {
        if (xsd[1].length < 2) {
          value = value.toString() + "0";
        }
        return value;
      }
    },
    submit: function (e) {
      console.log('fromid', e.detail.formId);
      console.log('sessionId',this.data.session_key.sessionId)
      if (this.data.session_key.sessionId !== undefined) {
        request(sendFormId, {
          formId: e.detail.formId,
          sessionId: this.data.session_key.sessionId,
        }, 'POST', res => {
          // 获取成功
          console.log('sendFormId')
          console.log('成功了', res.data.data)
        });
      }
    },
    onShareAppMessage(res) {
      if (res.from === 'button') {
        let userId =  this.data.session_key.userId;
        console.log(userId)
        return {
          title: '送你一个红包，快拆！',
          path: '/pages/index/index?userId=' + userId,
          imageUrl: '../../images/Shareenvelope.png',
          success: res => {
            console.log('成功')
            this.setData({
              quyaoqing: false,
            })

          },
          fail: error => {
            console.log(error)
          }
        }
      }
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
    },
    restore: function () {
      let logintimes = time.formatTime(new Date());
      console.log('logintimes:', logintimes)
      let userId = this.data.session_key.userId;
      console.log('userId:', userId)
      wx.reportAnalytics('restore', {
        userid: userId,
        logintimes: logintimes,
        scene: app.scene,
      });
      this.setData({
        quyaoqing: true,
      })
    },
    occlude1: function () {
      this.setData({
        quyaoqing: false,
      })
    },
  onShow: function (options) {
    this.setData({
      // showView7: false,
      showView4: false,
      showView6: false,
    })
    getLogin(key => {
      this.setData({
        session_key: key
      })

      //调取取消倒计时接口
      if (this.data.options_userId !== '') {
        let logintimes = time.formatTime(new Date());
        console.log('邀请logintimes2:', logintimes)
        let userId = this.data.session_key.userId;
        console.log('邀请userId2:', userId)
        wx.reportAnalytics('home_invite', {
          userid: userId,
          logintimes: logintimes,
          scene: app.scene,
        });
        console.log('this.data.options_userId', this.data.options_userId);
        console.log('this.data.session_key.sessionId', this.data.session_key.sessionId)
        request(clearLimitTime, {
          sessionId: this.data.session_key.sessionId,
          userId: this.data.options_userId,
        }, 'POST', res => {
          // 获取成功
          console.log('clearLimitTime')
        });
      }

      /*阅读加金币*/
      let sessionId2 = this.data.session_key.sessionId
      this.setData({
        sessionId3: sessionId2
      })
      const that = this;
      let url3 = readStatus
      request(url3, {
        sessionId: sessionId2,
      }, 'POST', res => {
        // 获取成功
        console.log('zhende chegong')
        let dailyTimes = res.data.data.dailyTimes;
        let dailyMaxTimes = res.data.data.dailyMaxTimes;
        let cishu = dailyMaxTimes - dailyTimes;
        let bizhi = dailyTimes / dailyMaxTimes * 100;
        let limitTime = res.data.data.limitTime * 1000;
        if (limitTime > 0) {
          that.setData({
            showView2: false,
            showView5: true,
          })
        }
        let currentTime = limitTime;
        countDownUtl.stopTimer()
        if (currentTime > 0) {
          let totalMsec = currentTime //倒计时的总毫秒数
          countDownUtl.countDown(totalMsec, 1000, function (res) {
            that.setData({
              sec: res
            })
            if (that.data.sec == '0:00:01'){
              that.setData({
                showView5: false,
                showView4: false,
                showView2: true,
              })
            }
          })
        }
        if (currentTime <= 0 || cishu == 0) {
          that.setData({
            showView5: false,
            showView4: false,
            showView2: true,
          })
        }
        if (cishu == 0) {
          that.setData({
            showView3: true,
          })
        }
        that.setData({
          dailyTimes1: dailyTimes,
          dailyMaxTimes: dailyMaxTimes,
          dailyTimes: cishu,
          bizhi: bizhi
        })
      })
    })   
  }
})

