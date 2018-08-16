<template>
  <div>
    <h5>now {{(turn % 2 !== 0) ? players[0].name + '\'s turn' : players[1].name + '\'s turn'}}</h5>
    <div class="row" v-for="(element,index) in fields" :key="index">
      <game-field @choseField="chosenField" @borderClicked="chosenBorder" v-if="!fields.blank" v-for="(fields) in element" :key="fields.id" :field-details="fields"></game-field>
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
      turn: 1,
      fields: [],
      playableFields: [],
      templates: ["..*..", ".***.", "*****", ".***.", "..*.."],
      players: [
        {
          id: 1,
          name: "vasya",
          color: "red"
        },
        {
          id: 2,
          name: "katya",
          color: "green"
        }
      ]
    };
  },
  created: function() {
    let id = 1;
    this.fields = this.templates.map(value =>
      value.split("").map(
        symbol =>
          symbol === "."
            ? { blank: true, id: id++ }
            : {
                id: id++,
                blank: false,
                active: false,
                bgc: "",
                borders: {
                  disabled: false,
                  top: {
                    disabled: false,
                    capturedBy: null,
                    color: "rgb(0,0,0)"
                  },
                  bottom: {
                    disabled: false,
                    capturedBy: null,
                    color: "rgb(0,0,0)"
                  },
                  left: {
                    disabled: false,
                    capturedBy: null,
                    color: "rgb(0,0,0)"
                  },
                  right: {
                    disabled: false,
                    capturedBy: null,
                    color: "rgb(0,0,0)"
                  }
                }
              }
      )
    );
  },
  mounted: function() {
    let filterPlayableFields = this.fields.map(arr =>
      arr.filter(obj => obj.blank === false)
    );
    this.playableFields = [].concat.apply([], filterPlayableFields);
  },
  methods: {
    chosenField: function(data) {
      //find other active fields and change them
      this.playableFields.forEach((item, _i, _arr) => {
        item.id === data.id ? (item.active = true) : (item.active = false);
      });

      console.log("parent component");
      console.log(data.id);
    },
    chosenBorder: function(data) {
      let playingCharacter =
        this.turn % 2 !== 0 ? this.players[0] : this.players[1];
      let playerColor = playingCharacter.color;
      let activeField = this.playableFields.filter(
        field => field.id === data.id
      )[0];
      activeField.borders[data.position].disabled = true;
      activeField.borders[data.position].capturedBy = playingCharacter.name;
      activeField.borders[data.position].color = playingCharacter.color;
      let isFinished =
        activeField.borders.top.disabled &&
        activeField.borders.bottom.disabled &&
        activeField.borders.right.disabled &&
        activeField.borders.left.disabled;

      if (isFinished) {
        activeField.borders.disabled = true;
        activeField.bgc = playerColor;
        this.turn += 2;
      } else {
        this.turn++;
      }
      console.log(data);
    }
  }
};
</script>

<style lang="css">
</style>