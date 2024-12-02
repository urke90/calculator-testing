// https://stackoverflow.com/questions/54416318/how-to-make-a-undo-redo-function

interface IState {
  a: string;
  b: string;
  operator: string;
  totalScore: number;
  display: string;
  isFirstNumber: boolean;
}

interface ICalculatorMemento {
  readonly state: IState;
  getState(): IState;
}

interface ICaretaker {
  history: CalculatorMemento[];
  pushNewState(state: CalculatorMemento): void;
  popPrevState(): CalculatorMemento | undefined;
}

interface ICalculator {
  undo(): void;
  operate(): void;
  getNumber(num: string): void;
  toggleNumberSign(): void;
  addDecimal(): void;
  resetAll(): void;
  getOperator(inputOperator: string): void;
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
const decimalButton = calculatorContainer.querySelector('[data-decimal-button]')!;
const resetAllButton = calculatorContainer.querySelector('[data-reset-all-button]');
const toggleNumberSignButton = calculatorContainer.querySelector(
  '[data-toggle-number-sign-button]'
);
const equalsButton = calculatorContainer.querySelector('[data-equals-button]');
const undoButton = calculatorContainer.querySelector('[data-undo-button]');

class CalculatorMemento implements ICalculatorMemento {
  constructor(readonly state: IState) {
    this.state = state;
  }

  public getState() {
    return this.state;
  }
}
class Caretaker implements ICaretaker {
  history: CalculatorMemento[];

  constructor() {
    this.history = [];
  }

  public pushNewState(state: CalculatorMemento) {
    const lastSavedState = this.history[this.history.length - 1];

    if (!lastSavedState || JSON.stringify(lastSavedState) !== JSON.stringify(state)) {
      this.history.push(state);
    }
  }

  public popPrevState() {
    if (this.history.length === 0) return;
    return this.history.pop();
  }
}

class Calculator implements ICalculator {
  private state = {
    a: '',
    b: '',
    operator: '',
    totalScore: 0,
    display: '',
    isFirstNumber: true,
  };

  private caretaker = new Caretaker();

  private methods: { [key: string]: (a: number, b: number) => number } = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => (a / b) * 100,
  };

  private saveState() {
    const memento = new CalculatorMemento({ ...this.state });
    this.caretaker.pushNewState(memento);
  }

  public undo() {
    const memento = this.caretaker.popPrevState();

    if (memento) {
      this.state = { ...memento.getState() };
      this.generateDisplayScore();
    }
  }

  public operate() {
    const areOperandsValid = this.areOperandsValid() && this.state.operator !== '';

    if (!areOperandsValid) return;

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
  }

  public getNumber(num: string) {
    this.saveState();
    const operand = this.getCurrentOperand();

    this.state[operand] += num;

    this.generateDisplayScore();
  }

  public toggleNumberSign() {
    this.saveState();
    const currentOperand = this.getCurrentOperand();

    if (this.state[currentOperand].startsWith('-')) {
      this.state[currentOperand] = this.state[currentOperand].replace('-', '');
    } else {
      this.state[currentOperand] = `-${this.state[currentOperand]}`;
    }

    this.generateDisplayScore();
  }

  public addDecimal() {
    const currentOperand = this.getCurrentOperand();
    const isValidOperand = this.isValidOperand(currentOperand);

    if (!isValidOperand) return;

    this.saveState();
    const operand = this.getCurrentOperand();

    if (this.state[operand].includes('.')) return;

    this.state[operand] += '.';
    this.generateDisplayScore();
  }

  public resetAll() {
    this.state.a = '';
    this.state.b = '';
    this.state.isFirstNumber = true;
    this.state.operator = '';
    this.state.totalScore = 0;
    this.generateDisplayScore(true);
  }

  public getOperator(inputOperator: string) {
    if (this.state.a === '' || this.state.a === '-') return;

    this.saveState();
    if (this.areOperandsValid() && this.state.operator) {
      this.operate();
    }
    this.state.isFirstNumber = false;
    this.state.operator = inputOperator;
    this.generateDisplayScore();
  }

  private generateDisplayScore(displayScoreOnly: boolean = false) {
    const { a, b, operator, totalScore } = this.state;

    if (displayScoreOnly) {
      display.textContent = totalScore.toString();
      return;
    }

    display.textContent = `${a.trim()} ${operator.trim()} ${b.trim()}`;
  }

  private areOperandsValid() {
    return (
      this.state.a !== '' && this.state.a !== '-' && this.state.b !== '' && this.state.b !== '-'
    );
  }

  private isValidOperand(currentOperand: 'a' | 'b') {
    return this.state[currentOperand] !== '-' && this.state[currentOperand] !== '';
  }

  private getCurrentOperand() {
    return this.state.isFirstNumber ? 'a' : 'b';
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

decimalButton.addEventListener('click', calculator.addDecimal.bind(calculator));
resetAllButton?.addEventListener('click', calculator.resetAll.bind(calculator));
toggleNumberSignButton?.addEventListener('click', calculator.toggleNumberSign.bind(calculator));
equalsButton?.addEventListener('click', calculator.operate.bind(calculator));
undoButton?.addEventListener('click', calculator.undo.bind(calculator));
