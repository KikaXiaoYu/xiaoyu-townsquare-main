/**
 * Handle a vote request.
 * If the vote is from a seat that is already locked, ignore it.
 * @param state session state
 * @param index seat of the player in the circle
 * @param vote true or false
 */
const handleVote = (state, [index, vote]) => {
    if (!state.nomination) return;
    state.votes = [...state.votes];
    state.votes[index] = vote === undefined ? !state.votes[index] : vote;
};

const state = () => ({
    sessionId: "",
    isSpectator: false,
    isReconnecting: false,
    playerCount: 0,
    ping: 0,
    playerId: "",
    claimedSeat: -1,
    nomination: false,
    votes: [],
    lockedVote: 0,
    votingSpeed: 100,
    isVoteInProgress: false,
    voteHistory: [],
    markedPlayer: -1,
    isVoteHistoryAllowed: true,
    isRolesDistributed: false,
    strikedRecords: [] // 新增：用于存储被划掉的记录的索引
});

const getters = {};

const actions = {};

// mutations helper functions
const set = key => (state, val) => {
    state[key] = val;
};

const mutations = {
    setPlayerId: set("playerId"),
    setSpectator: set("isSpectator"),
    setReconnecting: set("isReconnecting"),
    setPlayerCount: set("playerCount"),
    setPing: set("ping"),
    setVotingSpeed: set("votingSpeed"),
    setVoteInProgress: set("isVoteInProgress"),
    setMarkedPlayer: set("markedPlayer"),
    setNomination: set("nomination"),
    setVoteHistoryAllowed: set("isVoteHistoryAllowed"),
    claimSeat: set("claimedSeat"),
    distributeRoles: set("isRolesDistributed"),
    setSessionId(state, sessionId) {
        state.sessionId = sessionId
            .toLocaleLowerCase()
            .replace(/[^0-9a-z]/g, "")
            .substr(0, 10);
    },
    nomination(
        state,
        { nomination, votes, votingSpeed, lockedVote, isVoteInProgress } = {}
    ) {
        state.nomination = nomination || false;
        state.votes = votes || [];
        state.votingSpeed = votingSpeed || state.votingSpeed;
        state.lockedVote = lockedVote || 0;
        state.isVoteInProgress = isVoteInProgress || false;
    },
    /**
     * Create an entry in the vote history log. Requires current player array because it might change later in the game.
     * Only stores votes that were completed.
     * @param state
     * @param players
     */
    addHistory(state, players) {
        if (!state.isVoteHistoryAllowed && state.isSpectator) return;
        if (!state.nomination || state.lockedVote <= players.length) return;
        const isExile = players[state.nomination[1]].role.team === "traveler";
        state.voteHistory.push({
            timestamp: new Date(),
            nominator: players[state.nomination[0]].name,
            nominee: players[state.nomination[1]].name,
            type: isExile ? "Exile" : "Execution",
            majority: Math.ceil(
                players.filter(player => !player.isDead || isExile).length / 2
            ),
            votes: players
                .filter((player, index) => state.votes[index])
                .map(({ name }) => name)
        });
    },
    clearVoteHistory(state) {
        state.voteHistory = [];
    },
    deleteVoteHistory(state, index) {
        if (state.voteHistory && state.voteHistory.length > index) {
            state.voteHistory.splice(index, 1); // 删除指定索引的记录
        }
    },
    strikeRecord(state, index) {
        const recordIndex = state.strikedRecords.indexOf(index);
        if (recordIndex === -1) {
            state.strikedRecords.push(index); // 划掉记录
        } else {
            state.strikedRecords.splice(recordIndex, 1); // 恢复记录
        }
    },
    clearStrikedRecords(state) {
        state.strikedRecords = []; // 清空所有划掉的记录
    },
    deleteStrikedRecords(state) {
        // 删除所有划掉的记录
        state.voteHistory = state.voteHistory.filter(
            (_, index) => !state.strikedRecords.includes(index)
        );
        state.strikedRecords = []; // 清空划掉记录的索引
    },
    /**
     * Store a vote with and without syncing it to the live session.
     * This is necessary in order to prevent infinite voting loops.
     * @param state
     * @param vote
     */
    vote: handleVote,
    voteSync: handleVote,
    lockVote(state, lock) {
        state.lockedVote = lock !== undefined ? lock : state.lockedVote + 1;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
