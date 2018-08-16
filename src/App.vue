<template>
  <div>
    <div class="row" v-for="(element,index) in fields" :key="index">
      <game-field v-if="!fields.blank" v-for="(fields, i) in element" :key="i"></game-field>
      <game-field v-else :is-blank="true"></game-field>
      </div>
    </div>
</template>

<script>
import GameField from "./GameField.vue";

export default {
  name: "App",
  components: {
    GameField
  },
  data() {
    return {
      fieldActive: false,
      fields: [],
      templates: ["..*..", ".***.", "*****", ".***.", "..*.."]
    };
  },
  created: function() {
    this.fields = this.templates.map(value =>
      value.split("").map(
        symbol =>
          symbol === "."
            ? { blank: true }
            : {
                blank: false,
                id: Math.floor(Math.random() * 100) + 1
              }
      )
    );
  },
  methods: {}
};
</script>

<style lang="css">
</style>