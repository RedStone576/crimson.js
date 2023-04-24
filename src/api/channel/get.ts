import fetch from "node-fetch"

export type Nullish<T> = T | null | undefined

interface DataCache
{
  status:       "hit" | "miss" | "awaited"
  cached_at:    number
  cached_until: number
}

export interface Data<T>
{
  success: boolean
  error:   Nullish<string>
  cache:   Nullish<DataCache>
  data:    Nullish<T>
}

export async function get<T>(url: string): Promise<T>
{
  const raw = await fetch(encodeURI("https://ch.tetr.io/api/" + url), {
    method: "GET",
    headers: {
      "User-Agent": "v8/001",
      "Accept": "application/json"
    }
  })

  const res = await raw.json()

  return res as T
}
