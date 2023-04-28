import { Api } from "crimson.js"

const data = await Api.channel.getUser("FinBot")

console.log(data)
