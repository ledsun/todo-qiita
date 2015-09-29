import Handlebars from 'handlebars'
import streamify from 'stream-array'
import through from 'through2'
import postChatworkMessage from 'post-chatwork-message'
import getRecentItem from './getRecentItem'
import StackStream from './StackStream'

const APIKey = process.env.CHATWORK_TOKEN,
  roomId = process.env.ROOM_ID,
  DAY = process.env.DAY,
  template = Handlebars.compile(`{{#each bbb}}{{label}} {{user}}
{{/each}}`)

let stack = [],
  stackStream = new StackStream(stack)

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
      let date = new Date(chunk.item.created_at)

      this.push({
        user: chunk.user,
        date: date,
        label: `${date.getMonth() + 1}/${date.getDate()}`
      })
      callback()
    }))
    .pipe(stackStream)
}

stackStream.on('finish', () => {
  stack.sort((a, b) => {
    if (a.date < b.date)
      return -1;
    if (b.date < a.date)
      return 1;
    return 0;
  })

  postChatworkMessage(APIKey, roomId, `Qiitaにブログ書いた最後の日だー(devil)
http://qiita.com/organizations/luxiar
${template({bbb:stack})}`)
})
