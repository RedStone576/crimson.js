/* might reconstruct this */

/** raw events name */
export const EVENTS_TYPES = {
  /** for the client itself */
  SESSION_READY:     "ready",
  SESSION_ERROR:     "error",
  SESSION_DEAD:      "dead",

  /** for commands sent from client to ribbon */
  CLIENT_RESUME:            "resume",
  CLIENT_AUTHORIZE:         "authorize",
  CLIENT_JOIN_ROOM:         "room.join",
  CLIENT_LEAVE_ROOM:        "room.leave",
  CLIENT_CREATE_ROOM:       "room.create",
  CLIENT_SEND_ROOM_MESSAGE: "room.chat.send",
  CLIENT_ACK_DM:            "social.relationships.ack",
  CLIENT_SEND_DM:           "social.dm",
  CLIENT_SEND_INVITE:       "social.invite",
  CLIENT_UPDATE_PRESENCE:   "social.presence",

  /** @hidden unused for user */
  RIBBON_PONG:      "pong",
  RIBBON_HELLO:     "hello",
  RIBBON_AUTHORIZE: "authorize",
  RIBBON_MIGRATE:   "migrate",
  RIBBON_MIGRATED:  "migrated", 
  
  /** for commands received from ribbon */
  RIBBON_ROOM_JOIN:             "room.join",
  RIBBON_ROOM_LEAVE:            "room.leave",
  RIBBON_ROOM_UPDATE:           "room.update",
  RIBBON_ROOM_BRACKET_UPDATE:   "room.update.bracket",
  RIBBON_ROOM_HOST_UPDATE:      "room.update.host",
  RIBBON_ROOM_AUTO_UPDATE:      "room.update.auto",
  RIBBON_ROOM_SUPPORTER_UPDATE: "room.update.supporter", // no idea what the hell is this
  RIBBON_ROOM_KICK:             "room.kick",
  RIBBON_ROOM_PLAYER_ADD:       "room.addplayer",
  RIBBON_ROOM_PLAYER_REMOVE:    "room.removeplayer",
  RIBBON_ROOM_CHAT:             "room.chat",
  RIBBON_ROOM_CHAT_GIFT:        "room.chat.gift",
  RIBBON_ROOM_CHAT_DELETE:      "room.chat.delete",
  RIBBON_ROOM_CHAT_CLEAR:       "room.chat.clear",
  RIBBON_USER_PRESENCE:         "social.presence", 
  RIBBON_USER_INVITE:           "social.invite",
  RIBBON_USER_DM:               "social.dm",
  RIBBON_PLAYERS_ONLINE:        "social.online"
  //RIBBON_ROOM_GAME_READY:     "",
  //"notify"

  /* both seems reversed cuz yk to make it look like you're giving a command or receiving a command */
} as const

/* export const RIBBON_ERROR = {
} as const */
