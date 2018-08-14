Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{
      isLogin: false,
      unfold: true,
      Packup: false,
      isLogin1: false,
      unfold1: true,
      Packup1: false,
      isLogin2: false,
      unfold2: true,
      Packup2: false,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      unfold: true,
      unfold1: true,
      unfold2: true,
    })
  },
  unfold: function () {
    this.setData({
      unfold: false,
      Packup: true,
      isLogin: true,
    })
  },
  Packup: function () {
    this.setData({
      unfold: true ,
      Packup: false,
      isLogin: false,
    })
  },
  unfold1: function () {
    this.setData({
      unfold1: false,
      Packup1: true,
      isLogin1: true,
    })
  },
  Packup1: function () {
    this.setData({
      unfold1: true,
      Packup1: false,
      isLogin1: false,
    })
  },
  unfold2: function () {
    this.setData({
      unfold2: false,
      Packup2: true,
      isLogin2: true,
    })
  },
  Packup2: function () {
    this.setData({
      unfold2: true,
      Packup2: false,
      isLogin2: false,
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