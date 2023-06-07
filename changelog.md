# Changelog

## still-not-0.0.5-dev
- getRibbonVersion -> getRibbonSignature
- created half baked `src/model/relationship.ts`  
  basically an event emitter + the tetrio social interface  
  so you **will** able to do stuff like  
  ```js
  client.relationship.add("<userID>")
  client.relationship.remove("<userID>")
  client.relationship.block("<userID>")
  
  client.relationship.on("dm", () => {})
  // ... etc idk im not done with these
  ```
- created monkey made `src/model/room.ts`  
  same thing but for the room  
  ```js
  client.room.code // get the room code
  client.room.updateConfig({ ... })
  client.room.on("chat", () => {})
  // ...
  ```
- created `src/util/`
- almost create a logger for debugging things but im too tired
- also almost create some rest user actions on `src/api/game/`


## 0.0.4-dev
- write later


## 0.0.3-dev
- write later


## 0.0.2-dev
- write later


## 0.0.1-dev
- bing bang
