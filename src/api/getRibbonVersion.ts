import fetch from "node-fetch"
import getAuthed from "./getAuthed"

async function getRibbonVersion(token: string): Promise<any>
{
  const result = await getAuthed(token, "server/environment")

  if (result.success) return result.signature.commit
  else return undefined
}

