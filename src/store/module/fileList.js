export default {
  state: {
    showModel: sessionStorage.getItem("showModel") //  查看模式 - 0 列表 | 1 网格 | 2 时间线
  },
  mutations: {
    // 改变需要显示的表格列
    changeSelectedColumnList(state, data) {
      sessionStorage.setItem("selectedColumnList", data.toString());
      state.selectedColumnList = data.toString();
    },
    // 切换查看模式
    changeShowModel(state, data) {
      sessionStorage.setItem("showModel", data);
      state.showModel = data;
      console.log(state);
    }
  },
  actions: {}
};
