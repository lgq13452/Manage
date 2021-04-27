<template>
  <div class="setting">设置页面</div>
</template>

<script>
export default {
  name: "Setting",
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    this.userInfo = this.$route.params;
  }
};
</script>

<style lang="less" scoped>
</style>