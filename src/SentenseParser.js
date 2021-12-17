const fs = require('fs');

class SentenseParser {
  sentenseType = 1;

  constructor(sentenseType = 1) {
    this.sentenseType = sentenseType;
  }

  fileParser() {
    try {
      return fs.readFileSync(`./mock/step_${this.sentenseType}.txt`, 'utf8');
    } catch (err) {
      console.error(err);
    }

    return;
  }

  sentenseStrToObj(line) {
    const regexp = new RegExp(
      /([0-9]{2}\:[0-9]{2}\:[0-9]{2}) (Customer \:|Agent \:) (.+)/gi,
    );
    const matches = regexp.exec(line);

    if (!matches) return null;

    return {
      date: matches?.[1],
      mention: `${matches?.[1]} ${matches?.[2]}`,
      sentense: matches?.[3],
      type: matches?.[2].toLowerCase().replace(/\:|\s/g, ''),
    };
  }

  parse() {
    const fileData = this.fileParser();
    const jsonData = fileData
      .split('\n')
      .map((line) => this.sentenseStrToObj(line));

    return jsonData;
  }
}

module.exports = SentenseParser;
