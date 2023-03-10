export default {
  state: {
    audioReviewVisible: false, //  图片查看组件显隐状态
    audioReviewList: [], //  图片列表
    defaultActiveIndex: 0 //  默认当前打开的图片的索引
  },
  mutations: {
    setAudioReviewData(state, data) {
      if (data.audioReviewVisible) {
        state.audioReviewVisible = data.audioReviewVisible;
        state.audioReviewList = data.audioReviewList;
      } else {
        state.audioReviewVisible = data.false;
        state.audioReviewList = [];
        state.defaultActiveIndex = 0;
      }
    }
  }
};
