import {
  Transform
}
from 'stream'

export default class extends Transform {
  constructor() {
    super({
      objectMode: true
    })
  }
  _transform(chunk, config, next) {
    let date = new Date(chunk.item.created_at)

    this.push({
      user: chunk.user,
      date: date,
      url: chunk.item.url,
      label: `${date.getMonth() + 1}/${date.getDate()}`
    })

    next()
  }
}
