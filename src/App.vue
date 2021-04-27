<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
    //全局样式
    body {
      margin: 0 auto;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .fl{
      float: left;
    }
    .fr{
      float: right;
    }
    .clearfix::after{
      display: block;
      content: "";
      clear: both;
    }
    .auto-img{
      width: 100%;
      display: block;
    }
    .app{
      min-width: 1170px;
    }
</style>
