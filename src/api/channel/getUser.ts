import { get, Nullish, Data } from "./get"

interface UserBadge
{
  id:    string
  label: string
  ts:    Nullish<string>
}

interface UserLeague 
{
  gamesplayed:     number
  gameswon:        number
  rating:          number
  rank:            string
  bestrank:        string
  standing:        number
  standing_local:  number
  next_rank:       Nullish<string>
  prev_rank:       Nullish<string>
  next_at:         number
  prev_at:         number
  percentile:      number
  percentile_rank: string
  glicko:          Nullish<number>
  rd:              Nullish<number>
  apm:             Nullish<number>
  pps:             Nullish<number>
  vs:              Nullish<number>
  decaying:        boolean
}

interface UserConnectionDiscord
{
  id: string
  username: string
}

interface UserConnections
{
  discord: Nullish<UserConnectionDiscord>
}

/*
  the special banner thing for the programmer, staff, and designer you see on the game
  not rly sure about this lol 
*/
interface UserDistinguishment
{
  type:   string
  detail: string
  header: string
  footer: string
}

interface User
{
  _id:             string
  username:        string
  role:            "anon" | "user" | "bot" | "mod" | "admin" | "banned"
  ts:              Nullish<string>
  botmaster:       Nullish<string>
  badges:          UserBadge[]
  xp:              number
  gamesplayed:     number
  gameswon:        number
  gametime:        number
  country:         Nullish<string>
  badstanding:     Nullish<boolean>
  supporter:       boolean
  supporter_tier:  number
  verified:        boolean
  league:          UserLeague
  avatar_revision: Nullish<number>
  banner_revision: Nullish<number>
  bio:             Nullish<string>
  Distinguishment: Nullish<UserDistinguishment>
  connections:     UserConnections
  friend_count:    number
}

// can i have have res.data.**user.user**._username please 
interface DataUser
{
  user: User
}

/** Get user object */
export default async function(user: string): Promise<Nullish<User>>
{
  const res = await get<Data<DataUser>>(`users/${user}`)

  if (res?.data?.user) return res.data.user
  else return null
}
