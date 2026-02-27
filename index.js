'use strict';

/**
 * Brainfuck interpreter.
 *
 * @param {string} code   - Brainfuck source code.
 * @param {string} [input=''] - Input string consumed by `,` instructions.
 * @param {object} [opts={}] - Options object.
 * @param {number} [opts.maxSteps=1000000] - Maximum number of steps before throwing.
 * @returns {string} The output produced by `.` instructions.
 */
function brainfuck(code, input = '', opts = {}) {
  const maxSteps = opts.maxSteps ?? 1000000;
  const tape = new Uint8Array(30000);
  let dp = 0;        // data pointer
  let ip = 0;        // instruction pointer
  let inputPos = 0;  // position in input string
  let output = '';
  let steps = 0;     // step counter

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
    if (++steps > maxSteps) {
      throw new Error(`Exceeded maximum step limit of ${maxSteps}`);
    }

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

/**
 * Brainfuck interpreter with byte output.
 *
 * @param {string} code   - Brainfuck source code.
 * @param {string} [input=''] - Input string consumed by `,` instructions.
 * @param {object} [opts={}] - Options object.
 * @param {number} [opts.maxSteps=1000000] - Maximum number of steps before throwing.
 * @param {number} [opts.maxOutput=1000000] - Maximum output bytes before throwing.
 * @param {function} [opts.onOutput] - Optional callback for each output byte.
 * @returns {Uint8Array} The output bytes produced by `.` instructions.
 */
brainfuck.bytes = function(code, input = '', opts = {}) {
  const maxSteps = opts.maxSteps ?? 1000000;
  const maxOutput = opts.maxOutput ?? 1000000;
  const onOutput = opts.onOutput;
  const tape = new Uint8Array(30000);
  let dp = 0;
  let ip = 0;
  let inputPos = 0;
  const output = [];
  let steps = 0;

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
    if (++steps > maxSteps) {
      throw new Error(`Exceeded maximum step limit of ${maxSteps}`);
    }

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
        if (output.length >= maxOutput) {
          throw new Error(`Exceeded maximum output limit of ${maxOutput} bytes`);
        }
        output.push(tape[dp]);
        if (onOutput) onOutput(tape[dp]);
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

  return new Uint8Array(output);
};

module.exports = brainfuck;
