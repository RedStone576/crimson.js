import EventEmitter     from "events"

import { TypedEmitter } from "./emitter"
import message          from "./message"

import { RoomConfig }             from "~/types"
import { EVENTS_TYPES as EVENTS } from "~/constants"

/** 
 * maps the raw events, probably will only cover a small portion.
 * for other room specific events that are not included you should listen to the raw events instead 
 */
const roomEventsMap = {
  [EVENTS.RIBBON_ROOM_UPDATE]:           "update",
  [EVENTS.RIBBON_ROOM_HOST_UPDATE]:      "hostSwitch",
  [EVENTS.RIBBON_ROOM_PLAYER_REMOVE]:    "playerRemove",
  [EVENTS.RIBBON_ROOM_CHAT]:             "messageCreate",
  //[EVENTS.RIBBON_ROOM_PLAYER_ADD]:       "room.addplayer",
  //[RIBBON_ROOM_CHAT_CLEAR]:              "room.chat.clear",
} as const

// holy shit
// i have no idea what the hell am i doing
// i legit spent like solid 45 minutes for this
// why the heck cant i just do like `[roomEventsMap[EVENTS.RIBBON_ROOM_CHAT]]: { something }`
// how am i suppose to make this look pretty 
type MappedRoomEvents = {
  [K in typeof roomEventsMap[keyof typeof roomEventsMap]]: 
    K extends typeof roomEventsMap[typeof EVENTS.RIBBON_ROOM_CHAT] ? message<"room">
    : never
}

/** room social interface */
// not a standalone class
export default class Room extends (EventEmitter as { new (): TypedEmitter<MappedRoomEvents> })
{
  //config

  public type: "public" | "private" | null
  public code: string | null

  constructor()
  {
    super()

    this.type = null
    this.code = null
  }

  /** @hidden */
  bindEvent(event: any)
  {
    switch (event.command)
    {
      case EVENTS.RIBBON_ROOM_CHAT:
      {
        this.emit(roomEventsMap[EVENTS.RIBBON_ROOM_CHAT], new message("room", event.data))
        break
      }
    }
  }

  setConfig(config: RoomConfig)
  {
  
  }

  // yeah probably not
  /*getMessageLog()
  {
  
  }*/
}
