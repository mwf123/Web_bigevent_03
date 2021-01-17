// 入口函数
$(function () {
    // 1.获取用户信息
    getUserInfo();

    // 2.退出
    var lauer = layui.lauer;
    $('#btnlogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            // 1.清空本地 token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = "/login.html";
            // 3.关闭询问框
            layer.close(index);
        });
    })
})
// 封装获取用户信息函数(因其他页面还要使用所以封装为全局函数)
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        headers: {
            // 重新登录 因为token 过期12小时
            Authorization: localStorage.getItem("token") || ""
        },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功，渲染页面
            renderAvatar(res.data);
        }
    });
}
// 封装渲染头像函数
function renderAvatar(user) {
    // 1.渲染昵称
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎 " + name);
    // 2.渲染头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text_avatar').hide();
    } else {
        // 没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase(); //toUpperCase()使所有字符串大写
        $('.text_avatar').show().html(text);
    }
}