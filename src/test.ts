class Test
{
  private session: {
    id?: number
  }

  constructor()
  {
    this.session = {}
  }

  spawn(id: number): void
  {
    this.session.id = id
    
    this.run(() =>
    {
      console.log(this.session.id! > 1)
      console.log(this.session.id)
    })
  }

  run(fn: any): void
  {
    fn() // do something
  }
}

const h = new Test()
.spawn(2)
