<template>
  <div v-if="!blank" class="box" @click="chosenField">
    <div v-if="active && !borders.top.disabled" class="topborder" @click="topClicked"></div>
    <div v-if="active && !borders.bottom.disabled" class="bottomborder"></div>
    <div v-if="active && !borders.right.disabled" class="rightborder"></div>
    <div v-if="active && !borders.left.disabled" class="leftborder"></div>
  </div>
  <div v-else class="blank-box"></div>
</template>

<script>
export default {
  name: "GameField",
  data() {
    return {
      blank: this.isBlank,
      active: false, //when clicked
      captured: false, //when someone already captured field, cant select
      borders: {
        top: {
          disabled: false, //if someone already took it
          capturedBy: null //who captured it
        },
        bottom: {
          disabled: false,
          capturedBy: null
        },
        right: {
          disabled: false,
          capturedBy: null
        },
        left: {
          disabled: false,
          capturedBy: null
        }
      }
    };
  },
  props: ["isBlank"],
  methods: {
    chosenField: function() {
      this.$parent.$options.data.fieldActive = true;
      // this.active = !this.active;
      // console.log(this.active);
      // console.log('click');

      //background blinking
      //borders blinking
      //show borders
    }
  }
};
</script>