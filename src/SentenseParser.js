const fs = require('fs');

class SentenseParser {
  sentenseType = 1;

  constructor(sentenseType = 1) {
    this.sentenseType = sentenseType;
  }

  chatLoader() {
    try {
      return fs.readFileSync(`./mock/step_${this.sentenseType}.txt`, 'utf8');
    } catch (err) {
      console.error(err);
    }

    return;
  }

  defaultStrToObj(line) {
    const regexp = new RegExp(
      /([0-9]{2}\:[0-9]{2}\:[0-9]{2}) ((.+?\:)|Customer|Agent) (.+)/gi,
    );
    const matches = regexp.exec(line);

    if (!matches) return null;

    const mention = `${matches[1]} ${matches[2] || matches[3]} `;
    const type = (
      ['Customer', 'Agent'].find((el) => mention.includes(el)) || 'Customer'
    ).toLowerCase();

    return {
      date: matches?.[1],
      mention,
      sentense: matches?.[4],
      type,
    };
  }

  hasRegexp(regexp, line) {
    const matches = new RegExp(regexp).exec(line);
    return !!matches && !!matches.length;
  }

  sentenseSplitByDate(line) {
    const regexpDateSameLine = /(\.[0-9]{2}\:[0-9]{2}\:[0-9]{2})/gi;

    if (!this.hasRegexp(regexpDateSameLine, line)) return [line];

    // Split sensente when found thins like this in the same line:
    // .00:00:00

    let matchIndex;
    let lastIndex = 0;
    let newLine = line;
    const senstenseSplitted = [];
    while ((matchIndex = newLine.search(regexpDateSameLine))) {
      if (lastIndex === -1) break;

      newLine = line.substring(
        lastIndex,
        matchIndex > -1 ? matchIndex : undefined,
      );

      // rm first char if === "."
      if (newLine[0] === '.') newLine = newLine.substring(1);

      lastIndex = matchIndex;
      senstenseSplitted.push(newLine);
    }

    return senstenseSplitted;
  }

  sentenseStrToObj(line) {
    const lineSplittedByDate = this.sentenseSplitByDate(line);
    const sentensesObj = lineSplittedByDate.map((l) => this.defaultStrToObj(l));

    // Filter empty lines
    return sentensesObj.filter((obj) => !!obj && typeof obj === 'object');
  }

  parse() {
    const chatText = this.chatLoader();
    let chatTextSplitted;

    chatTextSplitted = chatText
      .split('\n')
      .map((line) => this.sentenseStrToObj(line))
      .flat();

    return chatTextSplitted;
  }

  splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];
}

module.exports = SentenseParser;
