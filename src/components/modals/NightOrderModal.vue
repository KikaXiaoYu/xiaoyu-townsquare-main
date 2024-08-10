<template>
    <div>
      <Modal
        class="night-reference"
        @close="toggleModal('nightOrder')"
        v-if="modals.nightOrder && roles.size"
      >
        <div ref="contentToCapture" class="modal-content"> <!-- 捕获区域开始 -->
          <div class="header">
            <font-awesome-icon
              @click="toggleModal('reference')"
              icon="address-card"
              class="toggle"
              title="展示角色信息"
            />
            <h3>
              <!-- Night Order -->
              <font-awesome-icon icon="cloud-moon" />
              {{ edition.name || "Custom Script" }}
            </h3>
            <button class="capture-button" @click="captureContent">SAVE</button>
          </div>
          <div class="night">
            <ul class="first">
              <li class="headline">首夜行动</li>
              <li
                v-for="role in rolesFirstNight"
                :key="role.name"
                :class="[role.team]"
              >
                <span class="name">
                  {{ role.name }}
                  <span class="player" v-if="role.players.length">
                    <br />
                    <small
                      v-for="(player, index) in role.players"
                      :class="{ dead: player.isDead }"
                      :key="index"
                      >{{
                        player.name + (role.players.length > index + 1 ? "," : "")
                      }}</small
                    >
                  </span>
                </span>
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
                <span class="reminder" v-if="role.firstNightReminder">
                  {{ role.firstNightReminder }}
                </span>
              </li>
            </ul>
            <ul class="other">
              <li class="headline">其他夜行动</li>
              <li
                v-for="role in rolesOtherNight"
                :key="role.name"
                :class="[role.team]"
              >
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
                <span class="name">
                  {{ role.name }}
                  <span class="player" v-if="role.players.length">
                    <br />
                    <small
                      v-for="(player, index) in role.players"
                      :class="{ dead: player.isDead }"
                      :key="index"
                      >{{
                        player.name + (role.players.length > index + 1 ? "," : "")
                      }}</small
                    >
                  </span>
                </span>
                <span class="reminder" v-if="role.otherNightReminder">
                  {{ role.otherNightReminder }}
                </span>
              </li>
            </ul>
          </div>
        </div> <!-- 捕获区域结束 -->
      </Modal>
    </div>
  </template>
  
  <script>
  import Modal from "./Modal";
  import { mapMutations, mapState } from "vuex";
  import html2canvas from 'html2canvas';
  
  export default {
    components: {
      Modal
    },
    computed: {
      rolesFirstNight() {
        const rolesFirstNight = [];
        // add minion / demon infos to night order sheet
        if (this.players.length > 6) {
          rolesFirstNight.push(
            {
              id: "evil",
              name: "邪恶信息",
              firstNight: 5,
              team: "minion",
              players: this.players.filter(p => p.role.team === "minion"),
              firstNightReminder:
                "邪恶阵营（爪牙和恶魔）互相得知身份。"
            },
            {
              id: "evil",
              name: "恶魔伪装",
              firstNight: 8,
              team: "demon",
              players: this.players.filter(p => p.role.team === "demon"),
              firstNightReminder:
                "给恶魔展示场上三个没有的好人身份。"
            }
          );
        }
        this.roles.forEach(role => {
          const players = this.players.filter(p => p.role.id === role.id);
          if (role.firstNight && (role.team !== "traveler" || players.length)) {
            rolesFirstNight.push(Object.assign({ players }, role));
          }
        });
        this.fabled
          .filter(({ firstNight }) => firstNight)
          .forEach(fabled => {
            rolesFirstNight.push(Object.assign({ players: [] }, fabled));
          });
        rolesFirstNight.sort((a, b) => a.firstNight - b.firstNight);
        return rolesFirstNight;
      },
      rolesOtherNight() {
        const rolesOtherNight = [];
        this.roles.forEach(role => {
          const players = this.players.filter(p => p.role.id === role.id);
          if (role.otherNight && (role.team !== "traveler" || players.length)) {
            rolesOtherNight.push(Object.assign({ players }, role));
          }
        });
        this.fabled
          .filter(({ otherNight }) => otherNight)
          .forEach(fabled => {
            rolesOtherNight.push(Object.assign({ players: [] }, fabled));
          });
        rolesOtherNight.sort((a, b) => a.otherNight - b.otherNight);
        return rolesOtherNight;
      },
      ...mapState(["roles", "modals", "edition", "grimoire"]),
      ...mapState("players", ["players", "fabled"])
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
            useCORS: true, // 如果有跨域图片，确保它们被正确处理
            backgroundColor: null // 确保背景透明，以保留原始颜色
          }).then(canvas => {
            console.log('Capture successful');
            
            // 创建一个新的canvas，调整其亮度
            const brightCanvas = document.createElement('canvas');
            brightCanvas.width = canvas.width;
            brightCanvas.height = canvas.height;
            const ctx = brightCanvas.getContext('2d');
            ctx.filter = 'brightness(1.2)'; // 调整亮度
            ctx.drawImage(canvas, 0, 0);
  
            const imgData = brightCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `${this.edition.name}_夜间顺序.png`;
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
  
  .modal-content {
    background-color: black; /* 设置背景颜色 */
    padding: 20px;
    color: white; /* 确保文字颜色为白色 */
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .toggle {
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
  
  h3 {
    margin: 0;
    svg {
      vertical-align: middle;
    }
  }
  
  .capture-button {
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
  
  h4 {
    text-transform: capitalize;
    display: flex;
    align-items: center;
    height: 20px;
    color: black; // 设置 h4 文字颜色为黑色
    &:before,
    &:after {
      content: " ";
      width: 100%;
      height: 1px;
      border-radius: 2px;
      background-color: black; // 设置 h4 前后横线颜色为黑色
    }
    &:before {
      margin-right: 15px;
    }
    &:after {
      margin-left: 15px;
    }
  }
  
  .fabled {
    .name {
      background: linear-gradient(180deg, $fabled, transparent 35%);
      .night .other & {
        background: linear-gradient(180deg, $fabled, transparent 35%);
      }
    }
  }
  .townsfolk {
    .name {
      background: linear-gradient(180deg, $townsfolk, transparent 35%);
      .night .other & {
        background: linear-gradient(180deg, $townsfolk, transparent 35%);
      }
    }
  }
  .outsider {
    .name {
      background: linear-gradient(180deg, $outsider, transparent 35%);
      .night .other & {
        background: linear-gradient(180deg, $outsider, transparent 35%);
      }
    }
  }
  .minion {
    .name {
      background: linear-gradient(-180deg, $minion, transparent 35%);
      .night .other & {
        background: linear-gradient(180deg, $minion, transparent 35%);
      }
    }
  }
  .demon {
    .name {
      background: linear-gradient(-180deg, $demon, transparent 35%);
      .night .other & {
        background: linear-gradient(180deg, $demon, transparent 35%);
      }
    }
  }
  
  ul {
    li {
      display: flex;
      width: 100%;
      margin-bottom: 3px;
      color: black; // 设置 li 字体颜色为黑色
      .icon {
        width: 6vh;
        background-size: cover;
        background-position: 0 0;
        flex-grow: 0;
        flex-shrink: 0;
        text-align: center;
        margin: 0 2px;
        &:after {
          content: " ";
          display: block;
          padding-top: 66%;
        }
      }
      .name {
        flex-grow: 0;
        flex-shrink: 0;
        width: 15%;
        text-align: right;
        font-size: 110%;
        padding: 5px;
        border-left: 3px solid black; // 设置 name 左边框颜色为黑色
        border-right: 3px solid black; // 设置 name 右边框颜色为黑色
        small {
          color: rgb(125, 125, 125); // 设置 small 字体颜色为黑色
          margin-right: 5px;
          &.dead {
            text-decoration: line-through;
          }
        }
      }
      .reminder {
        position: fixed;
        padding: 5px 10px;
        left: 50%;
        bottom: 10%;
        width: 500px;
        z-index: 25;
        background: white; // 设置 reminder 背景为白色
        color: black; // 设置 reminder 字体颜色为黑色
        border-radius: 10px;
        border: 3px solid black;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
        text-align: left;
        pointer-events: none;
        opacity: 0;
        transition: opacity 200ms ease-in-out;
        margin-left: -250px;
      }
      &:hover .reminder {
        opacity: 1;
      }
    }
    &.legend {
      font-weight: bold;
      height: 20px;
      margin-top: 10px;
      background-color: white; // 设置 legend 背景为白色
      color: black; // 设置 legend 字体颜色为黑色
      li span {
        background: none;
        height: auto;
        font-family: inherit;
        font-size: inherit;
      }
      .icon:after {
        padding-top: 0;
      }
    }
  }
  
  .night {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: rgb(0, 0, 0); // 设置 team 背景为白色
    color: black; // 设置 night 字体颜色为黑色
    > *:first-child {
      margin-right: 2vh;
    }
    > * {
      flex-grow: 0;
      flex-wrap: nowrap;
      flex-direction: column;
    }
    .headline {
      display: block;
      font-weight: bold;
      border-bottom: 3px solid black;
      padding: 5px 10px;
      background-color: white; // 设置 headline 背景为白色
      color: black; // 设置 headline 字体颜色为黑色
      border-radius: 0;
      text-align: center;
    }
    .name {
      flex-grow: 1;
      color: rgb(0, 0, 0); // 设置 name 字体颜色为黑色
      background-color: white;
    }
    .first {
        background-color: white;
        .name {
            border-left: 0;
        }
    }
    .other {
        background-color: white;
        li .name {
        text-align: left;
        border-right: 0;
      }
    }
  }
  
  /** hide players when town square is set to "public" **/
  #townsquare.public ~ .night-reference .modal .player {
    display: none;
  }
  </style>
  