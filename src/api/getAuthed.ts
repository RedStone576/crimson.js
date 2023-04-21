import fetch from "node-fetch"

export default async function (token: string, url: string): Promise<any>
{
  console.log("getAuthed")

  let res: any
    
  try 
  {
    res = await fetch(encodeURI("https://tetr.io/api/" + url), {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "User-Agent": "v8/001",
        "Accept": "application/json"
      }
    })
    
    res = await res.text()
    
    return JSON.parse(res)
  } 
  
  catch (e: any) 
  {
    console.log(res ? JSON.stringify(res) : undefined)
    console.log(e.message)
    console.log(url)
    
    console.error(res?.substring(0, 100))
    
    throw e
    
    return null
  }
}
