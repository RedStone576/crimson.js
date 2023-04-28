//import gameGet               from "./game/get"
import gameGetDespool        from "./game/getDespool"
import gameGetMe             from "./game/getMe"
import gameGetRibbonVersion  from "./game/getRibbonVersion"
import gameGetSpool          from "./game/getSpool"
//import gamePost               from "./game/post"

//import channelGet         from "./channel/get"
import channelGetUser                from "./channel/getUser"
import channelGetUserRecords         from "./channel/getUserRecords"
import channelGetUserFromDiscord     from "./channel/getUserFromDiscord"

export default {
  game: { 
    getMe:            gameGetMe,
    getDespool:       gameGetDespool, 
    getRibbonVersion: gameGetRibbonVersion,
    getSpool:         gameGetSpool, 
  },

  channel: {
    getUser:            channelGetUser,
    getUserRecords:     channelGetUserRecords,
    getUserFromDiscord: channelGetUserFromDiscord,
  }
}
