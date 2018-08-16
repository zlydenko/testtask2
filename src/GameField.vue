<template>
  <div v-if="!blank" class="box" @click="chosenField" :style="'background-color: '+this.fieldDetails.bgc">
    <div v-if="(this.fieldDetails.active || this.fieldDetails.borders.top.disabled) && !this.fieldDetails.borders.disabled" class="topborder" @click="borderClicked('top')" :style="'background-color: ' + this.fieldDetails.borders.top.color"></div>
    <div v-if="(this.fieldDetails.active || this.fieldDetails.borders.bottom.disabled) && !this.fieldDetails.borders.disabled" class="bottomborder" @click="borderClicked('bottom')" :style="'background-color: ' + this.fieldDetails.borders.bottom.color"></div>
    <div v-if="(this.fieldDetails.active || this.fieldDetails.borders.right.disabled) && !this.fieldDetails.borders.disabled" class="rightborder" @click="borderClicked('right')" :style="'background-color: ' + this.fieldDetails.borders.right.color"></div>
    <div v-if="(this.fieldDetails.active || this.fieldDetails.borders.left.disabled) && !this.fieldDetails.borders.disabled" class="leftborder" @click="borderClicked('left')" :style="'background-color: ' + this.fieldDetails.borders.left.color"></div>
  </div>
  <div v-else class="blank-box"></div>
</template>

<script>
export default {
  name: "GameField",
  props: ["isBlank", "fieldDetails"],
  data() {
    return {
      blank: this.isBlank
    };
  },
  methods: {
    chosenField: function() {
      this.$emit("choseField", {
        id: this.fieldDetails.id
      });
      console.log("clicked in child component - game-field");
    },
    borderClicked: function(position) {
      console.log(`top border clicked on ${this.fieldDetails.id}`);
      this.fieldDetails.borders.disabled ||
      this.fieldDetails.borders[position].disabled
        ? null
        : this.$emit("borderClicked", {
            position,
            id: this.fieldDetails.id
          });
    }
  }
};
</script>