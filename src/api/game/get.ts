import fetch from "node-fetch"
import { addExtension, Unpackr } from "msgpackr"

addExtension({
  Class: undefined!,
  type: 1,
  read: (e) => (null === e ? { success: true } : { success: true, ...e })
})

addExtension({
  Class: undefined!,
  type: 2,
  read: (e) => (null === e ? { success: false } : { success: false, error: e })
})

const { unpack } = new Unpackr({
  bundleStrings: false
})

export default async function (token: string, url: string, jsonExclusive?: boolean): Promise<any>
{
  let res: any
    
  try 
  {
    res = await fetch(encodeURI("https://tetr.io/api/" + url), {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "User-Agent": "v8/001",
        "Accept": !!jsonExclusive ? "application/json" : "application/vnd.osk.theorypack"
      }
    })
    
    res = !!jsonExclusive ? (await res.text()) : (await res.arrayBuffer())
    res = !!jsonExclusive ? JSON.parse(res)    : unpack(Buffer.from(res))
    
    return res
  } 
  
  catch (e: any) 
  {
    console.log(res ? JSON.stringify(res) : undefined)
    console.log(e.message)
    console.log(url)
    
    throw e
    
    return null
  }
}
