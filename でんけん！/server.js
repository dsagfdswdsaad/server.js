const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();

// 静的ファイルの配信設定
app.use(express.static(path.join(__dirname, 'public')));

// Expressサーバーを作成
const server = http.createServer(app);

// WebSocketサーバーを作成
const wss = new WebSocket.Server({ server });

// クライアントからの接続があった場合の処理
wss.on('connection', function connection(ws, req) {
  const clientIP = req.connection.remoteAddress;
  console.log('Client connected from IP:', clientIP);

  // クライアントからメッセージを受信した場合の処理
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    console.log('Received message from %s (%s): %s', data.username, clientIP, data.message);

    // メッセージと送信者の名前を全てのクライアントに送信する
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          username: data.username,
          message: data.message
        }));
      }
    });
  });

  // クライアントが切断した場合の処理
  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});

// Expressサーバーを起動
server.listen(3000, function listening() {
  console.log('Server listening on port 3000');
});
