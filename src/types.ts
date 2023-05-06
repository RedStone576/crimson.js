import { EVENTS_TYPES as EVENTS } from "./constant"

export type EventsTypes = typeof EVENTS[keyof typeof EVENTS]

export interface RoomConfig 
{}

export type ClientEvents = {
  [EVENTS.SESSION_READY]: string
  [EVENTS.SESSION_ERROR]: string
  [EVENTS.SESSION_DEAD]:  boolean

  [EVENTS.RIBBON_USER_DM]: {
    id: string,
    data: {
      content: string,
      content_safe: string,
      user: string,
      userdata: {
        role: string,
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
      role: string,
      supporter: boolean,
      supporter_tier: number,
      verified: boolean
    },
    system: boolean
  }
}
