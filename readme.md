# crimson.js

my attempt at building a library for interacting with both main tetr.io api and tetra channel.  
use an approved bot account btw

initial ribbon code is stolen from [craftxbox/Autohost](https://github.com/craftxbox/Autohost), forked from [Zudo/autohost](https://gitlab.com/Zudo/autohost)  
shout out to them !!

---

[my discord server](https://discord.gg/C2qHe7F)  
[tetr.io bot docs](https://github.com/Poyo-SSB/tetrio-bot-docs)

---

### how to build

- install typescript
- run `npm install` or `npm install --production=false`
- then run `tsc` and it will emits those source files to `./out/` 
- bundle them by running `npx run bundle`
- it should bundle all of the files into `./dist/`
  
this thing is still pretty messy so any contribution (especially for ideas on naming things) is appreciated

### some ongoing example

```js
const crimson = require("../dist/index.js")

const client = new crimson("<ur bot token>")
// or
const client = new crimson.default("<still ur bot token>")

client.once("ready", (endpoint) => 
{
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
```
