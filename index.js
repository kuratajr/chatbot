var logger = require("morgan");
var http = require("http");
var bodyParser = require("body-parser");
var express = require("express");
const app = express();
const PORT = 3000

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
// var server = http.createServer(app);
var request = require("request");

app.get("/", (req, res) => {
  res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "no-pass-nhe") {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong validation token");
});

// Xử lý khi có người nhắn tin cho bot
app.post("/webhook", function (req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        //If user send text
        if (message.message.text) {
          var text = message.message.text;
          console.log(text); // In tin nhắn người dùng
          console.log(senderId); // In id người dùng
          sendMessage(senderId, "Tui là bot đây: " + text);
          sendMessage(senderId, "How can I help you?");
        }
      }
    }
  }
  res.status(200).send("OK");
});

app.get("/api", (req, res) => {
  res.send("Hello world");
});

app.get("/api/:temp/:humid", function (req, res) {
  sendMessage(
    2546056792138320,
    "BOT: " + req.params.temp + " : " + req.params.humid
  );
  res.status(200).send("OK");
});

app.get("/api/:text", function (req, res) {
  sendMessage(2546056792138320, "BOT: " + req.params.text);
  res.status(200).send("OK");
});

// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  request({
    url: "https://graph.facebook.com/v17.0/me/messages",
    qs: {
      access_token: "EAARynmWpSZCIBO2Bhw3m6dXVtgzZBDdYxNeFIi46JQUJ92HZCG0triOkoTKnu4O2mrnf0D3536jG78jUZBRTNkaPwPozcrKNpgBRINZA6bnZCTveQ6AVrCtYdeNahuGAL1UgnZBtEMWnToSVUArAixBBfra9G4hsZC80wGT2PcHARv5BRdUNOAbtNUdNzpXoXFwFu8VEBh5XWQjG9WHMwQZDZD",
    },
    method: "POST",
    json: {
      recipient: {
        id: senderId,
      },
      message: {
        text: message,
      },
    },
  });
}

app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `)
  })