const state = {
  main: 0,
  homeHigtData:[],
  homeHotData:[],
  songObj:null,
  isPlaySongListID:'',
  songSrc:'',
  tracks:[],
  nowPlaySongInfo:null
}
const getters = {
  getHigtData(state){
    return state.homeHigtData
  },
  getHotData(state){
    return state.homeHotData
  },
  getSongObj(state){
    return state.songObj
  },
  getPlaySongListID(state){
    return state.isPlaySongListID
  },
  getSongSrc(state){
    return state.songSrc
  },
  getTracks(state){
    return state.tracks
  },
  getNowPlaySongInfo(state){
    return state.nowPlaySongInfo
  },
}
const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++;
  },
  SAVE_HOME_DATA_HIGT(state,data){
    state.homeHigtData = data
  },
  SAVE_HOME_DATA_HOT(state,data){
    state.homeHotData = data
  },
  SAVE_PLAY_SONG_ID(state,data){
    state.isPlaySongListID = data
  },
  SAVE_SONG_LIST_DATA(state,data){
    state.songObj = data
  },
  SAVE_NOW_SONG(state,data){
    state.songSrc = data
  },
  SAVE_TRACKS(state,data){
    state.tracks = data
  },
  SAVE_SONG_INFO(state,data){
    state.nowPlaySongInfo = data
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  saveHomeHigtData({commit}, data){
    commit('SAVE_HOME_DATA_HIGT', data)
  },
  saveHomeHotData({commit}, data){
    commit('SAVE_HOME_DATA_HOT', data)
  },
  saveSongListData({commit}, data){
    commit('SAVE_SONG_LIST_DATA', data)
  },
  savePlaySongListData({commit}, data){
    commit('SAVE_PLAY_SONG_ID', data)
  },
  saveNowPlaySong({commit}, data){
    commit('SAVE_NOW_SONG', data)
  },
  saveTracks({commit}, data){
    commit('SAVE_TRACKS', data)
  },
  saveSongInfo({commit}, data){
    commit('SAVE_SONG_INFO',data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
