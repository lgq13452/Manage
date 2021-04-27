<template>
  <div class="products">
    <!-- 搜索商品 -->
    <div class="hearder clearfix">
      <ul class="list fl clearfix">
        <li class="fl list-title">商品名称</li>
        <li class="fl list-input">
          <input type="text" class="form-control" v-model="searchInfo.name" />
        </li>
      </ul>
      <ul class="list fl clearfix">
        <li class="fl list-title">商品类型</li>
        <li class="fl list-input">
          <select class="form-control" v-model="searchInfo.type">
            <option
              :value="item.typeId"
              v-for="(item, index) in proTypeList"
              :key="index"
            >{{item.type}}</option>
          </select>
        </li>
      </ul>
      <ul class="list fl clearfix">
        <li class="fl list-title">商品状态</li>
        <li class="fl list-input">
          <select class="form-control" v-model="searchInfo.status">
            <option value="default">请选择</option>
            <option value="1">上架</option>
            <option value="0">下架</option>
          </select>
        </li>
      </ul>
      <ul class="list fl clearfix">
        <li class="fl list-title">添加日期</li>
        <li class="fl list-input">
          <input type="date" class="form-control" v-model="searchInfo.date" />
        </li>
      </ul>
      <ul class="list fl">
        <li>
          <button class="btn btn-secondary" @click="search">搜索</button>
        </li>
      </ul>
    </div>
    <!-- 添加商品 -->
    <div class="add-type">
      <button class="btn btn-primary" @click="goPro(2,null)">添加商品</button>
    </div>

    <!-- 商品列表 -->
    <div class="type-list">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">序号</th>
            <th scope="col">商品名称</th>
            <th scope="col">类型名称</th>
            <th scope="col">商品状态</th>
            <th scope="col">添加时间</th>
            <th scope="col">更新时间</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in productList" :key="index">
            <th scope="row">{{index + 1}}</th>
            <td>{{item.name}}</td>
            <td>{{item.type}}</td>
            <td>{{item.status == 1 ? '上架' : '下架'}}</td>
            <td>{{item.created_at}}</td>
            <td>{{item.updated_at}}</td>
            <td class="operation">
              <button class="btn btn-success btn-sm" @click="goPro(1,item.product_id)">查看</button>
              <button class="btn btn-info btn-sm edit" @click="goPro(3,item.product_id)">编辑</button>
              <button
                v-if="item.status == 1"
                class="btn btn-warning btn-sm fbd"
                @click="upDown(0,item)"
              >下架</button>
              <button v-else class="btn btn-secondary btn-sm" @click="upDown(1,item)">上架</button>
              <button class="btn btn-danger btn-sm" @click="deleProduct(item,index)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <nav v-if="productList.length > 0">
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
            :class="{active: currentPage == index+1}"
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
  </div>
</template>

<script>
// 导入公共方法
import { tool } from "../assets/js/tool";

export default {
  name: "Products",
  data() {
    return {
      // 搜索条件
      searchInfo: {
        name: "",
        type: "default",
        status: "default",
        date: ""
      },
      // 商品类型
      proTypeList: [],

      taken: "",
      // 当前页码
      currentPage: 1,
      // 每页显示10条数据
      pageCount: 2,
      // 总页数
      allPage: 1,
      // 商品列表
      productList: [],
      // 是否处于搜索状态
      isSearch: false,
      // 商品信息
      productInfo: null
    };
  },
  methods: {
    // 获取身份令牌
    initType() {
      this.token = JSON.parse(localStorage.getItem("_ttkk"));
    },
    //   查看：1, 添加：2, 编辑：3
    goPro(id, productId) {
      let params = {
        id
      };
      if (productId) {
        params.productId = productId;
      }
      this.$router.push({ name: "Pro", params});
    },
    // 获取商品类型
    getProType() {
      this.axios({
        method: "GET",
        url: "/proType",
        params: {
          token: this.token
        }
      })
        .then(result => {
          
          if (result.data.code == 10053) {
            result.data.result.unshift({
              typeId: "default",
              type: "请选择"
            });
            this.proTypeList = result.data.result;
          }
        })
        .catch(err => {
          
        });
    },

    // 获取搜索条件
    getSearchInfo() {
      // 获取搜索信息
      // 过滤空条件
      // 商品名称 日期为空
      // 商品类型 商品状态为default
      let getSearchInfo = {};
      if (this.searchInfo.name != "") {
        getSearchInfo.name = this.searchInfo.name;
      }
      if (this.searchInfo.date != "") {
        getSearchInfo.date = this.searchInfo.date;
      }
      if (this.searchInfo.type != "default") {
        getSearchInfo.type = this.searchInfo.type;
      }
      if (this.searchInfo.status != "default") {
        getSearchInfo.status = this.searchInfo.status;
      }
      getSearchInfo.token = this.token;
      // 

      return getSearchInfo;
    },

    // 获取商品列表数据
    getProductList() {
      let condition = this.getSearchInfo();
      // 偏移数据量
      condition.offset = (this.currentPage - 1) * this.pageCount;

      // 查询数据量
      condition.limit = this.pageCount;

      // 发起请求商品列表数据
      this.axios({
        method: "GET",
        url: "/productList",
        params: condition
      })
        .then(result => {
          result.data.result.forEach(v => {
            v.created_at = tool.formatDate(
              new Date(v.created_at),
              "yyyy-MM-dd hh:mm:ss"
            );
            v.updated_at = tool.formatDate(
              new Date(v.updated_at),
              "yyyy-MM-dd hh:mm:ss"
            );
          });
          
          if (result.data.code == 20010) {
            this.productList = result.data.result;
          }
        })
        .catch(err => {
          
        });
    },

    // 获取商品列表数量
    getProductListRows() {
      let condition = this.getSearchInfo();

      // 发起请求商品列表数据
      this.axios({
        method: "GET",
        url: "/productListRows",
        params: condition
      })
        .then(result => {
          
          this.allPage = Math.ceil(result.data.result / this.pageCount);
        })
        .catch(err => {
          
        });
    },

    // 搜索
    search() {
      // this.isSearch = true;
      this.currentPage = 1;
      // 获取商品列表数据
      this.getProductList();
      // 获取商品列表数量
      this.getProductListRows();
    },

    // 跳转页码
    jump(index) {
      if (index < 1 || index > this.allPage || index == this.currentPage) {
        return;
      }
      this.currentPage = index;

      this.getProductList();
    },

    // 修改商品上下架状态
    upDown(status, item) {
      this.axios({
        method: "POST",
        url: "/upDown",
        data: {
          status,
          productId: item.product_id,
          token: this.token
        }
      })
        .then(result => {
          
          if (result.data.code == 10072 && result.data.result[0] == 1) {
            item.status = status;
          }
        })
        .catch(err => {
          
        });
    },

    // 删除商品
    deleProduct(item, index) {
      this.productList.splice(index, 1);

      this.axios({
        method: "POST",
        url: "/deleProduct",
        data: {
          productId: item.product_id,
          token: this.token
        }
      })
        .then(result => {
          
          if (result.data.code == 20030 && result.data.result == 1) {
            //  如果当前页不是最后一页，补全当前页列表
            if (this.currentPage < this.allPage) {
              this.getProductList();
              this.getProductListRows();
            } else {
              //  如果是最后一页的且不止一条数据，则停留在本页
              if (this.productList.length >= 2) {
                this.productList.splice(index, 1);
              } else {
                //  如果是最后一页的只有一条数据，则返回上一页

                //  判断是否有上一页
                if (this.currentPage > 1) {
                  this.currentPage--;
                  this.getProductList();
                  this.getProductListRows();
                } else {
                  this.productList.splice(index, 1);
                }
              }
            }

            //如果存在下一页数据，则补全当前页数据
            //判断是否存在下一页
            // if (this.currentPage < this.allPage) {
            //   this.getProductList();
            //   this.getProductListRows();
            // } else {
            //   //如果是最后一页，存在两种可能
            //   //1--删除后，最后一页仍然存在数据，则只是删除当前数组数据，不换页码
            //   if (this.productList.length >= 2) {
            //     this.productList.splice(index, 1);
            //   } else {
            //     //2--删除后，最后一页不存在数据，判断是否存在上一页数据，如果存在上一页数据，则跳到上一页，否则隐藏分页控件

            //     //判断是否存在上一页数据
            //     if (this.currentPage > 1) {
            //       this.currentPage--;
            //       this.getProductList();
            //       this.getProductListRows();
            //     } else {
            //       this.productList.splice(index, 1);
            //     }
            //   }

            // }
          }
        })
        .catch(err => {
          
        });
    }
  },
  created() {
    this.initType();
    // 获取商品类型
    this.getProType();
    // 获取商品列表数据
    this.getProductList();
    // 获取商品列表数量
    this.getProductListRows();
  }
};
</script>

<style lang="less" scoped>
.hearder {
  .list {
    line-height: 38px;
    margin-right: 20px;
    &:last-child {
      line-height: 0;
    }
  }
  .list-title {
    width: 80px;
  }
  .list-input {
    width: 200px;
  }
}
.add-type {
  margin-top: 15px;
}
.type-list {
  margin-top: 15px;
}
.operation {
  button {
    margin-left: 8px;
    &:first-child {
      margin: 0;
    }
  }
}
// .page-item.active{

// }
</style>