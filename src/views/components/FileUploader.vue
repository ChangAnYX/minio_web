<template>
  <div id="global-uploader">
    <!-- 上传组件 -->
    <uploader
      class="uploader-box"
      ref="uploader"
      :options="options"
      :autoStart="false"
      @file-added="handleFileAdded"
      @file-progress="onFileProgress"
      @file-success="handleFileSuccess"
      @file-error="handleFileError"
    >
      <uploader-unsupport></uploader-unsupport>
      <!-- 选择文件按钮 -->
      <uploader-btn class="select-file-btn" :attrs="attrs" ref="uploadBtn"
        >选择文件</uploader-btn
      >
      <!-- 正在上传的文件面板 -->
      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props">
          <div class="panel-title">
            <span class="text">上传列表</span>
            <div class="operate-btn-wrapper">
              <el-button
                type="text"
                title="关闭窗口"
                icon="el-icon-close"
                @click="handleClosePanel"
              >
              </el-button>
            </div>
          </div>
          <!-- 正在上传的文件列表 -->
          <ul class="file-list">
            <li class="file-item" v-for="file in props.fileList" :key="file.id">
              <uploader-file
                ref="files"
                :class="`file_${file.id}`"
                :file="file"
                :list="true"
              ></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length">
              <i class="icon-empty-file"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import { getMultipartUpload, getUpFile } from "@/request/file";

export default {
  name: "FileUploader",
  data() {
    return {
      options: {
        // 目标上传 URL，可以是字符串也可以是函数，如果是函数的话，则会传入 Uploader.File 实例、
        // 当前块 Uploader.Chunk 以及是否是测试模式，默认值为 '/'
        target: function(file, chunkFile, mode) {
          // 分块上传前每次都会进入到该方法
          console.log("进入到target");
          console.log("文件名：" + file.name);
          console.log("当前分块序号" + chunkFile.offset);
          console.log("获取到分块上传URL：");
          console.log(file.chunkUrlData);
          const key = "chunk_" + chunkFile.offset; // 键值 用于获取分块链接URL
          return file.chunkUrlData[key];
        },
        // 为每个块向服务器发出 GET 请求，以查看它是否已经存在。如果在服务器端实现，
        // 这将允许在浏览器崩溃甚至计算机重新启动后继续上传。(默认: true)
        testChunks: true,
        // 分块时按照该值来分。最后一个上传块的大小是可能是大于等于1倍的这个值但是小于两倍的这个值大小，
        // 可见这个 Issue #51，默认 1*1024*1024。
        chunkSize: 5 * 1024 * 1024,
        // 强制所有块小于或等于 chunkSize。否则，最后一个块将大于或等于chunkSize。(默认: false)
        forceChunkSize: true,
        // 包含在带有数据的多部分 POST 中的额外参数。这可以是一个对象或一个函数。如果是一个函数，
        // 它将被传递一个 Uploader.File、一个 Uploader.Chunk 对象和一个 isTest 布尔值（默认值{}：）
        query: function(file, chunkFile, mode) {
          const data = { partNumber: chunkFile.offset + 1 };
          return data;
        },
        uploadMethod: "PUT",
        //  当上传的时候所使用的是方式，可选 multipart、octet，默认 multipart，参考 multipart vs octet。
        // MiniO 的分片不能使用表单
        method: "octet",
        //  处理请求参数，默认 function (params) {return params}，一般用于修改参数名字或者删除参数。0.5.2版本后，
        processParams: function(params) {
          return {};
        }
        // headers: {
        //  'Content-Type': 'binary/octet-stream'
        // }
      },
      attrs: {
        accept: "*" // 可接受的文件类型
      },
      panelShow: false //  上传文件面板是否显示
    };
  },
  computed: {
    // 全局上传组件 uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    },
    // 当前所在路径
    filePath() {
      return this.$route.query.filePath ? this.$route.query.filePath : "/";
    },
    // 是否触发上传文件事件
    startUploadFile() {
      return this.$store.state.file.startUploadFile;
    }
  },
  methods: {
    // 触发选择文件按钮的点击事件
    triggerSelectFileClick() {
      this.$refs.uploadBtn.$el.click(); // 触发 选择文件按钮 的点击事件
    },

    // 文件添加 回调函数
    handleFileAdded(file) {
      this.panelShow = true; //  显示文件上传面板
      this.calculateFileMD5(file); //  计算文件MD5值
      // 计算MD5
      // 获取分块上传链接
      // eslint-disable-next-line no-unused-vars
      const res = this.getChunkUploadUrl(file);
      console.log("文件被添加查看是否获取到分块URL");
      console.log(file.chunkUrlData);
    },
    async getChunkUploadUrl(file) {
      // 向具有指定ID的用户发出请求
      console.log(file);
      console.log("获取分块上传链接");
      const fileName = file.name; // 文件名
      const fileSize = file.size; // 文件大小
      const chunkSize = file.chunks.length; // 分片数
      // const  file
      // 请求后台返回每个分块的上传链接
      // eslint-disable-next-line no-unused-vars
      const res = await getUpFile({
        filename: fileName,
        chunkNumber: chunkSize,
        filePath: this.filePath,
        uploadTime: new Date().getTime(),
        fileSize: fileSize,
        identifier: file.uniqueIdentifier
      })
        .then(function(response) {
          console.log("获取到的uploadId:" + response.uploadId);
          console.log("获取到的分片上传集合URL:");
          file.chunkUrlData = response;
          console.log(file.chunkUrlData);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    /**
     * 文件上传过程 回调函数
     * @param rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
     * @param file 当前成功的 Uploader.File 对象本身
     * @param chunk Uploader.Chunk 实例，它就是该文件的最后一个块实例，如果你想得到请求响应码的话，chunk.xhr.status 就是
     */
    onFileProgress(rootFile, file, chunk) {
      // 打印文件上传过程中的信息
      console.log(
        `上传中 ${file.name}，chunk：${chunk.startByte /
          1024 /
          1024} ~ ${chunk.endByte / 1024 / 1024}`
      );
    },
    /**
     * 文件上传成功 回调函数
     * @param rootFile
     * @param file
     */
    handleFileSuccess(rootFile, file) {
      console.log("单个文件上传成功", arguments);
      // 调用后台合并文件
      const fileName = file.name; // 文件名
      const uploadId = file.chunkUrlData.uploadId; // uploadId
      console.log();
      getMultipartUpload({
        FileName: fileName,
        uploadId: uploadId
      })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      console.log("合并完成");
      this.$emit("getTableData"); //  刷新文件列表
    },

    // 文件上传失败 回调函数
    handleFileError(rootFile, file, responseStr) {
      this.$message({
        message: JSON.parse(responseStr).message,
        type: "error"
      });
    },

    // 计算文件MD5值
    calculateFileMD5(file) {
      let fileReader = new FileReader();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 5 * 1024 * 1024;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();
      file.pause(); //  暂停上传文件
      loadNext();
      fileReader.onload = e => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
        } else {
          let md5 = spark.end();
          this.calculateFileMD5End(md5, file);
          // console.log(
          //   `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
          //     file.size
          //   } 用时：${new Date().getTime() - time} ms`
          // );
        }
      };
      fileReader.onerror = function() {
        this.$notify({
          title: "上传出错",
          message: `文件${file.name}读取出错，请检查该文件`,
          type: "error",
          duration: 2000
        });
        file.cancel(); //  取消上传且从文件列表中移除。
      };
      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
    // 文件MD5计算结束
    calculateFileMD5End(md5, file) {
      file.uniqueIdentifier = md5;
      file.resume(); //  继续上传文件
    },

    // 关闭上传面板
    handleClosePanel() {
      this.uploader.cancel(); //  取消上传文件
      this.panelShow = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
#global-uploader {
  position: fixed;
  z-index: 20;
  right: 15px;
  bottom: 15px;

  .uploader-box {
    width: 520px;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .panel-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      border-bottom: 1px solid #ddd;

      .text {
        padding-left: 0;
        margin-bottom: 0;
        font-size: 16px;
        color: #303133;
      }

      .operate-btn-wrapper {
        flex: 1;
        text-align: right;

        >>> .el-button {
          *:hover {
            opacity: 0.5;
          }

          i[class^=el-icon-] {
            color: #000;
          }
        }
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      font-size: 14px;

      .file-item {
        background-color: #fff;

        >>>.uploader-file-icon {
          display: none;
        }
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  /deep/.uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
.select-file-btn {
  display: none;
}
</style>
