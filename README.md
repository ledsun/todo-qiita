# これは？
Qiita への投稿を促すリマインダーです。

# 仕組みは？

Heroku Scehulerを使ってチャットワークに通知しています。
詳しくは[Heroku Schedulerを使ってChatworkに定期ポストする - Qiita](http://qiita.com/ledsun/items/81d47d934f859a4a8a6b)をみてください。

Heroku Scehulerは毎日、毎時、10分毎しか選べません。
スクリプト内で曜日によって通知するか判定しています。

# 設定方法
## 通知内容
bin/sendMessage内に直接書いてあります。
編集してdeployしてください。

## 通知時刻
Heroku Schedulerの設定で変更します。

```
heroku addons:open scheduler
```

## 通知曜日
環境変数で設定します。
0が日曜日で、1が月曜日です。

```
heroku config:set DAY=3
```

## 通知先チャットルーム
環境変数で設定します。

```
heroku config:set ROOM_ID=18211191
```

## Chatwork token
環境変数で設定します。

```
heroku config:set CHATWORK_TOKEN=xxx
```

# 開発

ローカルでテスト実行するには

```
env DAY=3 CHATWORK_TOKEN=xxx ROOM_ID=18211191 node bin/sendMessage
```
