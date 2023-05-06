import { Client, Types, Constant } from "crimson.js"
//const { Client, Constant } = require("crimson.js")

const EVENTS = Constant.EVENTS_TYPES 

const client = new Client("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJpYXQiOjE2NjYwMDAwMDB9.CEvIiqMH_5VotiAOus3LEyGttivuaLgqinKlTqxCzJ8")

client.events.on(EVENTS.SESSION_READY, (endpoint) => console.log(endpoint))

client.events.on(EVENTS.RIBBON_USER_DM, (data) => 
{
  console.log(data)

  client.sendMessage({
    command: EVENTS.CLIENT_ACK_DM,
    data: data.data.user
  })

  if (data.data.user !== client.user.id) console.log(`dm from ${data.data.user}:\n\t${data.data.content}`)
})

client.events.on(EVENTS.RIBBON_USER_INVITE, (data) =>
{
  console.log(data)

  client.sendMessage({
    command: EVENTS.CLIENT_JOIN_ROOM,
    data: data.roomid
  })
})

client.events.on(EVENTS.RIBBON_ROOM_CHAT, (data) =>
{
  //console.log(data.gay) // throw an error  

  if (data.user._id !== client.user.id)
  {
    console.log(`room chat message from ${data.user.username}:\n\t${data.content}`)

    // simple say command
    
    if (data.content.startsWith("!say")) client.sendMessage({
      command: EVENTS.CLIENT_SEND_ROOM_MESSAGE,
      data: data.content.replace("!say", "").trim()
    })
  }
})

client.connect()
