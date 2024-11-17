const OPERATIONS = {
  CLEAR_ALL: 'clear-all',
  CLEAR_FIRST: 'clear-first',
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  PERCENTAGE: '%',
  NEGATIVE: 'negative',
  DECIMAL: '.',
  EQUALS: '=',
};

const calculatorContainer = document.getElementById('calculator')!;
const display = calculatorContainer.querySelector('[data-display]')!;
const numberButtons = calculatorContainer.querySelectorAll('[data-number-button]')!;
const operationButtons = calculatorContainer.querySelectorAll('[data-operation-button]')!;

class Calculator {
  state = {
    a: '',
    b: '',
    operator: '',
    totalScore: 0,
    display: '',
    isFirstNumber: true,
  };

  methods: { [key: string]: (a: number, b: number) => number } = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => (a / b) * 100,
  };

  operate() {
    const { a, b, operator } = this.state;
    console.log('a', a);
    console.log('b', b);
    console.log('operator', operator);

    const firstNumber = Number(a);
    const secondNumber = Number(b);

    const score = this.methods[this.state.operator](firstNumber, secondNumber);
    this.state.totalScore = score;
    this.generateDisplayScore(true);
    this.state.a = score.toString();
    this.state.b = '';
  }

  getNumber(num: string) {
    console.log('num', num);
    if (this.state.isFirstNumber) {
      this.state.a += num;
    } else {
      this.state.b += num;
    }

    this.generateDisplayScore();
  }

  getOperator(operator: string) {
    if (this.state.a === '') return;

    switch (operator) {
      case OPERATIONS.EQUALS: {
        this.operate();
        return;
      }
      case OPERATIONS.ADD:
      case OPERATIONS.SUBTRACT:
      case OPERATIONS.MULTIPLY:
      case OPERATIONS.DIVIDE:
      case OPERATIONS.PERCENTAGE: {
        if (this.state.a !== '' && this.state.b !== '' && this.state.operator) {
          this.operate();
        }

        this.state.isFirstNumber = false;
        this.state.operator = operator;
        this.generateDisplayScore();

        return;
      }
      case OPERATIONS.CLEAR_ALL: {
        this.resetAll();
        return;
      }
      case OPERATIONS.DECIMAL: {
        this.addDecimal();
        return;
      }

      default:
        throw new Error('Invalid operation!');
    }
  }

  generateDisplayScore(displayScoreOnly: boolean = false) {
    const { a, b, operator, totalScore } = this.state;

    if (displayScoreOnly) {
      display.textContent = totalScore.toString();
      return;
    }

    display.textContent = `${a.trim()} ${operator.trim()} ${b.trim()}`;
  }

  resetAll() {
    this.state.a = '';
    this.state.b = '';
    this.state.isFirstNumber = true;
    this.state.operator = '';
    this.state.totalScore = 0;
    this.generateDisplayScore(true);
  }

  addDecimal() {
    if (this.state.isFirstNumber) {
      if (this.state.a.includes('.')) return;
      this.state.a += '.';
      this.generateDisplayScore();
    } else {
      if (this.state.b.includes('.')) return;
      this.state.b += '.';
      this.generateDisplayScore();
    }

    console.log('this.state', this.state);
  }
}

const calculator = new Calculator();

numberButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const element = e.target as HTMLElement;

    if (!element.dataset.numberButton) {
      throw new Error('Missing number button data attribute value');
    }

    const btnValue = element.dataset.numberButton;

    calculator.getNumber(btnValue);
  });
});

operationButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const element = e.target as HTMLElement;

    if (!element.dataset.operationButton) {
      throw new Error('Missing value for operation button data attribute');
    }

    const btnValue = element.dataset.operationButton;

    calculator.getOperator(btnValue);
  });
});
