<template>
  <div>

    <user-create v-if="this.init.status && this.init.remaining === 2" :player="players[0]" @submittedPlayer="createUser"></user-create>
    <user-create v-if="this.init.status && this.init.remaining === 1" :player="players[1]" @submittedPlayer="createUser"></user-create>
    
    <div class="status">
      <user-info :player="players[0]"/>
      <span v-if="!this.finished" class="turn-counter" >now {{playerMove.name + '\'s turn'}}</span>
      <span v-if="this.finished" class="turn-counter" >game over</span>
      <span v-if="this.finished" class="win-text">{{winner + ' wins!'}}</span>
      <user-info :player="players[1]"/>
    </div>
    
    
    <div class="container">
    <div class="row" v-for="(element,index) in fields" :key="index">
      <game-field @choseField="chosenField" @borderClicked="chosenBorder" v-if="!fields.blank" v-for="(fields) in element" :key="fields.id" :field-details="fields"></game-field>
      <game-field v-else :is-blank="true"></game-field>
      </div>
    </div>
  </div>
</template>

<script>
import GameField from "./GameField.vue";
import UserInfo from "./UserInfo.vue";
import UserCreate from "./UserCreate.vue";

export default {
  name: "App",
  components: {
    GameField,
    UserInfo,
    UserCreate
  },
  data() {
    return {
      init: {
        remaining: 2,
        status: true
      },
      fields: [],
      finished: false,
      playableFields: [],
      templates: ["..*..", ".***.", "*****", ".***.", "..*.."],
      players: [
        {
          id: 1,
          name: "vasya",
          color: "red",
          turn: true,
          points: 0
        },
        {
          id: 2,
          name: "katya",
          color: "green",
          turn: false,
          points: 0
        }
      ]
    };
  },
  computed: {
    playerMove: function() {
      return this.players.filter(player => player.turn === true)[0];
    },
    winner: function() {
      let playerOne = this.players[0];
      let playerTwo = this.players[1];
      if (playerOne.points > playerTwo.points) {
        return playerOne.name;
      } else if (playerOne.points === playerTwo.points) {
        return "Nobody";
      } else {
        return playerTwo.name;
      }
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
    createUser: function(data) {
      this.players.filter(player => player.id === data.id)[0].name = data.name;
      this.players.filter(player => player.id === data.id)[0].color =
        data.color;
      this.init.remaining--;
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
      player.points++;
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
.status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 100px;
  padding: 1em 0.5em 1em 0.5em;
  background-color: rgba(255, 255, 255, 0.5);
}

.turn-counter {
  font-family: "Poppins", sans-serif;
  font-size: 1em;
  text-align: center;
}

.win-text {
  font-family: "Poppins", sans-serif;
  font-size: 1em;
  text-align: center;
}

.row {
  width: 100%;
  background-color: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>