import { get, Nullish } from "./get"

interface User
{
  _id:      string
  username: string
}

interface DataUser
{
  user: User
}

/** 
  * Get user tetr.io information based on their discord id snowflake 
  *
  * @param snowflake the user discord id
*/
export default async function getUserFromDiscord(snowflake: string): Promise<Nullish<User>>
{
  const res = await get<DataUser>(`users/search/${snowflake}`)

  if (res?.data?.user) return res.data.user
  else return null
}
