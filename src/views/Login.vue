<template>
  <div class="register">
    <MsgTotal></MsgTotal>
    <div class="register-box">
      <div class="title">后台管理系统</div>
      <div class="form-box">
        <div class="form-group clearfix">
          <label for="email" class="fl form-title">邮箱</label>
          <input
            type="text"
            class="form-control fr form-input"
            id="email"
            autocomplete="off"
            placeholder="输入邮箱"
            v-model="userInfo.email"
          />
        </div>
        <div class="form-group clearfix">
          <label for="password" class="fl form-title">密码</label>
          <input
            type="password"
            class="form-control fr form-input"
            id="password"
            autocomplete="off"
            placeholder="输入6~16位密码"
            v-model="userInfo.password"
          />
        </div>
        <!-- <div class="form-group clearfix">
        <div class="verification-box fr">
          <span>将滑块拖动到此处</span>
          <div class="verification-active"></div>
        </div>
        </div>-->
        <div class="form-group clearfix form-btn">
          <button type="button" class="btn btn-success login fr" @click="login">登录</button>
        </div>

        <div class="switch clearfix">
          <div class="forget fl">忘记密码</div>
          <router-link class="fr" :to="{name: 'Register'}">没有账号立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//导入消息提示组件
import MsgTotal from "../components/MsgToal";
// 导入表单验证
import { verification } from "../assets/js/verification";

export default {
  name: "Login",
  data() {
    return {
      userInfo: {
        email: "",
        password: ""
      }
    };
  },
  components: {
    MsgTotal
  },
  methods: {
    //登录
    login() {
      //验证表单
      let result = verification.verificat(this.userInfo);
      if (result.pass === false) {
        this.$showTotal({
          msg: result.msg,
          duration: 3000
        });
        return;
      }
      //发起登录请求
      this.axios({
        method: "POST",
        url: "/login",
        //post请求参数
        data: this.userInfo
      })
        .then(result => {
          
          if (result.data.code == 10020) {
            this.$cookies.set("_ttkk", result.data.token, "5d");

            localStorage.setItem("_ttkk", JSON.stringify(result.data.token));

            this.$router.push({ name: "Type" });
          }
        })
        .catch(err => {
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.register {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url(../assets/images/login.jpg) no-repeat center center;
  background-size: cover;
  min-width: 1170px;

  .register-box {
    width: 1170px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      color: white;
      width: 360px;
      font-size: 36px;
    }
  }
}
.form-box {
  width: 400px;
  //   height: 360px;
  background-color: #f5f5f5;
  border: 1px solid #008c8c;
  border-radius: 10px;
  // box-shadow: 4px 4px 10px 2px grey;
}
.form-group {
  width: 100%;
  height: 38px;
  margin-top: 20px;
}
.form-title {
  width: 42px;
  line-height: 38px;
  margin-left: 8px;
  font-size: 14px;
}
.font-size() {
  width: 310px;
  height: 38px;
  margin: 0 18px;
}
.form-input {
  .font-size;
}
.verification-box {
  position: relative;
  background-color: burlywood;
  .font-size;
  text-align: center;
  line-height: 38px;
  user-select: none;
  span {
    color: blueviolet;
  }
}
.verification-active {
  background-color: green;
  .font-size;
  position: absolute;
  width: 60px;
  top: 0;
  left: 0;
  margin: 0;
  cursor: pointer;
}
.login {
  .font-size();
}
.form-btn {
  margin-top: 35px;
}
.switch {
  //   float: right;
  font-size: 14px;
  margin: 0 15px;
  cursor: pointer;
  margin-bottom: 15px;
}
.forget {
  margin-left: 60px;
}
</style>