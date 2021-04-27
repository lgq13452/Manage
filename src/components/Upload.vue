<template>
  <div class="upload">
    <label class="upload-img">
      <i class="fa fa-plus"></i>
      <input class="file" type="file" @change="fileDate" />
    </label>
    <div class="img-box">
      <img class="auto-img" :src="url" alt />
    </div>
    <template v-if="id == 1 || id == 3">
      <slot></slot>
    </template>
    <!-- 消息提示 -->
    <MsgTotal></MsgTotal>
  </div>
</template>

<script>
//导入消息提示组件
import MsgTotal from "../components/MsgToal";

export default {
  name: "Upload",
  props: {
    id: {
      type: [Number, String],
      default: 2
    },
    size: {
      // 属性值为数值类型
      type: Number,
      //默认为1MB
      default: 1
    }
  },
  data() {
    return {
      url: ""
    };
  },

  components: {
    MsgTotal
  },
  methods: {
    fileDate(e) {
      let self = this;
      let file = e.target.files[0];
      //   
      //   控制上传图片大小
      let fileSize = file.size / 1024 / 1024;

      if (fileSize > this.size) {
        this.$showTotal({
          msg: "上传图片不能超过" + this.size + "MB,请重新选择"
        });
        return;
      }

      //   创建文件读取对象
      let fileReader = new FileReader();
      //   监听文件读取对象是否读取完毕文件
      fileReader.onload = function() {
        //   将文件信息转换成base64
        // 
        self.url = this.result;
        // 触发上传组件自定义事件
        self.$emit("file-upload", {
          base64: this.result,
          type: file.type.split("/")[1]
        });
      };
      //   读取
      fileReader.readAsDataURL(file);
    }
  }
};
</script>

<style lang="less" scoped>
.upload {
  width: 162px;
  height: 162px;
  background-color: #f2f2f2;
  border: 1px dashed rgb(112, 110, 110);
  position: relative;
  .upload-img {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }

  i {
    font-size: 50px;
    color: rgb(160, 155, 155);
  }
  .file {
    display: none;
  }

  .img-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    // background-color: #ddd;
    pointer-events: none;
    img {
      max-height: 100%;
    }
  }
}
</style>