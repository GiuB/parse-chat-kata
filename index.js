const inquirer = require('inquirer');
const SentenseParser = require('./src/SentenseParser');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'sentenseType',
      message: 'Choose sentense parser',
      choices: [
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
    console.log(new SentenseParser(answers.sentenseType).parse());
  })
  .catch((error) => {
    console.log({ error });
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
