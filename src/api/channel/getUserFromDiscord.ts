import { get, Nullish, Data } from "./get"

interface User
{
  _id:      string
  username: string
}

interface DataUser
{
  user: User
}

/** Get user tetr.io information based on their discord id snowflake */
export default async function(snowflake: string): Promise<Nullish<User>>
{
  const res = await get<Data<DataUser>>(`users/search/${snowflake}`)

  if (res?.data?.user) return res.data.user
  else return null
}
