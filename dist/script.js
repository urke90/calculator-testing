"use strict";
class Calculator {
    constructor() {
        this.state = {
            a: 0,
            b: 0,
            score: 0,
        };
        this.methods = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '%': (a, b) => (a / b) * 100,
        };
    }
    operate(a, b, operator) {
        this.state.a = a;
        this.state.b = b;
        this.state.score = this.methods[operator](a, b);
    }
}
const calculator = new Calculator();
const calculatorContainer = document.getElementById('calculator');
const numberButtons = calculatorContainer.querySelectorAll('[data-number-button]');
const operationButtons = calculatorContainer.querySelectorAll('[data-operation-button]');
console.log('calculatorContainer', calculatorContainer);
console.log('numberButtons', numberButtons);
console.log('operationButtons', operationButtons);
