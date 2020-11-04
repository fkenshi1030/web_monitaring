# 死活監視の結果をSlackに通知させるもの

## 事前準備
- 通知先チャンネルのコード取得
取得方法
任意のチャンネルに含まれる以下の部分<br>
https://app.slack.com/client/xxxx/C01EBQQ4YGH/<br>
チャンネルコード:C01EBQQ4YGH


- SlackAPI Tokenの取得<br>
以下のサイトからcreate new appにて作成<br>
https://api.slack.com/apps

- Slack Bot作成<br>
 Add features and functionality→Botsにて作成
 
- 権限設定
 Add features and functionality→Permissionsにて作成
  - scope
    - chat:writeを選択

