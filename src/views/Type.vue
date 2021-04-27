<template>
  <div class="type">
    <!-- 搜索条件 -->
    <div class="clearfix">
      <div class="fl type-title">商品类型</div>
      <div class="search fl">
        <input
          type="text"
          class="form-control"
          placeholder="输入商品类型"
          v-model="searchTitle"
          @keyup.enter="searchType"
        />
      </div>
      <div class="fl">
        <button class="btn btn-secondary" @click="search">搜索</button>
      </div>
    </div>
    <!-- 添加商品类型 -->
    <div class="add-type">
      <button class="btn btn-primary" @click="showMadol(1)">添加商品类型</button>
    </div>

    <!--添加商品 Modal -->
    <div class="modal fade" id="modal" ref="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group clearfix">
                <div class="fl type-name">类型名称</div>
                <div class="fl type-ipt">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="输入商品类型"
                    v-model="type"
                    @keyup.enter="saveType"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="saveType">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品类型列表 -->
    <div class="type-list">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col"></th>
            <th scope="col">类型名称</th>
            <th scope="col">状态</th>
            <th scope="col">添加时间</th>
            <th scope="col">更新时间</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in typeData" :key="index">
            <th scope="row">{{index + 1}}</th>
            <td>{{item.type}}</td>
            <td>{{item.isEnable ? '上架' : '下架'}}</td>
            <td>{{item.createdAt}}</td>
            <td>{{item.updatedAt}}</td>
            <td class="operation">
              <button
                class="btn btn-info btn-sm"
                @click="showMadol(0,item.type,item.typeId,index)"
              >编辑</button>
              <button
                v-if="item.isEnable"
                class="btn btn-warning btn-sm fbd"
                @click="toggleTpyeStatus(0,item.typeId,index)"
              >下架</button>
              <button
                v-else
                class="btn btn-secondary btn-sm"
                @click="toggleTpyeStatus(1,item.typeId,index)"
              >上架</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页 -->
    <nav v-if="typeData.length != 0">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{disabled: currentPage == 1 ? 'disabled' : ''}"
          @click="jump(currentPage - 1)"
        >
          <a class="page-link" href="javascript:void(0);">
            <span>&laquo;</span>
          </a>
        </li>
        <template>
          <li
            class="page-item"
            v-for="(item, index) in allPage"
            :key="index"
            @click="jump(index+1)"
          >
            <a class="page-link" href="javascript:void(0);">{{index + 1}}</a>
          </li>
        </template>
        <li
          class="page-item"
          :class="{disabled: currentPage == allPage ? 'disabled' : ''}"
          @click="jump(currentPage + 1)"
        >
          <a class="page-link" href="javascript:void(0);">
            <span>&raquo;</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);">
            <span>共{{allPage}}页</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- 消息提示 -->
    <MsgTotal></MsgTotal>
  </div>
</template>

<script>
// 导入jquery
import $ from "jquery";

// 导入公共方法
import { tool } from "../assets/js/tool";

//导入消息提示组件
import MsgTotal from "../components/MsgToal";

export default {
  name: "Type",
  data() {
    return {
      // 添加的商品类型名称
      type: "",
      // 登录令牌
      token: "",
      // 商品类型数据
      typeData: [],
      // 搜索名称
      searchTitle: "",
      // 添加或编辑商品类型
      title: "添加商品类型",
      // 编辑商品类型的id
      typeId: "",
      // 当前商品类型index
      currentIndex: "",
      // 是否处于搜索状态
      isSearch: false,
      // 当前页码
      currentPage: 1,
      // 每页显示6条数据
      pageCount: 6,
      // 总页数
      allPage: 1
    };
  },
  components: {
    MsgTotal
  },
  methods: {
    // 保存添加商品类型
    saveType() {
      if (
        (typeof this.type == "string" && this.type.trim() == "") ||
        this.type == null
      ) {
        this.$showTotal({
          msg: "请输入商品类型",
          duration: 3000
        });
        return;
      }
      // 

      if (!this.typeId) {
        // 发起添加商品类型数据
        this.axios({
          method: "POST",
          url: "/addType",
          data: {
            type: this.type,
            token: this.token
          }
        })
          .then(result => {
            // 获取商品类型数据
            this.currentPage = 1;
            // 获取商品
            this.getTypeData();
            // 总页数
            this.getTypeRows();

            this.typeData.unshift(result.data.result);
            $(this.$refs.modal).modal("hide");

            this.$showTotal({
              msg: result.data.msg
            });
            this.type = "";
          })
          .catch(err => {
            
          });
      } else {
        // 编辑商品类型
        if (this.type == this.typeData[this.currentIndex].type) {
          $(this.$refs.modal).modal("hide");
          this.type = "";
          return;
        }
        this.axios({
          method: "POST",
          url: "/editType",
          data: {
            type: this.type,
            typeId: this.typeId,
            token: this.token
          }
        })
          .then(result => {
            
            if (result.data.code == 10080) {
              $(this.$refs.modal).modal("hide");
              this.typeData[this.currentIndex].type = this.type;
              this.typeData[this.currentIndex].updatedAt = tool.formatDate(
                new Date(),
                "yyyy-MM-dd hh:mm:ss"
              );
            }
            this.$showTotal({
              msg: result.data.msg
            });
            this.type = "";
          })
          .catch(err => {
            
          });
      }
    },
    // 获取身份令牌
    initType() {
      this.token = JSON.parse(localStorage.getItem("_ttkk"));
      // 
    },
    // 获取商品类型数据
    getTypeData() {
      this.axios({
        method: "GET",
        url: "/getType",
        params: {
          // 偏移数据量
          offset: (this.currentPage - 1) * this.pageCount,
          // 查询数据量
          limit: this.pageCount,

          token: this.token
        }
      })
        .then(result => {
          // 
          result.data.result.forEach(v => {
            v.createdAt = tool.formatDate(
              new Date(v.createdAt),
              "yyyy-MM-dd hh:mm:ss"
            );
            v.updatedAt = tool.formatDate(
              new Date(v.updatedAt),
              "yyyy-MM-dd hh:mm:ss"
            );
          });
          this.typeData = result.data.result;
          this.isSearch = false;
          this.searchTitle = "";
        })
        .catch(err => {
          
        });
    },
    // 搜索商品类型数据
    search() {
      if (
        (typeof this.searchTitle === "string" &&
          this.searchTitle.trim() == "") ||
        this.searchTitle == null
      ) {
        this.$showTotal({
          msg: "请输入查询商品类型",
          duration: 3000
        });
        return;
      }

      this.currentPage = 1;
      // 搜索商品类型
      this.searchType();
      // 获取商品数量
      this.searchTypeCount();
    },

    // 搜索商品类型,用于搜索分页
    searchType() {
      this.axios({
        method: "GET",
        url: "/searchType",
        params: {
          searchTitle: this.searchTitle,
          offset: (this.currentPage - 1) * this.pageCount,
          limit: this.pageCount,
          token: this.token
        }
      })
        .then(result => {
          this.isSearch = true;
          
          result.data.result.forEach(v => {
            v.createdAt = tool.formatDate(
              new Date(v.createdAt),
              "yyyy-MM-dd hh:mm:ss"
            );
            v.updatedAt = tool.formatDate(
              new Date(v.updatedAt),
              "yyyy-MM-dd hh:mm:ss"
            );
          });
          this.typeData = result.data.result;
        })
        .catch(err => {
          
        });
    },

    // 搜索商品类型数据量,用于搜索分页
    searchTypeCount() {
      this.axios({
        method: "GET",
        url: "/searchTypeRows",
        params: {
          searchTitle: this.searchTitle,
          token: this.token
        }
      })
        .then(result => {
          
          // 分页
          this.allPage = Math.ceil(result.data.result / this.pageCount);
        })
        .catch(err => {
          
        });
    },

    // 上架 下架 修改状态
    toggleTpyeStatus(status, typeId, index) {
      this.axios({
        method: "POST",
        url: "/typeStatus",
        data: {
          status,
          typeId,
          token: this.token
        }
      })
        .then(result => {
          
          if (result.data.code == 10070) {
            this.typeData[index].isEnable = status;
          }
          this.$showTotal({
            msg: result.data.msg,
            duration: 3000
          });
        })
        .catch(err => {
          
        });
    },
    // 显示模态框类型
    showMadol(flag, type, typeId, index) {
      if (flag == 0) {
        this.title = "编辑商品类型";
        this.type = type;
        this.typeId = typeId;
        this.currentIndex = index;
      } else {
        this.title = "添加商品类型";
        this.type = "";
        this.typeId = "";
      }
      $(this.$refs.modal).modal("show");
    },
    // 获取数据表的数据数量
    getTypeRows() {
      this.axios({
        method: "GET",
        url: "/typeRows",
        params: {
          token: this.token
        }
      })
        .then(result => {
          
          // 分页
          this.allPage = Math.ceil(result.data.result / this.pageCount);
        })
        .catch(err => {
          
        });
    },
    // 跳转页码
    jump(index) {
      if (index < 1 || index > this.allPage || index == this.currentPage) {
        return;
      }
      this.currentPage = index;
      if (this.isSearch) {
        // 搜索商品类型,用于搜索分页
        this.searchType();
      } else {
        // 获取商品类型数据
        this.getTypeData();
      }
    }
  },
  // 初始化页面数据
  created() {
    // 获取身份令牌
    this.initType();
    // 获取商品类型
    this.getTypeData();
    // 获取数据表的数据数量
    this.getTypeRows();
  }
};
</script>

<style lang="less" scoped>
.type-ipt {
  width: calc(~"100% - 80px");
}
.type-name {
  line-height: 38px;
  width: 80px;
}
.type-title {
  line-height: 38px;
}
.search {
  width: 300px;
  margin: 0 15px;
}
.add-type {
  margin-top: 15px;
}
.type-list {
  margin-top: 15px;
}
.operation {
  button {
    margin: 0 5px;
  }
}
</style>