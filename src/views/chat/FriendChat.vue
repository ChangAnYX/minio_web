<template>
  <div id="app">
    <div class="sidebar">
      <card></card>
      <list></list>
    </div>
    <div class="main">
      <message></message>
      <usertext></usertext>
    </div>
  </div>
</template>

<script>
import card from "./chat/card.vue";
import list from "./chat/list.vue";
import message from "./chat/message.vue";
import usertext from "./chat/usertext.vue";

export default {
  name: "FriendChat",
  data() {
    return {};
  },
  mounted: function() {
    this.$store.dispatch("initData");
  },
  components: {
    card,
    list,
    message,
    usertext
  }
};
</script>

<!--1.安装scss
      npm install sass-loader --save-dev
    2.安装node-sass
      npm install node-sass --save-dev
  -->
<style lang="scss" scoped>
/*滚动条隐藏*/
::-webkit-scrollbar {
  display: none;
}

#app {
  margin: 10px auto;
  width: 800px;
  height: 600px;
  overflow: hidden;
  border-radius: 10px;

  .sidebar,
  .main {
    height: 100%;
  }

  .sidebar {
    float: left;
    color: #f4f4f4;
    background-color: #2e3238;
    width: 200px;
  }

  .main {
    position: relative;
    overflow: hidden;
    background-color: #eee;
  }
}
</style>
