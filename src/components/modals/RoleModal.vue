<template>
    <Modal v-if="modals.role && availableRoles.length" @close="close">
      <h3>
        Choose a new character for
        {{
          playerIndex >= 0 && players.length
            ? players[playerIndex].name
            : "bluffing"
        }}
      </h3>
      <ul class="tokens" v-if="tab === 'editionRoles' || !otherTravelers.size">
        <li
          v-for="role in availableRoles"
          :class="[role.team, { dimmed: !assignedRoleIds.includes(role.id) }]"
          :key="role.id"
          @click="setRole(role)"
        >
          <Token :role="role" />
          <font-awesome-icon
            icon="exclamation-triangle"
            v-if="role.setup"
            class="warning-icon"
          />
        </li>
      </ul>
      <ul class="tokens" v-if="tab === 'otherTravelers' && otherTravelers.size">
        <li
          v-for="role in otherTravelers.values()"
          :class="[role.team, { dimmed: assignedRoleIds.includes(role.id) }]"
          :key="role.id"
          @click="setRole(role)"
        >
          <Token :role="role" />
          <font-awesome-icon
            icon="exclamation-triangle"
            v-if="role.setup"
            class="warning-icon"
          />
        </li>
      </ul>
      <div
        class="button-group"
        v-if="playerIndex >= 0 && otherTravelers.size && !session.isSpectator"
      >
        <span
          class="button"
          :class="{ townsfolk: tab === 'editionRoles' }"
          @click="tab = 'editionRoles'"
          >Edition Roles</span
        >
        <span
          class="button"
          :class="{ townsfolk: tab === 'otherTravelers' }"
          @click="tab = 'otherTravelers'"
          >Other Travelers</span
        >
      </div>
      <div class="warning" v-if="hasSelectedSetupRoles">
        <font-awesome-icon icon="exclamation-triangle" />
        <span>
          Warning: there are characters selected that modify the game setup!
        </span>
      </div>
    </Modal>
  </template>
  
  <script>
  import { mapMutations, mapState } from "vuex";
  import Modal from "./Modal";
  import Token from "../Token";
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  
  export default {
    components: { Token, Modal, FontAwesomeIcon },
    props: ["playerIndex"],
    computed: {
      assignedRoleIds() {
        return this.players.map(player => player.role.id);
      },
      availableRoles() {
        const availableRoles = [];
        const players = this.$store.state.players.players;
        this.$store.state.roles.forEach(role => {
          if (
            this.playerIndex >= 0 ||
            (this.playerIndex < 0 &&
              !players.some(player => player.role.id === role.id))
          ) {
            availableRoles.push(role);
          }
        });
        availableRoles.push({});
        return availableRoles;
      },
      hasSelectedSetupRoles() {
        return this.availableRoles.some(role => role.setup);
      },
      ...mapState(["modals", "roles", "session"]),
      ...mapState("players", ["players"]),
      ...mapState(["otherTravelers"])
    },
    data() {
      return {
        tab: "editionRoles"
      };
    },
    methods: {
      setRole(role) {
        if (this.playerIndex < 0) {
          this.$store.commit("players/setBluff", {
            index: this.playerIndex * -1 - 1,
            role
          });
        } else {
          if (this.session.isSpectator && role.team === "traveler") return;
          const player = this.$store.state.players.players[this.playerIndex];
          this.$store.commit("players/update", {
            player,
            property: "role",
            value: role
          });
        }
        this.tab = "editionRoles";
        this.$store.commit("toggleModal", "role");
      },
      close() {
        this.tab = "editionRoles";
        this.toggleModal("role");
      },
      ...mapMutations(["toggleModal"])
    }
  };
  </script>
  
  <style scoped lang="scss">
  @import "../../vars.scss";
  
  ul.tokens li {
    border-radius: 50%;
    width: 6vw;
    margin: 1%;
    transition: transform 500ms ease;
    position: relative;
  
    &.townsfolk {
      box-shadow: 0 0 10px $townsfolk, 0 0 10px #004cff;
    }
    &.outsider {
      box-shadow: 0 0 10px $outsider, 0 0 10px $outsider;
    }
    &.minion {
      box-shadow: 0 0 10px $minion, 0 0 10px $minion;
    }
    &.demon {
      box-shadow: 0 0 10px $demon, 0 0 10px $demon;
    }
    &.traveler {
      box-shadow: 0 0 10px $traveler, 0 0 10px $traveler;
    }
    &:hover {
      transform: scale(1.2);
      z-index: 10;
    }
    &.dimmed {
      opacity: 0.5; // Make the role appear dimmed if not assigned
    }
  
    .warning-icon {
      position: absolute;
      color: red;
      top: 5px;
      right: 5px;
      font-size: 1.5em;
      display: block;
      filter: drop-shadow(0 0 3px black) drop-shadow(0 0 3px black);
    }
  }
  
  .warning {
    color: red;
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    svg {
      font-size: 150%;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  </style>
  