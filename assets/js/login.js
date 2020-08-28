$(function() {
    // 给'去注册账号'绑定点击事件
    $('#link_reg').on('click', function() {
        $('.lpgin-boix').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.lpgin-boix').show()
        $('.reg-box').hide()
    })

    // 从layui中获取 form 对象  
    var form = layui.form
    var layer = layui.layer
        // 通过form.verify() 函数自定义校验规则
    form.verify({
            // 自定义了pwd的这个校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            // 校验两次密码是否一致
            repwd: function(value) {
                // 通过形参拿到的是确认密码框中的内容
                // 还需拿到密码框中的内容
                // 然后进行一次等于的判断
                // 如果判断失败，则return 一个错误提示消息
                var pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) {
                    return '两次密码不一致！'
                }

            }
        })
        // 监听注册表单的提交事件 
    $('#form_reg').on('submit', function(e) {
        // 阻止默认的提交行为
        e.preventDefault()
            // 发起ajax行为的post请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
                    // return console.log(res.message)
            }
            // console.log('注册成功，请登录！')
            layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // console.log(res.token)
                    // 将登录成功得到的token字符串保存到localStrage中
                console.log(res.token)
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})