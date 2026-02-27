'use strict';

/**
 * Brainfuck interpreter.
 *
 * @param {string} code   - Brainfuck source code.
 * @param {string} [input=''] - Input string consumed by `,` instructions.
 * @returns {string} The output produced by `.` instructions.
 */
function brainfuck(code, input = '') {
  const tape = new Uint8Array(30000);
  let dp = 0;        // data pointer
  let ip = 0;        // instruction pointer
  let inputPos = 0;  // position in input string
  let output = '';

  // Pre-compute matching bracket positions for efficiency.
  const bracketMap = new Map();
  const stack = [];
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '[') {
      stack.push(i);
    } else if (code[i] === ']') {
      if (stack.length === 0) {
        throw new Error(`Unmatched ']' at position ${i}`);
      }
      const open = stack.pop();
      bracketMap.set(open, i);
      bracketMap.set(i, open);
    }
  }
  if (stack.length > 0) {
    throw new Error(`Unmatched '[' at position ${stack[stack.length - 1]}`);
  }

  while (ip < code.length) {
    const cmd = code[ip];
    switch (cmd) {
      case '>':
        dp = (dp + 1) % tape.length;
        break;
      case '<':
        dp = (dp - 1 + tape.length) % tape.length;
        break;
      case '+':
        tape[dp] = (tape[dp] + 1) & 0xff;
        break;
      case '-':
        tape[dp] = (tape[dp] - 1 + 256) & 0xff;
        break;
      case '.':
        output += String.fromCharCode(tape[dp]);
        break;
      case ',':
        tape[dp] = inputPos < input.length
          ? input.charCodeAt(inputPos++)
          : 0;
        break;
      case '[':
        if (tape[dp] === 0) {
          ip = bracketMap.get(ip);
        }
        break;
      case ']':
        if (tape[dp] !== 0) {
          ip = bracketMap.get(ip);
        }
        break;
      default:
        break;
    }
    ip++;
  }

  return output;
}

module.exports = brainfuck;
