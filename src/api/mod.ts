import gameGet               from "./game/get"
import gameGetDespool        from "./game/getDespool"
import gameGetMe             from "./game/getMe"
import gameGetRibbonVersion  from "./game/getRibbonVersion"
import gameGetSpool          from "./game/getSpool"
//import gamePost               from "./game/post"

import channelGet from "./channel/get"

export default {
  game: { 
    get:               gameGet, 
    getMe:             gameGetMe,
    getDespool:        gameGetDespool, 
    getRibbonVersion:  gameGetRibbonVersion,
    getSpool:          gameGetSpool, 
    //postAuthed:      gamePost
  },

  channel: {
    get: channelGet
  }
}
