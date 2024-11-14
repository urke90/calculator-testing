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

  operate(a: number, b: number, operator: string) {
    // this.state.a = a;
    // this.state.b = b;
    // this.state.score = this.methods[operator](a, b);
  }

  saveNumber(num: string) {
    // let { isFirstNumber, a, b } = this.state;

    console.log('num', num);
    if (this.state.isFirstNumber) {
      this.state.a += num;
    } else {
      this.state.b += num;
    }

    this.generateDisplayScore();

    console.log('this state', this.state);
  }

  saveOperator(operator: string) {
    this.state.operator = operator;
  }

  generateDisplayScore() {
    const { a, b, operator } = this.state;

    display.textContent = `${a.trim()} ${operator.trim()} ${b.trim()}`;
  }
}

const calculator = new Calculator();

const calculatorContainer = document.getElementById('calculator')!;
const display = calculatorContainer.querySelector('[data-display]')!;
const numberButtons = calculatorContainer.querySelectorAll('[data-number-button]')!;
const operationButtons = calculatorContainer.querySelectorAll('[data-operation-button]')!;

// console.log('calculatorContainer', calculatorContainer);
// console.log('numberButtons', numberButtons);
// console.log('operationButtons', operationButtons);
// console.log('display', display);

numberButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const element = e.target as HTMLElement;

    if (!element.dataset.numberButton) {
      throw new Error('Missing number button data attribute value');
    }

    const btnValue = element.dataset.numberButton;

    calculator.saveNumber(btnValue);
  });
});

console.log('calc state', calculator.state);

/**
 * 1. uzeti vrednost za prvu cifru, mora da se cuva u varijabli i da se ispise na display-u
 * 2. uzeti vrednosti operatora (+ - / * %) i sacuvati u varijabli spojiti sa vrdnosti prve cifre i ispisati na display-u
 * 3. uzeti vrednosti druge cifre, sacuvati u varijabli, i pridodati na vrednost display-a
 * 4. user click na "="  i poziva se funkcija operate() i ispisujemo konacnu vrednost na display-u
 */
