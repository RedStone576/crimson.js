import get from "./get"

interface DMData
{
  content: string
  content_safe: string
  user: string
  userdata: {
    role: "banned" | "user" | "bot" | "halfmod" | "mod" | "admin" | "sysop"
    supporter: boolean
    supporter_tier: number
    verified: boolean
  }
  system: boolean
}

interface DM
{
  data: DMData
  stream: string
  ts: string
  id: string
}

/**
 * get direct messages, from new to oldest
 * @param the client token
 * @param the user's id
 * @returns array of dm data, empty array if none or on error
 */
export default async function getDM(token: string, id: string): Promise<DM[]>
{
  const res = await get<{ dms: DM[] }>(token, `dms/${id}`)

  if (res === null) return []
  else
  {
    if (res.success) return res.dms as DM[]
    else return []
  }
}
