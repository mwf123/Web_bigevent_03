$(function () {
    var layer = layui.layer;
    // 1.文章类别列表展示
    initArtCateList();
    // 封装文章列表渲染页面函数 
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 获取成功 渲染到页面
                var strHtml = template('tpl-table', res)
                $('tbody').html(strHtml);
            }
        });
    }

    // 2. 点击添加按钮 添加文章类别列表
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });
    })
    var indexAdd = null;
    // 3.提交文章分类添加 (事件委托)
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        // console.log("ok");
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功  重新渲染页面
                initArtCateList();
                layer.msg('新增文章分类成功！')
                // 手动关闭提示框
                layer.close(indexAdd);
            }
        });
    })

    // 4.修改--展示表单
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        // 4.1 利用框架代码 显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: "修改文章分类",
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });

        // 4.2 获取id 发送ajax数据
        var Id = $(this).attr('data-id');
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('dialog-edit', res.data)
            }
        });
    })

    // 4. 修改--提交
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发送ajax 
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 修改成功  渲染页面
                initArtCateList();
                layer.msg('更新分类信息成功！')
                // 关闭提示框
                layer.close(indexEdit)
            }
        });
    })

    // 5.删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取id 
        var Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 删除成功  重新渲染页面
                    initArtCateList();
                    layer.msg('删除文章分类成功！')
                    // 关闭提示框
                    layer.close(index);
                }
            });
        });
    })
})