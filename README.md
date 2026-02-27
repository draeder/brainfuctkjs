# brainfuct

A lightweight, fast Brainfuck interpreter written in JavaScript.

## Features

- ✨ Simple and easy-to-use API
- 🚀 Pre-computed bracket matching for efficient loop execution
- 🔄 30,000-cell tape with wraparound support
- 🎯 Full Brainfuck language support
- 🛡️ Error handling for unmatched brackets
- ⏱️ Configurable step limit to prevent infinite loops
- 🔢 Byte output mode for efficient binary data handling
- 📦 Zero dependencies
- ✅ Comprehensive test suite

## Installation

Clone the repository and require it locally:

```bash
git clone https://github.com/draeder/brainfuct.git
cd brainfuct
```

## Usage

```javascript
const brainfuck = require('brainfuctkjs');

// Hello World program
const code = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';
const output = brainfuck(code);
console.log(output); // "Hello World!\n"

// With input
const cat = ',[.,]';
const result = brainfuck(cat, 'hello');
console.log(result); // "hello"

// With step limit (safe for untrusted code)
try {
  brainfuck('+[+]', '', { maxSteps: 10000 }); // Throws after 10k steps
} catch (e) {
  console.error('Infinite loop prevented:', e.message);
}

// Byte output for binary data
const bytes = brainfuck.bytes('++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.', '');
console.log(bytes); // Uint8Array [72, 101, ...]
```

## API

### `brainfuck(code, [input], [opts])`

Executes Brainfuck code and returns the output as a string.

**Parameters:**
- `code` (string): The Brainfuck source code to execute
- `input` (string, optional): Input string consumed by `,` instructions. Defaults to empty string.
- `opts` (object, optional): Options object
  - `maxSteps` (number): Maximum number of steps before throwing. Defaults to 1,000,000.

**Returns:**
- (string): The output produced by `.` instructions

**Throws:**
- Error if brackets are unmatched
- Error if step limit is exceeded

### `brainfuck.bytes(code, [input], [opts])`

Executes Brainfuck code and returns the output as a Uint8Array. More efficient for binary data and avoids UTF-16 string overhead.

**Parameters:**
- `code` (string): The Brainfuck source code to execute
- `input` (string, optional): Input string consumed by `,` instructions. Defaults to empty string.
- `opts` (object, optional): Options object
  - `maxSteps` (number): Maximum number of steps before throwing. Defaults to 1,000,000.
  - `maxOutput` (number): Maximum output bytes before throwing. Defaults to 1,000,000.
  - `onOutput` (function): Optional callback called with each output byte.

**Returns:**
- (Uint8Array): The output bytes produced by `.` instructions

**Throws:**
- Error if brackets are unmatched
- Error if step limit is exceeded
- Error if output limit is exceeded

## Brainfuck Language Reference

Brainfuck operates on a tape of 30,000 cells, each initialized to 0.

| Command | Description |
|---------|-------------|
| `>` | Move the data pointer one cell to the right |
| `<` | Move the data pointer one cell to the left |
| `+` | Increment the value at the current cell |
| `-` | Decrement the value at the current cell |
| `.` | Output the character at the current cell |
| `,` | Read one character of input into the current cell |
| `[` | Jump to the matching `]` if the current cell is 0 |
| `]` | Jump back to the matching `[` if the current cell is not 0 |

Any other characters are treated as comments and ignored.

## Examples

### Print 'A'
```javascript
brainfuck('+'.repeat(65) + '.'); // "A"
```

### Echo input
```javascript
brainfuck(',[.,]', 'test'); // "test"
```

### Multiplication (2 × 5 = 10)
```javascript
// Cell 0 = 2, loop adds 5 to cell 1 for each count in cell 0
brainfuck('++[->+++++<]>.')  // Outputs character with ASCII value 10
```

### Safe execution for genetic algorithms / evolution
```javascript
// Evaluate untrusted code safely with step limit
function evaluateFitness(code, testInput) {
  try {
    const output = brainfuck.bytes(code, testInput, { 
      maxSteps: 50000  // Prevent runaway evolution
    });
    return calculateScore(output);
  } catch (e) {
    return 0; // Failed programs get zero fitness
  }
}

// Stream output for real-time monitoring
const outputBytes = [];
brainfuck.bytes(code, input, {
  maxSteps: 100000,
  onOutput: (byte) => {
    outputBytes.push(byte);
    console.log('Output byte:', byte);
  }
});
```

## Implementation Details

- **Tape size**: 30,000 cells (Uint8Array)
- **Cell values**: 0-255 (wraps on overflow/underflow)
- **Pointer behavior**: Wraps around at both ends of the tape
- **Input handling**: Returns 0 when input is exhausted
- **Performance**: Bracket matching is pre-computed for O(1) loop jumps
- **Step limit**: Default 1,000,000 steps (configurable)
- **Byte output**: Zero-copy byte array, no UTF-16 string overhead

## Testing

Run the test suite:

```bash
npm test
```

The project includes comprehensive tests covering:
- Basic operations
- Cell value wrapping
- Input/output handling
- Loop execution
- Error handling
- Complex programs (Hello World, cat)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Resources

- [Brainfuck on Wikipedia](https://en.wikipedia.org/wiki/Brainfuck)
- [Brainfuck on Esolangs](https://esolangs.org/wiki/Brainfuck)