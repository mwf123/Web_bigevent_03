// 入口函数
$(function () {
    // 1.点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    // 2.点击“去登录账号”的链接
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    })
    // 3.自定义验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            // 提示信息
            "密码必须是6-16位，且不能输入空格"
        ],
        // 确认密码规则
        repwd: function (val) {
            // 先获取密码框的内容
            var pwd = $('.reg_box [name=password]').val().trim();
            // 判断是否相等
            if (val !== pwd) {
                return "两次密码输入不一致!"
            }
        }
    })
    // 4.给注册表单添加提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $('.reg_box [name=username]').val().trim(),
                password: $('.reg_box [name=password]').val().trim()
            },
            success: function (res) {
                // 返回状态判断
                if (res.status !== 0) {
                    return layer.msg(res.message)

                }
                // 获取成功提示
                layer.msg("注册表单成功，请登录！")
                // 手动调用去往登录的a链接
                $('#link_login').click();
                // 注册成功后清空form表单内容
                $('#form_reg')[0].reset();
            }
        });
    })
    // 5.给登录表单添加提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单内容
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                // 登录成功后提示信息
                layer.msg("恭喜您登录成功");
                // 保存token 未来的接口会用到 token
                localStorage.setItem('token', res.token);
                // 跳转到index
                location.href = "/index.html"
            }
        });
    })
})