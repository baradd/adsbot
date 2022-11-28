const fs = require('fs');

const generateWhatsAppNumbers = (async () => {
  let files = fs.readdirSync(`${__dirname}/numbers`);
  files.forEach((fileName) => {
    if (fileName.includes('.txt')) {
      let fileContent = fs.readFileSync(`${__dirname}/numbers/${fileName}`, {
        encoding: 'utf-8',
      });

      fileContent.split(/\r?\n/).forEach((line) => {
        let number = line.slice(1, line.length);
        fs.appendFileSync(
          `${__dirname}/numbers/wanumbers/${fileName}`,
          `98${number}@c.us\n`,
          {
            encoding: 'utf-8',
          }
        );
      });
    }
  });
})();
