import { Packr, Unpackr } from "msgpackr"
import EventEmitter from "events"
import WebSocket from "ws"

import Api from "@api"

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

export default class extends EventEmitter
{
  private token: string

  private ribbon: {
    version?:         any, // todo
    endpoint?:        string,
    //despool?:         string,
    spoolToken?:      any,
    migrateEndpoint?: string,
    resumeToken?:     string
  }

  private session: {
    open?:           boolean,
    dead?:           boolean,
    authed?:         boolean,
    socketId?:       any, // todo
    messageHistory?: any[],
    messageQueue?:   any[]
    lastPong?:       number,
    lastSent?:       number,
    lastReceived?:   any,
  }

  private ws?:      any
  private packr?:   typeof globalPackr
  private unpackr?: typeof globalUnpackr
  
  private heartbeat: any

  constructor(token: string)
  {
    super()

    this.token   = token
    this.ribbon  = {}
    this.session = {}
  }

  /* TODO: might try to handle n emit message properly */
  private handleMessage(msg: any)
  {
    //if (msg.command) console.log(msg.command)
    
    this.emit(msg.command, msg.data)
  }
  
  private handleInternalMessage(msg: any)
  { 
    if (msg.type === "Buffer") 
    {
      const packet  = Buffer.from(msg.data)
      const message = decoder(packet, this.unpackr)
      
      if (message?.error) return
      
      this.handleInternalMessage(message)
    }

    if (msg.command !== "hello" && msg.id) 
    {
      if (msg.id > (this.session.lastReceived ?? -1)) this.session.lastReceived = msg.id
      else return
    }

    if (!!msg.command) this.handleCommand(msg)
    
    /*if (msg.type !== "Buffer") 
    {
      console.log("message in:")
      console.log(msg)
    }*/
  }

  private handleCommand(msg: any)
  {
    switch (msg.command)
    {
      case "pong": 
      {
        this.session.lastPong = Date.now()
        break
      }

      case "hello":
      {
        this.session.socketId   = msg.id
        this.ribbon.resumeToken = msg.resume

        if (!this.session.authed)
        {
          this.sendImmediateMessage({
            command: "authorize",
            id: this.session.lastSent ?? 0,
            data: {
              token: this.token,
              handling: { arr: 0, das: 0, sdf: 0, safelock: false },
              signature: {
                commit: this.ribbon.version
              }
            }
          })

          for (const x of msg.packets) 
          {
            this.handleInternalMessage(x)
          }
        }

        break
      }
      
      case "authorize":
      {
        if (msg.data.success)
        {
          this.session.authed = true
          
          this.sendMessage({
            command: "social.presence",
            data: {
              status: "online",
              detail: ""
            }
          })
        
          this.emit("ready", this.ribbon.endpoint)
        }

        else 
        {
          this.die()
          console.log("failed to authorize ribbon")
          this.emit("error", "failed to authorize")
        }

        break
      } 
      
      default: this.handleMessage(msg)
    }
  }

  sendImmediateMessage(msg: any) // TODO 
  {
    this.ws.send(encoder(msg, this.packr))
  }

  sendMessage(message: any)
  {
    this.session.lastSent = !!this.session.lastSent ? (this.session.lastSent + 1) : 1 
    
    message.id = this.session.lastSent

    if (this.session.messageQueue === undefined) this.session.messageQueue     = []
    if (this.session.messageHistory === undefined) this.session.messageHistory = [] 
    
    this.session.messageQueue.push(message)
    this.session.messageHistory.push(message)
    
    if (this.session.messageQueue.length >= 500) this.session.messageHistory.shift()
    
    this.flushQueue()
  }

  flushQueue()
  {
    if (!this.session.open) return
    
    /* TODO: rewrite this */
    for (let i = 0; i < this.session.messageQueue!.length; i++) 
    {
      const message = this.session.messageQueue!.shift()
      this.sendImmediateMessage(message)
    }
  }
  
  die(sad?: boolean)
  {
    if (this.session.dead) return

    this.session.dead = true

    if (this.ws) this.ws.close(1000, "die")

    this.emit("dead", !!sad)
  }

  async connect(endpoint?: string | null | undefined, fn?: () => void): Promise<void>
  {
    //if (!!endpoint) console.log(endpoint)
  
    if (fn !== undefined) fn() 

    this.session.lastPong = Date.now()
    this.ribbon.version   = await Api.game.getRibbonVersion(this.token)

    const spool = (endpoint !== null && endpoint !== undefined) ? { endpoint, detail: "recommended", token: this.ribbon.spoolToken } : await Api.game.getSpool(this.token)
    
    this.ribbon.endpoint   = spool.endpoint
    this.ribbon.spoolToken = spool.token
    
    this.ws = new WebSocket(`wss:${this.ribbon.endpoint}`, this.ribbon.spoolToken)
    
    this.ws.on("open", () =>
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

      //console.log(`[RIBBON] ws opened: ${this.ws.url}`)

      if (this.ribbon.resumeToken) 
      {
        this.sendImmediateMessage({
          command: "resume",
          socketid: this.session.socketId,
          resumetoken: this.ribbon.resumeToken
        })
        
        this.sendImmediateMessage({ command: "hello", packets: this.session.messageHistory ?? [] })
      } 

      else this.sendImmediateMessage({ command: "new" })

      this.heartbeat = setInterval(() =>
      {
        if (this.ws.readyState !== 1) return
        
        if (Date.now() - this.session.lastPong! > 30000) 
        {
          console.log(`[RIBBON] pong timout, disconnecting`)
          this.ws.close(4001, "pong timeout")
        }

        this.ws.send(new Uint8Array([RIBBON_TAG.EXTENSION, EXTENSION_TAG.PING]))
      }, 5000)
    })

    this.ws.on("message", (data: any) /* TODO: type this */ => 
    {
      const messages = decoder(new Uint8Array(data), this.unpackr)
      
      if (messages?.error) return
      
      for (const x of messages) this.handleInternalMessage(x)
    })

    this.ws.on("close", (code: any, reason: any) =>
    {
      console.log(`[RIBBON] ws closed: ${reason} ${code}`)

      if (this.ribbon.migrateEndpoint, () => console.log("migrating")) 
      {
        this.connect(this.ribbon.migrateEndpoint)
        
        return
      }

      this.ws.removeAllListeners()
      this.session.open = false
      
      clearInterval(this.heartbeat)

      if (!this.session.dead) this.connect(null)
    })
  }
}

function decoder(packet: any, unpackr: any /* TODO */): any
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

    return [].concat(...items.map(item => decoder(item, unpackr)))
  }

  else if (packet[0] === RIBBON_TAG.EXTENSION)
  {
    if (packet[1] === EXTENSION_TAG.PONG) return [{ command: "pong" }]
    else return []                
  }

  else return [unpackr.unpack(packet)]
}

function encoder(message: any, packr: any /* TODO */): any
{
  const msgpacked = packr.encode(message)
  const packet    = new Uint8Array(msgpacked.length + 1)
  
  packet.set([0x45], 0)
  packet.set(msgpacked, 1)
  
  if (msgpacked.length === 5) console.log(msgpacked)

  return packet
}
