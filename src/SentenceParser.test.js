import test from 'ava';

import * as expected from '../mock/expected/index.js';
import SentenceParser from '../src/SentenceParser.js';

test('Step 1', (t) => {
  const step = new SentenceParser(1).parse();
  t.deepEqual(step, expected.step_1);
});

test('Step 2', (t) => {
  const step = new SentenceParser(2).parse();
  t.deepEqual(step, expected.step_2);
});

test('Step 3', (t) => {
  const step = new SentenceParser(3).parse();
  t.deepEqual(step, expected.step_3);
});

test('Step 4', (t) => {
  const step = new SentenceParser(4).parse();
  t.deepEqual(step, expected.step_4);
});

test('Step 5', (t) => {
  const step = new SentenceParser(5).parse();
  t.deepEqual(step, expected.step_5);
});

test('Step 6', (t) => {
  const step = new SentenceParser(6).parse();
  t.deepEqual(step, expected.step_6);
});

test('Step 7', (t) => {
  const step = new SentenceParser(7).parse();
  t.deepEqual(step, expected.step_7);
});
