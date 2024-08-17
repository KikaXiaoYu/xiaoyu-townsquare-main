<template>
  <div class="intro">
    <img src="static/apple-icon.png" alt="" class="logo" />
    <div>
      欢迎来到小钰的半汉化版血染钟楼软件喵~ 以下是原作者的英文介绍，我没有作任何修改。起因是官方汉化的版本闭源而且缺斤少两，于是就想着干脆自己汉化得了（我又不是做不到hhh）。注意这个在线软件必须使用Chrome浏览器，不然用不起来喵~
      Welcome to the (unofficial)
      <b>Virtual Town Square and Grimoire</b> for Blood on the Clocktower!
      Please add more players through the
      <span class="button" @click="toggleMenu">
        <font-awesome-icon icon="cog" /> Menu
      </span>
      on the top right or by pressing <b>[A]</b>. You can also join a game
      session by pressing <b>[J]</b>.<br />
      <div class="footer">
        This project is free and open source and can be found on
        <a href="https://github.com/bra1n/townsquare" target="_blank">GitHub</a
        >. It is not affiliated with The Pandemonium Institute. "Blood on the
        Clocktower" is a trademark of Steven Medway and The Pandemonium
        Institute.
      </div>
    </div>
    <a
      class="redirect"
      v-if="language === 'zh-CN'"
      href="https://clocktower.gstonegames.com"
    >
      <!-- <img src="../assets/gstone.png" class="gstone" alt="" />
      你想使用中文版魔典吗？ -->
    </a>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      language: window.navigator.userLanguage || window.navigator.language
    };
  },
  methods: mapMutations(["toggleMenu"])
};
</script>

<style scoped lang="scss">
// Intro
.intro {
  text-align: center;
  width: 50%;
  font-size: 120%;
  position: absolute;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 3px solid black;
  border-radius: 10px;
  z-index: 3;
  display: flex;
  justify-content: center;
  a {
    color: white;
  }
  a.redirect {
    display: block;
    text-decoration: none;
    position: absolute;
    top: 100%;
    margin-top: 2vh;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    border: 3px solid black;
    border-radius: 10px;

    &:hover {
      color: red;
    }
    img {
      width: 120px;
      display: block;
      margin: auto;
      margin-bottom: 1vh;
    }
  }

  img.logo {
    position: absolute;
    bottom: 100%;
    width: 25vh;
    margin-bottom: 2vh;
    max-width: 192px;
    border-radius: 50%;
    box-shadow: 0 0 10px black;
    border: 3px solid black;
  }
  .footer {
    font-size: 60%;
    opacity: 0.75;
  }
}
</style>
