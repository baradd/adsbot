const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const QRterminal = require('qrcode-terminal');

// const client = new Client({
//   authStrategy: new LocalAuth(),
//   // puppeteer: { headless: true },
// });
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox'],
  },
});
client.initialize();

client.on('qr', async (qr) => {
  //   console.log(qr);
  QRterminal.generate(qr, { small: true });
});

client.on('loading_screen', (percent, message) => {
  console.log('LOADING SCREEN', percent, message);
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

client.on('auth_failure', (msg) => {
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('READY');
});

client.on('message', async (msg) => {
  // if (msg.from == '989390141573@c.us') {
  if (msg.body == 'send') {
    let media = MessageMedia.fromFilePath(`${__dirname}/mohammad.jpg`);
    let caption =
      'لباس هاتو خودت بباف !!!🧶\n آموزشگاه بافتنی هنر بافت هنر جو میپذیرد.\nآموزش بافت انواع لباس و عروسک 🧸👚\nمدرس: فاطمه امیدوار\n☎: 09392936745\nTelegram: t.me/honarhayebaft\nInstagram: instagram.com/fateme_omidvar4646';
    let sentCounter = await sendMessages2(media, caption);
    console.log(`${sentCounter} Messages have been sent successfuly`);
  }
  // } else {
  //   client.sendMessage(msg.from, 'Do not reply please');
  // }
});

client.on('message_ack', (msg, ack) => {
  /*
          == ACK VALUES ==
          ACK_ERROR: -1
          ACK_PENDING: 0
          ACK_SERVER: 1
          ACK_DEVICE: 2
          ACK_READ: 3
          ACK_PLAYED: 4
      */

  if (ack == 3) {
    // The message was read
  }
});

client.on('change_state', (state) => {
  console.log('CHANGE STATE', state);
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

const sendMessages = async (media, caption) => {
  let sentCounter = 0;
  let files = fs.readdirSync(`${__dirname}/numbers/wanumbers`);
  files.forEach(async (fileName) => {
    if (fileName.includes('.txt')) {
      let fileContent = fs.readFileSync(
        `${__dirname}/numbers/wanumbers/${fileName}`,
        {
          encoding: 'utf-8',
        }
      );
      fileContent.split(/\r?\n/).forEach(async (line) => {
        let delayPromise = new Promise((resolve, reject) => {
          sentCounter++;
          setTimeout(() => {
            // client.sendMessage(line, caption);
            console.log(line);
            console.log(sentCounter);
            resolve('sent');
          }, 10000 * sentCounter);
        });
        await delayPromise;
      });
    }
    return sentCounter;
  });
};

let sendMessages2 = async (media, caption) => {
  return new Promise((resolve, reject) => {
    let sentCounter = 0;
    let files = fs.readdirSync(`${__dirname}/numbers/wanumbers`);
    let fileName = files[0];
    if (fileName.includes('.txt')) {
      let fileContent = fs.readFileSync(
        `${__dirname}/numbers/wanumbers/${fileName}`,
        {
          encoding: 'utf-8',
        }
      );
      fileContent.split(/\r?\n/).forEach(async (line, j) => {
        sentCounter++;
        setTimeout(() => {
          if (line != null && line != '' && line != ' ') {
            client.sendMessage(line, caption);
          }
          if (j == fileContent.split(/\r?\n/).length - 1) {
            fs.rmSync(`${__dirname}/numbers/wanumbers/${fileName}`);
            resolve(sentCounter);
          }
        }, 10000 * sentCounter);
      });
    }
  });
};
