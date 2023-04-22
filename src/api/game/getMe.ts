import get from "./get"

export default async function (token: string): Promise<any>
{
  const result = await get(token, "users/me", true)

  if (result && result.success) return result.user
  else return undefined
}

