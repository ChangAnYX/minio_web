<template>
  <transition name="el-fade-in-linear">
    <div class="audio-preview-wrapper" v-show="Visible">
      <div class="top">
        <i
          class="close-icon el-icon-close"
          title="关闭"
          @click="handleClosePreview"
        ></i>
      </div>
      <!-- 音频名称 -->
      <div
        class="audio-title"
        v-for="(item, index) in audioReviewList"
        :key="'info-' + index"
      >
        <i class="music-icon el-icon-headset"></i>
        {{ item.filename }}
      </div>
      <!-- 音频组件 -->
      <audio
        class="audio-box"
        v-for="(item, index) in audioReviewList"
        :key="index"
        :src="item.fileUrl"
        controls
        autoplay
      ></audio>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AudioReview",
  // data() {
  //   return {
  //     visible: true //  音频预览组件是否可见
  //   };
  // },
  computed: {
    // 图片查看组件是否显示
    Visible() {
      return this.$store.state.audioReview.audioReviewVisible;
    },
    // 图片列表
    audioReviewList() {
      return this.$store.state.audioReview.audioReviewList;
    },
    // 默认显示的图片索引 从 0 开始
    defaultActiveIndex() {
      return this.$store.state.audioReview.defaultActiveIndex;
    },
    // 当前显示的图片下载链接
    activeDownloadLink() {
      return this.audioReviewList.downloadLink;
    }
  },
  methods: {
    // 关闭视频预览
    handleClosePreview() {
      this.$store.commit("setAudioReviewData", { imgReviewVisible: false });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../assets/style/mixins.styl"
@import "../assets/style/varibles.styl"

.audio-preview-wrapper {
  position: fixed;
  top: 120px;
  right: 20px;
  border-radius: 8px;
  box-shadow: $tabBoxShadow;
  padding: 8px 16px 16px 16px;
  background: linear-gradient(to right, $Primary, #b6d7fd);
  width: 300px;
  z-index: 3;
  .top {
    margin-bottom: 8px;
    font-weight: 550;
    font-size: 18px;
    color: #fff;
    text-align: right;
    .close-icon {
      cursor: pointer;
      &:hover {
        color: $Danger;
      }
    }
  }
  .audio-title {
    margin-bottom: 16px;
    color: #fff;
    .music-icon {
      margin-right: 8px
    }
  }
  .audio-box {
    width: 100%;
    &::-webkit-media-controls-enclosure {
      background: #fff;
    }
  }
}
</style>
