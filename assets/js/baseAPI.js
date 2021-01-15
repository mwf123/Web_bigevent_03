// 开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net';
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url
})