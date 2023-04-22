import fetch from "node-fetch"

export default async function (token: string, url: string, body: any): Promise<any>
{
  let res = await fetch(encodeURI("https://tetr.io/api/" + url), {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "User-Agent": "v8/001"
    }
  })

  res = await res.json()

  return res
}
