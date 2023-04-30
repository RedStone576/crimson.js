import { Client, Constant } from "crimson.js"
//const { Client, Constant } = require("crimson.js")

const TYPES = Constant.EVENTS_TYPES

const client = new Client("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJpYXQiOjE2NjYwMDAwMDB9.CEvIiqMH_5VotiAOus3LEyGttivuaLgqinKlTqxCzJ8")

client.events.on(TYPES.SESSION_READY, (endpoint: string) => console.log(endpoint))

client.events.on(TYPES.RIBBON_USER_DM, (data: any) => 
{
  client.sendMessage({
    command: TYPES.CLIENT_ACK_DM,
    data: data.data.user
  })

  if (data.data.user !== client.user.id) console.log(`dm from ${data.data.user}:\n\t${data.data.content}`)
})

client.events.on(TYPES.RIBBON_USER_INVITE, (data: any) =>
{
  client.sendMessage({
    command: TYPES.CLIENT_JOIN_ROOM,
    data: data.roomid
  })
})

client.events.on(TYPES.RIBBON_ROOM_CHAT, (data: any) =>
{
  if (data.user._id !== client.user.id)
  {
    console.log(`room chat message from ${data.user.username}:\n\t${data.content}`)

    // simple say command
    
    if (data.content.startsWith("!say")) client.sendMessage({
      command: TYPES.CLIENT_SEND_ROOM_MESSAGE,
      data: data.content.replace("!say", "").trim()
    })
  }
})

client.connect()
