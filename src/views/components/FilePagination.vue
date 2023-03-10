<template>
  <!--  页码组件-->
  <el-pagination
    class="file-pagination"
    :current-page="pageData.currentPage"
    :page-size="pageData.pageCount"
    :total="pageData.total"
    :page-sizes="[10, 20, 50, 100]"
    layout="sizes, total, prev, pager, next"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "FilePagination",
  props: {
    pageData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    // 分页组件 当前页码改变
    handleCurrentChange(currentPage) {
      this.$emit("changePageData", {
        ...this.pageData,
        currentPage
      });
    },
    // 分页组件 每页显示条目个数改变
    handleSizeChange(pageCount) {
      this.$emit("changePageData", {
        ...this.pageData,
        pageCount
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
// 分页组件内容居右显示
.file-pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
