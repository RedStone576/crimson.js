# crimson.js

my attempt at building a library for interacting with both main tetr.io api and tetra channel.  
use an approved bot account btw

initial ribbon code is stolen from [craftxbox/Autohost](https://github.com/craftxbox/Autohost), forked from [Zudo/autohost](https://gitlab.com/Zudo/autohost)  
shout out to them !!

---

- [my discord server](https://discord.gg/C2qHe7F) - in case you're interested 
- [tetr.io bot docs](https://github.com/Poyo-SSB/tetrio-bot-docs) - unofficial main game api docs, slightly outdated but still relevant
- [tetra channel api docs](https://tetr.io/about/api) - for ch.tetr.io
- [npm](https://www.npmjs.com/package/crimson.js) - npm page

---

### how to build

- install typescript
- run `npm install` or `npm install --production=false`
- then run `tsc` and it will emits those source files to `./out/` 
- bundle them by running `npx run bundle`
- it should bundle all of the files into `./dist/`
  
this thing is still pretty messy so any contribution (especially for ideas on naming things) is appreciated.  
  
some current examples: [./demo/](./demo/)
