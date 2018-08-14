const app = getApp().globalData;
const { request } = require('../../utils/request.js')
const { login, openRedBag, center } = require('../../utils/address.js')
const time = require('../../utils/util.js');
const { getLogin, postUserInfo } = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    select1: false,
    select2: false,
    selected: true,
    selected1: false,
    selected2: false,
    isLogin: false,
    buzu: true,
    liji: false,
    isLogin2: false,
    isLogin1: false,
    openId: '',
    userId: '',
    credit: '',
    number1: '',
    status: '',
    price: '',
    articles: [],
    id: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.jiazai()
    let openId = options.openId;
    let userId = options.userId;
    let shuzi = Math.random() * 100000
    let number1 = Math.round(shuzi)
    console.log(openId)
    this.setData({
      openId: openId,
      userId: userId,
      number1: number1,
    });
    const that = this;
    let url = 'https://hkc.chengyudashen.com/mall/api/category/product/list?categoryId=1&&openId=' + openId + '&&userId=' + userId + '&&ticket=' + number1;
    wx.request({
      url: url,
      success: function (res) {
        const result = res.data.dataList;
        const shangpinid =  parseInt(result[0].id);
        const shangpinid1 = parseInt(result[1].id);
        const shangpinid2 = parseInt(result[2].id);
          console.log(typeof (shangpinid))
          that.setData({
            id: shangpinid,
            id1: shangpinid1,
            id2: shangpinid2,
            status: shangpinid,
          });

        let url1 = 'https://hkc.chengyudashen.com/mall/api/product/simpleDetail';
        wx.request({
          url: url1,
          data: {
            userId: userId,
            id: that.data.id,
            ticket: number1,
          },
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
          }
        })

        const oldArticles = that.data.articles,
        newArticles = result;
        that.setData({
          articles: newArticles,
          price: parseFloat(newArticles[0].price)
        });
        let qianzhe1 = parseFloat(that.data.credit)
        let qianzhe = that.returnFloat(qianzhe1)
        let houzhe = parseFloat(newArticles[0].price)
        if (qianzhe > houzhe) {
          that.setData({
            buzu: false,
            liji: true
          })
        }
      }
    })
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
  bingjing: function () {
    var that = this;
    that.setData({
      select: !that.data.select,
    });
  },
  bingjing1: function () {
    var that = this;
    that.setData({
      select1: !that.data.select,
    });
  },
  bingjing2: function () {
    var that = this;
    that.setData({
      select2: !that.data.select,
    });
  },

  selected: function (e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected: true,
      buzu: true,
      liji: false,
      status: this.data.id,
      price: this.data.articles[0].price,
    })
    let qianzhe = parseFloat(this.data.credit)
    let houzhe = parseFloat(this.data.articles[0].price)
    if (qianzhe > houzhe){
      this.setData({
        buzu: false,
        liji: true
      })
    }
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected2: false,
      selected1: true,
      buzu: true,
      liji: false,
      status: this.data.id1,
      price: this.data.articles[1].price,
    })
    let qianzhe = parseFloat(this.data.credit)
    let houzhe = parseFloat(this.data.articles[1].price)
    if (qianzhe > houzhe) {
      this.setData({
        buzu: false,
        liji: true
      })
    }
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true,
      buzu: true,
      liji: false,
      status: this.data.id2,
      price: this.data.articles[2].price
    })
    let qianzhe = parseFloat(this.data.credit)
    let houzhe = parseFloat(this.data.articles[2].price)
    if (qianzhe > houzhe) {
      this.setData({
        buzu: false,
        liji: true
      })
    }
  },
  deficiency: function () {
    let url2 = 'https://hkc.chengyudashen.com/mall/api/order/create';
    let userId = this.data.userId;
    let number1 = this.data.number1;
    let openId = this.data.openId;
    let status = this.data.status;
    let that = this
    wx.request({
      url: url2,
      data: {
        userId: userId,
        productId: status,
        wechatOpenId: openId,
        ticket: number1,
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 200){
          that.setData({
            isLogin: true,
            isLogin2:true,
          })
          let logintimes3 = time.formatTime(new Date());
          let userId3 = that.data.session_key.userId;
          wx.reportAnalytics('successful', {
            userid: userId3,
            logintimes: logintimes3,
            scene: app.scene,
            productId: that.data.status,
            integral: that.data.price,
          });
        }
        if (res.data.code !== 200) {
          that.setData({
            isLogin1: true,
            isLogin2: true,
          })
        }
      }
    })
  },
  ascertain: function () {
    this.setData({
      isLogin: false,
      isLogin2: false,
    })
  },
  ascertain1: function () {
    this.setData({
      isLogin1: false,
      isLogin2: false,
    })
  },

  
  jiazai: function () {
    if (app.session_key) {
      this.setData({
        session_key: app.session_key
      });
      let url = center
      let sessionId2 = this.data.session_key.sessionId
      request(url, {
        sessionId: sessionId2,
      }, 'POST', res => {
        let credit = res.data.data.credit / 100;
        this.setData({
          credit: credit,
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
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.jiazai();
    let userId = this.data.userId;
    let openId = this.data.openId;
    let shuzi = Math.random() * 100000
    let number1 = Math.round(shuzi)
    const that = this;
    let url = 'https://hkc.chengyudashen.com/mall/api/category/product/list?categoryId=1&&openId=' + openId + '&&userId=' + userId + '&&ticket=' + number1;
    wx.request({
      url: url,
      success: function (res) {
        const result = res.data.dataList;
        const oldArticles = that.data.articles,
        newArticles = result;
        that.setData({
          articles: newArticles,
        });
        let qianzhe = parseFloat(that.data.credit)
        let houzhe = parseFloat(newArticles[0].price)
        if (qianzhe > houzhe) {
          that.setData({
            buzu: false,
            liji: true
          })
        }


      }
    })
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
    
  }
})