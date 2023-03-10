<template>
  <div class="operation-menu-wrapper">
    <!-- 按钮组 -->
    <el-button-group class="operate-group">
      <el-dropdown class="create-drop" trigger="hover" v-if="fileType < 7">
        <el-button
          size="mini"
          type="primary"
          :disabled="fileType !== 0"
          icon="el-icon-plus"
          >新建<i class="el-icon-arrow-down el-icon--right"></i
        ></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="addFolderDialog.visible = true">
            <div class="img-text-wrapper">
              <img src="../../assets/images/file/dir.png" class="imgD" />
              新建文件夹
            </div>
          </el-dropdown-item>
          <hr color="#eee" style="width: 120px" />
          <el-dropdown-item>
            <div class="img-text-wrapper">
              <img
                src="../../assets/images/file/file_word.svg"
                class="imgS"
              />Word 文档
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div class="img-text-wrapper">
              <img
                src="../../assets/images/file/file_excel.svg"
                class="imgS"
              />Excel 表格
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div class="img-text-wrapper">
              <img
                src="../../assets/images/file/file_ppt.svg"
                class="imgS"
              />PPT 演示文稿
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-upload2"
        @click="handleUploadFileClick()"
        :disabled="fileType !== 0"
        v-if="fileType < 7"
        >上传文件</el-button
      >

      <el-button
        size="mini"
        type="primary"
        icon="el-icon-upload2"
        @click="handleEmptyTrash()"
        v-if="fileType === 8"
        >清空回收站</el-button
      >
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-upload2"
        @click="handleRestoreTrash()"
        v-if="fileType === 8"
        >还原回收站</el-button
      >

      <template v-if="operationFileList.length && fileType < 7">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-delete"
          @click="handleDeleteFileClick()"
          >删除</el-button
        >
        <!-- disabled 当表格勾选项为空时，禁用移动按钮 | v-if 当左侧菜单选择全部时，才显示移动按钮 -->
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-rank"
          :disabled="fileType !== 0"
          @click="handleMoveFileClick()"
          >移动</el-button
        >
        <!-- disabled 当表格勾选项为空时，禁用下载按钮 -->
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-download"
          @click="handleDownloadFileClick()"
          >下载</el-button
        >
      </template>
      <template v-if="operationFileList.length && fileType === 8">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-delete"
          @click="handleEmptyFilesBatch()"
          >彻底删除</el-button
        >
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-delete"
          @click="handRestoreFilesBatch()"
          >批量还原</el-button
        >
      </template>
    </el-button-group>

    <!-- 对话框 - 新建文件夹 -->
    <!-- @closed 对话框关闭动画结束时 重置表单并清空所有表单校验 -->
    <el-dialog
      title="新建文件夹"
      width="600px"
      :visible.sync="addFolderDialog.visible"
      @closed="$refs.addFolderForm.resetFields()"
    >
      <el-form
        :model="addFolderForm"
        :rules="addFolderRules"
        label-position="top"
        ref="addFolderForm"
      >
        <el-form-item label="文件夹名称" prop="name">
          <el-input v-model="addFolderForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFolderDialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="addFolderDialog.loading"
          @click="handleAddFolderSubmit('addFolderForm')"
          >提 交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  batchDeleteFile,
  batchEmptyFile,
  batchRestoreFile,
  getEmptyTrash,
  getRestoreTrash,
  makerDir
} from "@/request/file";

export default {
  name: "OperationMenu",
  props: {
    // 文件类型
    fileType: {
      type: Number,
      required: true
    },
    // 文件路径
    filePath: {
      type: String,
      required: true
    },
    // 表格行已选项
    operationFileList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 新建文件夹对话框数据
      addFolderDialog: {
        visible: false, //  对话框显隐状态
        loading: false
      },
      // 新建文件夹表单
      addFolderForm: {
        name: ""
      },
      // 新建文件夹表单校验规则
      addFolderRules: {
        name: [
          {
            required: true,
            message: "请输入文件夹名称",
            trigger: "blur, change"
          }
        ]
      }
    };
  },
  methods: {
    // 新建文件夹对话框 - 提交按钮
    handleAddFolderSubmit() {
      this.$refs.addFolderForm.validate(valid => {
        if (valid) {
          this.addFolderDialog.loading = true; //  对话框的确定按钮打开loading状态
          // 表单校验通过 - 调用新建文件夹接口
          makerDir({
            fileName: this.addFolderForm.name,
            filePath: this.filePath //  文件路径
            // IsDir: 1 //  是否为文件夹：1 表示文件夹 0 表示文件
          }).then(
            resp => {
              console.log(resp);
              this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
              if (resp.code === 200) {
                this.addFolderDialog.visible = false; //  关闭对话框
                this.$emit("getTableData"); // 重新获取文件列表
              } else {
                this.$message.warning(resp.message);
              }
            },
            error => {
              this.addFolderDialog.loading = false; //  对话框的确定按钮关闭loading状态
              console.log(error);
            }
          );
        } else {
          return false;
        }
      });
    },
    // 上传文件按钮 - 点击事件
    handleUploadFileClick() {
      this.$emit("handleUploadFile", true);
    },
    // 批量删除文件按钮
    handleDeleteFileClick() {
      // 消息弹框提示用户
      this.$confirm(
        "此操作将删除选中文件, 但你依然可以在回收站找到它，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // 确定按钮 点击事件 调用批量删除文件接口
          batchDeleteFile({
            files: JSON.stringify(this.operationFileList),
            filePath: "/"
          }).then(res => {
            if (res.code === 200) {
              this.$emit("getTableData"); //  刷新文件列表
            } else {
              this.$message.error("失败" + res.message);
            }
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
    // 移动文件按钮 - 点击事件
    handleMoveFileClick() {
      // true/false 批量移动/单文件操作 | this.operationFileList 当前行文件数据
      this.$emit("handleSelectFile", true, this.operationFileList);
      this.$emit("handleMoveFile", true); // true/false 打开/关闭移动文件对话框
    },
    // 清空回收站
    handleEmptyTrash() {
      this.$confirm("此操作将清空回收站，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定按钮 点击事件 调用批量删除文件接口
          getEmptyTrash({}).then(res => {
            if (res.code === 200) {
              this.$emit("getTableData"); //  刷新文件列表
            } else {
              this.$message.error("失败" + res.message);
            }
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
    // 还原回收站
    handleRestoreTrash() {
      this.$confirm("此操作将还原回收站，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定按钮 点击事件 调用批量删除文件接口
          getRestoreTrash({}).then(res => {
            if (res.code === 200) {
              this.$emit("getTableData"); //  刷新文件列表
            } else {
              this.$message.error("失败" + res.message);
            }
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
    // 彻底删除
    handleEmptyFilesBatch() {
      this.$confirm("此操作将彻底删除选中文件，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定按钮 点击事件 调用批量删除文件接口
          batchEmptyFile({
            files: JSON.stringify(this.operationFileList),
            filePath: "/"
          }).then(res => {
            if (res.code === 200) {
              this.$emit("getTableData"); //  刷新文件列表
            } else {
              this.$message.error("失败" + res.message);
            }
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
    // 批量还原
    handRestoreFilesBatch() {
      batchRestoreFile({
        files: JSON.stringify(this.operationFileList),
        filePath: "/"
      }).then(res => {
        if (res.code === 200) {
          this.$emit("getTableData"); //  刷新文件列表
        } else {
          this.$message.error("失败" + res.message);
        }
      });
    }
  }
};
</script>

<style>
.img-text-wrapper {
  display: flex;
  align-items: center;
}
.imgD {
  margin-right: 4px;
  height: 30px;
}
.imgS {
  margin-right: 4px;
  height: 23px;
}
.create-drop {
  float: left;
}
</style>
