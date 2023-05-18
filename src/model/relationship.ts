import EventEmitter     from "events"
import { TypedEmitter } from "./emitter"

type Events = {
  "h": {}
}

const eventsMap = {

}

/** tetr.io social interface */
// not a standalone class
export default class Relationship extends (EventEmitter as { new (): TypedEmitter<Events> })
{
  // map users to their corresponding id
  private userMap: Map<string, string>

  constructor()
  {
    super()

    this.userMap = new Map()
  }

  /** @hidden */
  bindEvent(event: any)
  {
    //events

    //do later
  }

  getUser()
  {}

  fetchMessages()
  {}
}
