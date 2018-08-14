// 配置请求后续地址
const address = {
    // // 第一周
  login: '/hkc/user/login',//登录请求session_key
  getUserInfo:'/hkc/user/getUserInfo',//获取用户信息
  openRedBag:'/hkc/user/openRedBag',//红包金额
  readStatus: '/hkc/gold/readStatus',//首页阅读加金币状态
  center:'/hkc/user/center',//个人中心
  initialize:'/hkc/config/initialize',//每次获得金币的个数
  readAdd:'/hkc/gold/readAdd',//完成答题
  clearLimitTime: '/hkc/share/clearLimitTime',//清楚时间
  sendFormId: '/hkc/share/sendFormId',//清楚时间
};

module.exports = address;