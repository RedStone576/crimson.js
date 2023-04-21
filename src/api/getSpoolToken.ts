import msgpackr from "msgpackr"
import fetch from "node-fetch"
import getAuthed from "./getAuthed"

//@ts-ignore
msgpackr.addExtension({
  type: 1,
  read: (e) => (null === e ? { success: true } : { success: true, ...e })
})

//@ts-ignore
msgpackr.addExtension({
  type: 2,
  read: (e) => (null === e ? { success: false } : { success: false, error: e })
})

const unpackr = new msgpackr.Unpackr({ bundleStrings: false })

async function _fetch(token: string): Promise<any>
{
  let res: any
    
  try 
  {
    res = await fetch(encodeURI("https://tetr.io/api/server/ribbon"), {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "User-Agent": "v8/001",
        "Accept": "application/vnd.osk.theorypack"
      }
    })

    res = await res.arrayBuffer()

    const unpacked = unpackr.unpack(Buffer.from(res))

    //console.log(unpacked)

    return unpacked
  } 

  catch (e: any) 
  {
    console.log(res ? JSON.stringify(res) : undefined)
    console.log(e.message)
    
    console.error(res?.substring(0, 100))
    
    throw e
    
    return null
  }
}

export default async function (token: string): Promise<any>
{
  console.log("getSpoolToken")

  //let res = await getAuthed(token, "server/ribbon")

  let res = await _fetch(token)
  
  if(!res.spools || !res.spools.token) return null
  
  return res//.spools.token
}
