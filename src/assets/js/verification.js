// 表单验证
class Verification {

    constructor() {
        //正则
        this.data = {
            //邮箱
            email: {
                reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                msg: '邮箱格式不正确'
            },
            //昵称
            nickname: {
                reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
                msg: "昵称只支持字母、汉字、数字以及_的字符"
            },
            //密码
            password: {
                reg: /^[A-Za-z]\w{5,15}$/,
                msg: "密码只支持字母、数字、_组合且首字符为字母"
            },
            //验证码
            verificationCode: {
                reg: /^\d{6}$/,
                msg: "验证码必须为6位数字"
            }
        }


    }

    verificat(o) {
        for (let key in o) {
            if (!this.data[key].reg.test(o[key])) {
                return {
                    pass:false,
                    msg: this.data[key].msg
                }
            }
        }
        
        return true
    }
}

export const verification = new Verification();