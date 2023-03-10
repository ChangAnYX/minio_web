import Vue from "vue";
import Vuex from "vuex";

import file from "./module/fileList"; // 引入 file 模块
import imgReview from "./module/imgReview";
import audioReview from "./module/audioReview";
import player from "@/store/module/videoPlayer";
import codeReview from "./module/codeReview";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {
    // 查看模式 - 0 列表 | 1 网格 | 2 时间线
    showModel: state =>
      state.file.showModel === null ? 0 : Number(state.file.showModel)
  },
  mutations: {},
  actions: {
    //
  },
  modules: {
    file,
    imgReview,
    audioReview,
    player,
    codeReview
  }
});
