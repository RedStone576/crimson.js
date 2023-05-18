// @ts-nocheck
import get from "./get"

export default async function getMe(token: string): Promise<any>
{
  const result = await get(token, "users/me")

  if (result && result.success) return result.user
  else return undefined
}

