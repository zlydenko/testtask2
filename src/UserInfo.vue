<template>
  <div class="user-info">
    <span class="name" :style="'color: '+this.player.color">{{this.player.name}}: {{this.player.points}}</span>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  props: ["player"]
};
</script>

<style lang="css">
.user-info {
  font-family: "Montserrat", sans-serif;
  font-weight: 800;
  font-size: 1.5em;
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
}
</style>