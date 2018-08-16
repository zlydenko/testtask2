<template>
  <div>
    <h5 v-if="!this.finished">now {{playerMove.name + '\'s turn'}}</h5>
    <h5 v-else>game over</h5>
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
      finished: false,
      playableFields: [],
      templates: ["..*..", ".***.", "*****", ".***.", "..*.."],
      players: [
        {
          id: 1,
          name: "vasya",
          color: "red",
          turn: false
        },
        {
          id: 2,
          name: "katya",
          color: "green",
          turn: true
        }
      ]
    };
  },
  computed: {
    playerMove: function() {
      return this.players.filter(player => player.turn === true)[0];
    }
  },
  created: function() {
    let id = 1;
    this.fields = this.templates.map(value =>
      value.split("").map(symbol => {
        return symbol === "."
          ? { blank: true, id: id++ }
          : {
              id: id++,
              blank: false,
              active: false,
              bgc: "",
              borders: {
                disabled: false,
                capturedBy: null,
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
            };
      })
    );
  },
  mounted: function() {
    let filterPlayableFields = this.fields.map(arr =>
      arr.filter(obj => obj.blank === false)
    );
    this.playableFields = [].concat.apply([], filterPlayableFields);
    this.playableFields.forEach((item, _i, _arr) => {
      let id = item.id;
      let { top, bottom, right, left } = this.findNeighbours(id);

      if (top === undefined) item.borders.top.disabled = true;
      if (bottom === undefined) item.borders.bottom.disabled = true;
      if (right === undefined) item.borders.right.disabled = true;
      if (left === undefined) item.borders.left.disabled = true;
    });
  },
  methods: {
    isGameOver: function() {
      return (
        this.playableFields.filter(field => field.borders.disabled === false)
          .length === 0
      );
    },
    delegateMove: function() {
      if (this.isGameOver()) {
        this.finished = true;
      } else {
        this.players.forEach((player, _i, _arr) => {
          player.turn = !player.turn;
        });
      }
    },
    findNeighbours: function(index) {
      let top = this.playableFields.filter(x => x.id === index - 5)[0];
      let bottom = this.playableFields.filter(x => x.id === index + 5)[0];
      let right = this.playableFields.filter(x => x.id === index + 1)[0];
      let left = this.playableFields.filter(x => x.id === index - 1)[0];

      return {
        top,
        bottom,
        right,
        left
      };
    },
    chosenField: function(data) {
      this.playableFields.forEach((item, _i, _arr) => {
        item.id === data.id ? (item.active = true) : (item.active = false);
      });
    },
    isFieldFinished: function(id) {
      let activeField = this.playableFields.filter(field => field.id === id)[0];
      return (
        activeField.borders.top.disabled &&
        activeField.borders.bottom.disabled &&
        activeField.borders.right.disabled &&
        activeField.borders.left.disabled
      );
    },
    captureBorder: function(id, position, player) {
      let activeField = this.playableFields.filter(field => field.id === id)[0];
      activeField.borders[position].disabled = true;
      activeField.borders[position].capturedBy = player.name;
      activeField.borders[position].color = player.color;
      console.log(
        `capturing ${position} border of #${id} box by ${player.name}`
      );
    },
    captureField: function(id, player) {
      let index = 0;
      let activeField = this.playableFields.filter((field, _i) => {
        if (field.id === id) {
          index = _i;
          return field;
        } else return false;
      })[0];
      activeField.borders.disabled = true;
      activeField.bgc = "white";
      activeField.capturedBy = player.id;
      console.log(`capturing #${id} field by ${player.name}`);
      if (this.isGameOver()) {
        this.finished = true;
      }
    },
    chosenBorder: function(data) {
      let id = data.id;
      let player = this.playerMove;
      let {
        top: topNeighbour,
        bottom: bottomNeighbour,
        right: rightNeighbour,
        left: leftNeighbour
      } = this.findNeighbours(id);

      this.captureBorder(id, data.position, player);

      if (this.isFieldFinished(id)) {
        this.captureField(id, player);
      }

      if (data.position === "top") {
        this.captureBorder(topNeighbour.id, "bottom", player);
        if (this.isFieldFinished(topNeighbour.id)) {
          this.captureField(topNeighbour.id, player);
        } else if (
          !this.isFieldFinished(id) &&
          !this.isFieldFinished(topNeighbour.id)
        ) {
          this.delegateMove();
        }
      }
      if (data.position === "bottom") {
        this.captureBorder(bottomNeighbour.id, "top", player);
        if (this.isFieldFinished(bottomNeighbour.id)) {
          this.captureField(bottomNeighbour.id, player);
        } else if (
          !this.isFieldFinished(id) &&
          !this.isFieldFinished(bottomNeighbour.id)
        ) {
          this.delegateMove();
        }
      }
      if (data.position === "right") {
        this.captureBorder(rightNeighbour.id, "left", player);
        if (this.isFieldFinished(rightNeighbour.id)) {
          this.captureField(rightNeighbour.id, player);
        } else if (
          !this.isFieldFinished(id) &&
          !this.isFieldFinished(rightNeighbour.id)
        ) {
          this.delegateMove();
        }
      }
      if (data.position === "left") {
        this.captureBorder(leftNeighbour.id, "right", player);
        if (this.isFieldFinished(leftNeighbour.id)) {
          this.captureField(leftNeighbour.id, player);
        } else if (
          !this.isFieldFinished(id) &&
          !this.isFieldFinished(leftNeighbour.id)
        ) {
          this.delegateMove();
        }
      }
    }
  }
};
</script>

<style lang="css">
</style>