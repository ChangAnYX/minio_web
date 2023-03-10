<template>
  <div class="change-file-model">
    <!--    &lt;!&ndash; 批量操作 &ndash;&gt;-->
    <!--    <i-->
    <!--        class="batch-icon el-icon-finished"-->
    <!--        :class="isBatchOperation ? 'active' : ''"-->
    <!--        :title="isBatchOperation ? '取消批量操作' : '批量操作'"-->
    <!--        v-if="currentshowModel === 1 && fileType < 7"-->
    <!--        @click="handleBatchOperationChange()"-->
    <!--    ></i>-->

    <!-- 全局搜索文件 -->
    <el-input
      v-if="fileType === 0"
      class="select-file-input"
      v-model="searchFile.fileName"
      placeholder="搜索文件名"
      size="mini"
      maxlength="255"
      :clearable="true"
      @change="handleSearchInputChange"
      @clear="$emit('getTableDataByType')"
      @keyup.enter.native="handleSearchInputChange(searchFile.fileName)"
    >
      <i
        slot="prefix"
        class="el-input__icon el-icon-search"
        title="点击搜索"
        @click="handleSearchInputChange(searchFile.fileName)"
      ></i>
    </el-input>

    <el-divider direction="vertical" class="split-line"></el-divider>
    <!-- 文件展示模式 -->
    <el-radio-group v-model="currentshowModel" size="mini">
      <el-radio-button :label="0">
        <i class="el-icon-tickets"></i> 列表
      </el-radio-button>
      <el-radio-button :label="1">
        <i class="el-icon-s-grid"></i> 网格
      </el-radio-button>
      <el-radio-button :label="2" v-if="fileType === 1">
        <i class="el-icon-date"></i> 时间线
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "ShowModel",
  props: {
    // 文件类型
    fileType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 文件搜索数据
      searchFile: {
        fileName: ""
      }
    };
  },
  computed: {
    //  查看模式 - 0 列表 | 1 网格 | 2 时间线
    currentshowModel: {
      get() {
        return this.$store.getters.showModel;
      },
      set(val) {
        this.$store.commit("changeShowModel", val); //  修改查看模式
      }
    }
  },
  methods: {
    // 搜索输入框搜索事件
    handleSearchInputChange(value) {
      if (value === "") {
        this.$emit("getTableDataByType");
      } else {
        this.$emit("getSearchFileList", value);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.change-file-model {
  margin-right: 5px;
  display: flex;
  padding: 0;

}
.operation-menu-wrapper.file-type-6 {
  margin: 8px 0;
  justify-content: flex-end;
}
.select-file-input {
  margin-right: 3px;
  width: 200px;
}

.split-line {
  margin: 5px;
}

.img-text-wrapper {
  display: flex;
  align-items: center;
  img {
    margin-right: 4px;
    height: 24px;
  }
}
</style>
