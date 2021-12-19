import fs from 'fs';
import chalk from 'chalk';

/**
 * Class for parsing the sentence and return {array} of {object}
 *
 * Usage:
 * new SentenceParser(<sentenceTypeNumber>).parse();
 *
 * @constructor @param {number} sentenceTypeNumber
 */
class SentenceParser {
  sentenceType = 1;
  sourceContent = '';
  agentsFullName = ['Emanuele Querzola'];

  constructor(type = 1) {
    this.sentenceType = type;
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
      .map((line) => this.sentenceStrToObj(line))
      .flat();

    return chatTextSplitted;
  }

  /**
   * Parse line and return array of structured objects
   * @param {string} line chat text line
   * @returns {array} of objects
   */
  sentenceStrToObj(line) {
    const lineSplittedByDate = this.sentenceSplitByDate(line);
    const sentencesObj = lineSplittedByDate.map((l) => this.defaultStrToObj(l));

    // Filter empty sentences lines
    return sentencesObj.filter((obj) => !!obj && typeof obj === 'object');
  }

  /**
   * Split sentence if has multiple Dates
   * @param {string} line    chat text line
   * @returns {array}       array of splitted strings
   */
  sentenceSplitByDate(line) {
    const regexpDateSameLine = /(\.[0-9]{2}\:[0-9]{2}\:[0-9]{2})/gi;

    if (!this.hasRegexp(line, regexpDateSameLine)) return [line];

    // Split sensente for multiple date in the same line:
    // .00:00:00
    let matchIndex;
    let lastIndex = 0;
    let newLine = line;
    const senstenseSplitted = [];
    while ((matchIndex = newLine.search(regexpDateSameLine))) {
      if (lastIndex === -1) break;

      newLine = line.substring(
        lastIndex,
        matchIndex > -1 ? matchIndex + 1 : undefined,
      );

      // rm first char if === "."
      if (newLine[0] === '.') newLine = newLine.substring(1);

      lastIndex = matchIndex;
      senstenseSplitted.push(newLine);
    }

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

    return {
      date: matches[1],
      mention,
      sentence: matches[4],
      type: this.typePrepare(matches, mention),
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
        `./mock/step_${this.sentenceType}.txt`,
        'utf8',
      );

      this.sourceContent = loadedChat;
      return loadedChat;
    } catch (err) {
      console.error(chalk.red(`${err}`));
    }

    return;
  }

  /**
   * Retrieve sentence type (agent || customer)
   *
   * @param {array} matches regexp matches
   * @param {string} mentionStr mention string
   * @returns {string} type
   */
  typePrepare(matches, mentionStr) {
    let type = 'Customer';
    const mentionPerson = (matches[3] || '').replace(':', '').trim();

    if (
      mentionStr.includes('Agent') ||
      this.agentsFullName.includes(mentionPerson)
    )
      type = 'Agent';

    return type.toLowerCase();
  }
}

export default SentenceParser;
