<template>
  <div class="home">
    <!-- 左侧菜单 - 区分文件类型 -->
    <SideMenu class="home-left" :storageValue="storageValue"></SideMenu>
    <!-- 右侧内容区 -->
    <div class="home-right">
      <UserHeader style="height: 100px" :user="user"></UserHeader>
      <!-- 面包屑导航栏-->
      <BreadCrumb :fileType="fileType" style="height: 30px"></BreadCrumb>
      <router-view />
      <div class="right-main" v-if="this.$route.path === '/index'">
        <div class="operation-wrapper">
          <OperationMenu
            :fileType="fileType"
            :filePath="filePath"
            @getTableData="getFileData"
            @handleUploadFile="handleUploadFile"
            @handleSelectFile="setOperationFile"
            @handleMoveFile="setMoveFileDialog"
            :operationFileList="operationFileList"
          ></OperationMenu>
          <FileUploader
            ref="globalUploader"
            @getTableData="getFileData"
          ></FileUploader>
          <!-- 查看模式切换组件 将 fileType 传递给子组件 -->
          <ShowModel :fileType="fileType"></ShowModel>
        </div>
        <!-- 表格文件展示区 -->
        <FileTable
          v-if="showModel === 0"
          :tableData="tableData"
          :fileType="fileType"
          :loading="loading"
          @getTableData="getFileData"
          @handleSelectFile="setOperationFile"
          @handleMoveFile="setMoveFileDialog"
        ></FileTable>
        <FileGrid
          v-if="showModel === 1"
          :tableData="tableData"
          :loading="loading"
        ></FileGrid>
        <!-- 分页组件 -->
        <FilePagination
          style="position:absolute; bottom:0;padding-bottom: 20px"
          :pageData="pageData"
          @changePageData="changePageData"
        ></FilePagination>
        <!-- 移动文件模态框 -->
        <MoveFileDialog
          :dialogMoveFile="dialogMoveFile"
          @setSelectFilePath="setSelectFilePath"
          @confirmMoveFile="confirmMoveFile"
          @handleMoveFile="setMoveFileDialog"
        ></MoveFileDialog>
        <!-- 流文件在线查看组件 -->
        <ImgReview></ImgReview>
        <AudioReview></AudioReview>
        <VideoPlayer></VideoPlayer>
        <CodeReview></CodeReview>
      </div>
    </div>
  </div>
</template>

<script>
import SideMenu from "./components/SideMenu.vue"; //  引入左侧菜单组件
import BreadCrumb from "./components/BreadCrumb.vue"; //  引入面包屑导航栏
import FileTable from "./components/FileTable.vue"; //  引入文件表格展示区
import FilePagination from "./components/FilePagination.vue"; //  引入分页组件
import OperationMenu from "./components/OperationMenu.vue"; //  引入文件新建组件
import ShowModel from "./components/ShowModel.vue"; //  引入查看模式切换组件
import FileGrid from "./components/FileGrid.vue"; //  引入网格组件
import MoveFileDialog from "./components/MoveFileDialog"; //  引入移动文件组件
import ImgReview from "@/components/ImgReview"; //  图片查看
import UserHeader from "@/views/header/UserHeader"; //标题头
import FileUploader from "./components/FileUploader.vue"; // 文件上传组件
import AudioReview from "@/components/AudioReview"; //音频播放
import VideoPlayer from "@/components/VideoPlayer"; //视频播放
import CodeReview from "@/components/CodeReview"; //视频播放

import axios from "axios";

import {
  batchMoveFile,
  getFileByName,
  getFileListByPath,
  getFileListByType,
  getFileStorage,
  getFileTree,
  moveFile
} from "@/request/file.js";

export default {
  name: "Home",
  components: {
    VideoPlayer,
    UserHeader,
    SideMenu,
    BreadCrumb,
    FileTable,
    FilePagination,
    OperationMenu,
    ShowModel,
    FileGrid,
    FileUploader,
    MoveFileDialog,
    ImgReview,
    AudioReview,
    CodeReview
  },
  data() {
    return {
      user: {}, // 用户信息
      storageValue: 0, //  存储空间占用大小
      loading: false,
      tableData: [], //  文件列表
      pageData: {
        currentPage: 1, //   页码
        pageCount: 10, //  每页显示条目个数
        total: 0 //  总数
      },
      //  移动文件模态框数据
      dialogMoveFile: {
        visible: false, //  对话框是否显示
        fileTree: [] //  目录树
      },
      isBatch: false, //  是否批量操作
      operationFile: {}, // 单个操作的文件信息
      operationFileList: [], // 批量操作的文件信息
      selectFilePath: "" //  目标路径
    };
  },
  computed: {
    // 左侧菜单选中的文件类型
    fileType() {
      return this.$route.query.fileType
        ? Number(this.$route.query.fileType)
        : 0;
    },
    // 查看模式
    showModel() {
      return this.$store.getters.showModel;
    },
    // 当前所在路径
    filePath() {
      return this.$route.query.filePath ? this.$route.query.filePath : "/";
    }
  },
  watch: {
    fileType() {
      this.getFileData(); //  获取文件列表
    },
    filePath() {
      // 当左侧菜单选择全部，文件路径发生变化时，再重新获取文件列表
      if (this.fileType === 0) {
        this.getFileData(); //  获取文件列表
      }
    }
  },
  mounted() {
    this.getFileData(); //  获取文件列表
    this.created();
  },
  methods: {
    // 上传文件 按钮点击事件
    handleUploadFile() {
      //  触发子组件中的打开文件上传窗口事件
      this.$refs.globalUploader.triggerSelectFileClick();
    },
    // 获取用户信息
    created() {
      axios.get("/api/admin/info").then(resp => {
        // console.log(resp);
        this.user = resp;
        // console.log(this.user);
      });
    },
    // 获取文件列表
    getFileData() {
      this.loading = true; // 打开表格loading状态
      if (this.fileType === 0) {
        // 左侧菜单选择的为 全部 时，根据路径，获取文件列表
        this.loading = false;
        this.getFileDataByPath();
      } else {
        // 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
        this.getFileDataByType();
      }
      this.getStorageValue(); //  获取文件占用空间
    },
    // 获取文件占用空间
    getStorageValue() {
      getFileStorage().then(res => {
        this.storageValue = res.data ? Number(res.data) : 0;
      });
    },
    // 根据路径获取文件列表
    getFileDataByPath() {
      getFileListByPath({
        filePath: this.filePath, // 传递当前路径
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount
      }).then(
        res => {
          // console.log(res);
          this.loading = false; //  关闭表格loading状态
          this.tableData = res.data.list; // 表格数据赋值
          this.pageData.total = res.data.total; //  分页组件 - 文件总数赋值
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
    },
    // 根据类型获取文件列表
    getFileDataByType() {
      getFileListByType({
        fileType: this.fileType, //  文件类型
        currentPage: this.pageData.currentPage, //  当前页码
        pageCount: this.pageData.pageCount //  每页条目数
      }).then(
        res => {
          this.loading = false; //  关闭表格loading状态
          this.tableData = res.data.list; // 表格数据赋值
          this.pageData.total = res.data.total; //  分页组件 - 文件总数赋值
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
    },
    //模糊查询获取文件列表
    getFileByName() {
      getFileByName({
        fileName: "7", //  文件名
        currentPage: this.pageData.currentPage, //  当前页码
        pageCount: this.pageData.pageCount //  每页条目数
      }).then(
        res => {
          this.loading = false; //  关闭表格loading状态
          this.tableData = res.data.list; // 表格数据赋值
          this.pageData.total = res.data.total; //  分页组件 - 文件总数赋值
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
    },
    // 分页组件 - 页码或当页条目数改变时
    changePageData(pageData) {
      this.pageData.currentPage = pageData.currentPage; // 页码赋值
      this.pageData.pageCount = pageData.pageCount; //  每页条目数赋值
      this.getFileData(); // 获取文件列表
    },
    /**
     * 设置移动文件时的文件信息
     * @param {Boolean} isBatch 是否批量移动，true 是批量移动，false 是单个文件操作
     * @param {Object | Array} file 需要移动的文件信息，单个操作时为Oject，批量操作时，为Array
     */
    setOperationFile(isBatch, file) {
      this.isBatch = isBatch; //  保存操作类型
      if (isBatch) {
        this.operationFileList = file; //  批量操作文件
      } else {
        this.operationFile = file; //  单个操作文件
      }
    },
    /**
     * 设置移动文件对话框相关数据
     * @param {Boolean} visible 打开/关闭移动文件模态框
     */
    setMoveFileDialog(visible) {
      this.dialogMoveFile.visible = visible; //  打开对话框
      if (visible) {
        // 打开对话框时，获取文件夹目录树
        getFileTree().then(res => {
          if (res.code === 200) {
            this.dialogMoveFile.fileTree = [res.data];
          } else {
            this.$message.error(res.code);
          }
        });
      }
    },
    //  设置移动文件的目标路径
    setSelectFilePath(selectFilePath) {
      this.selectFilePath = selectFilePath;
    },
    //  移动文件模态框-确定按钮事件
    confirmMoveFile() {
      if (this.isBatch) {
        //  批量移动
        batchMoveFile({
          filePath: this.selectFilePath,
          files: JSON.stringify(this.operationFileList)
        }).then(res => {
          if (res.code === 200) {
            this.getFileData(); //  刷新文件列表
            this.dialogMoveFile.visible = false; //  关闭对话框
            this.operationFileList = [];
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        //  单文件移动
        moveFile({
          id: this.operationFile.id, //文件id
          file_name: this.operationFile.file_name, //  文件名称
          file_url: this.selectFilePath //  目标路径
        }).then(res => {
          // console.log(res);
          if (res.code === 200) {
            this.getFileData(); //  刷新文件列表
            this.dialogMoveFile.visible = false; //  关闭对话框
          } else {
            this.$message.error(res.message);
          }
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.home {
  // 使用flex布局 菜单居左固定宽度 右侧内容区域自适应宽度
  background-color: #eef0f4;
  display: flex;
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;

  .home-left {
    box-sizing: border-box;
  }

  .home-right {
    box-sizing: border-box;
    width: calc(100vh - 220px);
    padding-left : 20px;
    padding-right : 20px;
    flex: 1;

    .operation-wrapper {
      padding-top 10px
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      // 左侧菜单按钮组 样式调整
      >>> .operation-menu-wrapper {
        flex: 1;
      }
    }
    .right-main{
      border-top-right-radius 15px
      border-top-left-radius 15px
      padding-right 10px
      padding-left 10px
      background-color white
      height calc(100vh - 130px)
    }
  }
}
</style>
