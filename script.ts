class Calculator {
  state = {
    a: 0,
    b: 0,
    score: 0,
  };

  methods: { [key: string]: (a: number, b: number) => number } = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => (a / b) * 100,
  };

  operate(a: number, b: number, operator: string) {
    this.state.a = a;
    this.state.b = b;
    this.state.score = this.methods[operator](a, b);
  }
}

const calculator = new Calculator();

calculator.operate(2, 4, '+');
