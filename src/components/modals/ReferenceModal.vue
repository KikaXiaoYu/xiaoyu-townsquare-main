<template>
    <div>
      <Modal
        class="characters"
        @close="toggleModal('reference')"
        v-if="modals.reference && roles.size"
      >
        <div ref="contentToCapture" class="modal-content"> <!-- 父级容器 -->
          <font-awesome-icon
            @click="toggleModal('nightOrder')"
            icon="cloud-moon"
            class="toggle"
            title="显示夜间顺序"
          />
          <div class="title-container">
            <h3>
              CR
              <font-awesome-icon icon="address-card" />
              {{ edition.name || "Custom Script" }}
            </h3>
            <button class="capture-button" @click="captureContent">SAVE</button>
          </div>
          <div>
            <div
              v-for="(teamRoles, team) in rolesGrouped"
              :key="team"
              :class="['team', team]"
            >
              <aside>
                <h4>{{ team }}</h4>
              </aside>
              <ul>
                <li v-for="role in teamRoles" :class="[team]" :key="role.id">
                  <span
                    class="icon"
                    v-if="role.id"
                    :style="{
                      backgroundImage: `url(${
                        role.image && grimoire.isImageOptIn
                          ? role.image
                          : require('../../assets/icons/' +
                              (role.imageAlt || role.id) +
                              '.png')
                      })`
                    }"
                  ></span>
                  <div class="role">
                    <span class="player" v-if="Object.keys(playersByRole).length">{{
                      playersByRole[role.id] ? playersByRole[role.id].join(", ") : ""
                    }}</span>
                    <span class="name">{{ role.name }}</span>
                    <!-- <span class="ability">{{ role.ability }}</span> -->
                    <span class="ability" v-html="role.ability"></span>
                  </div>
                </li>
                <li :class="[team]"></li>
                <li :class="[team]"></li>
              </ul>
            </div>
  
            <div class="team jinxed" v-if="jinxed.length">
              <aside>
                <h4>Jinxed</h4>
              </aside>
              <ul>
                <li v-for="(jinx, index) in jinxed" :key="index">
                  <span
                    class="icon"
                    :style="{
                      backgroundImage: `url(${require('../../assets/icons/' +
                        (jinx.first.imageAlt || jinx.first.id) +
                        '.png')})`
                    }"
                  ></span>
                  <span
                    class="icon"
                    :style="{
                      backgroundImage: `url(${require('../../assets/icons/' +
                        (jinx.second.imageAlt || jinx.second.id) +
                        '.png')})`
                    }"
                  ></span>
                  <div class="role">
                    <span class="name"
                      >{{ jinx.first.name }} & {{ jinx.second.name }}</span
                    >
                    <span class="ability">{{ jinx.reason }}</span>
                  </div>
                </li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div> <!-- 父级容器结束 -->
        </div>
      </Modal>
    </div>
  </template>
  
  <script>
  import html2canvas from 'html2canvas';
  import { mapMutations, mapState } from "vuex";
  import Modal from "./Modal";
  
  export default {
    components: {
      Modal
    },
    computed: {
      /**
       * Return a list of jinxes in the form of role IDs and a reason
       * @returns {*[]} [{first, second, reason}]
       */
      jinxed: function() {
        const jinxed = [];
        console.log(this.jinxes); // 打印 jinxes 数据
        this.roles.forEach(role => {
            console.log(this.jinxes.get(role.id)); // 打印 jinxes 数据
            if (this.jinxes.get(role.id)) {
            this.jinxes.get(role.id).forEach((reason, second) => {
              if (this.roles.get(second)) {
                jinxed.push({
                  first: role,
                  second: this.roles.get(second), reason
                });
              }
            });
          }
        });
      console.log(this.jinxes); // 打印 jinxes 数据

        return jinxed;
      },
      rolesGrouped: function() {
        const rolesGrouped = {};
        this.roles.forEach(role => {
          if (!rolesGrouped[role.team]) {
            rolesGrouped[role.team] = [];
          }
          rolesGrouped[role.team].push(role);
        });
        delete rolesGrouped["traveler"];
        return rolesGrouped;
      },
      playersByRole: function() {
        const players = {};
        this.players.forEach(({ name, role }) => {
          if (role && role.id && role.team !== "traveler") {
            if (!players[role.id]) {
              players[role.id] = [];
            }
            players[role.id].push(name);
          }
        });
        return players;
      },
      ...mapState(["roles", "modals", "edition", "grimoire", "jinxes"]),
      ...mapState("players", ["players"])
    },
    methods: {
      ...mapMutations(["toggleModal"]),
      captureContent() {
        console.log('Capture button clicked');
  
        // 增加延迟，确保元素完全渲染
        setTimeout(() => {
          const element = this.$refs.contentToCapture; // 捕获父级容器
          console.log('Element:', element);
  
          if (!element) {
            console.error('Element to capture not found');
            return;
          }
  
          if (!(element instanceof HTMLElement)) {
            console.error('Element to capture is not a valid DOM element');
            console.log('Element type:', typeof element);
            console.log('Element:', element);
            return;
          }
  
          // 检查元素是否在文档中
          if (!document.body.contains(element)) {
            console.error('Element not attached to document');
            return;
          }
  
          console.log('Element found, capturing...');
  
          html2canvas(element, {
            scale: 2, // 将 scale 设置为 2，以提高分辨率
            useCORS: true // 如果有跨域图片，确保它们被正确处理
          }).then(canvas => {
            console.log('Capture successful');
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `${this.edition.name}_角色信息.png`;
            link.click();
          }).catch(error => {
            console.error('Error capturing the content:', error);
          });
        }, 500); // 延迟 0.5 秒（根据需要调整）
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  @import "../../vars.scss";
  
  :root {
    color: black; // 设置全局文字颜色为黑色
  }
  
  .toggle {
    position: absolute;
    left: 20px;
    top: 15px;
    color: white;
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
  
  .title-container {
    display: flex;
    justify-content: center; /* 确保标题容器居中 */
    align-items: center; /* 确保按钮与标题在垂直方向上对齐 */
    margin-bottom: 10px; /* 调整标题与内容区之间的间距 */
  }
  
  .capture-button {
    margin-left: 10px; /* 调整按钮与标题之间的间距 */
    padding: 5px 10px;
    font-size: 14px;
  }
  
  .modal-content {
    background-color: black; /* 设置背景颜色为黑色 */
    padding: 20px; /* 添加一些内边距 */
  }
  
  h3 {
    margin: 0;
    display: inline-block; /* 使标题在 flex 容器内居中 */
    color: white; /* 确保标题文字颜色为白色 */
    svg {
      vertical-align: middle;
    }
  }
  
  .team {
    display: flex;
    align-items: stretch;
    width: 100%;
    background-color: rgb(255, 254, 250); // 设置 team 背景为白色
    color: black; // 设置 team 字体颜色为黑色
    &:not(:last-child):after {
      content: " ";
      display: block;
      width: 100%;
      height: 3px;
      background: black;
      position: absolute;
      left: 0;
      bottom: 0;
    }
    aside {
      width: 30px;
      display: flex;
      flex-grow: 0;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      align-content: center;
      overflow: hidden;
      text-shadow: 0 0 4px black;
    }
  
    h4 {
      text-transform: uppercase;
      text-align: center;
      transform: rotate(90deg);
      transform-origin: center;
      font-size: 80%;
      color: rgb(255, 255, 255); // 设置 h4 文字颜色为黑色
    }
  
    &.jinxed {
      .icon {
        margin: 0 -5px;
      }
    }
  }
  
  ul {
    flex-grow: 1;
    display: flex;
    padding: 5px 0;
  
    li {
      display: flex;
      align-items: center;
      flex-grow: 1;
      width: 420px;
      color: black; // 设置 li 文字颜色为黑色
      .icon {
        width: 8vh;
        background-size: cover;
        background-position: 0 -5px;
        flex-shrink: 0;
        flex-grow: 0;
        &:after {
          content: " ";
          display: block;
          padding-top: 75%;
        }
      }
      .role {
        line-height: 80%;
        flex-grow: 1;
      }
      .name {
        font-weight: bold;
        font-size:70%;
        display: block;
        color: black; // 设置 name 文字颜色为黑色
        font-family: consolas, 华文黑体, 微软雅黑, 华康手札体W5P;
      }
      .player {
        color: black; // 设置 player 文字颜色为黑色
        float: right;
        font-size: 60%;
      }
      .ability {
        font-size: 65%;
        color: black; // 设置 ability 文字颜色为黑色
        font-family: 微软雅黑, sans-serif;
      }
    }
  }
  .ustate {
    .name {
      color: $ustate;
    }
    aside {
      background: linear-gradient(-90deg, $ustate, transparent);
    }
  }
  .uedition {
    .name {
      color: $uedition;
    }
    aside {
      background: linear-gradient(-90deg, $uedition, transparent);
    }
  }
  .townsfolk {
    .name {
      color: $townsfolk;
    }
    aside {
      background: linear-gradient(-90deg, $townsfolk, transparent);
    }
  }
  .outsider {
    .name {
      color: $outsider;
    }
    aside {
      background: linear-gradient(-90deg, $outsider, transparent);
    }
  }
  .minion {
    .name {
      color: $minion;
    }
    aside {
      background: linear-gradient(-90deg, $minion, transparent);
    }
  }
  .demon {
    .name {
      color: $demon;
    }
    aside {
      background: linear-gradient(-90deg, $demon, transparent);
    }
  }
  
  .jinxed {
    .name {
      color: black; // 设置 jinxed 名字文字颜色为黑色
    }
  }
  
  /** break into 1 column below 1200px **/
  @media screen and (max-width: 1199.98px) {
    .modal {
      max-width: 40%;
    }
    ul {
      li {
        .icon {
          width: 6vh;
        }
        .role {
          line-height: 100%;
          color: black; // 设置 name 文字颜色为黑色
        }
        .name {
          font-size: 100%;
          color: rgb(125, 125, 125); // 设置 name 文字颜色为黑色
        }
        .player {
          font-size: 20%;
          color: rgb(125, 125, 125); // 设置 player 文字颜色为黑色
        }
        .ability {
          font-size: 90%;
          color: black; // 设置 ability 文字颜色为黑色
        }
      }
    }
  }
  
  /** trim icon size on maximized one-column sheet **/
  @media screen and (max-width: 991.98px) {
    .characters .modal.maximized ul li .icon {
      width: 5.1vh;
    }
  }
  
  /** hide players when town square is set to "public" **/
  #townsquare.public ~ .characters .modal .player {
    display: none;
  }
  </style>
  