// TODO: make a message model and include `mentions` property, yk like the one js discord lib has
import EventEmitter     from "events"
import { TypedEmitter } from "./emitter"
import { EVENTS_TYPES } from "~/constants"

export default class Room extends (EventEmitter as { new (): TypedEmitter<{}> })
{
  type:    "public" | "private" | null
  state:   "lobby" | "ingame" | null
  code:    string | null
  name:    string | null
  host:    string | null
  creator: string | null
  options: any
  
  players: Array<{
    _id:       string
    username:  string
    verified:  boolean
    bot:       boolean
    supporter: boolean
    anon:      boolean
    xp:        number
    country:   string | null
    bracket:  "player" | "spectator" | "observer"
    role:     "anon" | "user" | "bot" | "halfmod" | "mod" | "admin" | "sysop"

    badges: Array<{
      id:    string
      label: string
      ts:    string
    }>

    record: {
      games:  number
      wins:   number
      streak: number
    }
  }>

  /** @hidden */
  private _propGet: any
  /** @hidden */
  private _propSet: any
  
  constructor(_propGet: any, _propSet: any)
  {
    super()
    
    this.type    = null
    this.state   = null
    this.code    = null
    this.name    = null
    this.host    = null
    this.creator = null
    this.options = {}
    this.players = []
  
    this._propGet = _propGet
    this._propSet = _propSet
  }

  /** join a room */
  join(code: string): Promise<boolean | Pick<this, "type" | "state" | "code" | "name" | "host" | "creator" | "options" | "players">>
  {
    return new Promise((resolve: (x: Awaited<ReturnType<typeof this.join>>) => void, reject: any) =>
    {
      // return false if client is already in a room
      // might make it automatically leave and then join the new room later
      if (this.code !== null) return resolve(false)
    
      this._propGet("sendMessage")({
        command: EVENTS_TYPES.CLIENT_JOIN_ROOM,
        data: code
      })      

      // TODO: type data
      // listen to room.update event instead of room.join cuz it has more data 
      this._propGet("events").once(EVENTS_TYPES.RIBBON_ROOM_UPDATE, (data: any) => 
      {
        this.type    = data.type
        this.state   = data.state
        this.code    = data.id
        this.name    = data.name
        this.host    = data.owner
        this.creator = data.creator
        this.options = data.options
        this.players = data.players

        return resolve({
          type:    data.type,
          state:   data.state,
          code:    data.id,
          name:    data.name,
          host:   data.owner,
          creator: data.creator,
          options: data.options,
          players: data.players
        })
      })
    })
  }

  /** leave the current room */
  leave(): Promise<boolean>
  {
    return new Promise((resolve: (x: boolean) => void, reject: any) =>
    {
      if (this.code === null) return resolve(false)
      
      this._propGet("sendMessage")({
        command: EVENTS_TYPES.CLIENT_LEAVE_ROOM
      })

      this._propGet("events").once(EVENTS_TYPES.RIBBON_ROOM_LEAVE, (id: string) =>
      {
        // basically reset to init state
        this.type    = null
        this.state   = null
        this.code    = null
        this.name    = null
        this.host    = null
        this.creator = null
        this.options = {}
        this.players = []

        // if id === this.code then this 
        return resolve(true)
      })
    })
  }

  /** 
   * create a room 
   *
   * for "safety" reason, if no argument were provided the room will default to private
   * trust me, accidentally creating a public room sucksss
   */
  create(type: "public" | "private" = "private"): Promise<boolean | Pick<this, "type" | "state" | "code" | "name" | "host" | "creator" | "options" | "players">>
  {
    return new Promise((resolve: (x: Awaited<ReturnType<typeof this.join>>) => void, reject: any) =>
    {
      if (this.code !== null) return resolve(false)

      this._propGet("sendMessage")({
        command: EVENTS_TYPES.CLIENT_CREATE_ROOM,
        data: type
      })

      this._propGet("events").once(EVENTS_TYPES.RIBBON_ROOM_UPDATE, (data: any) =>
      {
        this.type    = data.type
        this.state   = data.state
        this.code    = data.id
        this.name    = data.name
        this.host    = data.owner
        this.creator = data.creator
        this.options = data.options
        this.players = data.players

        return resolve({
          type:    data.type,
          state:   data.state,
          code:    data.id,
          name:    data.name,
          host:    data.owner,
          creator: data.creator,
          options: data.options,
          players: data.players
        })
      })
    })
  }

  /** update the current room's config */
  update(config: any): Promise<boolean>
  {
    return new Promise((resolve: (x: boolean) => void, reject: any) =>
    {
      if (this._propGet("user").id !== this.host) return resolve(false)
      
      //
      return resolve(true)
    })
  }

  kick() {}
  ban() {}
  clearChat() {}
  createMessage() {}
  invite() {}
  start() {}
  abort() {}
  transferHost() {}
  switchBracket(user: any, bracket: "spectator" | "player") {}
}

