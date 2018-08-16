<template>
  <div class="wrapper">
    <div class="content">
      <header :style="'background-color: '+ (this.color || this.player.color)">
        <h2>Player One: {{name || this.player.name}}</h2>
      </header>
    <input v-model="name" placeholder="enter your name" class="name-input" :style="'border-color:'+(this.color || this.player.color)"/> 
    <div class="color-picker">
      <p>pick a color</p>
      <div class="colors">
      <button class="color" style="background-color: #001f3f" @click="choseColor('#001f3f')"></button>
      <button class="color" style="background-color: #0074D9" @click="choseColor('#0074D9')"></button>
      <button class="color" style="background-color: #39CCCC" @click="choseColor('#39CCCC')"></button>
      <button class="color" style="background-color: #3D9970" @click="choseColor('#3D9970')"></button>
      <button class="color" style="background-color: #2ECC40" @click="choseColor('#2ECC40')"></button>
      <button class="color" style="background-color: #01FF70" @click="choseColor('#01FF70')"></button>
      <button class="color" style="background-color: #FFDC00" @click="choseColor('#FFDC00')"></button>
      <button class="color" style="background-color: #FF851B" @click="choseColor('#FF851B')"></button>
   </div> </div>
    <button class="btn" @click="submitPlayer" :style="'border-color:'+(this.color || this.player.color)">go!</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCreate",
  props: ["player"],
  data() {
    return {
      name: "",
      color: ""
    };
  },
  methods: {
    submitPlayer: function() {
      this.$emit("submittedPlayer", {
        id: this.player.id,
        name: this.name,
        color: this.color
      });
      this.name = "";
      this.color = "";
    },
    choseColor: function(data) {
      this.color = data;
    }
  }
};
</script>

<style lang="css">
.color-picker {
  margin-top: 20px;
}

.color-picker p {
  text-align: center;
}

.colors {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.color {
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

.name-input {
  width: 60%;
  margin: 0 auto;
  border: 5px solid;
  display: block;
  padding: 15px;
  border-radius: 10px;
  font-size: 20px;
  margin-top: 30px;
}

.btn {
  background-color: inherit;
  width: 30%;
  margin: 0 auto;
  border: 3px solid;
  display: block;
  padding: 10px;
  border-radius: 10px;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.wrapper {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.content {
  position: relative;
  top: 25%;
  background: linear-gradient(to right, #ffffff, #c1cac1);
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 40%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  animation-name: animatetop;
  animation-duration: 0.4s;
}
header {
  padding: 2px 16px;
  color: white;
}
@keyframes animatetop {
  0% {
    top: -500px;
  }
  100% {
    top: 25%;
  }
}
</style>