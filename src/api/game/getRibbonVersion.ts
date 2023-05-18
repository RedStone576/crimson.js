import get from "./get"

export default async function getRibbonVersion(token: string): Promise<any>
{
  const result = await get<any>(token, "server/environment", true)

  if (result.success) return result.signature.commit
  else return undefined
}

