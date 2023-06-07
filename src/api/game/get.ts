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
  bundleStrings: true
})

interface Data
{
  success: boolean
}

export default async function get<T = unknown>(token: string, url: string, jsonExclusive?: boolean): Promise<Data & T | null>
{
  try
  {
    let res: any = await fetch(encodeURI("https://tetr.io/api/" + url), {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "User-Agent": "v8/001",
        "Accept": !!jsonExclusive ? "application/json" : "application/vnd.osk.theorypack"
      }
    })

    res = !!jsonExclusive ? (await res.text()) : (await res.arrayBuffer())
    res = !!jsonExclusive ? JSON.parse(res)    : unpack(Buffer.from(res))

    return res as Data & T
  }

  catch 
  {
    return null
  }
}
