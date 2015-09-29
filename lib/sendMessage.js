import {
  Writable
}
from 'stream'
import Handlebars from 'handlebars'
import streamify from 'stream-array'
import through from 'through2'
import getRecentItem from './getRecentItem'
import postChatworkMessage from 'post-chatwork-message'

const APIKey = process.env.CHATWORK_TOKEN,
  roomId = process.env.ROOM_ID,
  DAY = process.env.DAY,
  template = Handlebars.compile(`{{#each bbb}}{{label}} {{user}}
{{/each}}`)

let stack = [],
  chatworkWritable = new Writable({
    objectMode: true,
    write: function(chunk, encoding, next) {
      stack.push(chunk)

      next()
    }
  })

chatworkWritable.on('finish', () => {
  stack.sort((a, b) => {
    if (a.date < b.date)
      return -1;
    if (b.date < a.date)
      return 1;
    return 0;
  })

  postChatworkMessage(APIKey, roomId, `Qiitaにブログ書いでねぇ、わりいごはいねえがー(devil)
http://qiita.com/organizations/luxiar
${template({bbb:stack})}`)
})

if (new Date().getUTCDay().toString() === DAY) {
  streamify(['ledsun', 'aiyu427', 'hokutosei', 'mtsuge', 'Hyper_Idol_Singer', 'yusuke-matsuda', 'kurubushionline'])
    .pipe(through.obj(function(chunk, enc, callback) {
      getRecentItem(chunk, (user, recent) => {
        this.push({
          user: user,
          item: recent
        })
        callback()
      })
    }))
    .pipe(through.obj(function(chunk, enc, callback) {
      let createdAt = chunk.item.created_at,
        date = new Date(createdAt)

      this.push({
        user: chunk.user,
        date: date,
        label: `${date.getMonth() + 1}/${date.getDate()}`
      })
      callback()
    }))
    .pipe(chatworkWritable)
}
