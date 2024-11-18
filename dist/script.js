"use strict";
const OPERATIONS = {
    CLEAR_ALL: 'clear-all',
    CLEAR_FIRST: 'clear-first',
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '*',
    DIVIDE: '/',
    PERCENTAGE: '%',
    TOGGLE_SIGN: 'toggle-sign',
    DECIMAL: '.',
    EQUALS: '=',
};
const calculatorContainer = document.getElementById('calculator');
const display = calculatorContainer.querySelector('[data-display]');
const numberButtons = calculatorContainer.querySelectorAll('[data-number-button]');
const operationButtons = calculatorContainer.querySelectorAll('[data-operation-button]');
class Calculator {
    constructor() {
        this.state = {
            a: '',
            b: '',
            operator: '',
            totalScore: 0,
            display: '',
            isFirstNumber: true,
        };
        this.methods = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '%': (a, b) => (a / b) * 100,
        };
    }
    getOperand() {
        return this.state.isFirstNumber ? 'a' : 'b';
    }
    operate() {
        const { a, b, operator } = this.state;
        console.log('a', a);
        console.log('b', b);
        // console.log('operator', operator);
        const firstNumber = Number(a);
        const secondNumber = Number(b);
        const score = this.methods[this.state.operator](firstNumber, secondNumber);
        this.state.totalScore = score;
        this.generateDisplayScore(true);
        this.state.a = score.toString();
        this.state.b = '';
        console.log('this state u operate()', this.state);
    }
    getNumber(num) {
        console.log('num', num);
        const operand = this.getOperand();
        this.state[operand] += num;
        this.generateDisplayScore();
    }
    // toggleNumberSign() {
    //   console.log('this.state. BEFORE', this.state);
    //   const { a, b, isFirstNumber } = this.state;
    //   if (isFirstNumber) {
    //     if (a.startsWith('-')) {
    //       this.state.a = a.replace('-', '');
    //     } else {
    //       this.state.a = `-${a}`;
    //     }
    //   } else {
    //     if (b.startsWith('-')) {
    //       this.state.b = b.replace('-', '');
    //     } else {
    //       this.state.b = `-${b}`;
    //     }
    //   }
    //   this.generateDisplayScore();
    //   console.log('this.state AFTER', this.state);
    // }
    addDecimal() {
        const operand = this.getOperand();
        if (this.state[operand].includes('.'))
            return;
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
    generateDisplayScore(displayScoreOnly = false) {
        const { a, b, operator, totalScore } = this.state;
        if (displayScoreOnly) {
            display.textContent = totalScore.toString();
            return;
        }
        display.textContent = `${a.trim()} ${operator.trim()} ${b.trim()}`;
    }
    getOperator(operator) {
        if (operator !== OPERATIONS.TOGGLE_SIGN && (this.state.a === '' || this.state.a === '-'))
            return;
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
            // case OPERATIONS.TOGGLE_SIGN: {
            //   this.toggleNumberSign();
            //   return;
            // }
            default:
                throw new Error('Invalid operation!');
        }
    }
}
const calculator = new Calculator();
numberButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const element = e.target;
        if (!element.dataset.numberButton) {
            throw new Error('Missing number button data attribute value');
        }
        const btnValue = element.dataset.numberButton;
        calculator.getNumber(btnValue);
    });
});
operationButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const element = e.target;
        if (!element.dataset.operationButton) {
            throw new Error('Missing value for operation button data attribute');
        }
        const btnValue = element.dataset.operationButton;
        calculator.getOperator(btnValue);
    });
});
