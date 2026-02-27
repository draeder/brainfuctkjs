import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import brainfuck from '../index.js';

describe('brainfuck interpreter', () => {
  it('outputs a single character via .', () => {
    // Set cell 0 to 65 ('A') then print it.
    const code = '+'.repeat(65) + '.';
    assert.equal(brainfuck(code), 'A');
  });

  it('> and < move the data pointer', () => {
    // Put 72 in cell 0, move right, put 105 in cell 1, print both.
    const code = '+'.repeat(72) + '.>' + '+'.repeat(105) + '.<';
    assert.equal(brainfuck(code), 'Hi');
  });

  it('wraps cell values on overflow (+ past 255 -> 0)', () => {
    // 256 increments should wrap cell back to 0; add 66 -> 'B'.
    const code = '+'.repeat(256) + '+'.repeat(66) + '.';
    assert.equal(brainfuck(code), 'B');
  });

  it('wraps cell values on underflow (- below 0 -> 255)', () => {
    // Decrement from 0 should give 255.
    const code = '-.';
    assert.equal(brainfuck(code), String.fromCharCode(255));
  });

  it(', reads input into the current cell', () => {
    // Read a character from input and immediately print it.
    assert.equal(brainfuck(',.', 'Z'), 'Z');
  });

  it('[] loop: skips loop body when cell is zero', () => {
    // Cell 0 is 0, so the loop body should be skipped entirely.
    const code = '[++++++++++]' + '+'.repeat(65) + '.';
    assert.equal(brainfuck(code), 'A');
  });

  it('[] loop: repeats until cell reaches zero', () => {
    // Use a loop to add 5+5 = 10 (ASCII '\n'):
    // cell 0 = 2, loop: each iteration adds 5 to cell 1 and decrements cell 0
    // Result: cell 1 = 10 = '\n'
    const code = '++[->+++++<]>.';
    assert.equal(brainfuck(code), String.fromCharCode(10));
  });

  it('produces "Hello World!" output', () => {
    const helloWorld =
      '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]' +
      '>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
    assert.equal(brainfuck(helloWorld), 'Hello World!\n');
  });

  it('cat program: copies input to output', () => {
    // Simple cat: read and print each character until input is exhausted.
    // When , returns 0 (EOF), the loop exits.
    const cat = ',[.,]';
    assert.equal(brainfuck(cat, 'hello'), 'hello');
  });

  it('throws on unmatched [', () => {
    assert.throws(() => brainfuck('['), /Unmatched '\['/);
  });

  it('throws on unmatched ]', () => {
    assert.throws(() => brainfuck(']'), /Unmatched '\]'/);
  });

  it('ignores non-command characters (comments)', () => {
    const code = 'This is a comment\n' + '+'.repeat(65) + '.';
    assert.equal(brainfuck(code), 'A');
  });

  it('tape pointer wraps around at both ends', () => {
    // Move left from cell 0 should wrap to last cell.
    const code = '<' + '+'.repeat(66) + '.>';
    assert.equal(brainfuck(code), 'B');
  });
});
