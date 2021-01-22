$(function () {
    var layer = layui.layer;//导入layer
    var form = layui.form; // 导入 form

    // 0.设置表单信息
    function initForm() {
        // 获取id 用等号切割，然后使用里面的值
        var Id = location.search.split("=")[1];
        $.ajax({
            type: "GET",
            url: "/my/article/" + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 获取成功渲染form表单
                form.val('form-edit', res.data);
                // tinymce赋值 百度查询
                tinyMCE.activeEditor.setContent(res.data.content);
                // 赋值图片
                // 先做判断
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传图片！')
                }
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        });

    }
    // 1.初始化文章类别
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                // 获取成功 渲染表单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                form.render();
                initForm();
            }
        });
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 5.设置图片 
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 判断用户是否选择文件，如果没有选择就return 返回出去
        if (file === undefined) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 创建 FOrmData对象，收集数据
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                publistArticle(fd)
            })
    })
    // 封装添加文章的方法
    function publistArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/edit",
            data: fd,
            // FormData类型ajax提交，需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                // 修改成功
                layer.msg("修改文章成功！");
                // location.href = "/article/art_list.html"
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click();
                }, 1200)
            }
        });
    }
})