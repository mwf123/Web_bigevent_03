$(function () {

    var layer = layui.layer;
    var form = layui.form;
    // 定义事件过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 为时间补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }
    // 1.定义提交参数
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 2.初始化文章列表
    initTable();
    // 封装初始化文章列表函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 3.初始化分类
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 获取成功
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 渲染form
                form.render();
            }
        });
    }

    // 4.筛选功能 (监听form的 submit事件)
    $('#form-search').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        console.log("ok");
        // 获取状态
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })

    // 5.分页功能
    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }

    // 6.删除功能 （事件委托）
    $('tbody').on('click', '.btn-delete', function () {
        // console.log('ok');
        // 先获取id
        var Id = $(this).attr('data-id');
        // 弹出对话框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 删除成功 渲染列表
                    layer.msg('恭喜您，删除成功！')
                    // 页面汇总按钮个数等于1，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            });
            layer.close(index);
        });
    })
})