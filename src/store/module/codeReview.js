export default {
  state: {
    codeReviewVisible: false, //  图片查看组件显隐状态
    codeReviewList: [], //  图片列表
    fileId: "",
    filename: ""
  },
  mutations: {
    setCodeReviewData(state, data) {
      if (data.codeReviewVisible) {
        state.codeReviewVisible = data.codeReviewVisible;
        state.fileId = data.fileId;
        state.filename = data.filename;
      } else {
        state.codeReviewVisible = false;
        state.fileId = "";
        state.filename = "";
      }
    }
  }
};
