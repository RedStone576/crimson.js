import EventEmitter     from "events"
import { TypedEmitter } from "./emitter"

import { EVENTS_TYPES } from "~/constants"
import { RibbonEvents } from "~/types"
import * as api         from "~/api/mod"

export default class Relationship extends (EventEmitter as { new (): TypedEmitter<{}> })
{
  /** notifications queue */
  notifications: Array<{
    id: string
    ts: string
    type: string // "friend" | "pending" | "noop_forfeit_notice" | "announcement" | "supporter_new" | "supporter_gift" | "" 
    seen: boolean
    data: {
      relationship?: {
        id: string
        username: string
        unread: number
        mutual: boolean
      }
    }
  }>
  
  /** friends list */
  friends: {
    [id: string]: {
      username: string
      id: string
      unread: number
      ts: string
    }
  }
  
  /** blocked users list */
  blocklist: {
    [id: string]: {
      username: string
      id: string
      unread: number
      ts: string
    }
  }

  /** other, pending request idk i cant think of a better name. will change this later */
  backlog: {
    [id: string]: {
      username: string
      id: string
      unread: number
      ts: string
      type: string
    }
  }
  
  /** list of users that are currently online */
  presences: {
    [id: string]: {
      status: string
      detail: string
      invitable: boolean
    }
  }

  /** @hidden */
  _init: boolean
  /** @hidden */
  private _propGet: any
  /** @hidden */
  private _propSet: any
  
  constructor(_propGet: any, _propSet: any)
  {
    super()

    this.notifications = []
    this.friends       = {}
    this.blocklist     = {}
    this.backlog       = {}
    this.presences     = {}
    this._init         = false

    this._propGet = _propGet
    this._propSet = _propSet
  }

  /** @hidden */
  _setInitVal(data: any)
  {
    this._init = true

    for (const x of data.notifications)
    {
      this.notifications.push({
        id: x._id,
        ts: x.ts,
        type: x.type,
        seen: x.seen,
        data: !x.data?.relationship ? {} : {
          relationship: {
            id: x.data.relationship.from._id,
            username: x.data.relationship.from.username,
            unread: x.data.relationship.unread,
            mutual: x.data.ismutual
          }
        }
      })
    }

    for (const x of data.relationships)
    {
      if (x.type === "friend") 
      {
        this.friends[x.to._id] = {
          username: x.to.username,
          id: x.to._id,
          unread: x.unread,
          ts: x.updated
        }
      }

      else if (x.type === "block")
      {
        this.blocklist[x.to._id] = {
          username: x.to.username,
          id: x.to._id,
          unread: x.unread,
          ts: x.updated
        }
      }

      else this.backlog[x.to._id] = {
        username: x.to.username,
        id: x.to._id,
        unread: x.unread,
        ts: x.updated,
        type: x.type
      }
    }

    for (const x of Object.keys(data.presences))
    {
      this.presences[x] = {
        status: data.presences[x].status,
        detail: data.presences[x].detail,
        invitable: data.presences[x].invitable
      }
    }
  }

  async add(user: string)
  {
  }

  async remove(user: string)
  {
  
  }

  async block(user: string)
  {}

  async sendDM(user: string, message: string): Promise<{ 
    content: string,
    content_safe: string,
    id: string, 
    stream: string, 
    ts: string 
  }>
  {
    return new Promise((resolve: (x: Awaited<ReturnType<typeof this.sendDM>>) => void, reject: any) =>
    {
      this._propGet("sendMessage")({
        command: "social.dm",
        data: {
          recipient: user,
          msg: message
        }
      })   

      this._propGet("events").once(EVENTS_TYPES.RIBBON_USER_DM, (event: RibbonEvents[typeof EVENTS_TYPES.RIBBON_USER_DM]) =>
      {
        //hmmmm should it check the message?
        resolve({
          content: event.data.content,
          content_safe: event.data.content_safe,
          id: event.id,
          stream: event.stream,
          ts: event.ts
        })
      })
    })
  }

  async fetchDM(user: string): ReturnType<typeof api.game.getDM>
  {
    return await api.game.getDM(this._propGet("user").token, user)
  }

  // not sure about report and gift methods
}
