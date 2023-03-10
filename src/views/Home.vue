<!--<template>-->
<!--  <div class="home">-->
<!--    &lt;!&ndash; 左侧菜单 - 区分文件类型 &ndash;&gt;-->
<!--    <SideMenu class="home-left" :storageValue="storageValue"></SideMenu>-->
<!--    &lt;!&ndash; 右侧内容区 &ndash;&gt;-->
<!--    <div class="home-right">-->
<!--      <UserHeader style="height: 100px" :user="user"></UserHeader>-->
<!--      &lt;!&ndash; 面包屑导航栏 - 显示文件路径 &ndash;&gt;-->
<!--      <BreadCrumb :fileType="fileType" style="height: 30px"></BreadCrumb>-->
<!--      <router-view />-->
<!--      <div class="right-main" v-if="this.$route.path === '/index'">-->
<!--        <div class="operation-wrapper">-->
<!--          <OperationMenu-->
<!--            :fileType="fileType"-->
<!--            :filePath="filePath"-->
<!--            @getTableData="getFileData"-->
<!--          ></OperationMenu>-->
<!--          &lt;!&ndash; 3. 使用查看模式切换组件 将 fileType 传递给子组件 &ndash;&gt;-->
<!--          <ShowModel :fileType="fileType"></ShowModel>-->
<!--          <SelectColumn></SelectColumn>-->
<!--        </div>-->
<!--        &lt;!&ndash; 表格组件 - 文件展示区 &ndash;&gt;-->
<!--        <FileTable-->
<!--          v-if="showModel === 0"-->
<!--          :tableData="tableData"-->
<!--          :loading="loading"-->
<!--          @getTableData="getFileData"-->
<!--        ></FileTable>-->
<!--        <FileGrid-->
<!--          v-if="showModel === 1"-->
<!--          :tableData="tableData"-->
<!--          :loading="loading"-->
<!--        ></FileGrid>-->
<!--        &lt;!&ndash; 分页组件 - 文件分页 &ndash;&gt;-->
<!--        <FilePagination-->
<!--          style="position:absolute; bottom:0;padding-bottom: 20px"-->
<!--          :pageData="pageData"-->
<!--          @changePageData="changePageData"-->
<!--        ></FilePagination>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import SideMenu from "./components/SideMenu.vue"; //  引入左侧菜单组件-->
<!--import BreadCrumb from "./components/BreadCrumb.vue"; //  引入面包屑导航栏-->
<!--import FileTable from "./components/FileTable.vue"; //  引入文件表格展示区-->
<!--import FilePagination from "./components/FilePagination.vue"; //  引入分页组件-->
<!--import OperationMenu from "./components/OperationMenu.vue"; //  引入文件新建组件-->
<!--// import FileUploader from './components/FileUploader.vue' //  引入文件上传组件-->
<!--import ShowModel from "./components/ShowModel.vue"; //  引入查看模式切换组件-->
<!--import FileGrid from "./components/FileGrid.vue"; //  引入网格组件-->
<!--import UserHeader from "@/views/header/UserHeader";-->
<!--import axios from "axios";-->

<!--import {-->
<!--  getFileListByPath,-->
<!--  getFileListByType,-->
<!--  getFileStorage-->
<!--} from "@/request/file.js";-->

<!--export default {-->
<!--  name: "Home",-->
<!--  components: {-->
<!--    UserHeader,-->
<!--    SideMenu,-->
<!--    BreadCrumb,-->
<!--    FileTable,-->
<!--    FilePagination,-->
<!--    OperationMenu,-->
<!--    ShowModel,-->
<!--    // UserHeader,-->
<!--    FileGrid //  2.    注册网格组件-->
<!--    // FileUploader //  2. 注册文件上传组件-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      storageValue: 0, //  存储空间占用大小-->
<!--      loading: false,-->
<!--      tableData: [], //  文件列表-->
<!--      pageData: {-->
<!--        currentPage: 1, //   页码-->
<!--        pageCount: 10, //  每页显示条目个数-->
<!--        total: 0 //  总数-->
<!--      },-->
<!--      user: {}-->
<!--    };-->
<!--  },-->
<!--  computed: {-->
<!--    // 左侧菜单选中的文件类型-->
<!--    fileType() {-->
<!--      return this.$route.query.fileType-->
<!--        ? Number(this.$route.query.fileType)-->
<!--        : 0;-->
<!--    },-->
<!--    // 查看模式-->
<!--    showModel() {-->
<!--      return this.$store.getters.showModel;-->
<!--    },-->
<!--    // 当前所在路径-->
<!--    filePath() {-->
<!--      return this.$route.query.filePath ? this.$route.query.filePath : "/";-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    fileType() {-->
<!--      this.getFileData(); //  获取文件列表-->
<!--    },-->
<!--    filePath() {-->
<!--      // 当左侧菜单选择全部，文件路径发生变化时，再重新获取文件列表-->
<!--      if (this.fileType === 0) {-->
<!--        this.getFileData(); //  获取文件列表-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.getFileData(); //  获取文件列表-->
<!--  },-->
<!--  created() {-->
<!--    this.created();-->
<!--  },-->
<!--  methods: {-->
<!--    created() {-->
<!--      axios.get("/admin/info").then(resp => {-->
<!--        console.log(resp);-->
<!--        this.user = resp;-->
<!--        console.log(this.user);-->
<!--      });-->
<!--    },-->
<!--    // 获取文件列表-->
<!--    getFileData() {-->
<!--      this.loading = true; // 打开表格loading状态-->
<!--      if (this.fileType === 0) {-->
<!--        // 左侧菜单选择的为 全部 时，根据路径，获取文件列表-->
<!--        this.loading = false;-->
<!--        this.getFileDataByPath();-->
<!--      } else {-->
<!--        // 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表-->
<!--        this.getFileDataByType();-->
<!--      }-->
<!--      this.getStorageValue(); //  获取文件占用空间-->
<!--    },-->
<!--    // 获取文件占用空间-->
<!--    getStorageValue() {-->
<!--      getFileStorage().then(res => {-->
<!--        this.storageValue = res.data ? Number(res.data) : 0;-->
<!--      });-->
<!--    },-->
<!--    // 根据路径获取文件列表-->
<!--    getFileDataByPath() {-->
<!--      getFileListByPath({-->
<!--        filePath: this.filePath, // 传递当前路径-->
<!--        currentPage: this.pageData.currentPage,-->
<!--        pageCount: this.pageData.pageCount-->
<!--      }).then(-->
<!--        res => {-->
<!--          console.log(res);-->
<!--          this.loading = false; //  关闭表格loading状态-->

<!--          this.tableData = res.data.list; // 表格数据赋值-->
<!--          this.pageData.total = res.data.total; //  分页组件 - 文件总数赋值-->
<!--        },-->
<!--        error => {-->
<!--          this.loading = false;-->
<!--          console.log(error);-->
<!--        }-->
<!--      );-->
<!--    },-->
<!--    // 根据类型获取文件列表-->
<!--    getFileDataByType() {-->
<!--      getFileListByType({-->
<!--        fileType: this.fileType, //  文件类型-->
<!--        currentPage: this.pageData.currentPage, //  当前页码-->
<!--        pageCount: this.pageData.pageCount //  每页条目数-->
<!--      }).then(-->
<!--        res => {-->
<!--          this.loading = false; //  关闭表格loading状态-->
<!--          this.tableData = res.data.list; // 表格数据赋值-->
<!--          this.pageData.total = res.data.total; //  分页组件 - 文件总数赋值-->
<!--        },-->
<!--        error => {-->
<!--          this.loading = false;-->
<!--          console.log(error);-->
<!--        }-->
<!--      );-->
<!--    },-->
<!--    // 分页组件 - 页码或当页条目数改变时-->
<!--    changePageData(pageData) {-->
<!--      this.pageData.currentPage = pageData.currentPage; // 页码赋值-->
<!--      this.pageData.pageCount = pageData.pageCount; //  每页条目数赋值-->
<!--      this.getFileData(); // 获取文件列表-->
<!--    }-->
<!--    // 上传文件 按钮点击事件-->
<!--    // handleUploadFile() {-->
<!--    //   this.$refs.globalUploader.triggerSelectFileClick() //  打开文件上传窗口-->
<!--    // }-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style lang="stylus" scoped>-->
<!--.home {-->
<!--  // 使用flex布局 菜单居左固定宽度 右侧内容区域自适应宽度-->
<!--  background-color: #eef0f4;-->
<!--  display: flex;-->
<!--  margin: 0;-->
<!--  padding: 0;-->
<!--  font-family: Arial, Helvetica, sans-serif;-->

<!--  .home-left {-->
<!--    box-sizing: border-box;-->
<!--  }-->

<!--  .home-right {-->
<!--    box-sizing: border-box;-->
<!--    width: calc(100vh - 220px);-->
<!--    padding-left : 20px;-->
<!--    padding-right : 20px;-->
<!--    flex: 1;-->

<!--    .operation-wrapper {-->
<!--      padding-top 10px-->
<!--      margin-bottom: 16px;-->
<!--      display: flex;-->
<!--      align-items: center;-->
<!--      justify-content: space-between;-->

<!--      // 左侧菜单按钮组 样式调整-->
<!--      >>> .operation-menu-wrapper {-->
<!--        flex: 1;-->
<!--      }-->
<!--    }-->
<!--    .right-main{-->
<!--      border-top-right-radius 15px-->
<!--      border-top-left-radius 15px-->
<!--      padding-right 10px-->
<!--      padding-left 10px-->
<!--      background-color white-->
<!--      height calc(100vh - 130px)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
