import { get, Nullish } from "./get"

interface RecordUser
{
  _id:      string
  username: string
}

interface Record
{
  _id:        string
  stream:     string
  replayid:   string
  user:       RecordUser
  ts:         string
  ismulti:    Nullish<boolean>
  endcontext: any | any[] /* any for now cuz this things can always change */
}

interface RecordsGamemodes_
{
  record: Record
  rank:   Nullish<number>
}

interface RecordsGamemodes
{
  "40l": Nullish<RecordsGamemodes_>
  blitz: Nullish<RecordsGamemodes_>
}

interface RecordZen
{
  level: number
  score: number
}

interface UserRecords
{
  records: RecordsGamemodes
  zen:     RecordZen
}

/** Get user recent records object */
export default async function getUserRecords(user: string): Promise<Nullish<UserRecords>>
{
  const res = await get<UserRecords>(`users/${user}/records`)

  if (res?.data) return res.data
  else return null
}
