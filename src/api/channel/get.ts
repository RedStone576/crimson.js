import fetch from "node-fetch"

export type Nullish<T> = T | null | undefined

interface DataCache
{
  status:       "hit" | "miss" | "awaited"
  cached_at:    number
  cached_until: number
}

interface Data<T>
{
  success: boolean
  error:   Nullish<string>
  cache:   Nullish<DataCache>
  data:    Nullish<T>
}

export async function get<T = Data<unknown>>(url: string): Promise<Data<T>>
{
  const raw = await fetch(encodeURI("https://ch.tetr.io/api/" + url), {
    method: "GET",
    headers: {
      "User-Agent": "v8/001",
      "Accept": "application/json"
    }
  })

  const res = await raw.json()

  return res as Data<T>
}
