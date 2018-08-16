import Vue from "vue";
import App from "./App.vue";

new Vue({
  el: "#app",
  render: h => h(App)
});

//! how to build template for field
// var i = 3,
//   line = i,
//   a = '.',
//   b = '*'; var x = [];

// while (i-- > 0) {
//   x.push(
//     Array(1 + i).join(a) + Array((line - i) * 2).join(b) + Array(1 + i).join(a));
// }
// i = 0;
// while (++i < line) {
//   x.push(
//     Array(1 + i).join(a) + Array((line - i) * 2).join(b) + Array(1 + i).join(a));
// }
