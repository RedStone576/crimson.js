import { Packr, Unpackr } from "msgpackr"
import EventEmitter       from "events"
import WebSocket          from "ws"

import { fallbackEmitter } from "./emitter"
import Relationship        from "./relationship"
import Room                from "./room"

import { EVENTS_TYPES } from "~/constants"
import * as Api         from "~/api"
import * as Types       from "~/types"

const globalPackr   = new Packr({ bundleStrings: false })
const globalUnpackr = new Unpackr({ bundleStrings: false })

const RIBBON_TAG = {
  STANDARD_ID: 0x45, // base
  EXTRACTED_ID: 0xAE, // buffer packets
  BATCH: 0x58,
  EXTENSION: 0xB0
}

const EXTENSION_TAG = {
  PING: 0x0B, // client
  PONG: 0x0C  // server
}

export default class Client 
{
  user: {
    token?:    string
    id?:       string
    username?: string
  }

  // check ../types.ts
  events:       fallbackEmitter<Types.SessionEvents & Types.RibbonEvents>
  relationship: Omit<Relationship, "_propGet" | "_propSet">
  room:         Omit<Room, "_propGet" | "_propSet">

  /* */
 
  private ribbon: {
    endpoint?:        string
    spoolToken?:      string
    migrateEndpoint?: string
    resumeToken?:     string
    signature?:       {}
  }

  private session: {
    open?:           boolean
    dead?:           boolean
    authed?:         boolean
    id?:             string | number
    messageHistory?: any[]
    messageQueue?:   any[]
    lastPong?:       number
    lastSent?:       number
    lastReceived?:   string | number
  }

  // legit too late but better than never
  //private debug: {}
  
  private ws:        any
  private packr:     any
  private unpackr:   any
  private heartbeat: any
 
  constructor(token: string)
  {  
    this.events       = new EventEmitter()
    this.relationship = new Relationship(this._propGet.bind(this), this._propSet.bind(this))
    this.room         = new Room(this._propGet.bind(this), this._propSet.bind(this))
    
    this.user    = {}
    this.ribbon  = {}
    this.session = {}
    
    this.user.token = token
  }

  async connect(endpoint?: string)
  {
    if (!this.user.token) return
    if (!!this.session.authed) return

    const user  = await Api.game.getMe(this.user.token)
    const spool = (!!endpoint || user.role !== "bot") ? { endpoint, detail: "migrated", token: this.ribbon.spoolToken } : await Api.game.getSpool(this.user.token)

    if (user.role !== "bot") return console.log(":3")

    this.session.lastPong  = Date.now()
    this.user.id           = user._id
    this.user.username     = user.username
    this.ribbon.endpoint   = spool.endpoint
    this.ribbon.spoolToken = spool.token
    this.ribbon.signature  = await Api.game.getRibbonSignature(this.user.token)
  
    this.ws = new WebSocket(`wss:${this.ribbon.endpoint}`, this.ribbon.spoolToken)
    
    this.ws.on("open",    this._wsOnOpen.bind(this))
    this.ws.on("message", this._wsOnMessage.bind(this))
    this.ws.on("close",   this._wsOnClose.bind(this))
  }

  /** @hidden */
  private _wsOnOpen()
  {
    this.packr = new Packr({
      bundleStrings: false,
      sequential: true
    })

    this.unpackr = new Unpackr({
      bundleStrings: false,
      sequential: true,
      structures: []
    })

    this.session.open = true
    this.session.dead = false

    if (!this.ribbon.resumeToken) this.sendMessageDirect({ command: "new" })
    else
    {
      this.sendMessageDirect({
        command:     EVENTS_TYPES.CLIENT_RESUME,
        socketid:    this.session.id,
        resumetoken: this.ribbon.resumeToken
      })
        
      this.sendMessageDirect({ command: "hello", packets: this.session.messageHistory ?? [] })
    }

    this.heartbeat = setInterval(() => 
    {
      if (this.ws!.readyState !== 1) return
      if (Date.now() - this.session.lastPong! > 30000) this.ws!.close(4001, "pong timeout") /* */

      this.ws!.send(new Uint8Array([RIBBON_TAG.EXTENSION, EXTENSION_TAG.PING]))
    }, 5000)
  }

  /** @hidden */
  private _wsOnMessage(data: any)
  {
    const messages = decode(new Uint8Array(data), this.unpackr)
    if (messages?.error) return      
    for (const x of messages) this.handleInternalMessage(x)
  }

  /** @hidden */
  private _wsOnClose(e: any)
  {
    /* emit this */
    //if (!!e) console.log(e)
  
    if (!!this.ribbon.migrateEndpoint) 
    {
      this.connect(this.ribbon.migrateEndpoint)
      this.ribbon.migrateEndpoint = ""
      return
    }

    this.ws!.removeAllListeners()
    this.session.open = false

    clearInterval(this.heartbeat)

    if (!this.session.dead) this.connect()
  }

  /** send message to ribbon but direct, meh */
  sendMessageDirect(msg: any): void
  {
    //console.log(msg)
  
    this.ws!.send(encode(msg, this.packr))
  }

  /** send message to ribbon */
  sendMessage(msg: any): void
  {
    this.session.lastSent = !!this.session.lastSent ? (this.session.lastSent + 1) : 1 
    
    msg.id = this.session.lastSent

    if (this.session.messageQueue === undefined) this.session.messageQueue     = []
    if (this.session.messageHistory === undefined) this.session.messageHistory = [] 
    
    this.session.messageQueue.push(msg)
    this.session.messageHistory.push(msg)
    
    if (this.session.messageQueue.length >= 500) this.session.messageHistory.shift()    
    if (!this.session.open) return
    
    for (let i = 0; i < this.session.messageQueue!.length; i++) 
    {
      const message = this.session.messageQueue!.shift()
      this.sendMessageDirect(message)
    }
  }

  private handleInternalMessage(msg: any): void
  {
    if (msg.type === "Buffer") 
    {
      const packet  = Buffer.from(msg.data)
      const message = decode(packet, this.unpackr)
      
      if (message?.error) return
      
      this.handleInternalMessage(message)
    }

    if (msg.command !== "hello" && msg.id) 
    {
      if (msg.id > (this.session.lastReceived ?? -1)) this.session.lastReceived = msg.id
      else return
    }

    if (!!msg.command) this.handleCommand(msg)
    //else console.log(msg)
  }

  private handleCommand(msg: any)
  {
    switch (msg.command)
    {
      case EVENTS_TYPES.RIBBON_PONG:
      {
        this.session.lastPong = Date.now()
        break
      }

      case EVENTS_TYPES.RIBBON_HELLO: 
      {
        this.session.id         = msg.id
        this.ribbon.resumeToken = msg.resume

        if (!this.session.authed)
        {
          this.sendMessageDirect({
            command: "authorize",
            id: this.session.lastSent ?? 0,
            data: {
              token: this.user.token,
              handling: { arr: 0, das: 0, dcd: 0, sdf: 0, safelock: false },
              signature: this.ribbon.signature
            }
          })

          for (const x of msg.packets) 
          {
            this.handleInternalMessage(x)
          }
        }

        break
      }

      case EVENTS_TYPES.RIBBON_AUTHORIZE:
      {
        if (msg.data.success)
        {
          this.session.authed = true
          if (!this.relationship._init) this.relationship._setInitVal(msg.data.social)
          
          this.sendMessage({
            command: "social.presence",
            data: {
              status: "online",
              detail: ""
            }
          })
        
          this.events.emit(EVENTS_TYPES.SESSION_READY, this.ribbon.endpoint!)
        }

        else
        {
          this.die()
          this.events.emit(EVENTS_TYPES.SESSION_ERROR, "failed to authorize ribbon")
        }

        break
      }

      case EVENTS_TYPES.RIBBON_MIGRATE: 
      {
        this.ribbon.migrateEndpoint = this.ribbon.endpoint!.split("/ribbon/")[0] + msg.data.endpoint
        this.session.authed         = false
        this.die()

        //this.events.emit("SESSION_MIGRATE", "")
      
        break
      }

      default: this.handleMessage(msg)
    }
  }

  private handleMessage(msg: any): void
  {
    //console.log(msg)
    
    this.events.emit(msg.command, msg.data)
  }

  /** kill the client */
  die(sad?: boolean): void
  {
    if (!!this.session.dead) return
    if (this.ws) this.ws.close(1000, "die")

    this.session.dead = true
    this.events.emit(EVENTS_TYPES.SESSION_DEAD, !!sad)
  }

  /* user consumed utils */

  /**
   * send a direct message to a user
   *
   * @param the user's id.
   * @param the message.
   * @returns if the client succeeded sending the dm, false if the target might've been not friended by the client
   */
  sendDM(target: string, message: string): boolean
  {
    this.sendMessage({
      command: EVENTS_TYPES.CLIENT_SEND_DM,
      data: {
        recipient: target,
        msg: message
      }
    })

    return true
  }

  /**
    join a room

    @param room's code, usually 4 letters long and always case-insensitive
  */
  joinRoom(code: string): void
  {
    this.sendMessage({
      command: EVENTS_TYPES.CLIENT_JOIN_ROOM,
      data: code
    })
  }
  
  // type this
  editPresence(status: string, detail: string): void
  {
    this.sendMessage({
      command: "social.presence",
      data: {
        status: status || "online",
        detail: detail || ""
      }
    })
  }

  // whacky ahh stuff to try to not create a cyclic reference
  /** @hidden */
  private _propGet(i: keyof typeof this)
  {
    // ugly but whatever
    if (i === "__proto__"
    || i === "constructor"
    || i === "_propGet" 
    || i === "_propSet" 
    || i === "ws" 
    || i === "packr" 
    || i === "unpackr" 
    || i === "_wsOnOpen" 
    || i === "_wsOnClose" 
    || i === "_wsOnMessage"
    || i === "relationship"
    || i === "room") return undefined
  
    return typeof this[i] === "function" ? (this[i] as any).bind(this) : this[i]
  }

  /** @hidden */
  private _propSet(i: any, val: any): void
  {
    if (i === "__proto__"
    || i === "constructor"
    || i === "_propGet" 
    || i === "_propSet" 
    || i === "ws" 
    || i === "packr" 
    || i === "unpackr" 
    || i === "_wsOnOpen" 
    || i === "_wsOnClose" 
    || i === "_wsOnMessage"
    || i === "relationship"
    || i === "room") return

    //@ts-ignore
    this[i] = val
  }
}

/* */

function decode(packet: any, unpackr: any): any
{
  if (packet[0] === RIBBON_TAG.STANDARD_ID) return unpackr.unpackMultiple(packet.slice(1))

  else if (packet[0] === RIBBON_TAG.EXTRACTED_ID)
  {
    const message = globalPackr.unpack(packet.slice(5))
    const view    = new DataView(packet.buffer)

    message.id = view.getUint32(1, false)

    return [message]
  }

  else if (packet[0] === RIBBON_TAG.BATCH)
  {
    const items   = []
    const lengths = []
    
    const batchView = new DataView(packet.buffer)

    for (let i = 0; true; i++) 
    {
      const length = batchView.getUint32(1 + (i * 4), false)
      
      if (length === 0) break
      
      lengths.push(length)
    }

    let pointer = 0
    
    for (let i = 0; i < lengths.length; i++) 
    {
      items.push(packet.slice(1 + (lengths.length * 4) + 4 + pointer, 1 + (lengths.length * 4) + 4 + pointer + lengths[i]))
      pointer += lengths[i];
    }

    return [].concat(...items.map(item => decode(item, unpackr)))
  }

  else if (packet[0] === RIBBON_TAG.EXTENSION)
  {
    if (packet[1] === EXTENSION_TAG.PONG) return [{ command: "pong" }]
    else return []                
  }

  else return [unpackr.unpack(packet)]
}

function encode(message: any, packr: any): any
{
  const msgpacked = packr.encode(message)
  const packet    = new Uint8Array(msgpacked.length + 1)
  
  packet.set([0x45], 0)
  packet.set(msgpacked, 1)
  
  if (msgpacked.length === 5) console.log(msgpacked)

  return packet
}
