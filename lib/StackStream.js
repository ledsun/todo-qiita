import {
  Writable
}
from 'stream'

export default class extends Writable {
  constructor(stack) {
    super({
      objectMode: true
    })

    this._stack = stack
  }
  _write(chunk, encoding, next) {
    this._stack.push(chunk)
    next()
  }
}
