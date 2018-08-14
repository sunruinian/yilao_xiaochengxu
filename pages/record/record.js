const time = require('../../utils/util.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    userId: '',
    credit: '',
    articles: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openId = options.openId;
    const userId = options.userId;
    const credit = options.credit;
    this.setData({
      openId: openId,
      userId: userId,
      credit: credit,
    });
    const that = this;
    let shuzi = Math.random() * 100000;
    let number1 = Math.round(shuzi);
    let url = "https://hkc.chengyudashen.com/mall/api/order/history";
    wx.request({
      url: url, 
      data: { 
        userId: userId, 
        ticket: number1,
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        const result = res.data.dataList;
        for (let i = 0; i < result.length; i++) {
          result[i]["time"] = time.formatTime(new Date(result[i]["time"]))
        }
        const newArticles = result;
        that.setData({
          articles: newArticles,
        });
      }
    })
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