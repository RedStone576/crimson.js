import fetch from "node-fetch"

export default async function (token: string, spool: any): Promise<any>
{
  let res: any = await fetch(encodeURI("https://" + spool + "/spool"), {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "User-Agent": "v8/001",
      "Accept": "application/json"
    }
  })

  res = await res.arrayBuffer()
  res = new Uint8Array(res)
    
  let despool = {
    version:    res[0],
    load1:      res[2],
    load5:      res[3],
    load15:     res[4],
    online:     ((res[1] & 0b10000000) >> 7) === 1,
    overloaded: ((res[1] & 0b01000000) >> 6) === 1,
    cold:       ((res[1] & 0b00100000) >> 5) === 1,
    reserved1:  ((res[1] & 0b00010000) >> 4) === 1,
    reserved2:  ((res[1] & 0b00001000) >> 3) === 1,
    reserved3:  ((res[1] & 0b00000100) >> 2) === 1,
    reserved4:  ((res[1] & 0b00000010) >> 1) === 1,
    reserved5:  ((res[1] & 0b00000001) >> 0) === 1,
  }
  
  return despool
}
