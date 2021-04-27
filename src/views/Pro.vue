<template>
  <div class="Pro">
    <form>
      <!-- 商品名称 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">商品名称</div>
        <div class="fl form-input">
          <input
            type="text"
            class="form-control"
            maxlength="30"
            v-model="productInfo.name"
            :disabled="id == 1"
          />
        </div>
      </div>
      <!-- 商品类型 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">商品类型</div>
        <div class="fl form-input">
          <select class="form-control" v-model="productInfo.type" :disabled="id == 1">
            <option
              :value="item.typeId"
              v-for="(item, index) in proTypeList"
              :key="index"
            >{{item.type}}</option>
          </select>
        </div>
      </div>
      <!-- 商品价格 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">商品价格</div>
        <div class="fl form-input">
          <input
            type="text"
            class="form-control"
            maxlength="10"
            v-model="productInfo.price"
            :disabled="id == 1"
          />
        </div>
      </div>
      <!-- 库存 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">库存</div>
        <div class="fl form-input">
          <input
            type="text"
            class="form-control"
            maxlength="10"
            v-model="productInfo.count"
            :disabled="id == 1"
          />
        </div>
      </div>
      <!-- 商品图片 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">商品图片</div>
        <div class="form-upload fl">
          <Upload @file-upload="fileUpload" :size="size" :id="id">
            <div
              class="vslot"
              :class="{ctou : id == 3}"
              v-if="temporaryInfoProductInfo.img == productInfo.img"
            >
              <img class="auto-img" :src="staticUrl + '/' + temporaryInfoProductInfo.img" alt />
            </div>
          </Upload>
        </div>
      </div>
      <!-- 商品详情图 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">商品详情图</div>
        <div class="form-upload fl">
          <Upload @file-upload="detailFileUpload" :size="size" :id="id">
            <div
              class="vslot"
              :class="{ctou : id == 3}"
              v-if="temporaryInfoProductInfo.imgDetail == productInfo.imgDetail"
            >
              <img class="auto-img" :src="staticUrl + '/' + temporaryInfoProductInfo.imgDetail" alt />
            </div>
          </Upload>
        </div>
      </div>
      <!-- 商品状态 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">商品状态</div>
        <div class="form-input custom-radio-box fl clearfix">
          <div class="fl">
            <div class="custom-control custom-radio mr-sm-2 fl">
              <input
                type="radio"
                class="custom-control-input"
                id="r1"
                name="r"
                @change="selectStatus"
                :checked="productInfo.status == 1"
                data-status="1"
                :disabled="id == 1"
              />
              <label class="custom-control-label" for="r1">上架</label>
            </div>
          </div>
          <div class="fl">
            <div class="custom-control custom-radio mr-sm-2 fl">
              <input
                type="radio"
                class="custom-control-input"
                id="r2"
                name="r"
                @change="selectStatus"
                :checked="productInfo.status == 0"
                data-status="0"
                :disabled="id == 1"
              />
              <label class="custom-control-label" for="r2">下架</label>
            </div>
          </div>
        </div>
      </div>
      <!-- 商品描述 -->
      <div class="form-group form-box clearfix">
        <div class="form-title fl">商品描述</div>
        <div class="fl form-input">
          <textarea
            class="form-control textarea-box"
            maxlength="200"
            v-model="productInfo.desc"
            :disabled="id == 1"
          />
        </div>
      </div>
      <!-- 发布商品 -->
      <div class="form-group form-box clearfix" v-if="id == 2 || id == 3">
        <button type="button" class="btn btn-success btn-box" @click=" postProduct">发布商品</button>
      </div>
    </form>
    <MsgTotal></MsgTotal>
  </div>
</template>

<script>
//导入消息提示组件
import MsgTotal from "../components/MsgToal";
//导入上传图片组件
import Upload from "../components/Upload.vue";

export default {
  name: "Pro",
  data() {
    return {
      id: "",
      productId: "",
      //   上传图片大小的最大值
      size: 0.5,
      // 令牌
      token: "",
      // 商品类型列表
      proTypeList: null,
      // 保存上传商品信息
      productInfo: {
        // 商品名称
        name: "",
        // 商品类型
        type: "default",
        // 商品价格
        price: "",
        // 商品库存
        count: "",
        // 商品图片
        img: "",
        // 商品图片类型
        imgType: "",
        // 商品详情图
        imgDetail: "",
        // 商品详情图类型
        imgDetailType: "",
        // 1：上架 0：下架
        status: "1",
        // 描述
        desc: ""
      },
      // 临时数据，用于判断用户是否编辑商品信息
      temporaryInfoProductInfo: {}
    };
  },
  components: {
    Upload,
    MsgTotal
  },
  methods: {
    // 获取上传图片信息
    fileUpload(e) {
      // 
      this.productInfo.img = e.base64.replace(
        /data:image\/[A-Za-z]+;base64,/,
        ""
      );
      this.productInfo.imgType = e.type;
    },
    // 获取上传详情信息
    detailFileUpload(e) {
      
      this.productInfo.imgDetail = e.base64.replace(
        /data:image\/[A-Za-z]+;base64,/,
        ""
      );
      // 
      this.productInfo.imgDetailType = e.type;
    },
    // 获取身份令牌
    initType() {
      this.token = JSON.parse(localStorage.getItem("_ttkk"));
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
          
          // let res = result.data.result;
          // let arr = [];
          // res.forEach(v => {
          //   if ((arr.indexOf(v.type) < 0)) {
          //     arr.push(v.type);
          //   }
          // });
          // 
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
    // 选择上下架
    selectStatus(e) {
      this.productInfo.status = e.target.dataset.status;
      
    },
    // 发布商品验证表单
    postProduct() {
      let nameReg = /<\/?script>/;

      //^[1-9]\d*$ ==> 整数
      //^0\.\d{1,2}$ ==> 0.xx的小数
      //^[1-9]\d*\.\d{1,2}$ ==> 121.xx小数

      let priceReg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
      let countReg = /^[1-9]\d*$/;

      if (this.productInfo.name == "" || nameReg.test(this.productInfo.name)) {
        this.$showTotal({
          msg: "商品名称不能为空且不可有<srcipt>"
        });
      } else if (this.productInfo.type == "default") {
        this.$showTotal({
          msg: "请选择商品类型"
        });
      } else if (!priceReg.test(this.productInfo.price)) {
        this.$showTotal({
          msg: "价格只能填写正数且最多含两位小数"
        });
      } else if (!countReg.test(this.productInfo.count)) {
        this.$showTotal({
          msg: "库存只能填正整数"
        });
      } else if (this.productInfo.img == "") {
        this.$showTotal({
          msg: "请上传商品图片"
        });
      } else if (this.productInfo.imgDetail == "") {
        this.$showTotal({
          msg: "请上传商品详情图"
        });
      } else if (
        this.productInfo.desc == "" ||
        nameReg.test(this.productInfo.desc)
      ) {
        this.$showTotal({
          msg: "商品描述不能为空且不能含有<script>字符"
        });
      } else {
        
        this.productInfo.token = this.token;

        // 发起请求
        if (this.id == 2) {
          // 添加商品
          this.addProduct(this.productInfo);
        } else {
          // 编辑商品
          // 获取编辑的数据
          let data = {};
          for (let k in this.temporaryInfoProductInfo) {
            // 对比是否修改
            if (this.temporaryInfoProductInfo[k] != this.productInfo[k]) {
              if (k == "img" || k == "imgDetail") {
                data[k + "Type"] = this.productInfo[k + "Type"];
              }
              data[k] = this.productInfo[k];
            }
          }
          if (JSON.stringify(data) == "{}") {
            
            return;
          }
          data.productId = this.productId;
          data.token = this.token;
          
          this.editProduct(data);
        }
      }
    },

    // 添加商品
    addProduct(productInfo) {
      this.axios({
        method: "POST",
        url: "/postProducts",
        data: productInfo
      })
        .then(result => {
          
          if (result.data.code == 10045) {
            this.$router.push({ name: 'Products' });
          }
        })
        .catch(err => {
          
        });
    },
    // 编辑商品
    editProduct(productInfo) {
      this.axios({
        method: "POST",
        url: "/editProduct",
        data: productInfo
      })
        .then(result => {
          
          if (result.data.code == 10055) {
            this.$router.push({ name: 'Products' });
          }
        })
        .catch(err => {
          
        });
    },
    // 查看商品信息
    getProductInfo(productId) {
      let product = {};
      product.token = this.token;
      product.productId = productId;
      // 请求商品信息
      this.axios({
        method: "GET",
        url: "/getProductInfo",
        params: product
      })
        .then(result => {
          // 
          this.productInfo = result.data.result[0];

          // 复制一份临时数据，用于判断用户是否编辑商品信息
          this.temporaryInfoProductInfo = Object.assign({}, this.productInfo);
        })
        .catch(err => {
          
        });
    }
  },
  created() {
    //   截取路由信息
    let params = this.$route.params;
    
    this.id = params.id;
    this.productId = params.productId;

    this.initType();

    if (params.id == 1 || params.id == 3) {
      this.getProductInfo(params.productId);
    }
    // 获取商品类型
    this.getProType();
  }
};
</script>

<style lang="less" scoped>
.custom-radio-box {
  padding-top: 7px;
}
.form-title {
  margin-right: 15px;
  width: 90px;
  line-height: 38px;
}
.form-input {
  width: 300px;
}
.form-upload {
  width: 160px;
  height: 160px;
  //   background-color: #ddd;
}
.textarea-box {
  height: 180px;
  resize: none;
}
.btn-box {
  margin: 50px 160px;
}
.vslot {
  width: 160px;
  height: 160px;
  top: 0;
  left: 0;
  position: absolute;
  background-color: #ffffff;
}
.ctou {
  pointer-events: none;
}
</style>