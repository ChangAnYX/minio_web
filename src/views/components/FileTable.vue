<template>
  <el-table
    class="file-table"
    :data="tableData"
    height="calc(100vh - 232px)"
    :row-style="{ height: '50px' }"
    :cell-style="{ padding: '0px' }"
    style="width: 100%"
    v-loading="loading"
    @selection-change="handleSelectRow"
  >
    <!-- 勾选框 -->
    <el-table-column
      type="selection"
      width="50"
      align="center"
    ></el-table-column>
    <el-table-column label prop="isDir" width="50" align="center">
      <template slot-scope="scope">
        <img :src="setFileImg(scope.row)" style="width: 30px" />
      </template>
    </el-table-column>
    <el-table-column prop="fileName" label="文件名">
      <template slot-scope="scope">
        <div style="cursor: pointer" @click="handleFileNameClick(scope.row)">
          {{
            scope.row.file_type
              ? `${scope.row.file_name}.${scope.row.file_type}`
              : `${scope.row.file_name}`
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="extendName" label="类型" width="100">
      <template slot-scope="scope">
        <span>
          {{ scope.row.file_type ? scope.row.file_type : "文件夹" }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="file_size" label="大小" width="100">
      <template slot-scope="scope">
        <span>
          {{ calculateFileSize(scope.row.file_size) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="file_date" label="上传日期" width="180">
    </el-table-column>
    <el-table-column
      prop="file_url"
      label="原始路径"
      width="180"
      v-if="fileType === 8"
    >
    </el-table-column>
    <el-table-column
      prop="file_url"
      label="分享链接"
      width="250"
      v-if="fileType === 9"
    >
    </el-table-column>
    <el-table-column
      prop="file_url"
      label="分享日期"
      width="180"
      v-if="fileType === 9"
    >
    </el-table-column>
    <el-table-column
      prop="file_url"
      label="过期时间"
      width="180"
      v-if="fileType === 9"
    >
    </el-table-column>
    <el-table-column
      prop="file_del_date"
      label="删除日期"
      width="180"
      v-if="fileType === 8"
    >
    </el-table-column>
    <!-- 表格操作列 自定义表格头 原有的 label="操作" 需要删除 -->
    <el-table-column :width="operaColumnIsFold ? 200 : 100">
      <!-- 自定义表格头 -->
      <template slot="header">
        <span>操作</span>
        <i
          class="el-icon-circle-plus"
          title="展开"
          @click="operaColumnIsFold = true"
        ></i>
        <i
          class="el-icon-remove"
          title="折叠"
          @click="operaColumnIsFold = false"
        ></i>
      </template>
      <template slot-scope="scope">
        <!-- 操作列展开状态下的按钮 -->
        <div class="opera-unfold" v-if="operaColumnIsFold">
          <el-button
            type="text"
            size="small"
            v-if="fileType < 7"
            @click.native="handleClickDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="fileType === 8"
            @click.native="handleClickDelete(scope.row)"
            >还原</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="fileType < 7"
            @click.native="handleClickMove(scope.row)"
            >移动</el-button
          >
          <el-button
            type="text"
            v-if="fileType === 8"
            size="small"
            @click.native="handleClickDelete(scope.row)"
            >彻底删除</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="fileType < 7"
            @click.native="handleClickRename(scope.row)"
            >重命名</el-button
          >
          <el-button type="text" size="small">
            <a
              target="_blank"
              style="display: block; color: inherit; text-decoration-line: none"
              :href="getDownloadPath(scope.row)"
              v-if="fileType < 7"
              >下载</a
            >
          </el-button>
        </div>
        <!-- 操作列收缩状态下的按钮 -->
        <el-dropdown trigger="click" v-else>
          <el-button size="mini">
            操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="handleClickDelete(scope.row)"
              v-if="fileType < 7"
              >删除</el-dropdown-item
            >
            <el-dropdown-item
              @click.native="handleClickMove(scope.row)"
              v-if="fileType < 7"
              >移动</el-dropdown-item
            >
            <el-dropdown-item
              @click.native="handleClickRename(scope.row)"
              v-if="fileType < 7"
              >重命名</el-dropdown-item
            >
            <el-dropdown-item
              @click.native="handleClickRename(scope.row)"
              v-if="fileType === 8"
              >文件还原</el-dropdown-item
            >
            <el-dropdown-item
              @click.native="handleClickRename(scope.row)"
              v-if="fileType === 8"
              >彻底删除</el-dropdown-item
            >
            <el-dropdown-item>
              <a
                target="_blank"
                :href="getDownloadPath(scope.row)"
                style="display: block; color: inherit; text-decoration-line: none"
                v-if="fileType < 7"
                >下载</a
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deleteFile, renameFile } from "@/request/file";
export default {
  name: "FileTable",
  props: {
    // 表格数据
    tableData: {
      type: Array,
      required: true
    },
    // 表格加载状态
    loading: {
      type: Boolean,
      required: true
    },
    // 文件类型
    fileType: {
      type: Number,
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

.file-table {

  // 调整滚动条样式
  >>> .el-table__body-wrapper {
    setScrollbar(8px, #EBEEF5, #909399);
  }
}

// 表格操作列-表头图标样式调整
.el-icon-circle-plus, .el-icon-remove {
  margin-left: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    opacity: 0.5;
  }
}
</style>
