<template>
  <div class="main">
    <div class="header">
      <div class="titile fl">商家后台管理系统</div>
      <div class="user-info fr clearfix">
        <div class="user-img fl">
          <img :src="staticUrl + '/' + userInfo.userImg" alt />
        </div>
        <div class="nickname fl setset">
          <span>{{userInfo.nickname}}</span>
        </div>
        <div class="fl setset">
          <!-- <span @click="setUserInfo">设置</span> -->
          <div class="btn-group">
            <span class="dropdown-toggle vset" data-toggle="dropdown">设置</span>
            <div class="dropdown-menu vmenu">
              <a class="dropdown-item" href="javascript:void(0);" @click="goSetting">修改账号信息</a>
              <a class="dropdown-item" href="javascript:void(0);">退出</a>
            </div>
          </div>
        </div>
        <!-- <div class="sign-out fl setset">
          <span>退出</span>
        </div>-->
      </div>
    </div>

    <div class="box">
      <!-- 侧边栏 -->
      <div class="aside">
        <div class="accordion" id="accordion">
          <!-- 商品管理 -->
          <div class="card" v-for="(item, index) in asideMenu" :key="index">
            <div class="card-header">
              <div class="aside-item clearfix" data-toggle="collapse" :data-target="'#c' + index">
                <div class="icon fl">
                  <i class="fa" :class="[item.icon]"></i>
                </div>
                <div class="fl">{{item.title}}</div>
                <div class="icon fr">
                  <i class="fa fa-angle-down"></i>
                </div>
              </div>
            </div>

            <div
              :id="'c' + index"
              class="collapse"
              :class="{show: index == 0}"
              data-parent="#accordion"
            >
              <div class="card-body">
                <div
                  class="type-list"
                  v-for="(v, i) in item.subTitle"
                  :key="i"
                  :class="{active: v.isActive }"
                  @click="toggleMenu(v)"
                >{{v.name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 主体 -->
      <div class="content">
        <!-- 二级路由 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      asideMenu: [
        {
          title: "商品管理",
          icon: "fa-cube",
          subTitle: [
            {
              name: "商品类型",
              isActive: true,
              //路由名称
              routerName: "Type"
            },
            {
              name: "商品列表",
              isActive: false,
              routerName: "Products"
            }
          ]
        },
        {
          title: "订单管理",
          icon: "fa-file-text-o",
          subTitle: [
            {
              name: "订单列表",
              isActive: false,
              routerName: ""
            }
          ]
        },
        {
          title: "数据统计",
          icon: "fa-bar-chart",
          subTitle: [
            {
              name: "商品统计",
              isActive: false,
              routerName: ""
            },
            {
              name: "订单统计",
              isActive: false,
              routerName: ""
            }
          ]
        }
      ],
      token: "",
      userInfo: {}
    };
  },
  methods: {
    // 获取身份令牌
    initType() {
      this.token = JSON.parse(localStorage.getItem("_ttkk"));
    },
    //获取用户信息
    getUserInfo() {
      this.axios({
        method: "GET",
        url: "/userInfo",
        params: {
          token: this.token
        }
      })
        .then(result => {
          //
          if (result.data.code == 10005) {
            this.userInfo = result.data.result[0];
          }
        })
        .catch(err => {});
    },
    goSetting() {
      let params = this.userInfo;
      this.$router.push({name:'Setting',params})
    },
    // 设置用户信息
    setUserInfo() {
      this.axios({
        method: "POST",
        url: "/setUserInfo",
        data: {
          token: this.token
        }
      })
        .then(result => {
          //
          if (result.data.code == 10007) {
            console.log(result.data.result);
          }
        })
        .catch(err => {});
    },
    // 切换菜单
    toggleMenu(v) {
      // 如果点击当前菜单,不做事情
      if (v.isActive) {
        return;
      }

      // 将其他选中改为未选中状态
      this.asideMenu.forEach(v1 => {
        v1.subTitle.forEach(v2 => {
          v2.isActive = false;
        });
      });
      v.isActive = true;
      this.$router.push({ name: v.routerName });
    }
  },
  created() {
    this.initType();
    this.getUserInfo();
  }
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 80px;
  background-color: #f3f3f4;
  position: sticky;
  top: 0;
  padding: 0 20px;
  z-index: 999;
  .titile {
    font-size: 24px;
    line-height: 80px;
    margin-left: 50px;
  }
  .user-info {
    margin-right: 50px;
    .user-img {
      padding: 16px 0;
      margin-right: 20px;
      overflow: hidden;
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
    }
    & > .setset {
      line-height: 80px;
      margin: 0 20px;
      .vset::after {
        content: none;
      }
      .vmenu {
        transform: translate3d(-100px, 80px, 0px);
        border-radius: 8px;
        a {
          height: 44px;
          line-height: 44px;
        }
      }
    }
  }
}
.box {
  .aside {
    width: 200px;
    position: fixed;
    top: 80px;
    left: 0;
    bottom: 0;
    background-color: #2f4050;
    color: #a7b1c2;
    z-index: 9;
    .card {
      border-radius: 0;
      background-color: transparent;
      cursor: pointer;
    }
    .card-header {
      padding: 0;
    }
    .aside-item {
      height: 44px;
      line-height: 44px;
      .icon {
        margin: 0 10px;
        width: 16px;
        height: 16px;
      }
    }
    .card-body {
      padding: 0;
      .type-list {
        &.active {
          background-color: #008c8c;
        }
        &:hover {
          background-color: #008c8c;
        }
      }

      color: white;
      .type-list {
        height: 32px;
        line-height: 32px;
        padding-left: 45px;
      }
    }
  }
  .content {
    width: calc(~"100% - 200px");
    margin-left: 200px;
    padding: 20px;
    // background-color: #f3f3f4;
  }
}
</style>