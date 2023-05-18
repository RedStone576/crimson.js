import { EVENTS_TYPES as EVENTS } from "./constants"

export type EventsTypes = typeof EVENTS[keyof typeof EVENTS]

/** raw events */
export type ClientEvents = {
  [EVENTS.SESSION_READY]: string
  [EVENTS.SESSION_ERROR]: string
  [EVENTS.SESSION_DEAD]:  boolean

  [EVENTS.RIBBON_USER_PRESENCE]: {
    user: string,
    presence: {
      status: "online" | "away" | "busy" | "offline",
      detail: /*"" | "menus" | "40l" | "blitz" | "zen" | "custom" |*/ string,
      invitable: boolean
    }
  }

  [EVENTS.RIBBON_USER_DM]: {
    id: string,
    data: {
      content: string,
      content_safe: string,
      user: string,
      userdata: {
        role: "banned" | "user" | "bot" | "halfmod" | "mod" | "admin" | "sysop",
        supporter: boolean,
        supporter_tier: number,
        verified: boolean
      },
      system: boolean
    },
    stream: string,
    ts: string
  }

  [EVENTS.RIBBON_USER_INVITE]: {
    sender: string,
    roomid: string,
    roomname: string,
    roomname_safe: string
  }

  [EVENTS.RIBBON_ROOM_CHAT]: {
    content: string,
    content_safe: string,
    user: {
      _id: string,
      username: string,
      role: "anon" | "user" | "bot" | "halfmod" | "mod" | "admin" | "sysop",
      supporter: boolean,
      supporter_tier: number,
      verified: boolean
    },
    system: boolean,
    // no idea what this is, probably something to do with superlobby user logging
    suppressable: boolean
  }

  [EVENTS.RIBBON_ROOM_PLAYER_REMOVE]: {
    /** player's id */
    data: string
  }

  [EVENTS.RIBBON_ROOM_HOST_UPDATE]: {
    /** new host's user id */
    data: string
  }

  [EVENTS.RIBBON_PLAYERS_ONLINE]: {
    /** numbers of players currently online */
    data: number
  }

  [EVENTS.RIBBON_ROOM_UPDATE]: {
    id: string,
    name: string,
    name_safe: string,
    type: "public" | "private",
    owner: string,
    creator: string,
    auto: {
      enabled: boolean,
      status: "lobby" | "ingame",
      time: number,
      maxtime: number
    },
    options: unknown, // too much stuff
    userLimit: number,
    autoStart: number,
    allowAnonymous: boolean,
    allowUnranked: boolean,
    allowBots: boolean,
    userRankLimit: string,
    useBestRankAsLimit: string,
    forceRequireXPToChat: boolean,
    bgm: string,
    match: {
      gamemode: string,
      modename: string,
      ft: number, // first to
      wb: number, // win by
      record_replays: boolean,
      winningKey: string,
      keys: unknown,
      extra: unknown,
    },
    players: unknown[]
  }
}

export interface RoomConfig 
{

}
