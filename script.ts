// https://stackoverflow.com/questions/54416318/how-to-make-a-undo-redo-function

interface IState {
  a: string;
  b: string;
  operator: string;
  totalScore: number;
  display: string;
  isFirstNumber: boolean;
}

const OPERATIONS = {
  CLEAR_ALL: 'clear-all',
  CLEAR_FIRST: 'clear-last',
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  PERCENTAGE: '%',
  TOGGLE_SIGN: 'toggle-sign',
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

  getCurrentOperand() {
    return this.state.isFirstNumber ? 'a' : 'b';
  }

  operate() {
    const { a, b, operator } = this.state;

    const firstNumber = Number(a);
    const secondNumber = Number(b);

    if (operator === OPERATIONS.DIVIDE && secondNumber === 0) {
      alert('Division by 0 is not allowed');
      return;
    }

    const score = this.methods[this.state.operator](firstNumber, secondNumber);
    this.state.totalScore = score;
    this.generateDisplayScore(true);
    this.state.a = score.toString();
    this.state.b = '';
  }

  getNumber(num: string) {
    const operand = this.getCurrentOperand();

    this.state[operand] += num;

    this.generateDisplayScore();
  }

  toggleNumberSign() {
    const currentOperand = this.getCurrentOperand();

    if (this.state[currentOperand].startsWith('-')) {
      this.state[currentOperand] = this.state[currentOperand].replace('-', '');
    } else {
      this.state[currentOperand] = `-${this.state[currentOperand]}`;
    }

    this.generateDisplayScore();
  }

  addDecimal() {
    const operand = this.getCurrentOperand();

    if (this.state[operand].includes('.')) return;

    this.state[operand] += '.';
    this.generateDisplayScore();
  }

  resetAll() {
    this.state.a = '';
    this.state.b = '';
    this.state.isFirstNumber = true;
    this.state.operator = '';
    this.state.totalScore = 0;
    this.generateDisplayScore(true);
  }

  generateDisplayScore(displayScoreOnly: boolean = false) {
    const { a, b, operator, totalScore } = this.state;

    if (displayScoreOnly) {
      display.textContent = totalScore.toString();
      return;
    }

    display.textContent = `${a.trim()} ${operator.trim()} ${b.trim()}`;
  }

  getOperator(operator: string) {
    if (operator === OPERATIONS.CLEAR_ALL) {
      this.resetAll();
      return;
    }

    if (operator === OPERATIONS.TOGGLE_SIGN) {
      this.toggleNumberSign();
      return;
    }

    if (operator === OPERATIONS.EQUALS && this.areOperandsValid() && this.state.operator) {
      this.operate();
      return;
    }

    if (this.state.a === '' || this.state.a === '-') return;

    switch (operator) {
      case OPERATIONS.ADD:
      case OPERATIONS.SUBTRACT:
      case OPERATIONS.MULTIPLY:
      case OPERATIONS.DIVIDE:
      case OPERATIONS.PERCENTAGE: {
        if (this.areOperandsValid() && this.state.operator) {
          this.operate();
        }

        this.state.isFirstNumber = false;
        this.state.operator = operator;
        this.generateDisplayScore();

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

  areOperandsValid() {
    return (
      this.state.a !== '' && this.state.a !== '-' && this.state.b !== '' && this.state.b !== '-'
    );
  }
}

const calculator = new Calculator();

class CalculatorMemento {
  state: IState;

  constructor(state: IState) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}

class Caretaker {
  history: CalculatorMemento[];

  constructor() {
    this.history = [];
  }

  push(state: IState) {
    this.history.push(state);
  }
  pop() {
    if (this.history.length === 0) return;
    return this.history.pop();
  }
}

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
