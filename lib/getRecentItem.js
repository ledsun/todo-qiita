import request from 'superagent'

export default function(user, done) {
  request
    .get(`http://qiita.com/api/v2/users/${user}/items?page=1&per_page=1`)
    .end((err, res) => {
      if (!err) {
        let recent = res.body[0]

        if (recent) {
          done(user, recent)
        }
      } else {
        if (res.status === 404)
          console.error('user not found', user)
        else
          console.error('network err', err)
      }
    })
}
