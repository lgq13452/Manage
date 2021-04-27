<template>
  <div class="Msg-total"></div>
</template>

<script>
import Vue from "vue";
Vue.prototype.$showTotal = function(o) {
    //this.$children ==> 页面使用组件集合
  for (let i = 0; i < this.$children.length; i++) {
    let children = this.$children[i].$el;
    if (children.className == "Msg-total") {
      children.textContent = o.msg;
      children.style.top = "0px";
      setTimeout(() => {
        children.style.top = "-45px";
      }, o.duration || 2000);
    }
  }
};
export default {
  name: "MsgTotal"
};
</script>

<style lang="less" scoped>
.Msg-total {
  position: fixed;
  width: 350px;
  height: 45px;
  background-color: #f9d9d4;
  font-size: 16px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  top: -45px;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
  line-height: 45px;
  z-index: 9999;
}
</style>