# ⚠️ USE [TRIANGLE.JS](https://github.com/Genius6942/triangle) (@haelp/teto) INSTEAD

# Crimson.js 

A Node.js library for tetr.​io and ch.​tetr.​io, asynchronous and typed (well, mostly)

> **Warning**  
> 
> this library is still in heavy development. although useable, very fragile.  
> tetr.io is still in alpha, any new updates to the game have a chance to break the library if it goes unnoticed.  
> use an authorized bot account if you're trying to connect to the gateway or interact with the main game api!  

## Module Exports 
- `Client` the main guy
- `api` wrapper around the rest api
  - `channel` tetra channel
  - `game` main game
- `CONSTANTS` bunch of enum-dictionary-like helper object
- `Types` bonus, typings for stuff like ribbon messaging, room config schema, etc 

## Current Example
```ts
// test.ts - connect to gateway
import { Client, CONSTANTS } from "crimson.js"

const session = new Client("<token>")

session.events.on(CONSTANTS.EVENTS_TYPES.SESSION_READY, (endpoint) => 
{
  console.log("ready!")
  console.log(`connected to ${endpoint} as ${client.user.username}`)
})

session.login()
```

## Building

- `λ npm install --production=false` locally install the dependencies, ts, tsup, and other dev dependencies
- `λ tsc` and emits the transpiled codes to `./out/`
- `λ npx run bundle` and emits the bundled cjs, esm, and dts codes to `./dist/`
- `λ npx run docs` to build the auto-generated docs and emits it to `./docs/`
- `λ npx install -S` in a testing directory with `"crimson.js": "file:<lib dir rel path>"` in `package.json` dependencies field

## Links

- [my personal discord guild](https://discord.gg/C2qHe7F)
- [or the newly established dev-oriented tetr.io community guild](https://discord.gg/qgrw5J7q8k) (recommended)
- [unofficial tetr.io bot docs](https://github.com/Poyo-SSB/tetrio-bot-docs) (slightly outdated but still relevant)
- [tetra channel api docs](https://tetr.io/about/api)
- [npm](https://www.npmjs.com/package/crimson.js)

## Contributing
Pull requests, open issues, or just a direct messages for any new ideas (especially with structuring the api and naming things) is all appreciated!

## Acknowledgements
- osk, obviously, for creating tetr.​io
- Zudo, for open sourcing the [original](https://github.com/ZudoB/Autohost/tree/main/server) Autohost source code
- craftxbox, for [continuing](https://github.com/craftxbox/Autohost) Autohost development

## License
Distributed under the [Artistic License 2.0](https://www.perlfoundation.org/artistic-license-20.html) with <3
