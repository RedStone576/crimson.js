import { ClientEvents } from "~/types"
import { EVENTS_TYPES as EVENTS } from "~/constants"
import { channel } from "~/api/mod"

/** represent a user recieved text message */
export default class Message<T extends "dm" | "room">
{
  public id: string | null
  public content: string
  public content_safe: string
  public system: boolean
  public suppressable: boolean
  public ts: string
  public channel: T
  
  public user: {
    _id: string
    username: string | null
    role: "banned" | "anon" | "user" | "bot" | "halfmod" | "mod" | "admin" | "sysop"
    supporter: string
    supporter_tier: number
    verified: boolean
  } 
  
  public raw: T extends "dm" 
    ? ClientEvents[typeof EVENTS.RIBBON_USER_DM] 
    : T extends "room" 
    ? ClientEvents[typeof EVENTS.RIBBON_ROOM_CHAT] 
    : never
  
  constructor(channel: T, msg: any)
  {
    this.channel = channel // where the heck does the message came from
    this.raw     = (msg as any) as this["raw"]

    if (channel === "dm")
    {
      this.id           = msg.id
      this.content      = msg.data.content
      this.content_safe = msg.data.content_safe
      this.system       = msg.data.system
      this.suppressable = false
      this.ts           = msg.ts
      this.user         = {
        _id:            msg.data.user,
        username:       null,
        role:           msg.data.userdata.role,
        supporter:      msg.data.userdata.supporter,
        supporter_tier: msg.data.userdata.supporter_tier,
        verified:       msg.data.userdata.verified
      }
    }

    // for room message
    else
    {
      this.id           = null
      this.content      = msg.content
      this.content_safe = msg.content_safe
      this.system       = msg.system
      this.suppressable = msg.suppressable
      this.ts           = Date.now().toString() // i forgor how the hell does the `ts` property should look like, might change this later
      this.user         = {
        _id:            msg.user._id,
        username:       msg.user.username,
        role:           msg.user.role,
        supporter:      msg.user.supporter,
        supporter_tier: msg.user.supporter_tier,
        verified:       msg.user.verified
      }
    }
  }

  /*async getAuthor(): Promise<any>//Promise<UserLimited>
  {
    let user: any//UserLimited
    
    if (this.channel === "dm" && this.userMap[this.raw.data.user])
    {
      const res = await channel.getUser(this.raw.data.user)
      this.userMap[this.raw.data.user] = res?.username
      user = {
        _id: res?._id,
        username: res?.username,
        
      }
    }
  }*/

}
