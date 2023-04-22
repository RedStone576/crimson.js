import fetch from "node-fetch"
  
export default async function (token: string, url: string): Promise<any>
{
  let res: any = await fetch(encodeURI("https://ch.tetr.io/api/" + url), {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "User-Agent": "v8/001",
      "Accept": "application/json"
    }
  })

  res = await res.json()

  return res
}
