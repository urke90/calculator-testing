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
  UNDO: 'undo',
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  PERCENTAGE: '%',
  TOGGLE_SIGN: 'toggle-sign',
  DECIMAL: '.',
  EQUALS: '=',
};

const INIT_STATE = {
  a: '',
  b: '',
  operator: '',
  totalScore: 0,
  display: '',
  isFirstNumber: true,
};

const calculatorContainer = document.getElementById('calculator')!;
const display = calculatorContainer.querySelector('[data-display]')!;
const numberButtons = calculatorContainer.querySelectorAll('[data-number-button]')!;
const operationButtons = calculatorContainer.querySelectorAll('[data-operation-button]')!;

class Caretaker {
  history: CalculatorMemento[];

  constructor() {
    this.history = [];
  }

  pushNewState(state: CalculatorMemento) {
    this.history.push(state);
  }

  popPrevState() {
    if (this.history.length === 0) return;
    return this.history.pop();
  }
}

class Calculator {
  state = {
    a: '',
    b: '',
    operator: '',
    totalScore: 0,
    display: '',
    isFirstNumber: true,
  };

  caretaker = new Caretaker();

  methods: { [key: string]: (a: number, b: number) => number } = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => (a / b) * 100,
  };

  saveState() {
    const memento = new CalculatorMemento({ ...this.state });
    this.caretaker.pushNewState(memento);
  }

  undo() {
    console.log('this.state u UNDO', this.state);
    const memento = this.caretaker.popPrevState();

    if (memento) {
      console.log('memento.getState', memento.getState());

      this.state = { ...memento.getState() };
      this.generateDisplayScore();
    }
  }

  operate() {
    console.log('this.state u operate BEFORE', this.state);

    this.saveState();
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

    console.log('this.state u operate AFTER', this.state);
  }

  getNumber(num: string) {
    this.saveState();
    const operand = this.getCurrentOperand();

    this.state[operand] += num;

    this.generateDisplayScore();
  }

  toggleNumberSign() {
    this.saveState();
    const currentOperand = this.getCurrentOperand();

    if (this.state[currentOperand].startsWith('-')) {
      this.state[currentOperand] = this.state[currentOperand].replace('-', '');
    } else {
      this.state[currentOperand] = `-${this.state[currentOperand]}`;
    }

    this.generateDisplayScore();
  }

  addDecimal() {
    this.saveState();
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

  getOperator(inputOperator: string) {
    if (inputOperator === OPERATIONS.CLEAR_ALL) {
      this.resetAll();
      return;
    }

    if (inputOperator === OPERATIONS.TOGGLE_SIGN) {
      this.toggleNumberSign();
      return;
    }

    if (inputOperator === OPERATIONS.EQUALS && this.areOperandsValid() && this.state.operator) {
      this.operate();
      return;
    }

    if (this.state.a === '' || this.state.a === '-') return;

    switch (inputOperator) {
      case OPERATIONS.ADD:
      case OPERATIONS.SUBTRACT:
      case OPERATIONS.MULTIPLY:
      case OPERATIONS.DIVIDE:
      case OPERATIONS.PERCENTAGE: {
        this.saveState();
        if (this.areOperandsValid() && this.state.operator) {
          this.operate();
        }

        this.state.isFirstNumber = false;
        this.state.operator = inputOperator;
        this.generateDisplayScore();

        return;
      }

      case OPERATIONS.DECIMAL: {
        this.addDecimal();
        return;
      }

      case OPERATIONS.UNDO: {
        this.undo();
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
  getCurrentOperand() {
    return this.state.isFirstNumber ? 'a' : 'b';
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
