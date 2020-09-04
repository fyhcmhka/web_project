$(function() {
    // 定义一个查询的参数对象  将来发送请求的时候需要把这个对象提交到服务器
    // 定义美化时间的过滤器
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    template.defaults.imports.dataFormat = function(date) {
        const dt = new Data(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSenconds())

        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss + ':'

    }

    // 定义补零函数、
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var layer = layui.layer
    var form = layui.form
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()

    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    // return layer.msg('获取文章列表失败！')
                    console.log(res)
                }

                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('获取数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cat_id]').html(htmlStr)
                    // 重新渲染layui的表单结构
                form.render()
            }

        })
    }




    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventdefault()
            // 获取表单中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象q中的参数赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表单数据
        initTable()
    })




    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump 回调

            // 触发jump回调的两种方式
            // 1.点击页码的时候会触发jump回调
            // 2、只要调用了laypage.render 方法就会触发jump函数

            jump: function(obj, first) {

                // 可以通过first的值来判断是通过哪种方式触发的jump
                // 如果first的值为true ，证明是方式2触发的  
                // 否则就是方式1触发的

                // console.log(obj.curr)
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条数目，赋值到Q这个参数对象的pageSize属性中  
                q.pagesize = obj.limit


                if (!first) {
                    initTable()
                }
            }
        })

    }


    // 通过代理的形式 给删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function(e) {
        // 获取删除按钮个数
        var len = $('.btn-delete').length
            // 获取到文章的Id
        var id = $(this).attr('data-id')
            // e.preventdefault()
            // 询问用户是否要删除数据
        layer.confirm('确定删除?', { icon: 3, title: '删除问章分类' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                        // 当数据删除完成后，先半段当前页是否还有剩余数据，如果没有，让页码值-1，再调用initTable 方法
                    if (len === 1) {
                        //如果len=1，证明删除完毕之后页面上就没有数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        })
    })
})