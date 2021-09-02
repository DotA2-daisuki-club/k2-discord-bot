# k2-discord-bot
discordの身内鯖で稼働するおもちゃbot

機能の追加はいつでも歓迎です( botのtokenは[ohyama4z](https://github.com/ohyama4z)に聞いてください )

# 機能一覧
## `/gazou`
ランダムで画像を1枚吐きます
```
/gazou [options]
```
### options
```
channel={channel_name}
/gazou channel=k2
```
画像を取ってくるチャンネルを指定する。
デフォルトでは`src/const.ts`の`GAZOU_CHANNEL_ID`で指定されたIDのチャンネルとなる。
