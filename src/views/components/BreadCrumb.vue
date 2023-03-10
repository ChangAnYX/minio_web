<template>
  <!--  面包屑-->
  <div class="bread-crumb-wrapper">
    <div class="current-path">当前位置：</div>
    <!-- 按类型查看文件时 -->
    <el-breadcrumb class="bread-crumb" v-if="fileType" separator="/">
      <el-breadcrumb-item>{{ fileTypeMap[fileType] }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按路径查看文件时 -->
    <el-breadcrumb class="bread-crumb" v-else separator="/">
      <!-- 当点击面包屑导航栏中的某一级时，改变路由 -->
      <el-breadcrumb-item
        v-for="(item, index) in breadCrumbList"
        :key="index"
        :to="{ query: { fileType: 0, filePath: item.path } }"
        >{{ item.name }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "BreadCrumb",
  props: {
    fileType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      fileTypeMap: {
        1: "全部图片",
        2: "全部文档",
        3: "全部视频",
        4: "全部音乐",
        5: "压缩文件",
        6: "其他",
        8: "回收站",
        9: "我的分享"
      }
    };
  },
  computed: {
    // 依据路径查看时 当前路径拆分的面包屑数据
    breadCrumbList() {
      let path = this.$route.query.filePath;
      let pathList = path ? path.split("/").slice(1, -1) : []; // 路径列表，取第二个 ~ 倒数第二个，因为第一个和最后一个数组项都是空字符串
      let res = [{ name: "全部文件", path: "/" }];
      pathList.forEach((element, index) => {
        res.push({
          name: element,
          path: `${res[index].path}${element}/`
        });
      });
      return res;
    }
  }
};
</script>

<style lang="stylus" scoped>
.bread-crumb-wrapper {
  height: 32px;
  line-height: 32px;
  display: flex;
  align-items: center;
}
</style>
