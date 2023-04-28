const { Client } = require("crimson.js")

const client = new Client("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJpYXQiOjE2NjYwMDAwMDB9.CEvIiqMH_5VotiAOus3LEyGttivuaLgqinKlTqxCzJ8")

client.once("ready", (endpoint) => {
  console.log("ready")
  console.log(`connected to ${endpoint}`)
})

client.on("social.dm", (data) =>
{
  client.sendMessage({
    command: "social.relationships.ack",
    data: data.data.user
  })

  if (data.data.content === "hi") client.sendMessage({
    command: "social.dm",
    data: {
      recipient: data.data.user,
      msg: "hello :3 !! !!!"
    }
  })
  
  else if (data.data.user !== "618cd0bbbac22ab31db6ea6b") console.log(`dm from ${data.data.user}:\n\t${data.data.content}`)
          /* my bot id, just so it doesnt log back the sended message lol */
})

client.connect(null, () => console.log("connecting..."))
