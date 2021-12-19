import test from 'ava';

import * as expected from '../mock/expected/index.js';
import SentenceParser from '../src/SentenceParser.js';

function stepTest(num) {
  test(`Step ${num}`, (t) => {
    const step = new SentenceParser(num).parse();
    t.deepEqual(step, expected[`step_${num}`]);
  });
}

[1, 2, 3, 4, 5, 6, 7].forEach(stepTest);
