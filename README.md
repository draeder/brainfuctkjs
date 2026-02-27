# brainfuctkjs

A lightweight, fast Brainfuck interpreter written in JavaScript.

## Features

- ✨ Simple and easy-to-use API
- 🚀 Pre-computed bracket matching for efficient loop execution
- 🔄 30,000-cell tape with wraparound support
- 🎯 Full Brainfuck language support
- 🛡️ Error handling for unmatched brackets
- 📦 Zero dependencies
- ✅ Comprehensive test suite

## Installation

Clone the repository and require it locally:

```bash
git clone https://github.com/danraeder/brainfuctkjs.git
cd brainfuctkjs
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
```

## API

### `brainfuck(code, [input])`

Executes Brainfuck code and returns the output.

**Parameters:**
- `code` (string): The Brainfuck source code to execute
- `input` (string, optional): Input string consumed by `,` instructions. Defaults to empty string.

**Returns:**
- (string): The output produced by `.` instructions

**Throws:**
- Error if brackets are unmatched

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

## Implementation Details

- **Tape size**: 30,000 cells (Uint8Array)
- **Cell values**: 0-255 (wraps on overflow/underflow)
- **Pointer behavior**: Wraps around at both ends of the tape
- **Input handling**: Returns 0 when input is exhausted
- **Performance**: Bracket matching is pre-computed for O(1) loop jumps

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