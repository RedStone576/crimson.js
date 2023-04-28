import { Api } from "crimson.js"

Api.channel.getUserFromDiscord("263872620661964800")
.then(data => 
{
  if (data?.username) 
  {
    // console.log(data.nonexistentproperty) // should throw a typecheck error
    return Api.channel.getUser(data.username)
  }
  
  else return null
})
.then(data => console.log(data))
