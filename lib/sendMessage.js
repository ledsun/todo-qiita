import Handlebars from 'handlebars'
import streamify from 'stream-array'
import through from 'through2'
import postChatworkMessage from 'post-chatwork-message'
import getRecentItem from './getRecentItem'
import StackStream from './StackStream'
import FormatResultStream from './FormatResultStream'

const APIKey = process.env.CHATWORK_TOKEN,
  roomId = process.env.ROOM_ID,
  DAY = process.env.DAY,
  template = Handlebars.compile(`{{#each bbb}}{{label}} {{user}} {{url}}
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
    .pipe(new FormatResultStream())
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
${template({bbb:stack})}`)
})
