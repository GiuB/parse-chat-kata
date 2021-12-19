import chalk from 'chalk';
import inquirer from 'inquirer';

import SentenseParser from './src/SentenseParser.js';

inquirer
  .prompt([
    {
      type: 'list',
      name: 'sentenseType',
      message: 'Choose sentense parser',
      choices: [
        { name: 'Step 0 (WRONG)', value: 0 },
        { name: 'Step 1 (single sentence)', value: 1 },
        { name: 'Step 2 (two sentences)', value: 2 },
        { name: 'Step 3 (two customer mentions as start)', value: 3 },
        { name: 'Step 4 (date splitting)', value: 4 },
        { name: 'Step 5 (ignore extra dates)', value: 5 },
        { name: 'Step 6 (full name)', value: 6 },
        { name: 'Step 7 [Extra] (missing colon after the names)', value: 7 },
      ],
    },
  ])
  .then((answers) => {
    const sentenseParsed = new SentenseParser(answers.sentenseType).parse();

    console.log(chalk.black.bgGreen('Parsed:') + ' 🤖');
    console.log(sentenseParsed);
  })
  .catch((error) => {
    let errOutput;

    if (error.isTtyError)
      errOutput = "Prompt couldn't be rendered in the current environment";
    else errOutput = `Something went wrong, details: ${error}`;

    console.error(chalk.red(errOutput));
  });
