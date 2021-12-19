import fs from 'fs';
import chalk from 'chalk';

/**
 * Class for parsing the sentense and return {array} of {object}
 *
 * Usage:
 * new SentenseParser(<sentenseTypeNumber>).parse();
 *
 * @constructor @param {number} sentenseTypeNumber
 */
class SentenseParser {
  sentenseType = 1;

  constructor(sentenseType = 1) {
    this.sentenseType = sentenseType;
  }

  /**
   * Main method that retrieves array of structured objects
   * @returns {array} of objects
   */
  parse() {
    const chatText = this.chatLoader();
    let chatTextSplitted;

    chatTextSplitted = chatText
      .split('\n')
      .map((line) => this.sentenseStrToObj(line))
      .flat();

    return chatTextSplitted;
  }

  /**
   * Parse line and return array of structured objects
   * @param {string} line chat text line
   * @returns {array} of objects
   */
  sentenseStrToObj(line) {
    const lineSplittedByDate = this.sentenseSplitByDate(line);
    const sentensesObj = lineSplittedByDate.map((l) => this.defaultStrToObj(l));

    // Filter empty sentenses lines
    return sentensesObj.filter((obj) => !!obj && typeof obj === 'object');
  }

  /**
   * Split sentense if has multiple Dates
   * @param {string} line    chat text line
   * @returns {array}       array of splitted strings
   */
  sentenseSplitByDate(line) {
    const regexpDateSameLine = /(\.[0-9]{2}\:[0-9]{2}\:[0-9]{2})/gi;

    if (!this.hasRegexp(line, regexpDateSameLine)) return [line];

    // Split sensente for multiple date in the same line:
    // .00:00:00

    let matchIndex;
    let lastIndex = 0;
    let newLine = line;
    const senstenseSplitted = [];
    do {
      if (lastIndex === -1) break;

      newLine = line.substring(
        lastIndex,
        matchIndex > -1 ? matchIndex : undefined,
      );

      // rm first char if === "."
      if (newLine[0] === '.') newLine = newLine.substring(1);

      lastIndex = matchIndex;
      senstenseSplitted.push(newLine);
    } while ((matchIndex = newLine.search(regexpDateSameLine)));

    return senstenseSplitted;
  }

  /**
   * Parse chatText line and retrieve an object with structured data
   * @param {string} line chat text line
   * @returns {object}
   */
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
      date: matches[1],
      mention,
      sentense: matches[4],
      type,
    };
  }

  /**
   * Check if given string contains regexp
   * @param {string} str      chat text line or equivalent string
   * @param {RegExp} regexp   regexp to search
   * @returns {boolean}
   */
  hasRegexp(str, regexp) {
    const matches = new RegExp(regexp).exec(str);
    return !!matches && !!matches.length;
  }

  /**
   * Load chat text from file
   * @returns {string} content
   */
  chatLoader() {
    try {
      const loadedChat = fs.readFileSync(
        `./mock/step_${this.sentenseType}.txt`,
        'utf8',
      );
      console.log(`${chalk.black.bgCyan('Mocked chat:')} 💬`);
      console.log(chalk.cyan(`-------\n${loadedChat}\n-------`));
      return loadedChat;
    } catch (err) {
      console.error(chalk.red(`${err}`));
    }

    return;
  }
}

export default SentenseParser;
