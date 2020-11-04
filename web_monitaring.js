'use strict';

const https = require('https');
const querystring = require('querystring');

//Slack web API
const SLACK_HOST = 'slack.com';
const SLACK_PATH = '/api/chat.postMessage';
const TOKEN = ''; // 取得したSlackのトークン
const CHANNEL = ''; // 投稿したいチャンネルのコード
const NAME = 'darage_web_monitaring';
const ICON = ':apple:';

function sendSlack(message, context){

    var formData = {
        token: TOKEN,
        channel: CHANNEL,
        text: message,
        icon_emoji: ICON,
        username: NAME,
    };
    var options = {
        hostname: SLACK_HOST,
        path: SLACK_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    };
    var req = https.request(options, function(res){
        res.on('data', function(d) {
            console.log(d + "\n");
        });
    });
    req.write(querystring.stringify(formData));
    req.on('error', function(e){
        console.log("Slackにメッセージを送信できませんでした\n" + e.message);
    });
    req.end();
}



exports.handler = (event, context, callback) => {

    /**
     * paramList
     * host: 検証したいホスト
     * path: 検証したいパス(200が返ってくるところ)
     * auth: Basic認証の"username:password"
     */
    var paramList = new Array(
        { host: 'example.com', path:'', auth: '' },
        { host: 'example.com', path: '/about', auth: '' },
        { host: 'api.fugafuga.jp', path: '/login', auth: 'hogehoge:hogehoge!' }
    );
    var index = 0;

    sendSlack('死活監視');
    function checkAlive(index) {
        var option = paramList[index];
        if(index == paramList.length){
            context.succeed();
            return;
        }
        index++;

        // httpsでリクエストを送ってみる
        var req = https.request(option, function (response) {
            var code = response.statusCode;
            if (code != 200) {
                var message = "\n*【異常】* \n" + option.host + option.path + " は正常なステータスではありません。\n- STATUS CODE " + code;
                console.log(message);
                sendSlack(message, context);
            }
            else{
                var message = option.host + " : " + code;
                console.log(message);
            }
            checkAlive(index);
        });
        req.on('error', function (error) {
            var message = "\n*【エラー】* \n" + option.host + " にリクエストを送信できません";
            message += "\n - ERROR MESSAGE : " + error.message + "\n";
            console.log(message);
            sendSlack(message, context);
            checkAlive(index);
        });
        req.end();
    }

    checkAlive(index);
}
