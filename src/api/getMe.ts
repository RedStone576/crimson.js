import fetch from "node-fetch"
import getAuthed from "./getAuthed"

export default async function (token: string): Promise<any>
{
  const result = await getAuthed(token, "users/me")

  if (result && result.success) return result.user
  else return undefined
}

