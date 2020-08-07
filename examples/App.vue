<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <div class="container">
      <vue-marquee :data="list" />
    </div>
  </div>
</template>

<script>
import VueMarquee from '../packages/vue-marquee/index';

export default {
  name: 'App',
  components: {
    VueMarquee
  },
  data() {
    return {
      list: [
        'data1 some text.',
        'data2 balabalabalabala.',
        'data3 long long long long long long long long long long long text.',
        'data4 hahaha.'
      ]
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html,
body,
ul,
li {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
  overflow: auto;
}
body {
  text-align: center;
}
.container {
  margin: 0 auto;
  width: 300px;
  font-size: 14px;
  height: 36px;
  border: 1px dashed #000;
  text-align: left;
  padding: 0 5px;
}
</style>
