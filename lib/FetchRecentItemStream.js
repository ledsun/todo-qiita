import {
  Transform
}
from 'stream'
import getRecentItem from './getRecentItem'

export default class extends Transform {
  constructor() {
    super({
      objectMode: true
    })
  }
  _transform(chunk, config, next) {
    getRecentItem(chunk, (user, recent) => {
      this.push({
        user: user,
        item: recent
      })

      next()
    })
  }
}
