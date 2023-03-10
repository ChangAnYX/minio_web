<template slot-scope="scope">
  <!--  网格试图-->
  <ul class="file-list" v-loading="loading" element-loading-text="加载中……">
    <li
      class="file-item"
      v-for="(item, index) in tableData"
      :key="index"
      @click="handleFileNameClick(item)"
      :title="`${item.file_name}`"
    >
      <img class="file-img" :src="setFileImg(item)" />
      <div class="file-name">{{ item.file_name }}</div>
    </li>
  </ul>
</template>

<script>
import { deleteFile, renameFile } from "@/request/file";

export default {
  name: "FileGrid",
  props: {
    // 文件数据
    tableData: {
      type: Array,
      required: true
    },
    // 加载状态
    loading: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      operaColumnIsFold: sessionStorage.getItem("operaColumnIsFold") || false, //  表格操作列-是否收缩
      //  文件图片Map映射
      fileImgMap: {
        csv: require("../../assets/images/file/file_csv.png"),
        doc: require("../../assets/images/file/file_word.svg"),
        excel: require("../../assets/images/file/file_excel.svg"),
        exe: require("../../assets/images/file/file_exe.png"),
        gif: require("../../assets/images/file/file_gif.png"),
        html: require("../../assets/images/file/file_html.png"),
        json: require("../../assets/images/file/file_json.png"),
        mp3: require("../../assets/images/file/file_music.png"),
        flac: require("../../assets/images/file/file_music.png"),
        other: require("../../assets/images/file/file_unknown.png"),
        pdf: require("../../assets/images/file/file_pdf.png"),
        ppt: require("../../assets/images/file/file_ppt.svg"),
        rar: require("../../assets/images/file/file_rar.png"),
        svg: require("../../assets/images/file/file_svg.png"),
        fold: require("../../assets/images/file/dir.png"),
        txt: require("../../assets/images/file/file_txt.png"),
        zip: require("../../assets/images/file/file_zip.png"),
        wav: require("../../assets/images/file/file_music.png"),
        mp4: require("../../assets/images/file/file_avi.png")
      }
    };
  },
  computed: {
    // 表格显示列
    selectedColumnList() {
      return this.$store.getters.selectedColumnList;
    }
  },
  watch: {
    // 监听收缩状态变化，存储在sessionStorage中，保证页面刷新时仍然保存设置的状态
    operaColumnIsFold(newValue) {
      sessionStorage.setItem("operaColumnIsFold", newValue);
    }
  },
  created() {
    this.operaColumnIsFold =
      sessionStorage.getItem("operaColumnIsFold") === "true"; //  读取保存的状态
  },
  methods: {
    //  根据文件扩展名设置文件图片
    setFileImg(row) {
      if (row._directory) {
        //  文件夹
        return this.fileImgMap.fold;
      } else if (["jpg", "png", "jpeg", "gif"].includes(row.file_type)) {
        // 图片类型，直接显示缩略图
        return this.getThumbnailPath(row.id);
      } else {
        const fileTypeMap = {
          pptx: "ppt",
          doc: "word",
          docx: "doc",
          xls: "excel",
          xlsx: "excel"
        };
        //  可以识别文件类型的文件
        return (
          this.fileImgMap[row.file_type] ||
          this.fileImgMap[fileTypeMap[row.file_type]] ||
          this.fileImgMap.other
        );
      }
    },
    // 文件名点击事件
    handleFileNameClick(row) {
      //  若是目录则进入目录
      if (row._directory) {
        this.$router.push({
          query: {
            filePath: `${row.file_url}${row.file_name}/`,
            fileType: 0
          }
        });
      } else if (["jpg", "png", "jpeg"].includes(row.file_type)) {
        // 触发图片在线查看
        let data = {
          imgReviewVisible: true,
          imgReviewList: [
            {
              fileUrl: this.getThumbnailPath(row.id),
              downloadLink: this.getThumbnailPath(row.id),
              fileName: row.file_name,
              extendName: row.file_type
            }
          ],
          activeIndex: 0
        };
        this.$store.commit("setImgReviewData", data);
      } else if (["mp3", "flac", "wav"].includes(row.file_type)) {
        // 触发音频
        let data = {
          audioReviewVisible: true,
          audioReviewList: [
            {
              fileUrl: this.getThumbnailPath(row.id),
              downloadLink: this.getThumbnailPath(row.id),
              filename: row.file_name + "." + row.file_type
            }
          ],
          activeIndex: 0
        };
        this.$store.commit("setAudioReviewData", data);
      } else if (["mp4", "wmv"].includes(row.file_type)) {
        // 视频
        let data = {
          visible: true,
          url: this.getThumbnailPath(row.id),
          filename: row.file_name + "." + row.file_type
        };
        this.$store.commit("setVideoReviewData", data);
      } else if (["txt", "js"].includes(row.file_type)) {
        // 文本文件
        let data = {
          codeReviewVisible: true,
          fileId: row.id,
          filename: row.file_name + "." + row.file_type
        };
        this.$store.commit("setCodeReviewData", data);
      } else if (
        ["ppt", "pptx", "doc", "docx", "xls", "xlsx"].includes(row.file_type)
      ) {
        //office文件
        window.open(this.getDownloadFile(row.id), "_blank");
      }
    },
    //  计算文件大小
    calculateFileSize(size) {
      const B = 1024;
      const KB = Math.pow(1024, 2);
      const MB = Math.pow(1024, 3);
      const GB = Math.pow(1024, 4);
      if (!size) {
        return " ";
      } else if (size < KB) {
        return (size / B).toFixed(0) + "KB";
      } else if (size < MB) {
        return (size / KB).toFixed(1) + "MB";
      } else if (size < GB) {
        return (size / MB).toFixed(2) + "GB";
      } else {
        return (size / GB).toFixed(3) + "TB";
      }
    },
    // 表格行勾选事件 selection 勾选的表格行数据
    handleSelectRow(selection) {
      this.$emit("handleSelectFile", true, selection); // true/false 批量移动/单文件操作；selection 勾选的表格行数据
    },
    // 删除按钮 - 点击事件
    handleClickDelete(row) {
      // 消息弹框提示用户
      this.$confirm(
        "此操作将删除该文件, 但你依然可以在回收站找到它，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // 确定按钮 点击事件 调用删除文件接口
          deleteFile(row).then(res => {
            console.log(res);
            this.$emit("getTableData"); //  刷新文件列表
            // this.$message.success("删除成功");
          });
        })
        .catch(() => {
          //  取消
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 移动按钮 - 点击事件
    handleClickMove(row) {
      this.$emit("handleSelectFile", false, row); // true/false 批量移动/单文件操作；row 当前行文件数据
      this.$emit("handleMoveFile", true); // true/false 打开/关闭移动文件对话框
    },
    // 重命名按钮 - 点击事件
    handleClickRename(row) {
      const fileName = row.file_name;
      this.$prompt("请输入文件名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: fileName,
        inputPattern: /\S/, //  文件名不能为空
        inputErrorMessage: "请输入文件名",
        closeOnClickModal: false
      })
        .then(({ value }) => {
          // 确定按钮 调用重命名接口
          renameFile({
            ...row,
            file_name: value
          }).then(res => {
            console.log(res);
            this.$emit("getTableData"); //  刷新文件列表
            // this.$message.success("文件已重命名");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    // 下载按钮
    getDownloadPath(row) {
      return this.getDownloadFile(row.id);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/mixins.styl';

.file-list {
  height: calc(100vh - 237px);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  list-style: none;
  overflow-y: auto;
  setScrollbar(8px, #EBEEF5, #909399);

  .file-item {
    margin: 16px 16px 0 0;
    border-radius: 4px;
    width: 120px;
    padding: 8px;
    cursor: pointer;
    text-align: center;

    &:hover {
      background: #F5F7FA;
    }

    .file-img {
      width: 100px;
      height: 100px;
    }

    .file-name {
      line-height: 24px;
      font-size: 12px;
      word-break: break-all;
      setEllipsis(2);
    }
  }
}
</style>
