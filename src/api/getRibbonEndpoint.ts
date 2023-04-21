import fetch from "node-fetch"
import getAuthed from "./getAuthed"
import getSpool from "./getSpool"

export default async function (token: string): Promise<any>
{
  const result = await getAuthed(token, "server/ribbon")

  if (result && result.success) 
  {
    let despool
    
    try
    {
      if (result.spools === null)
      {
        console.log("direct ribbon fallback")
        
        return "tetr.io" + result.endpoint
      }
      
      for (let i of result.spools.spools) 
      {
        let spool = await getSpool(token, i.host)
        
        if (spool.isOnline && !spool.avoidDueToHighLoad) 
        {
          despool = i
          
          break
        }
      }
    } 
    
    catch(e)
    {
      console.log("failed to get ribbon endpoint")
      console.log(JSON.stringify(result))
    }
    
    console.log(`recommended ribbon endpoint: ${despool.host + result.endpoint}`)

    console.log("getRibbon")
    
    return despool.host + result.endpoint
  } 
  
  else throw new Error("Unable to find ribbon endpoint")
}
